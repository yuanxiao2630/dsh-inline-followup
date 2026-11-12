/**
 * dsh-inline-followup — browser half.
 *
 * Flow:
 *   1. Watch text selections inside rendered Chat output.
 *   2. Float two icon actions at the end of the selection.
 *   3. "Ask here" opens a small streaming window anchored beside the text.
 *      "Quote" appends the selection to the main composer as a Markdown quote
 *      and focuses the composer, so the user can ask there.
 *
 * The small window is intentionally independent from the main Session: it
 * talks to this plugin's own Host route (`/inline-followup/api/ask`), keeps its
 * own turn history in component state, and never writes to the Session log.
 */

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react'

const PLUGIN_ID = 'dsh-inline-followup'

/** Client services this overlay needs before it activates. */
export const inject = ['slots', 'sessions', 'locale', 'uiSession', 'uiConversation']
const API = '/inline-followup/api'
const MAX_SELECTION_CHARS = 6000
const STYLE_ID = `${PLUGIN_ID}-style`

type Locale = 'zh' | 'en'

interface Copy {
  title: string
  subtitle: string
  sideAction: string
  sideHint: string
  quoteAction: string
  quoteHint: string
  close: string
  copy: string
  copied: string
  send: string
  stop: string
  placeholder: string
  startHint: string
  selectionLabel: string
  footnote: string
  thinking: string
  retry: string
  errorTitle: string
  noModel: string
  emptyAnswer: string
  quotedToast: string
  copiedToast: string
  failedToast: string
  chars: (count: number) => string
  modelLabel: string
}

const ZH: Copy = {
  title: '划词追问',
  subtitle: '就这段内容继续问，不影响主对话',
  sideAction: '就地追问',
  sideHint: '在选中内容旁边的小窗里追问',
  quoteAction: '引用到主对话',
  quoteHint: '把选中内容作为引用放进主对话输入框',
  close: '关闭',
  copy: '复制',
  copied: '已复制',
  send: '发送',
  stop: '停止',
  placeholder: '针对选中内容继续追问，Enter 发送',
  startHint: '下面这段内容已带入小窗，直接提问即可。',
  selectionLabel: '选中内容',
  footnote: '回答只显示在小窗中 · 不会写入主对话',
  thinking: '正在思考',
  retry: '重试',
  errorTitle: '追问失败',
  noModel: '没有可用的模型，请先在设置里选择默认模型。',
  emptyAnswer: '模型没有返回内容，请换个问法再试。',
  quotedToast: '已引用到主对话输入框，继续输入你的问题',
  copiedToast: '已复制到剪贴板',
  failedToast: '没有找到主对话输入框，引用失败',
  chars: count => `${count} 字`,
  modelLabel: '模型',
}

const EN: Copy = {
  title: 'Ask about selection',
  subtitle: 'Follow up here without touching the main chat',
  sideAction: 'Ask here',
  sideHint: 'Open a small window beside the selected text',
  quoteAction: 'Quote in main chat',
  quoteHint: 'Put the selection into the main composer as a quote',
  close: 'Close',
  copy: 'Copy',
  copied: 'Copied',
  send: 'Send',
  stop: 'Stop',
  placeholder: 'Ask about the selection — Enter to send',
  startHint: 'The selection is already in this window. Ask away.',
  selectionLabel: 'Selected text',
  footnote: 'Answers stay in this window · the main chat is not modified',
  thinking: 'Thinking',
  retry: 'Retry',
  errorTitle: 'Follow-up failed',
  noModel: 'No model is available. Choose a default model in Settings first.',
  emptyAnswer: 'The model returned no text. Try rephrasing the question.',
  quotedToast: 'Quoted in the main composer — keep typing your question',
  copiedToast: 'Copied to clipboard',
  failedToast: 'Could not find the main composer; the selection was not quoted',
  chars: count => `${count} chars`,
  modelLabel: 'Model',
}

const COPY: Record<Locale, Copy> = { zh: ZH, en: EN }

interface RectLike {
  top: number
  left: number
  right: number
  bottom: number
  width: number
  height: number
}

interface SelectionInfo {
  text: string
  totalChars: number
  rect: RectLike
}

interface ToolbarState {
  selection: SelectionInfo
  top: number
  left: number
}

interface PanelState extends ToolbarState {
  id: number
  width: number
  maxHeight: number
}

interface Turn {
  role: 'user' | 'assistant'
  text: string
}

