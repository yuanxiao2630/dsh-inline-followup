window.__ModuleLoader__.load({ id: "dsh-inline-followup", factory: (require) => {
var module = { exports: {} };
var exports = module.exports;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client.tsx
var client_exports = {};
__export(client_exports, {
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(client_exports);
var import_react = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
var PLUGIN_ID = "dsh-inline-followup";
var inject = ["slots", "sessions", "locale", "uiSession", "uiConversation"];
var API = "/inline-followup/api";
var MAX_SELECTION_CHARS = 6e3;
var STYLE_ID = `${PLUGIN_ID}-style`;
var ZH = {
  title: "\u5212\u8BCD\u8FFD\u95EE",
  subtitle: "\u5C31\u8FD9\u6BB5\u5185\u5BB9\u7EE7\u7EED\u95EE\uFF0C\u4E0D\u5F71\u54CD\u4E3B\u5BF9\u8BDD",
  sideAction: "\u5C31\u5730\u8FFD\u95EE",
  sideHint: "\u5728\u9009\u4E2D\u5185\u5BB9\u65C1\u8FB9\u7684\u5C0F\u7A97\u91CC\u8FFD\u95EE",
  quoteAction: "\u5F15\u7528\u5230\u4E3B\u5BF9\u8BDD",
  quoteHint: "\u628A\u9009\u4E2D\u5185\u5BB9\u4F5C\u4E3A\u5F15\u7528\u653E\u8FDB\u4E3B\u5BF9\u8BDD\u8F93\u5165\u6846",
  close: "\u5173\u95ED",
  copy: "\u590D\u5236",
  copied: "\u5DF2\u590D\u5236",
  send: "\u53D1\u9001",
  stop: "\u505C\u6B62",
  placeholder: "\u9488\u5BF9\u9009\u4E2D\u5185\u5BB9\u7EE7\u7EED\u8FFD\u95EE\uFF0CEnter \u53D1\u9001",
  startHint: "\u4E0B\u9762\u8FD9\u6BB5\u5185\u5BB9\u5DF2\u5E26\u5165\u5C0F\u7A97\uFF0C\u76F4\u63A5\u63D0\u95EE\u5373\u53EF\u3002",
  selectionLabel: "\u9009\u4E2D\u5185\u5BB9",
  footnote: "\u56DE\u7B54\u53EA\u663E\u793A\u5728\u5C0F\u7A97\u4E2D \xB7 \u4E0D\u4F1A\u5199\u5165\u4E3B\u5BF9\u8BDD",
  thinking: "\u6B63\u5728\u601D\u8003",
  retry: "\u91CD\u8BD5",
  errorTitle: "\u8FFD\u95EE\u5931\u8D25",
  noModel: "\u6CA1\u6709\u53EF\u7528\u7684\u6A21\u578B\uFF0C\u8BF7\u5148\u5728\u8BBE\u7F6E\u91CC\u9009\u62E9\u9ED8\u8BA4\u6A21\u578B\u3002",
  emptyAnswer: "\u6A21\u578B\u6CA1\u6709\u8FD4\u56DE\u5185\u5BB9\uFF0C\u8BF7\u6362\u4E2A\u95EE\u6CD5\u518D\u8BD5\u3002",
  quotedToast: "\u5DF2\u5F15\u7528\u5230\u4E3B\u5BF9\u8BDD\u8F93\u5165\u6846\uFF0C\u7EE7\u7EED\u8F93\u5165\u4F60\u7684\u95EE\u9898",
  copiedToast: "\u5DF2\u590D\u5236\u5230\u526A\u8D34\u677F",
  failedToast: "\u6CA1\u6709\u627E\u5230\u4E3B\u5BF9\u8BDD\u8F93\u5165\u6846\uFF0C\u5F15\u7528\u5931\u8D25",
  chars: (count) => `${count} \u5B57`,
  modelLabel: "\u6A21\u578B"
};
var EN = {
  title: "Ask about selection",
  subtitle: "Follow up here without touching the main chat",
  sideAction: "Ask here",
  sideHint: "Open a small window beside the selected text",
  quoteAction: "Quote in main chat",
  quoteHint: "Put the selection into the main composer as a quote",
  close: "Close",
  copy: "Copy",
  copied: "Copied",
  send: "Send",
  stop: "Stop",
  placeholder: "Ask about the selection \u2014 Enter to send",
  startHint: "The selection is already in this window. Ask away.",
  selectionLabel: "Selected text",
  footnote: "Answers stay in this window \xB7 the main chat is not modified",
  thinking: "Thinking",
  retry: "Retry",
  errorTitle: "Follow-up failed",
  noModel: "No model is available. Choose a default model in Settings first.",
  emptyAnswer: "The model returned no text. Try rephrasing the question.",
  quotedToast: "Quoted in the main composer \u2014 keep typing your question",
  copiedToast: "Copied to clipboard",
  failedToast: "Could not find the main composer; the selection was not quoted",
  chars: (count) => `${count} chars`,
  modelLabel: "Model"
};
var COPY = { zh: ZH, en: EN };
var CSS = `
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
`;
function installStyle() {
  if (document.getElementById(STYLE_ID) !== null) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.dataset.plugin = PLUGIN_ID;
  style.textContent = CSS;
  document.head.append(style);
}
function IconChatSpark() {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", { width: "17", height: "17", viewBox: "0 0 20 20", fill: "none", "aria-hidden": "true", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "path",
      {
        d: "M3.4 6.2A2.7 2.7 0 0 1 6.1 3.5h7.8a2.7 2.7 0 0 1 2.7 2.7v5.1a2.7 2.7 0 0 1-2.7 2.7H9.2l-3.9 2.7v-2.9A2.7 2.7 0 0 1 3.4 11V6.2Z",
        stroke: "currentColor",
        strokeWidth: "1.4",
        strokeLinejoin: "round"
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "path",
      {
        d: "M14.2 1.6l.45 1.25 1.25.45-1.25.45-.45 1.25-.45-1.25L12.5 3.3l1.25-.45.45-1.25Z",
        fill: "currentColor"
      }
    )
  ] });
}
function IconQuote() {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", { width: "17", height: "17", viewBox: "0 0 20 20", fill: "none", "aria-hidden": "true", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M8 5.2 4.2 9l3.8 3.8", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M4.4 9h7.2a4.2 4.2 0 0 1 4.2 4.2v1.5", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round" })
  ] });
}
function IconClose() {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", { width: "15", height: "15", viewBox: "0 0 16 16", fill: "none", "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "m4.2 4.2 7.6 7.6M11.8 4.2l-7.6 7.6", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round" }) });
}
function IconSend() {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", { width: "15", height: "15", viewBox: "0 0 16 16", fill: "none", "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M2.4 7.9 13.5 2.7 9.2 13.7 7.3 9.3 2.4 7.9Z", stroke: "currentColor", strokeWidth: "1.4", strokeLinejoin: "round" }) });
}
function IconStop() {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", { width: "13", height: "13", viewBox: "0 0 16 16", fill: "none", "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", { x: "4.2", y: "4.2", width: "7.6", height: "7.6", rx: "1.5", fill: "currentColor" }) });
}
function toRectLike(rect) {
  return {
    top: rect.top,
    left: rect.left,
    right: rect.right,
    bottom: rect.bottom,
    width: rect.width,
    height: rect.height
  };
}
function elementOf(node) {
  if (node === null) return null;
  if (node.nodeType === Node.ELEMENT_NODE) return node;
  return node.parentElement;
}
function readSelection() {
  const selection = window.getSelection();
  if (selection === null || selection.isCollapsed || selection.rangeCount === 0) return null;
  const raw = selection.toString();
  const text = raw.replace(/\u00a0/g, " ").trim();
  if (text === "") return null;
  const range = selection.getRangeAt(0);
  const start = elementOf(range.startContainer);
  if (start === null) return null;
  if (start.closest('textarea, input, select, [contenteditable="true"], [contenteditable=""], [data-inline-followup-ui]') !== null) {
    return null;
  }
  if (start.closest('button, a, [role="button"]') !== null) return null;
  const flow = start.closest("[data-chat-flow-key]");
  if (flow === null) return null;
  const kind = flow.getAttribute("data-chat-flow-kind");
  if (kind === "user" || kind === "steering" || kind === "turn-trigger") return null;
  if (start.closest('[data-conversation-scroll], [data-slot="conversation.chat.flow"]') === null) return null;
  const rects = typeof range.getClientRects === "function" ? Array.from(range.getClientRects()) : [];
  let rect = rects.length > 0 ? rects[rects.length - 1] : range.getBoundingClientRect();
  if (rect === void 0 || rect.width === 0 && rect.height === 0) rect = range.getBoundingClientRect();
  if (rect.width === 0 && rect.height === 0) return null;
  const totalChars = text.length;
  const clipped = totalChars > MAX_SELECTION_CHARS ? `${text.slice(0, MAX_SELECTION_CHARS)}

\u2026\uFF08\u5DF2\u622A\u65AD ${totalChars - MAX_SELECTION_CHARS} \u5B57\uFF09` : text;
  return { text: clipped, totalChars, rect: toRectLike(rect) };
}
function toolbarGeometry(rect) {
  const width = 76;
  const height = 38;
  let top = rect.bottom + 8;
  let left = rect.right - width;
  if (top + height > window.innerHeight - 8) top = rect.top - height - 8;
  top = Math.max(8, Math.min(top, window.innerHeight - height - 8));
  left = Math.max(8, Math.min(left, window.innerWidth - width - 8));
  return { top, left };
}
function panelGeometry(rect) {
  const width = Math.min(430, window.innerWidth - 24);
  let left = rect.right + 12;
  if (left + width > window.innerWidth - 12) {
    left = Math.max(12, Math.min(rect.right - width, window.innerWidth - width - 12));
  }
  const limit = Math.min(560, window.innerHeight - 24);
  let top = rect.bottom + 12;
  let maxHeight = Math.min(limit, window.innerHeight - top - 12);
  if (maxHeight < 300 && rect.top > 300) {
    maxHeight = Math.min(limit, rect.top - 24);
    top = Math.max(12, rect.top - maxHeight - 12);
  }
  if (maxHeight < 260) {
    maxHeight = 260;
    top = Math.max(12, window.innerHeight - maxHeight - 12);
  }
  return { top, left, width, maxHeight };
}
async function* readSse(response) {
  if (response.body === null) throw new Error("empty response body");
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true }).replace(/\r\n/g, "\n");
      let boundary = buffer.indexOf("\n\n");
      while (boundary >= 0) {
        const frame = buffer.slice(0, boundary);
        buffer = buffer.slice(boundary + 2);
        const parsed = parseFrame(frame);
        if (parsed !== null) yield parsed;
        boundary = buffer.indexOf("\n\n");
      }
    }
    buffer += decoder.decode();
    const tail = parseFrame(buffer);
    if (tail !== null) yield tail;
  } finally {
    reader.releaseLock();
  }
}
function parseFrame(frame) {
  let event = "message";
  const dataLines = [];
  for (const line of frame.split("\n")) {
    if (line === "" || line.startsWith(":")) continue;
    if (line.startsWith("event:")) event = line.slice(6).trim();
    else if (line.startsWith("data:")) dataLines.push(line.slice(5).trimStart());
  }
  if (dataLines.length === 0) return null;
  const payload = dataLines.join("\n");
  try {
    return { event, data: JSON.parse(payload) };
  } catch {
    return { event, data: payload };
  }
}
function errorMessage(error, copy) {
  if (error instanceof Error && error.message !== "") return error.message;
  return copy.errorTitle;
}
function isBlockStart(line) {
  if (/^\s*```/.test(line)) return true;
  if (/^#{1,4}\s+/.test(line)) return true;
  if (/^\s*([-*_])\1{2,}\s*$/.test(line)) return true;
  if (/^\s*>\s?/.test(line)) return true;
  if (/^\s*[-*+]\s+/.test(line)) return true;
  if (/^\s*\d+[.)]\s+/.test(line)) return true;
  return line.trim() === "";
}
function renderInline(text, keyPrefix) {
  const nodes = [];
  const pattern = /(`[^`\n]+`|\*\*[^*\n]+\*\*|\*[^*\n]+\*|\[[^\]\n]+\]\((?:https?:\/\/)[^\s)]+\))/g;
  let cursor = 0;
  let index = 0;
  for (const match of text.matchAll(pattern)) {
    const at = match.index ?? 0;
    if (at > cursor) nodes.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: text.slice(cursor, at) }, `${keyPrefix}-t-${index++}`));
    const token = match[0];
    if (token.startsWith("`")) {
      nodes.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: token.slice(1, -1) }, `${keyPrefix}-c-${index++}`));
    } else if (token.startsWith("**")) {
      nodes.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: token.slice(2, -2) }, `${keyPrefix}-b-${index++}`));
    } else if (token.startsWith("*")) {
      nodes.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: token.slice(1, -1) }, `${keyPrefix}-i-${index++}`));
    } else {
      const close = token.indexOf("](");
      const label = token.slice(1, close);
      const href = token.slice(close + 2, -1);
      nodes.push(
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", { href, target: "_blank", rel: "noreferrer noopener", children: label }, `${keyPrefix}-a-${index++}`)
      );
    }
    cursor = at + token.length;
  }
  if (cursor < text.length) nodes.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: text.slice(cursor) }, `${keyPrefix}-t-${index++}`));
  return nodes;
}
function CodeBlock({ code, language, copy }) {
  const [copied, setCopied] = (0, import_react.useState)(false);
  const timer = (0, import_react.useRef)(void 0);
  (0, import_react.useEffect)(() => () => {
    if (timer.current !== void 0) window.clearTimeout(timer.current);
  }, []);
  const onCopy = () => {
    void navigator.clipboard?.writeText(code).then(() => {
      setCopied(true);
      if (timer.current !== void 0) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 1200);
    }).catch(() => {
    });
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-if-code", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-if-codeHead", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: language === "" ? "code" : language }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "dsh-if-codeCopy", onClick: onCopy, children: copied ? copy.copied : copy.copy })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: code }) })
  ] });
}
function Markdown({ text, copy }) {
  const lines = (0, import_react.useMemo)(() => text.split("\n"), [text]);
  const blocks = [];
  let i = 0;
  let key = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.trim() === "") {
      i += 1;
      continue;
    }
    const fence = /^\s*```(.*)$/.exec(line);
    if (fence !== null) {
      const language = fence[1].trim();
      const body = [];
      i += 1;
      while (i < lines.length && !/^\s*```\s*$/.test(lines[i])) {
        body.push(lines[i]);
        i += 1;
      }
      if (i < lines.length) i += 1;
      blocks.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CodeBlock, { code: body.join("\n"), language, copy }, `code-${key++}`));
      continue;
    }
    const heading = /^(#{1,4})\s+(.*)$/.exec(line);
    if (heading !== null) {
      const level = Math.min(4, heading[1].length);
      const content = renderInline(heading[2], `h-${key}`);
      if (level === 1) blocks.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: content }, `h-${key++}`));
      else if (level === 2) blocks.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: content }, `h-${key++}`));
      else if (level === 3) blocks.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: content }, `h-${key++}`));
      else blocks.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { children: content }, `h-${key++}`));
      i += 1;
      continue;
    }
    if (/^\s*([-*_])\1{2,}\s*$/.test(line)) {
      blocks.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", {}, `hr-${key++}`));
      i += 1;
      continue;
    }
    if (/^\s*>\s?/.test(line)) {
      const quoted = [];
      while (i < lines.length && /^\s*>\s?/.test(lines[i])) {
        quoted.push(lines[i].replace(/^\s*>\s?/, ""));
        i += 1;
      }
      blocks.push(
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("blockquote", { children: quoted.map((row, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
          renderInline(row, `q-${key}-${index}`),
          index < quoted.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {})
        ] }, `q-${key}-${index}`)) }, `q-${key++}`)
      );
      continue;
    }
    const unordered = /^\s*[-*+]\s+/.test(line);
    const ordered = /^\s*\d+[.)]\s+/.test(line);
    if (unordered || ordered) {
      const items = [];
      const pattern = unordered ? /^\s*[-*+]\s+/ : /^\s*\d+[.)]\s+/;
      while (i < lines.length && pattern.test(lines[i])) {
        items.push(lines[i].replace(pattern, ""));
        i += 1;
      }
      const children = items.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: renderInline(item, `li-${key}-${index}`) }, `li-${key}-${index}`));
      blocks.push(unordered ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children }, `ul-${key++}`) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", { children }, `ol-${key++}`));
      continue;
    }
    const paragraph = [];
    while (i < lines.length && lines[i].trim() !== "" && !isBlockStart(lines[i])) {
      paragraph.push(lines[i]);
      i += 1;
    }
    if (paragraph.length === 0) {
      paragraph.push(lines[i]);
      i += 1;
    }
    blocks.push(
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: paragraph.map((row, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
        renderInline(row, `p-${key}-${index}`),
        index < paragraph.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {})
      ] }, `p-${key}-${index}`)) }, `p-${key++}`)
    );
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dsh-if-md", children: blocks });
}
function MiniPanel({ selection, copy, geometry, onClose, onQuote }) {
  const [turns, setTurns] = (0, import_react.useState)([]);
  const [draft, setDraft] = (0, import_react.useState)("");
  const [answer, setAnswer] = (0, import_react.useState)("");
  const [busy, setBusy] = (0, import_react.useState)(false);
  const [error, setError] = (0, import_react.useState)(null);
  const [model, setModel] = (0, import_react.useState)("");
  const busyRef = (0, import_react.useRef)(false);
  const abortRef = (0, import_react.useRef)(null);
  const lastQuestion = (0, import_react.useRef)("");
  const threadRef = (0, import_react.useRef)(null);
  const inputRef = (0, import_react.useRef)(null);
  (0, import_react.useEffect)(() => {
    inputRef.current?.focus();
  }, []);
  (0, import_react.useEffect)(() => () => {
    abortRef.current?.abort();
  }, []);
  (0, import_react.useEffect)(() => {
    const element = threadRef.current;
    if (element !== null) element.scrollTop = element.scrollHeight;
  }, [turns, answer, busy, error]);
  (0, import_react.useEffect)(() => {
    const element = inputRef.current;
    if (element === null) return;
    element.style.height = "auto";
    element.style.height = `${Math.min(132, element.scrollHeight)}px`;
  }, [draft]);
  const ask = (0, import_react.useCallback)(async (question) => {
    if (busyRef.current) return;
    busyRef.current = true;
    setBusy(true);
    setError(null);
    setAnswer("");
    setModel("");
    lastQuestion.current = question;
    const controller = new AbortController();
    abortRef.current = controller;
    let accumulated = "";
    let settled = false;
    try {
      const history = turns.map((turn) => ({ role: turn.role, text: turn.text }));
      const response = await fetch(`${API}/ask`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ selection: selection.text, question, history }),
        signal: controller.signal
      });
      if (!response.ok) {
        let message = `HTTP ${response.status}`;
        try {
          const payload = await response.json();
          if (typeof payload.message === "string" && payload.message !== "") message = payload.message;
        } catch {
        }
        throw new Error(message);
      }
      for await (const event of readSse(response)) {
        if (event.event === "delta") {
          const payload = event.data;
          if (typeof payload.text === "string") {
            accumulated += payload.text;
            setAnswer(accumulated);
          }
        } else if (event.event === "done") {
          const payload = event.data;
          if (typeof payload.model === "string") setModel(payload.model);
          settled = true;
          break;
        } else if (event.event === "error") {
          const payload = event.data;
          const code = typeof payload.code === "string" ? payload.code : "ASK_FAILED";
          const message = typeof payload.message === "string" ? payload.message : copy.errorTitle;
          throw Object.assign(new Error(message), { code });
        }
      }
      if (!settled && accumulated.trim() === "") throw new Error(copy.emptyAnswer);
      if (accumulated.trim() === "") throw new Error(copy.emptyAnswer);
      setTurns((previous) => [
        ...previous,
        { role: "user", text: question },
        { role: "assistant", text: accumulated }
      ]);
      setAnswer("");
    } catch (caught) {
      if (controller.signal.aborted) {
        if (accumulated.trim() !== "") {
          setTurns((previous) => [
            ...previous,
            { role: "user", text: question },
            { role: "assistant", text: accumulated }
          ]);
        }
        setAnswer("");
      } else {
        const code = caught !== null && typeof caught === "object" && "code" in caught ? String(caught.code ?? "") : "";
        const message = errorMessage(caught, copy);
        setError({ code, message });
        if (accumulated.trim() !== "") {
          setTurns((previous) => [
            ...previous,
            { role: "user", text: question },
            { role: "assistant", text: accumulated }
          ]);
          setAnswer("");
        }
      }
    } finally {
      busyRef.current = false;
      abortRef.current = null;
      setBusy(false);
    }
  }, [copy, selection.text, turns]);
  const submit = (0, import_react.useCallback)(() => {
    const question = draft.trim();
    if (question === "" || busyRef.current) return;
    setDraft("");
    void ask(question);
  }, [ask, draft]);
  const retry = (0, import_react.useCallback)(() => {
    if (lastQuestion.current === "") return;
    setError(null);
    void ask(lastQuestion.current);
  }, [ask]);
  const quoteHere = () => {
    onQuote(selection.text, draft.trim() === "" ? void 0 : draft.trim());
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    "div",
    {
      className: "dsh-if-panel dsh-if-ui",
      "data-inline-followup-ui": "",
      role: "dialog",
      "aria-label": copy.title,
      style: { top: geometry.top, left: geometry.left, width: geometry.width, maxHeight: geometry.maxHeight },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-if-head", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dsh-if-headIcon", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconChatSpark, {}) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-if-headCopy", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dsh-if-title", children: copy.title }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dsh-if-sub", children: copy.subtitle })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-if-headActions", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "dsh-if-iconBtn", title: copy.quoteHint, "aria-label": copy.quoteAction, onClick: quoteHere, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconQuote, {}) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "dsh-if-iconBtn", title: copy.close, "aria-label": copy.close, onClick: onClose, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconClose, {}) })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-if-quote", title: copy.selectionLabel, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dsh-if-quoteBar" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dsh-if-quoteText", children: selection.text })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-if-thread", ref: threadRef, children: [
          turns.length === 0 && answer === "" && !busy && error === null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dsh-if-hint", children: copy.startHint }),
          turns.map((turn, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `dsh-if-turn dsh-if-turn--${turn.role}`, children: turn.role === "user" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dsh-if-userBubble", children: turn.text }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dsh-if-answer", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Markdown, { text: turn.text, copy }) }) }, `turn-${index}`)),
          answer !== "" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dsh-if-turn dsh-if-turn--assistant", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `dsh-if-answer${busy ? " dsh-if-answer--streaming" : ""}`, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Markdown, { text: answer, copy }) }) }),
          busy && answer === "" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-if-thinking", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: copy.thinking }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "dsh-if-dots", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {})
            ] })
          ] }),
          error !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-if-error", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-if-errorHead", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: error.code === "NO_MODEL" ? copy.noModel : copy.errorTitle }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "dsh-if-retry", onClick: retry, children: copy.retry })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dsh-if-errorText", children: error.message })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-if-compose", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "textarea",
            {
              ref: inputRef,
              className: "dsh-if-input",
              rows: 1,
              value: draft,
              placeholder: copy.placeholder,
              onChange: (event) => setDraft(event.target.value),
              onKeyDown: (event) => {
                if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
                  event.preventDefault();
                  submit();
                }
              }
            }
          ),
          busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "button",
            {
              type: "button",
              className: "dsh-if-send dsh-if-send--stop",
              title: copy.stop,
              "aria-label": copy.stop,
              onClick: () => abortRef.current?.abort(),
              children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconStop, {})
            }
          ) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "button",
            {
              type: "button",
              className: "dsh-if-send",
              title: copy.send,
              "aria-label": copy.send,
              disabled: draft.trim() === "",
              onClick: submit,
              children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconSend, {})
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-if-foot", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: copy.footnote }),
          model !== "" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "dsh-if-footModel", title: model, children: [
            copy.modelLabel,
            ": ",
            model
          ] })
        ] })
      ]
    }
  );
}
function InlineFollowup({ localeSource, sessionSource, quoteToMain }) {
  const locale = (0, import_react.useSyncExternalStore)(localeSource.subscribe, localeSource.getSnapshot, localeSource.getSnapshot);
  const copy = COPY[locale] ?? ZH;
  const sessionId = (0, import_react.useSyncExternalStore)(sessionSource.subscribe, sessionSource.getSnapshot, () => void 0);
  const [toolbar, setToolbar] = (0, import_react.useState)(null);
  const [panel, setPanel] = (0, import_react.useState)(null);
  const [toast, setToast] = (0, import_react.useState)(null);
  const panelId = (0, import_react.useRef)(0);
  const toolbarRef = (0, import_react.useRef)(null);
  const panelRef = (0, import_react.useRef)(null);
  const toastTimer = (0, import_react.useRef)(void 0);
  const detectTimer = (0, import_react.useRef)(void 0);
  const toastCopy = (0, import_react.useRef)(copy);
  toastCopy.current = copy;
  (0, import_react.useEffect)(() => {
    toolbarRef.current = toolbar;
  }, [toolbar]);
  (0, import_react.useEffect)(() => {
    panelRef.current = panel;
  }, [panel]);
  const showToast = (0, import_react.useCallback)((message) => {
    setToast(message);
    if (toastTimer.current !== void 0) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2800);
  }, []);
  (0, import_react.useEffect)(() => () => {
    if (toastTimer.current !== void 0) window.clearTimeout(toastTimer.current);
    if (detectTimer.current !== void 0) window.clearTimeout(detectTimer.current);
  }, []);
  const openPanel = (0, import_react.useCallback)((selection) => {
    const geometry = panelGeometry(selection.rect);
    panelId.current += 1;
    const next = { selection, ...geometry, id: panelId.current };
    panelRef.current = next;
    setToolbar(null);
    setPanel(next);
  }, []);
  const transferQuote = (0, import_react.useCallback)(async (selectionText, question) => {
    const result = await quoteToMain(selectionText, question);
    setPanel(null);
    setToolbar(null);
    if (result === "composer") showToast(toastCopy.current.quotedToast);
    else if (result === "clipboard") showToast(toastCopy.current.copiedToast);
    else showToast(toastCopy.current.failedToast);
  }, [quoteToMain, showToast]);
  (0, import_react.useEffect)(() => {
    if (sessionId === void 0) {
      setToolbar(null);
      setPanel(null);
    }
  }, [sessionId]);
  (0, import_react.useEffect)(() => {
    if (sessionId === void 0) return void 0;
    const detect = () => {
      if (panelRef.current !== null) return;
      const selection = readSelection();
      if (selection === null) {
        setToolbar(null);
        return;
      }
      setToolbar({ selection, ...toolbarGeometry(selection.rect) });
    };
    const schedule = () => {
      if (detectTimer.current !== void 0) window.clearTimeout(detectTimer.current);
      detectTimer.current = window.setTimeout(() => {
        detectTimer.current = void 0;
        detect();
      }, 40);
    };
    const onPointerUp = (event) => {
      if (event.target instanceof Element && event.target.closest("[data-inline-followup-ui]") !== null) return;
      schedule();
    };
    const onScroll = () => {
      if (panelRef.current === null) setToolbar(null);
    };
    const onResize = () => {
      setToolbar(null);
      setPanel(null);
    };
    const onKeyDown = (event) => {
      if (event.key !== "Escape") return;
      setToolbar(null);
      setPanel(null);
    };
    document.addEventListener("pointerup", onPointerUp, true);
    document.addEventListener("keyup", schedule, true);
    document.addEventListener("selectionchange", schedule);
    document.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerup", onPointerUp, true);
      document.removeEventListener("keyup", schedule, true);
      document.removeEventListener("selectionchange", schedule);
      document.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKeyDown);
      if (detectTimer.current !== void 0) {
        window.clearTimeout(detectTimer.current);
        detectTimer.current = void 0;
      }
    };
  }, [sessionId]);
  (0, import_react.useEffect)(() => {
    if (panel === null) return void 0;
    const onPointerDown = (event) => {
      if (event.target instanceof Element && event.target.closest("[data-inline-followup-ui]") !== null) return;
      setPanel(null);
    };
    document.addEventListener("pointerdown", onPointerDown, true);
    return () => document.removeEventListener("pointerdown", onPointerDown, true);
  }, [panel]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-if-root", "data-inline-followup-root": "", children: [
    toolbar !== null && panel === null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      "div",
      {
        className: "dsh-if-toolbar dsh-if-ui",
        "data-inline-followup-ui": "",
        role: "toolbar",
        "aria-label": copy.title,
        style: { top: toolbar.top, left: toolbar.left },
        onMouseDown: (event) => event.preventDefault(),
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "button",
            {
              type: "button",
              className: "dsh-if-toolbarBtn dsh-if-toolbarBtn--primary",
              "data-tip": copy.sideAction,
              title: copy.sideHint,
              "aria-label": copy.sideAction,
              onClick: () => openPanel(toolbar.selection),
              children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconChatSpark, {})
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dsh-if-toolbarSep" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "button",
            {
              type: "button",
              className: "dsh-if-toolbarBtn dsh-if-toolbarBtn--end",
              "data-tip": copy.quoteAction,
              title: copy.quoteHint,
              "aria-label": copy.quoteAction,
              onClick: () => {
                void transferQuote(toolbar.selection.text);
              },
              children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconQuote, {})
            }
          )
        ]
      }
    ),
    panel !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      MiniPanel,
      {
        selection: panel.selection,
        copy,
        geometry: { top: panel.top, left: panel.left, width: panel.width, maxHeight: panel.maxHeight },
        onClose: () => setPanel(null),
        onQuote: (selectionText, question) => {
          void transferQuote(selectionText, question);
        }
      },
      `panel-${panel.id}`
    ),
    toast !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dsh-if-toast", role: "status", children: toast })
  ] });
}
function currentSessionId(ctx) {
  try {
    const binding = ctx.uiSession?.adapter?.current?.getSnapshot?.();
    const key = binding?.key ?? binding?.sessionId;
    return typeof key === "string" && key !== "" ? key : void 0;
  } catch {
    return void 0;
  }
}
function formatQuote(selection, question) {
  const quoted = selection.split(/\r?\n/).map((line) => `> ${line}`).join("\n");
  const asked = question?.trim();
  return asked === void 0 || asked === "" ? `${quoted}

` : `${quoted}

${asked}
`;
}
function focusComposerDom() {
  const input = document.querySelector('[data-composer-input], [contenteditable="true"]');
  input?.focus();
}
function apply(ctx) {
  installStyle();
  let capturedActions = null;
  function InputActionBridge(props) {
    capturedActions = props.inputActions ?? null;
    return null;
  }
  const quoteToMain = async (selection, question) => {
    const text = formatQuote(selection, question);
    const sessionId = currentSessionId(ctx);
    if (sessionId !== void 0) {
      try {
        const conversation = ctx.get("conversation");
        const scope = typeof ctx.sessions?.scope === "function" ? ctx.sessions.scope(sessionId) : void 0;
        if (scope !== void 0 && typeof conversation?.input?.for === "function") {
          const shell = conversation.input.for(scope);
          if (shell !== null && shell !== void 0) {
            if (typeof shell.requestDraftInitialization === "function") {
              const result = shell.requestDraftInitialization({ prompt: text, whenDraftExists: "append" });
              if (result !== "blocked") {
                shell.focus?.();
                return "composer";
              }
            }
            if (typeof shell.setDraft === "function") {
              const existing = typeof shell.snapshot?.draft === "string" ? shell.snapshot.draft : "";
              shell.setDraft(existing.trim() === "" ? text : `${existing}

${text}`);
              shell.focus?.();
              return "composer";
            }
          }
        }
      } catch {
      }
      if (capturedActions !== null) {
        try {
          if (typeof capturedActions.setDraft === "function") {
            capturedActions.setDraft(text);
            focusComposerDom();
            return "composer";
          }
          if (typeof capturedActions.captureInsertion === "function" && typeof capturedActions.insertText === "function") {
            const span = capturedActions.captureInsertion();
            if (capturedActions.insertText(`

${text}`, span) !== false) {
              focusComposerDom();
              return "composer";
            }
          }
        } catch {
        }
      }
    }
    try {
      await navigator.clipboard.writeText(text);
      return "clipboard";
    } catch {
      return "failed";
    }
  };
  const localeSource = {
    getSnapshot: () => {
      try {
        const active = String(ctx.locale.getLocale().active);
        return active.toLowerCase().startsWith("zh") ? "zh" : "en";
      } catch {
        return "zh";
      }
    },
    subscribe: (listener) => ctx.locale.subscribe(listener)
  };
  const sessionSource = {
    getSnapshot: () => currentSessionId(ctx),
    subscribe: (listener) => ctx.uiSession.adapter.current.subscribe(listener)
  };
  try {
    ctx.slots.inject("conversation.input.right", () => ctx.slots.register({
      name: "conversation.input.right",
      id: `${PLUGIN_ID}-composer-bridge`,
      order: 900
    }, InputActionBridge));
  } catch {
  }
  ctx.slots.inject("shell.overlay", () => ctx.slots.register({
    name: "shell.overlay",
    id: PLUGIN_ID,
    order: 700,
    inject: () => ({ localeSource, sessionSource, quoteToMain })
  }, InlineFollowup));
}

return module.exports;
} });
