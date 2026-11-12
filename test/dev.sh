#!/usr/bin/env sh
# Run the Web profile with this plugin installed from the checkout, without
# touching the user's real profile. Generates a temporary patch file so the
# repository never has to contain a machine-specific absolute path.
set -eu

ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
TMP_ROOT="${TMPDIR:-/tmp}"
TMP="${TMP_ROOT%/}/dsh-inline-followup-overlay.yml"
DSH_BIN="${DSH:-dsh}"

cat > "$TMP" <<EOF
- insert:
    - id: inline-followup
      name: "file://$ROOT/index.js"
      config:
        maxTokens: 1200
EOF

echo "overlay: $TMP"
echo "plugin:  $ROOT"
exec "$DSH_BIN" --profile web --patch "$TMP" --no-open \
  --port "${PORT:-63999}" --host "${HOST:-127.0.0.1}" "$@"