const CSS = `
.dsh-if-root {
  position: fixed;
  inset: 0;
  z-index: 70;
  pointer-events: none;
  font-family: var(--dsw-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif);
  color: var(--dsw-alias-label-primary, #1f2328);
}
.dsh-if-root *, .dsh-if-root *::before, .dsh-if-root *::after { box-sizing: border-box; }
.dsh-if-ui { pointer-events: auto; }
.dsh-if-toolbar {
  position: fixed;
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 4px;
  border: 1px solid var(--dsw-alias-border-l2, rgba(0,0,0,.12));
  border-radius: 13px;
  background: color-mix(in srgb, var(--dsw-specific-menu, #fff) 94%, transparent);
  box-shadow: 0 10px 32px rgba(0,0,0,.16), 0 2px 8px rgba(0,0,0,.08);
  backdrop-filter: blur(20px) saturate(1.5);
  -webkit-backdrop-filter: blur(20px) saturate(1.5);
  pointer-events: auto;
  animation: dsh-if-pop 120ms ease-out;
  transform-origin: 50% 0;
}
@keyframes dsh-if-pop {
  from { opacity: 0; transform: translateY(-3px) scale(.96); }
  to { opacity: 1; transform: none; }
}
.dsh-if-toolbarBtn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  padding: 0;
  border: 0;
  border-radius: 9px;
  background: transparent;
  color: var(--dsw-alias-label-secondary, #57606a);
  cursor: pointer;
  transition: background 110ms ease, color 110ms ease, transform 110ms ease;
}
.dsh-if-toolbarBtn:hover {
  background: var(--dsw-alias-interactive-bg-hover, rgba(0,0,0,.06));
  color: var(--dsw-alias-state-business-primary, #4d6bfe);
}
.dsh-if-toolbarBtn:active { transform: scale(.94); }
.dsh-if-toolbarBtn::after {
  content: attr(data-tip);
  position: absolute;
  bottom: calc(100% + 7px);
  left: 50%;
  transform: translateX(-50%) translateY(2px);
  padding: 4px 8px;
  border: 1px solid var(--dsw-alias-border-l2, rgba(0,0,0,.12));
  border-radius: 6px;
  background: var(--dsw-specific-menu, #fff);
  box-shadow: 0 6px 18px rgba(0,0,0,.14);
  color: var(--dsw-alias-label-primary, #1f2328);
  font-size: 11px;
  line-height: 14px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 90ms ease, transform 90ms ease;
}
.dsh-if-toolbarBtn:hover::after { opacity: 1; transform: translateX(-50%) translateY(0); }
.dsh-if-toolbarBtn--end::after { left: auto; right: 0; transform: translateY(2px); }
.dsh-if-toolbarBtn--end:hover::after { transform: translateY(0); }
.dsh-if-toolbarBtn--primary { color: var(--dsw-alias-state-business-primary, #4d6bfe); }
.dsh-if-toolbarBtn--primary:hover {
  background: color-mix(in srgb, var(--dsw-alias-state-business-primary, #4d6bfe) 12%, transparent);
}
.dsh-if-toolbarSep {
  width: 1px;
  height: 18px;
  margin: 0 2px;
  background: var(--dsw-alias-border-l1, rgba(0,0,0,.08));
}

.dsh-if-panel {
  position: fixed;
  display: flex;
  flex-direction: column;
  min-height: 220px;
  overflow: hidden;
  border: 1px solid var(--dsw-alias-border-l2, rgba(0,0,0,.12));
  border-radius: 16px;
  background: color-mix(in srgb, var(--dsw-specific-menu, #fff) 97%, transparent);
  box-shadow: 0 24px 64px rgba(0,0,0,.22), 0 4px 14px rgba(0,0,0,.08);
  backdrop-filter: blur(24px) saturate(1.55);
  -webkit-backdrop-filter: blur(24px) saturate(1.55);
  pointer-events: auto;
  animation: dsh-if-panel-in 160ms cubic-bezier(.2,.8,.3,1);
  color: var(--dsw-alias-label-primary, #1f2328);
}
@keyframes dsh-if-panel-in {
  from { opacity: 0; transform: translateY(6px) scale(.985); }
  to { opacity: 1; transform: none; }
}
.dsh-if-head {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: none;
  padding: 12px 12px 10px 14px;
  border-bottom: 1px solid var(--dsw-alias-border-l1, rgba(0,0,0,.07));
}
.dsh-if-headIcon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 30px;
  height: 30px;
  border-radius: 10px;
  color: var(--dsw-alias-state-business-primary, #4d6bfe);
  background: color-mix(in srgb, var(--dsw-alias-state-business-primary, #4d6bfe) 12%, transparent);
}
.dsh-if-headCopy { min-width: 0; flex: 1; display: flex; flex-direction: column; gap: 1px; }
.dsh-if-title { font-size: 14px; font-weight: 650; line-height: 19px; letter-spacing: -.01em; }
.dsh-if-sub {
  overflow: hidden;
  color: var(--dsw-alias-label-tertiary, #6e7781);
  font-size: 11px;
  line-height: 15px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dsh-if-headActions { display: flex; align-items: center; gap: 2px; flex: none; }
.dsh-if-iconBtn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: var(--dsw-alias-label-secondary, #57606a);
  cursor: pointer;
  transition: background 110ms ease, color 110ms ease;
}
.dsh-if-iconBtn:hover {
  background: var(--dsw-alias-interactive-bg-hover, rgba(0,0,0,.06));
  color: var(--dsw-alias-label-primary, #1f2328);
}
.dsh-if-quote {
  position: relative;
  display: flex;
  gap: 9px;
  flex: none;
  max-height: 104px;
  margin: 10px 14px 0;
  padding: 8px 10px 8px 11px;
  overflow: auto;
  border-radius: 10px;
  background: color-mix(in srgb, var(--dsw-alias-state-business-primary, #4d6bfe) 7%, transparent);
  color: var(--dsw-alias-label-secondary, #57606a);
}
.dsh-if-quoteBar {
  flex: none;
  width: 2px;
  border-radius: 2px;
  background: color-mix(in srgb, var(--dsw-alias-state-business-primary, #4d6bfe) 55%, transparent);
}
.dsh-if-quoteText {
  min-width: 0;
  font-size: 12px;
  line-height: 18px;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
.dsh-if-thread {
  flex: 1;
  min-height: 90px;
  padding: 12px 14px 8px;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
}
.dsh-if-thread::-webkit-scrollbar { width: 8px; }
.dsh-if-thread::-webkit-scrollbar-thumb {
  border: 2px solid transparent;
  border-radius: 8px;
  background: var(--dsw-alias-scrollbar-bg-l1, rgba(0,0,0,.18));
  background-clip: padding-box;
}
.dsh-if-hint {
  padding: 10px 2px 14px;
  color: var(--dsw-alias-label-tertiary, #6e7781);
  font-size: 12px;
  line-height: 18px;
}
.dsh-if-turn { display: flex; margin-bottom: 10px; }
.dsh-if-turn--user { justify-content: flex-end; }
.dsh-if-turn--assistant { justify-content: flex-start; }
.dsh-if-userBubble {
  max-width: 88%;
  padding: 7px 11px;
  border-radius: 12px 12px 4px 12px;
  background: color-mix(in srgb, var(--dsw-alias-state-business-primary, #4d6bfe) 12%, transparent);
  font-size: 13px;
  line-height: 19px;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
.dsh-if-answer {
  width: 100%;
  font-size: 13.5px;
  line-height: 1.68;
  overflow-wrap: anywhere;
}
.dsh-if-answer--streaming::after {
  content: "";
  display: inline-block;
  width: 6px;
  height: 15px;
  margin-left: 2px;
  vertical-align: -2px;
  border-radius: 2px;
  background: var(--dsw-alias-state-business-primary, #4d6bfe);
  animation: dsh-if-blink 1s steps(2, start) infinite;
}
@keyframes dsh-if-blink { 50% { opacity: 0; } }
.dsh-if-md > :first-child { margin-top: 0; }
.dsh-if-md p { margin: 0 0 9px; }
.dsh-if-md h1, .dsh-if-md h2, .dsh-if-md h3, .dsh-if-md h4 {
  margin: 14px 0 7px;
  font-size: 14px;
  font-weight: 680;
  line-height: 1.4;
}
.dsh-if-md ul, .dsh-if-md ol { margin: 0 0 9px; padding-left: 20px; }
.dsh-if-md li { margin: 2px 0; }
.dsh-if-md blockquote {
  margin: 0 0 9px;
  padding: 2px 0 2px 10px;
  border-left: 2px solid var(--dsw-alias-border-l2, rgba(0,0,0,.14));
  color: var(--dsw-alias-label-secondary, #57606a);
}
.dsh-if-md code {
  padding: 1px 5px;
  border-radius: 5px;
  background: color-mix(in srgb, var(--dsw-alias-label-primary, #1f2328) 7%, transparent);
  font-family: var(--dsw-font-family-mono, ui-monospace, SFMono-Regular, Menlo, monospace);
  font-size: 12px;
}
.dsh-if-md a { color: var(--dsw-alias-state-business-primary, #4d6bfe); text-decoration: none; }
.dsh-if-md a:hover { text-decoration: underline; }
.dsh-if-md hr {
  height: 1px;
  margin: 12px 0;
  border: 0;
  background: var(--dsw-alias-border-l1, rgba(0,0,0,.08));
}
.dsh-if-code {
  position: relative;
  margin: 0 0 10px;
  overflow: hidden;
  border: 1px solid var(--dsw-alias-border-l1, rgba(0,0,0,.08));
  border-radius: 9px;
  background: color-mix(in srgb, var(--dsw-alias-label-primary, #1f2328) 5%, transparent);
}
.dsh-if-codeHead {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 5px 8px 5px 10px;
  border-bottom: 1px solid var(--dsw-alias-border-l1, rgba(0,0,0,.07));
  color: var(--dsw-alias-label-tertiary, #6e7781);
  font-size: 10.5px;
  line-height: 14px;
  text-transform: lowercase;
}
.dsh-if-codeCopy {
  padding: 2px 7px;
  border: 0;
  border-radius: 5px;
  background: transparent;
  color: inherit;
  font: inherit;
  cursor: pointer;
}
.dsh-if-codeCopy:hover { background: var(--dsw-alias-interactive-bg-hover, rgba(0,0,0,.06)); }
.dsh-if-code pre {
  max-height: 320px;
  margin: 0;
  padding: 10px 12px;
  overflow: auto;
  font-family: var(--dsw-font-family-mono, ui-monospace, SFMono-Regular, Menlo, monospace);
  font-size: 11.5px;
  line-height: 1.55;
  white-space: pre;
}
.dsh-if-thinking {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 6px 2px 12px;
  color: var(--dsw-alias-label-tertiary, #6e7781);
  font-size: 12px;
}
.dsh-if-dots { display: inline-flex; gap: 3px; }
.dsh-if-dots i {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: currentColor;
  animation: dsh-if-dot 1.1s ease-in-out infinite;
}
.dsh-if-dots i:nth-child(2) { animation-delay: .15s; }
.dsh-if-dots i:nth-child(3) { animation-delay: .3s; }
@keyframes dsh-if-dot {
  0%, 70%, 100% { opacity: .25; transform: translateY(0); }
  35% { opacity: 1; transform: translateY(-2px); }
}
.dsh-if-error {
  margin: 2px 0 10px;
  padding: 9px 11px;
  border: 1px solid color-mix(in srgb, var(--dsw-alias-state-error-primary, #cf222e) 28%, transparent);
  border-radius: 9px;
  background: color-mix(in srgb, var(--dsw-alias-state-error-primary, #cf222e) 7%, transparent);
  color: var(--dsw-alias-state-error-primary, #cf222e);
  font-size: 12px;
  line-height: 18px;
}
.dsh-if-errorHead { display: flex; align-items: center; justify-content: space-between; gap: 8px; font-weight: 620; }
.dsh-if-retry {
  flex: none;
  padding: 2px 8px;
  border: 1px solid currentColor;
  border-radius: 6px;
  background: transparent;
  color: inherit;
  font: inherit;
  font-size: 11px;
  cursor: pointer;
}
.dsh-if-errorText { margin-top: 3px; opacity: .9; overflow-wrap: anywhere; }
.dsh-if-compose {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  flex: none;
  margin: 0 12px;
  padding: 8px;
  border: 1px solid var(--dsw-alias-border-l2, rgba(0,0,0,.12));
  border-radius: 12px;
  background: var(--dsw-alias-bg-base, #fff);
  transition: border-color 120ms ease, box-shadow 120ms ease;
}
.dsh-if-compose:focus-within {
  border-color: color-mix(in srgb, var(--dsw-alias-state-business-primary, #4d6bfe) 55%, transparent);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--dsw-alias-state-business-primary, #4d6bfe) 10%, transparent);
}
.dsh-if-input {
  flex: 1;
  min-width: 0;
  max-height: 132px;
  padding: 1px 0;
  border: 0;
  outline: 0;
  resize: none;
  background: transparent;
  color: inherit;
  font-family: inherit;
  font-size: 13px;
  line-height: 20px;
}
.dsh-if-input::placeholder { color: var(--dsw-alias-label-tertiary, #8b949e); }
.dsh-if-send {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 30px;
  height: 30px;
  padding: 0;
  border: 0;
  border-radius: 9px;
  background: var(--dsw-alias-state-business-primary, #4d6bfe);
  color: #fff;
  cursor: pointer;
  transition: filter 110ms ease, transform 110ms ease;
}
.dsh-if-send:hover { filter: brightness(1.06); }
.dsh-if-send:active { transform: scale(.94); }
.dsh-if-send:disabled { cursor: default; opacity: .4; }
.dsh-if-send--stop { background: var(--dsw-alias-label-secondary, #57606a); }
.dsh-if-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex: none;
  padding: 7px 14px 10px;
  color: var(--dsw-alias-label-tertiary, #8b949e);
  font-size: 10.5px;
  line-height: 14px;
}
.dsh-if-footModel { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dsh-if-toast {
  position: fixed;
  bottom: 26px;
  left: 50%;
  z-index: 90;
  max-width: min(460px, calc(100vw - 32px));
  padding: 9px 15px;
  transform: translateX(-50%);
  border: 1px solid var(--dsw-alias-border-l2, rgba(0,0,0,.12));
  border-radius: 10px;
  background: color-mix(in srgb, var(--dsw-specific-menu, #fff) 96%, transparent);
  box-shadow: 0 10px 30px rgba(0,0,0,.16);
  color: var(--dsw-alias-label-primary, #1f2328);
  font-size: 12px;
  line-height: 17px;
  pointer-events: none;
  animation: dsh-if-toast-in 160ms ease-out;
}
@keyframes dsh-if-toast-in {
  from { opacity: 0; transform: translate(-50%, 5px); }
  to { opacity: 1; transform: translate(-50%, 0); }
}
@media (prefers-reduced-motion: reduce) {
  .dsh-if-toolbar, .dsh-if-panel, .dsh-if-toast { animation: none; }
  .dsh-if-answer--streaming::after { animation: none; }
}
`

