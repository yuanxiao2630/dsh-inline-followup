import { createServer } from 'node:http'
import { strict as assert } from 'node:assert'
import { apply, ROUTE_PREFIX } from '../index.js'

let handler = null
const seen = []
const fakeStream = async function* stream(options) {
  seen.push(options)
  yield { type: 'block-start', index: 0, blockType: 'text' }
  yield { type: 'text-delta', index: 0, text: '你好，' }
  yield { type: 'text-delta', index: 0, text: '这是小窗回答。' }
  yield { type: 'finish', reason: { kind: 'stop' } }
}
const ctx = {
  webServer: {
    register(route) {
      assert.equal(route.kind, 'prefix')
      assert.equal(route.path, ROUTE_PREFIX)
      handler = route.handler
      return () => { handler = null }
    },
  },
  effect(fn) {
    const dispose = fn()
    return () => dispose?.()
  },
  get(name) {
    if (name === 'llm') return { stream: fakeStream }
    if (name === 'agentDefaultModel') return { currentSelection: () => ({ provider: 'fake-provider', model: 'fake-model' }) }
    return undefined
  },
}

apply(ctx, { maxTokens: 321 })

const server = createServer((req, res) => handler(req, res))
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
const address = server.address()
const base = `http://127.0.0.1:${address.port}${ROUTE_PREFIX}`
try {
  const health = await fetch(`${base}/health`)
  const healthBody = await health.json()
  assert.equal(health.status, 200)
  assert.equal(healthBody.ok, true)
  assert.equal(healthBody.model, 'fake-provider/fake-model')

  const badOrigin = await fetch(`${base}/health`, { headers: { origin: 'https://evil.example' } })
  assert.equal(badOrigin.status, 403)

  const empty = await fetch(`${base}/ask`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ selection: 'x', question: '   ' }),
  })
  assert.equal(empty.status, 400)
  assert.equal((await empty.json()).code, 'EMPTY_QUESTION')

  const answer = await fetch(`${base}/ask`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      selection: '被选中的那句话',
      question: '这是什么意思？',
      history: [{ role: 'user', text: '上一问' }, { role: 'assistant', text: '上一答' }],
    }),
  })
  assert.equal(answer.status, 200)
  assert.match(answer.headers.get('content-type') ?? '', /text\/event-stream/)
  const wire = await answer.text()
  assert.match(wire, /event: delta/)
  assert.match(wire, /你好，/)
  assert.match(wire, /event: done/)
  assert.equal(seen.length, 1)
  assert.equal(seen[0].provider, 'fake-provider')
  assert.equal(seen[0].model, 'fake-model')
  assert.equal(seen[0].maxTokens, 321)
  assert.match(seen[0].messages[0].content[0].text, /<selected_text>\n被选中的那句话\n<\/selected_text>/)
  assert.match(seen[0].messages[0].content[0].text, /用户：上一问/)
  assert.equal(seen[0].messages[1].content[0].text, '这是什么意思？')

  console.log('host smoke: ok')
} finally {
  await new Promise(resolve => server.close(resolve))
}
