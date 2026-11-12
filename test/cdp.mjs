import { writeFile } from 'node:fs/promises'

const [command, ...args] = process.argv.slice(2)
const port = process.env.CDP_PORT ?? '9222'
const targets = await (await fetch(`http://localhost:${port}/json/list`)).json()
const needle = process.env.CDP_URL_MATCH ?? '63999'
const page = targets.find(target => target.type === 'page' && target.url.includes(needle))
if (page === undefined) throw new Error('test page not found')
const socket = new WebSocket(page.webSocketDebuggerUrl)
let sequence = 0
const pending = new Map()

const events = []
socket.onmessage = (event) => {
  const message = JSON.parse(event.data)
  if (message.method === 'Runtime.consoleAPICalled' || message.method === 'Runtime.exceptionThrown' || message.method === 'Log.entryAdded') {
    events.push(message)
  }
  if (message.id !== undefined) {
    const waiter = pending.get(message.id)
    if (waiter !== undefined) {
      pending.delete(message.id)
      if (message.error !== undefined) waiter.reject(new Error(JSON.stringify(message.error)))
      else waiter.resolve(message.result)
    }
  }
}
await new Promise((resolve, reject) => {
  socket.onopen = resolve
  socket.onerror = reject
})

function send(method, params = {}) {
  sequence += 1
  const id = sequence
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject })
    socket.send(JSON.stringify({ id, method, params }))
  })
}

async function evaluate(expression) {
  const result = await send('Runtime.evaluate', {
    expression,
    awaitPromise: true,
    returnByValue: true,
    userGesture: true,
  })
  if (result.exceptionDetails !== undefined) {
    throw new Error(result.exceptionDetails.exception?.description ?? result.exceptionDetails.text)
  }
  return result.result?.value
}

if (command === 'eval') {
  console.log(JSON.stringify(await evaluate(args.join(' ')), null, 2))
} else if (command === 'viewport') {
  await send('Emulation.setDeviceMetricsOverride', {
    width: Number(args[0] ?? 1440),
    height: Number(args[1] ?? 1000),
    deviceScaleFactor: 1,
    mobile: false,
  })
  console.log('viewport set')
} else if (command === 'screenshot') {
  const result = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
  await writeFile(args[0], Buffer.from(result.data, 'base64'))
  console.log(args[0])
} else if (command === 'reload') {
  await send('Runtime.enable')
  await send('Log.enable')
  await send('Page.enable')
  await send('Page.reload', { ignoreCache: true })
  await new Promise(resolve => setTimeout(resolve, Number(args[0] ?? 5000)))
  for (const event of events) {
    if (event.method === 'Runtime.consoleAPICalled') {
      console.log('[console]', event.params.type, event.params.args.map(arg => arg.value ?? arg.description ?? '').join(' '))
    } else if (event.method === 'Runtime.exceptionThrown') {
      console.log('[exception]', event.params.exceptionDetails.exception?.description ?? event.params.exceptionDetails.text)
    } else {
      console.log('[log]', event.params.entry.level, event.params.entry.text)
    }
  }
  console.log(JSON.stringify(await evaluate('document.body.innerText.slice(0,2000)')))
} else if (command === 'type') {
  await send('Input.insertText', { text: args.join(' ') })
  console.log('typed')
} else if (command === 'mouse') {
  await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: Number(args[0]), y: Number(args[1]) })
  await new Promise(resolve => setTimeout(resolve, 400))
  console.log('moved')
} else if (command === 'navigate') {
  await send('Page.navigate', { url: args[0] })
  await new Promise(resolve => setTimeout(resolve, Number(args[1] ?? 3000)))
  console.log(await evaluate('document.title'))
} else {
  throw new Error(`unknown command: ${command}`)
}
socket.close()