function installStyle(): void {
  if (document.getElementById(STYLE_ID) !== null) return
  const style = document.createElement('style')
  style.id = STYLE_ID
  style.dataset.plugin = PLUGIN_ID
  style.textContent = CSS
  document.head.append(style)
}

// ───────────────────────────────────────────────────────────────────────────
// Icons
// ───────────────────────────────────────────────────────────────────────────

function IconChatSpark(): JSX.Element {
  return (
    <svg width="17" height="17" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M3.4 6.2A2.7 2.7 0 0 1 6.1 3.5h7.8a2.7 2.7 0 0 1 2.7 2.7v5.1a2.7 2.7 0 0 1-2.7 2.7H9.2l-3.9 2.7v-2.9A2.7 2.7 0 0 1 3.4 11V6.2Z"
        stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"
      />
      <path
        d="M14.2 1.6l.45 1.25 1.25.45-1.25.45-.45 1.25-.45-1.25L12.5 3.3l1.25-.45.45-1.25Z"
        fill="currentColor"
      />
    </svg>
  )
}

function IconQuote(): JSX.Element {
  return (
    <svg width="17" height="17" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M8 5.2 4.2 9l3.8 3.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.4 9h7.2a4.2 4.2 0 0 1 4.2 4.2v1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function IconClose(): JSX.Element {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="m4.2 4.2 7.6 7.6M11.8 4.2l-7.6 7.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function IconSend(): JSX.Element {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2.4 7.9 13.5 2.7 9.2 13.7 7.3 9.3 2.4 7.9Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  )
}

function IconStop(): JSX.Element {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="4.2" y="4.2" width="7.6" height="7.6" rx="1.5" fill="currentColor" />
    </svg>
  )
}

function IconCopy(): JSX.Element {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="5.2" y="5.2" width="7.2" height="7.2" rx="1.4" stroke="currentColor" strokeWidth="1.3" />
      <path d="M10.6 5.1V4.3A1.3 1.3 0 0 0 9.3 3H4.3A1.3 1.3 0 0 0 3 4.3v5a1.3 1.3 0 0 0 1.3 1.3h.8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

function IconCheck(): JSX.Element {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="m3.2 8.2 3.1 3.1 6.5-6.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ───────────────────────────────────────────────────────────────────────────
// Selection capture and geometry
// ───────────────────────────────────────────────────────────────────────────

function toRectLike(rect: DOMRect): RectLike {
  return {
    top: rect.top,
    left: rect.left,
    right: rect.right,
    bottom: rect.bottom,
    width: rect.width,
    height: rect.height,
  }
}

function elementOf(node: Node | null): Element | null {
  if (node === null) return null
  if (node.nodeType === Node.ELEMENT_NODE) return node as Element
  return node.parentElement
}

/**
 * Read a user selection that belongs to rendered conversation output. Composer
 * text, form controls, buttons, and this plugin's own UI are excluded.
 */
function readSelection(): SelectionInfo | null {
  const selection = window.getSelection()
  if (selection === null || selection.isCollapsed || selection.rangeCount === 0) return null
  const raw = selection.toString()
  const text = raw.replace(/\u00a0/g, ' ').trim()
  if (text === '') return null

  const range = selection.getRangeAt(0)
  const start = elementOf(range.startContainer)
  if (start === null) return null
  if (start.closest('textarea, input, select, [contenteditable="true"], [contenteditable=""], [data-inline-followup-ui]') !== null) {
    return null
  }
  if (start.closest('button, a, [role="button"]') !== null) return null

  const flow = start.closest('[data-chat-flow-key]')
  if (flow === null) return null
  const kind = flow.getAttribute('data-chat-flow-kind')
  if (kind === 'user' || kind === 'steering' || kind === 'turn-trigger') return null
  if (start.closest('[data-conversation-scroll], [data-slot="conversation.chat.flow"]') === null) return null

  const rects = typeof range.getClientRects === 'function' ? Array.from(range.getClientRects()) : []
  let rect = rects.length > 0 ? rects[rects.length - 1] : range.getBoundingClientRect()
  if (rect === undefined || (rect.width === 0 && rect.height === 0)) rect = range.getBoundingClientRect()
  if (rect.width === 0 && rect.height === 0) return null

  const totalChars = text.length
  const clipped = totalChars > MAX_SELECTION_CHARS
    ? `${text.slice(0, MAX_SELECTION_CHARS)}\n\n…（已截断 ${totalChars - MAX_SELECTION_CHARS} 字）`
    : text
  return { text: clipped, totalChars, rect: toRectLike(rect) }
}

function toolbarGeometry(rect: RectLike): { top: number; left: number } {
  const width = 76
  const height = 38
  let top = rect.bottom + 8
  let left = rect.right - width
  if (top + height > window.innerHeight - 8) top = rect.top - height - 8
  top = Math.max(8, Math.min(top, window.innerHeight - height - 8))
  left = Math.max(8, Math.min(left, window.innerWidth - width - 8))
  return { top, left }
}

function panelGeometry(rect: RectLike): { top: number; left: number; width: number; maxHeight: number } {
  const width = Math.min(430, window.innerWidth - 24)
  // Prefer the empty gutter to the right of the selection. When the selection
  // reaches the right edge, align the window with the selection's end instead
  // of flipping all the way to the left and covering the sidebar.
  let left = rect.right + 12
  if (left + width > window.innerWidth - 12) {
    left = Math.max(12, Math.min(rect.right - width, window.innerWidth - width - 12))
  }

  // Prefer opening below the selection so the selected line stays visible.
  // Flip above only when there is no usable room underneath.
  const limit = Math.min(560, window.innerHeight - 24)
  let top = rect.bottom + 12
  let maxHeight = Math.min(limit, window.innerHeight - top - 12)
  if (maxHeight < 300 && rect.top > 300) {
    maxHeight = Math.min(limit, rect.top - 24)
    top = Math.max(12, rect.top - maxHeight - 12)
  }
  if (maxHeight < 260) {
    maxHeight = 260
    top = Math.max(12, window.innerHeight - maxHeight - 12)
  }
  return { top, left, width, maxHeight }
}

// ───────────────────────────────────────────────────────────────────────────
// Streaming
// ───────────────────────────────────────────────────────────────────────────

interface SseEvent {
  event: string
  data: unknown
}

/**
 * Parse the Host's SSE frames. The parser tolerates CRLF, comments, and a
 * final frame without the blank-line terminator.
 */
async function* readSse(response: Response): AsyncGenerator<SseEvent> {
  if (response.body === null) throw new Error('empty response body')
  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true }).replace(/\r\n/g, '\n')
      let boundary = buffer.indexOf('\n\n')
      while (boundary >= 0) {
        const frame = buffer.slice(0, boundary)
        buffer = buffer.slice(boundary + 2)
        const parsed = parseFrame(frame)
        if (parsed !== null) yield parsed
        boundary = buffer.indexOf('\n\n')
      }
    }
    buffer += decoder.decode()
    const tail = parseFrame(buffer)
    if (tail !== null) yield tail
  } finally {
    reader.releaseLock()
  }
}

