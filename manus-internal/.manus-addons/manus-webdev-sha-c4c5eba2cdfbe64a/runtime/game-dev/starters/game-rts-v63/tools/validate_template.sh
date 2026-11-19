#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CHECK_ROOT="$(mktemp -d "${TMPDIR:-/tmp}/superhero-rts-check.XXXXXX")"
trap 'rm -rf "$CHECK_ROOT"' EXIT
rsync -a --exclude '.git/' --exclude '.godot/' --exclude 'site/' --exclude 'dist/' --exclude 'captures/' "$ROOT/" "$CHECK_ROOT/project/"
python3 - "$CHECK_ROOT/project" <<'PY'
import hashlib, json, pathlib, sys
root = pathlib.Path(sys.argv[1])
json.loads((root / 'template.json').read_text())
for name, asset in json.loads((root / 'assets.lock.json').read_text())['assets'].items():
    data = (root / name).read_bytes()
    assert len(data) == asset['size'], name
    assert hashlib.sha256(data).hexdigest() == asset['sha256'].removeprefix('sha256:'), name
project = root / 'project.godot'
project.write_text(project.read_text().replace('[application]', '[application]\nconfig/use_custom_user_dir=true\nconfig/custom_user_dir_name="' + root.parent.name + '"', 1))
PY
bash "$CHECK_ROOT/project/tools/run_tests.sh"
printf '%s\n' 'PASS validate_template: clean assets, import and simulation'
