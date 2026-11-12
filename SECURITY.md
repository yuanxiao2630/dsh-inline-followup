# Security

`dsh-inline-followup` is a local DeepSeek Harness client plugin. It does not
collect credentials, run a remote service, or send telemetry.

## Data flow

- The browser half calls only the same-origin Host route
  `POST /inline-followup/api/ask`.
- The Host half calls the model provider configured in your DSH profile
  through `ctx.llm.stream()`.
- The selected text, the current question, and the small window's local
  history are placed in that model request. Treat selected text as data you
  are willing to send to your configured provider.
- The plugin persists nothing: no Session log, no localStorage, no files.

## Host fence

The `/ask` route accepts only:

- same-origin `Origin` (or a non-browser request without an Origin header);
- `application/json`;
- a bounded request body (512 KiB), selection (12,000 chars), question
  (8,000 chars), and history (16 turns / 24,000 chars).

The route is served by DSH's loopback Web server, not exposed publicly by this
plugin.

## Reporting a vulnerability

Please use GitHub's **Security → Report a vulnerability** flow on this
repository rather than opening a public issue with exploit details.