function parseFrame(frame: string): SseEvent | null {
  let event = 'message'
  const dataLines: string[] = []
  for (const line of frame.split('\n')) {
    if (line === '' || line.startsWith(':')) continue
    if (line.startsWith('event:')) event = line.slice(6).trim()
    else if (line.startsWith('data:')) dataLines.push(line.slice(5).trimStart())
  }
  if (dataLines.length === 0) return null
  const payload = dataLines.join('\n')
  try {
    return { event, data: JSON.parse(payload) as unknown }
  } catch {
    return { event, data: payload }
  }
}

function errorMessage(error: unknown, copy: Copy): string {
  if (error instanceof Error && error.message !== '') return error.message
  return copy.errorTitle
}

// ───────────────────────────────────────────────────────────────────────────
// Lightweight Markdown
// ───────────────────────────────────────────────────────────────────────────

function isBlockStart(line: string): boolean {
  if (/^\s*```/.test(line)) return true
  if (/^#{1,4}\s+/.test(line)) return true
  if (/^\s*([-*_])\1{2,}\s*$/.test(line)) return true
  if (/^\s*>\s?/.test(line)) return true
  if (/^\s*[-*+]\s+/.test(line)) return true
  if (/^\s*\d+[.)]\s+/.test(line)) return true
  return line.trim() === ''
}

function renderInline(text: string, keyPrefix: string): JSX.Element[] {
  const nodes: JSX.Element[] = []
  const pattern = /(`[^`\n]+`|\*\*[^*\n]+\*\*|\*[^*\n]+\*|\[[^\]\n]+\]\((?:https?:\/\/)[^\s)]+\))/g
  let cursor = 0
  let index = 0
  for (const match of text.matchAll(pattern)) {
    const at = match.index ?? 0
    if (at > cursor) nodes.push(<span key={`${keyPrefix}-t-${index++}`}>{text.slice(cursor, at)}</span>)
    const token = match[0]
    if (token.startsWith('`')) {
      nodes.push(<code key={`${keyPrefix}-c-${index++}`}>{token.slice(1, -1)}</code>)
    } else if (token.startsWith('**')) {
      nodes.push(<strong key={`${keyPrefix}-b-${index++}`}>{token.slice(2, -2)}</strong>)
    } else if (token.startsWith('*')) {
      nodes.push(<em key={`${keyPrefix}-i-${index++}`}>{token.slice(1, -1)}</em>)
    } else {
      const close = token.indexOf('](')
      const label = token.slice(1, close)
      const href = token.slice(close + 2, -1)
      nodes.push(
        <a key={`${keyPrefix}-a-${index++}`} href={href} target="_blank" rel="noreferrer noopener">
          {label}
        </a>,
      )
    }
    cursor = at + token.length
  }
  if (cursor < text.length) nodes.push(<span key={`${keyPrefix}-t-${index++}`}>{text.slice(cursor)}</span>)
  return nodes
}

