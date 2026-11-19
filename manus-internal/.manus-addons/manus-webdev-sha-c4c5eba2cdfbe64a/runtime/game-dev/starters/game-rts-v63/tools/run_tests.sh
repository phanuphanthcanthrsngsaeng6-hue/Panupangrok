#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
GODOT_BIN="${GODOT_BIN:-$(command -v godot || command -v godot4 || true)}"
if [[ -z "$GODOT_BIN" && -x /Applications/Godot.app/Contents/MacOS/Godot ]]; then
  GODOT_BIN=/Applications/Godot.app/Contents/MacOS/Godot
fi
[[ -n "$GODOT_BIN" && -x "$GODOT_BIN" ]] || { echo 'Set GODOT_BIN to Godot 4.7.2.' >&2; exit 1; }
[[ "$("$GODOT_BIN" --version)" == 4.7.2* ]] || { echo 'Godot 4.7.2 is required.' >&2; exit 1; }
LOG_DIR="$(mktemp -d)"
trap 'rm -rf "$LOG_DIR"' EXIT
run_checked() {
  local label="$1"
  shift
  "$GODOT_BIN" "$@" 2>&1 | tee "$LOG_DIR/$label.log"
  if grep -Eq '(^|[[:space:]])(SCRIPT ERROR|ERROR:|Parse Error|Compile Error)|FAIL:' "$LOG_DIR/$label.log"; then
    echo "Godot diagnostics failed $label." >&2
    exit 1
  fi
}
run_checked import --headless --editor --path "$ROOT" --import
test -f "$ROOT/tests/simulation_test.gd"
run_checked simulation --headless --path "$ROOT" --script res://tests/simulation_test.gd
grep -q 'simulation_test: PASS' "$LOG_DIR/simulation.log"
