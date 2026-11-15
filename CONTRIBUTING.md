# Contributing

## Commit convention

This repository follows [Conventional Commits](https://www.conventionalcommits.org/).
Keep each commit focused on one change.

```text
<type>(<optional scope>): <short imperative summary>

<optional body>

<optional footer>
```

Common types:

| Type | Use for |
| --- | --- |
| `feat` | A user-visible capability or package/release change |
| `fix` | A bug fix |
| `docs` | README, comments, guides |
| `test` | Tests and test fixtures |
| `refactor` | Internal restructuring without behavior change |
| `chore` | Tooling, dependencies, CI |
| `build` | Build output or build scripts |

Examples:

```text
feat: add inline follow-up window for selected text
feat(client): quote a selection into the main composer
fix(host): reject cross-origin ask requests
docs: document npm installation
test: cover truncated history prompts
```

Rules:

- Use the imperative mood: `add`, `fix`, `remove` — not `added` or `adds`.
- Do not end the subject with a period.
- Keep the subject under ~72 characters.
- Put the “why” in the body when it is not obvious.
- Reference issues in the footer, for example `Refs: #12`.
- Never commit credentials, `.env` files, tokens, private keys, or personal
  paths. Screenshots must be cropped to remove account, workspace, and session
  information.

## Development install

```sh
pnpm install          # installs the esbuild build dependency
pnpm build            # regenerates client.js
pnpm check            # node --check on both halves
pnpm test             # Host route + SSE smoke test
```

`client.js` is committed on purpose so installing the plugin never requires a
build step. After changing `src/client.tsx`, run `pnpm build` and commit the
regenerated `client.js` in the same commit.

## Local DSH test

```sh
./test/dev.sh
```

The script generates a temporary overlay with this checkout's absolute path and
starts the Web profile on `127.0.0.1:63999` by default. Override with
`PORT`, `HOST`, or `DSH`:

```sh
DSH=/path/to/dsh PORT=64000 ./test/dev.sh
```

## Release checklist

1. Update `version` in `package.json`.
2. Run `pnpm build`, `pnpm check`, and `pnpm test`.
3. Commit with a `feat:` or `fix:` subject.
4. Tag: `git tag -a vX.Y.Z -m "dsh-inline-followup X.Y.Z"`.
5. Push `main` and the tag.
6. Create a GitHub release with the packed tarball:
   `npm pack` → `gh release create vX.Y.Z ./dsh-inline-followup-X.Y.Z.tgz`.
7. Publish to npm: `npm publish --registry=https://registry.npmjs.org/`.
8. Verify: `npm view dsh-inline-followup version`.