function CodeBlock({ code, language, copy }: { code: string; language: string; copy: Copy }): JSX.Element {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number | undefined>(undefined)
  useEffect(() => () => {
    if (timer.current !== undefined) window.clearTimeout(timer.current)
  }, [])
  const onCopy = (): void => {
    void navigator.clipboard?.writeText(code).then(() => {
      setCopied(true)
      if (timer.current !== undefined) window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setCopied(false), 1200)
    }).catch(() => { /* clipboard can be unavailable */ })
  }
  return (
    <div className="dsh-if-code">
      <div className="dsh-if-codeHead">
        <span>{language === '' ? 'code' : language}</span>
        <button type="button" className="dsh-if-codeCopy" onClick={onCopy}>
          {copied ? copy.copied : copy.copy}
        </button>
      </div>
      <pre><code>{code}</code></pre>
    </div>
  )
}

function Markdown({ text, copy }: { text: string; copy: Copy }): JSX.Element {
  const lines = useMemo(() => text.split('\n'), [text])
  const blocks: JSX.Element[] = []
  let i = 0
  let key = 0
  while (i < lines.length) {
    const line = lines[i]
    if (line.trim() === '') { i += 1; continue }

    const fence = /^\s*```(.*)$/.exec(line)
    if (fence !== null) {
      const language = fence[1].trim()
      const body: string[] = []
      i += 1
      while (i < lines.length && !/^\s*```\s*$/.test(lines[i])) {
        body.push(lines[i])
        i += 1
      }
      if (i < lines.length) i += 1
      blocks.push(<CodeBlock key={`code-${key++}`} code={body.join('\n')} language={language} copy={copy} />)
      continue
    }

    const heading = /^(#{1,4})\s+(.*)$/.exec(line)
    if (heading !== null) {
      const level = Math.min(4, heading[1].length)
      const content = renderInline(heading[2], `h-${key}`)
      if (level === 1) blocks.push(<h1 key={`h-${key++}`}>{content}</h1>)
      else if (level === 2) blocks.push(<h2 key={`h-${key++}`}>{content}</h2>)
      else if (level === 3) blocks.push(<h3 key={`h-${key++}`}>{content}</h3>)
      else blocks.push(<h4 key={`h-${key++}`}>{content}</h4>)
      i += 1
      continue
    }

    if (/^\s*([-*_])\1{2,}\s*$/.test(line)) {
      blocks.push(<hr key={`hr-${key++}`} />)
      i += 1
      continue
    }

    if (/^\s*>\s?/.test(line)) {
      const quoted: string[] = []
      while (i < lines.length && /^\s*>\s?/.test(lines[i])) {
        quoted.push(lines[i].replace(/^\s*>\s?/, ''))
        i += 1
      }
      blocks.push(
        <blockquote key={`q-${key++}`}>
          {quoted.map((row, index) => (
            <span key={`q-${key}-${index}`}>
              {renderInline(row, `q-${key}-${index}`)}
              {index < quoted.length - 1 && <br />}
            </span>
          ))}
        </blockquote>,
      )
      continue
    }

    const unordered = /^\s*[-*+]\s+/.test(line)
    const ordered = /^\s*\d+[.)]\s+/.test(line)
    if (unordered || ordered) {
      const items: string[] = []
      const pattern = unordered ? /^\s*[-*+]\s+/ : /^\s*\d+[.)]\s+/
      while (i < lines.length && pattern.test(lines[i])) {
        items.push(lines[i].replace(pattern, ''))
        i += 1
      }
      const children = items.map((item, index) => (
        <li key={`li-${key}-${index}`}>{renderInline(item, `li-${key}-${index}`)}</li>
      ))
      blocks.push(unordered
        ? <ul key={`ul-${key++}`}>{children}</ul>
        : <ol key={`ol-${key++}`}>{children}</ol>)
      continue
    }

    const paragraph: string[] = []
    while (i < lines.length && lines[i].trim() !== '' && !isBlockStart(lines[i])) {
      paragraph.push(lines[i])
      i += 1
    }
    if (paragraph.length === 0) {
      paragraph.push(lines[i])
      i += 1
    }
    blocks.push(
      <p key={`p-${key++}`}>
        {paragraph.map((row, index) => (
          <span key={`p-${key}-${index}`}>
            {renderInline(row, `p-${key}-${index}`)}
            {index < paragraph.length - 1 && <br />}
          </span>
        ))}
      </p>,
    )
  }
  return <div className="dsh-if-md">{blocks}</div>
}

// ───────────────────────────────────────────────────────────────────────────
// Small window
// ───────────────────────────────────────────────────────────────────────────

interface MiniPanelProps {
  selection: SelectionInfo
  copy: Copy
  geometry: { top: number; left: number; width: number; maxHeight: number }
  onClose: () => void
  onQuote: (selectionText: string, question?: string) => void
}

function MiniPanel({ selection, copy, geometry, onClose, onQuote }: MiniPanelProps): JSX.Element {
  const [turns, setTurns] = useState<Turn[]>([])
  const [draft, setDraft] = useState('')
  const [answer, setAnswer] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<{ code: string; message: string } | null>(null)
  const [model, setModel] = useState('')
  const busyRef = useRef(false)
  const abortRef = useRef<AbortController | null>(null)
  const lastQuestion = useRef('')
  const threadRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => () => {
    abortRef.current?.abort()
  }, [])

  useEffect(() => {
    const element = threadRef.current
    if (element !== null) element.scrollTop = element.scrollHeight
  }, [turns, answer, busy, error])

  useEffect(() => {
    const element = inputRef.current
    if (element === null) return
    element.style.height = 'auto'
    element.style.height = `${Math.min(132, element.scrollHeight)}px`
  }, [draft])

  const ask = useCallback(async (question: string) => {
    if (busyRef.current) return
    busyRef.current = true
    setBusy(true)
    setError(null)
    setAnswer('')
    setModel('')
    lastQuestion.current = question

    const controller = new AbortController()
    abortRef.current = controller
    let accumulated = ''
    let settled = false
    try {
      const history = turns.map(turn => ({ role: turn.role, text: turn.text }))
      const response = await fetch(`${API}/ask`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ selection: selection.text, question, history }),
        signal: controller.signal,
      })
      if (!response.ok) {
        let message = `HTTP ${response.status}`
        try {
          const payload = await response.json() as { message?: unknown }
          if (typeof payload.message === 'string' && payload.message !== '') message = payload.message
        } catch { /* non-JSON error body */ }
        throw new Error(message)
      }
      for await (const event of readSse(response)) {
        if (event.event === 'delta') {
          const payload = event.data as { text?: unknown }
          if (typeof payload.text === 'string') {
            accumulated += payload.text
            setAnswer(accumulated)
          }
        } else if (event.event === 'done') {
          const payload = event.data as { model?: unknown }
          if (typeof payload.model === 'string') setModel(payload.model)
          settled = true
          break
        } else if (event.event === 'error') {
          const payload = event.data as { code?: unknown; message?: unknown }
          const code = typeof payload.code === 'string' ? payload.code : 'ASK_FAILED'
          const message = typeof payload.message === 'string' ? payload.message : copy.errorTitle
          throw Object.assign(new Error(message), { code })
        }
      }
      if (!settled && accumulated.trim() === '') throw new Error(copy.emptyAnswer)
      if (accumulated.trim() === '') throw new Error(copy.emptyAnswer)
      setTurns(previous => [
        ...previous,
        { role: 'user', text: question },
        { role: 'assistant', text: accumulated },
      ])
      setAnswer('')
    } catch (caught) {
      if (controller.signal.aborted) {
        if (accumulated.trim() !== '') {
          setTurns(previous => [
            ...previous,
            { role: 'user', text: question },
            { role: 'assistant', text: accumulated },
          ])
        }
        setAnswer('')
      } else {
        const code = caught !== null && typeof caught === 'object' && 'code' in caught
          ? String((caught as { code?: unknown }).code ?? '')
          : ''
        const message = errorMessage(caught, copy)
        setError({ code, message })
        if (accumulated.trim() !== '') {
          setTurns(previous => [
            ...previous,
            { role: 'user', text: question },
            { role: 'assistant', text: accumulated },
          ])
          setAnswer('')
        }
      }
    } finally {
      busyRef.current = false
      abortRef.current = null
      setBusy(false)
    }
  }, [copy, selection.text, turns])

  const submit = useCallback(() => {
    const question = draft.trim()
    if (question === '' || busyRef.current) return
    setDraft('')
    void ask(question)
  }, [ask, draft])

  const retry = useCallback(() => {
    if (lastQuestion.current === '') return
    setError(null)
    void ask(lastQuestion.current)
  }, [ask])

  const quoteHere = (): void => {
    onQuote(selection.text, draft.trim() === '' ? undefined : draft.trim())
  }

  return (
    <div
      className="dsh-if-panel dsh-if-ui"
      data-inline-followup-ui=""
      role="dialog"
      aria-label={copy.title}
      style={{ top: geometry.top, left: geometry.left, width: geometry.width, maxHeight: geometry.maxHeight }}
    >
      <div className="dsh-if-head">
        <div className="dsh-if-headIcon"><IconChatSpark /></div>
        <div className="dsh-if-headCopy">
          <div className="dsh-if-title">{copy.title}</div>
          <div className="dsh-if-sub">{copy.subtitle}</div>
        </div>
        <div className="dsh-if-headActions">
          <button type="button" className="dsh-if-iconBtn" title={copy.quoteHint} aria-label={copy.quoteAction} onClick={quoteHere}>
            <IconQuote />
          </button>
          <button type="button" className="dsh-if-iconBtn" title={copy.close} aria-label={copy.close} onClick={onClose}>
            <IconClose />
          </button>
        </div>
      </div>

      <div className="dsh-if-quote" title={copy.selectionLabel}>
        <div className="dsh-if-quoteBar" />
        <div className="dsh-if-quoteText">{selection.text}</div>
      </div>

      <div className="dsh-if-thread" ref={threadRef}>
        {turns.length === 0 && answer === '' && !busy && error === null && (
          <div className="dsh-if-hint">{copy.startHint}</div>
        )}
        {turns.map((turn, index) => (
          <div key={`turn-${index}`} className={`dsh-if-turn dsh-if-turn--${turn.role}`}>
            {turn.role === 'user'
              ? <div className="dsh-if-userBubble">{turn.text}</div>
              : <div className="dsh-if-answer"><Markdown text={turn.text} copy={copy} /></div>}
          </div>
        ))}
        {answer !== '' && (
          <div className="dsh-if-turn dsh-if-turn--assistant">
            <div className={`dsh-if-answer${busy ? ' dsh-if-answer--streaming' : ''}`}>
              <Markdown text={answer} copy={copy} />
            </div>
          </div>
        )}
        {busy && answer === '' && (
          <div className="dsh-if-thinking">
            <span>{copy.thinking}</span>
            <span className="dsh-if-dots"><i /><i /><i /></span>
          </div>
        )}
        {error !== null && (
          <div className="dsh-if-error">
            <div className="dsh-if-errorHead">
              <span>{error.code === 'NO_MODEL' ? copy.noModel : copy.errorTitle}</span>
              <button type="button" className="dsh-if-retry" onClick={retry}>{copy.retry}</button>
            </div>
            <div className="dsh-if-errorText">{error.message}</div>
          </div>
        )}
      </div>

      <div className="dsh-if-compose">
        <textarea
          ref={inputRef}
          className="dsh-if-input"
          rows={1}
          value={draft}
          placeholder={copy.placeholder}
          onChange={event => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
              event.preventDefault()
              submit()
            }
          }}
        />
        {busy
          ? (
            <button
              type="button"
              className="dsh-if-send dsh-if-send--stop"
              title={copy.stop}
              aria-label={copy.stop}
              onClick={() => abortRef.current?.abort()}
            >
              <IconStop />
            </button>
          )
          : (
            <button
              type="button"
              className="dsh-if-send"
              title={copy.send}
              aria-label={copy.send}
              disabled={draft.trim() === ''}
              onClick={submit}
            >
              <IconSend />
            </button>
          )}
      </div>

      <div className="dsh-if-foot">
        <span>{copy.footnote}</span>
        {model !== '' && <span className="dsh-if-footModel" title={model}>{copy.modelLabel}: {model}</span>}
      </div>
    </div>
  )
}

// ───────────────────────────────────────────────────────────────────────────
// Root overlay
// ───────────────────────────────────────────────────────────────────────────

interface RootProps {
  localeSource: { getSnapshot: () => Locale; subscribe: (listener: () => void) => () => void }
  sessionSource: { getSnapshot: () => string | undefined; subscribe: (listener: () => void) => () => void }
  quoteToMain: (selection: string, question?: string) => Promise<'composer' | 'clipboard' | 'failed'>
}

function InlineFollowup({ localeSource, sessionSource, quoteToMain }: RootProps): JSX.Element {
  const locale = useSyncExternalStore(localeSource.subscribe, localeSource.getSnapshot, localeSource.getSnapshot)
  const copy = COPY[locale] ?? ZH
  const sessionId = useSyncExternalStore(sessionSource.subscribe, sessionSource.getSnapshot, () => undefined)

  const [toolbar, setToolbar] = useState<ToolbarState | null>(null)
  const [panel, setPanel] = useState<PanelState | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const panelId = useRef(0)
  const toolbarRef = useRef<ToolbarState | null>(null)
  const panelRef = useRef<PanelState | null>(null)
  const toastTimer = useRef<number | undefined>(undefined)
  const detectTimer = useRef<number | undefined>(undefined)
  const toastCopy = useRef(copy)
  toastCopy.current = copy

  useEffect(() => {
    toolbarRef.current = toolbar
  }, [toolbar])
  useEffect(() => {
    panelRef.current = panel
  }, [panel])

  const showToast = useCallback((message: string) => {
    setToast(message)
    if (toastTimer.current !== undefined) window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(null), 2800)
  }, [])

  useEffect(() => () => {
    if (toastTimer.current !== undefined) window.clearTimeout(toastTimer.current)
    if (detectTimer.current !== undefined) window.clearTimeout(detectTimer.current)
  }, [])

  const openPanel = useCallback((selection: SelectionInfo) => {
    const geometry = panelGeometry(selection.rect)
    panelId.current += 1
    const next = { selection, ...geometry, id: panelId.current }
    // Update the ref in the same tick so a trailing selectionchange cannot
    // re-open the toolbar behind the window that is about to render.
    panelRef.current = next
    setToolbar(null)
    setPanel(next)
  }, [])

  const transferQuote = useCallback(async (selectionText: string, question?: string) => {
    const result = await quoteToMain(selectionText, question)
    setPanel(null)
    setToolbar(null)
    if (result === 'composer') showToast(toastCopy.current.quotedToast)
    else if (result === 'clipboard') showToast(toastCopy.current.copiedToast)
    else showToast(toastCopy.current.failedToast)
  }, [quoteToMain, showToast])

  useEffect(() => {
    if (sessionId === undefined) {
      setToolbar(null)
      setPanel(null)
    }
  }, [sessionId])

  useEffect(() => {
    if (sessionId === undefined) return undefined

    const detect = (): void => {
      if (panelRef.current !== null) return
      const selection = readSelection()
      if (selection === null) {
        setToolbar(null)
        return
      }
      setToolbar({ selection, ...toolbarGeometry(selection.rect) })
    }
    const schedule = (): void => {
      if (detectTimer.current !== undefined) window.clearTimeout(detectTimer.current)
      detectTimer.current = window.setTimeout(() => {
        detectTimer.current = undefined
        detect()
      }, 40)
    }
    const onPointerUp = (event: PointerEvent): void => {
      if (event.target instanceof Element && event.target.closest('[data-inline-followup-ui]') !== null) return
      schedule()
    }
    const onScroll = (): void => {
      if (panelRef.current === null) setToolbar(null)
    }
    const onResize = (): void => {
      setToolbar(null)
      setPanel(null)
    }
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key !== 'Escape') return
      setToolbar(null)
      setPanel(null)
    }

    document.addEventListener('pointerup', onPointerUp, true)
    document.addEventListener('keyup', schedule, true)
    document.addEventListener('selectionchange', schedule)
    document.addEventListener('scroll', onScroll, true)
    window.addEventListener('resize', onResize)
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerup', onPointerUp, true)
      document.removeEventListener('keyup', schedule, true)
      document.removeEventListener('selectionchange', schedule)
      document.removeEventListener('scroll', onScroll, true)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('keydown', onKeyDown)
      if (detectTimer.current !== undefined) {
        window.clearTimeout(detectTimer.current)
        detectTimer.current = undefined
      }
    }
  }, [sessionId])

  useEffect(() => {
    if (panel === null) return undefined
    const onPointerDown = (event: PointerEvent): void => {
      if (event.target instanceof Element && event.target.closest('[data-inline-followup-ui]') !== null) return
      setPanel(null)
    }
    document.addEventListener('pointerdown', onPointerDown, true)
    return () => document.removeEventListener('pointerdown', onPointerDown, true)
  }, [panel])

  return (
    <div className="dsh-if-root" data-inline-followup-root="">
      {toolbar !== null && panel === null && (
        <div
          className="dsh-if-toolbar dsh-if-ui"
          data-inline-followup-ui=""
          role="toolbar"
          aria-label={copy.title}
          style={{ top: toolbar.top, left: toolbar.left }}
          onMouseDown={event => event.preventDefault()}
        >
          <button
            type="button"
            className="dsh-if-toolbarBtn dsh-if-toolbarBtn--primary"
            data-tip={copy.sideAction}
            title={copy.sideHint}
            aria-label={copy.sideAction}
            onClick={() => openPanel(toolbar.selection)}
          >
            <IconChatSpark />
          </button>
          <span className="dsh-if-toolbarSep" />
          <button
            type="button"
            className="dsh-if-toolbarBtn dsh-if-toolbarBtn--end"
            data-tip={copy.quoteAction}
            title={copy.quoteHint}
            aria-label={copy.quoteAction}
            onClick={() => { void transferQuote(toolbar.selection.text) }}
          >
            <IconQuote />
          </button>
        </div>
      )}

      {panel !== null && (
        <MiniPanel
          key={`panel-${panel.id}`}
          selection={panel.selection}
          copy={copy}
          geometry={{ top: panel.top, left: panel.left, width: panel.width, maxHeight: panel.maxHeight }}
          onClose={() => setPanel(null)}
          onQuote={(selectionText, question) => { void transferQuote(selectionText, question) }}
        />
      )}

      {toast !== null && <div className="dsh-if-toast" role="status">{toast}</div>}
    </div>
  )
}

// ───────────────────────────────────────────────────────────────────────────
// Plugin entry
// ───────────────────────────────────────────────────────────────────────────

function currentSessionId(ctx: any): string | undefined {
  try {
    const binding = ctx.uiSession?.adapter?.current?.getSnapshot?.()
    const key = binding?.key ?? binding?.sessionId
    return typeof key === 'string' && key !== '' ? key : undefined
  } catch {
    return undefined
  }
}

function formatQuote(selection: string, question?: string): string {
  const quoted = selection.split(/\r?\n/).map(line => `> ${line}`).join('\n')
  const asked = question?.trim()
  return asked === undefined || asked === ''
    ? `${quoted}\n\n`
    : `${quoted}\n\n${asked}\n`
}

function focusComposerDom(): void {
  const input = document.querySelector<HTMLElement>('[data-composer-input], [contenteditable="true"]')
  input?.focus()
}

/**
 * Install the overlay, the selection watcher, and the composer bridge.
 */
export function apply(ctx: any): void {
  installStyle()

  let capturedActions: any = null

  function InputActionBridge(props: { inputActions?: any }): null {
    capturedActions = props.inputActions ?? null
    return null
  }

  const quoteToMain = async (selection: string, question?: string): Promise<'composer' | 'clipboard' | 'failed'> => {
    const text = formatQuote(selection, question)
    const sessionId = currentSessionId(ctx)
    if (sessionId !== undefined) {
      try {
        const conversation = ctx.get('conversation')
        const scope = typeof ctx.sessions?.scope === 'function' ? ctx.sessions.scope(sessionId) : undefined
        if (scope !== undefined && typeof conversation?.input?.for === 'function') {
          const shell = conversation.input.for(scope)
          if (shell !== null && shell !== undefined) {
            if (typeof shell.requestDraftInitialization === 'function') {
              const result = shell.requestDraftInitialization({ prompt: text, whenDraftExists: 'append' })
              if (result !== 'blocked') {
                shell.focus?.()
                return 'composer'
              }
            }
            if (typeof shell.setDraft === 'function') {
              const existing = typeof shell.snapshot?.draft === 'string' ? shell.snapshot.draft : ''
              shell.setDraft(existing.trim() === '' ? text : `${existing}\n\n${text}`)
              shell.focus?.()
              return 'composer'
            }
          }
        }
      } catch {
        /* fall through to the captured action face */
      }

      if (capturedActions !== null) {
        try {
          if (typeof capturedActions.setDraft === 'function') {
            capturedActions.setDraft(text)
            focusComposerDom()
            return 'composer'
          }
          if (typeof capturedActions.captureInsertion === 'function' && typeof capturedActions.insertText === 'function') {
            const span = capturedActions.captureInsertion()
            if (capturedActions.insertText(`\n\n${text}`, span) !== false) {
              focusComposerDom()
              return 'composer'
            }
          }
        } catch {
          /* fall through to clipboard */
        }
      }
    }

    try {
      await navigator.clipboard.writeText(text)
      return 'clipboard'
    } catch {
      return 'failed'
    }
  }

  const localeSource = {
    getSnapshot: (): Locale => {
      try {
        const active = String(ctx.locale.getLocale().active)
        return active.toLowerCase().startsWith('zh') ? 'zh' : 'en'
      } catch {
        return 'zh'
      }
    },
    subscribe: (listener: () => void) => ctx.locale.subscribe(listener),
  }

  const sessionSource = {
    getSnapshot: (): string | undefined => currentSessionId(ctx),
    subscribe: (listener: () => void) => ctx.uiSession.adapter.current.subscribe(listener),
  }

  // A tiny invisible bridge into the composer's session-scoped standard props.
  // It is the fallback when the internal `conversation.input` facade is not
  // available in this host build.
  try {
    ctx.slots.inject('conversation.input.right', () => ctx.slots.register({
      name: 'conversation.input.right',
      id: `${PLUGIN_ID}-composer-bridge`,
      order: 900,
    }, InputActionBridge))
  } catch {
    /* the direct conversation facade still covers the common case */
  }

  ctx.slots.inject('shell.overlay', () => ctx.slots.register({
    name: 'shell.overlay',
    id: PLUGIN_ID,
    order: 700,
    inject: () => ({ localeSource, sessionSource, quoteToMain }),
  }, InlineFollowup))
}
