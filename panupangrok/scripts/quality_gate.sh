#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
python -m json.tool branding/brand_config.json >/dev/null
python -m json.tool config/config.template.json >/dev/null
python -m compileall -q app.py config.py agent bridge channel cli common expert_system models plugins scheduler tasks_api translate voice
python -m pytest
if command -v git >/dev/null 2>&1; then git diff --check -- . ':!*.log' || true; fi
if find . -type f \( -name 'config.json' -o -name '.env' -o -name 'user_datas.pkl' -o -name 'session_prefs.json' -o -name '*.db' -o -name '*.log' -o -name '*.pid' \) -print -quit | grep -q .; then echo 'forbidden runtime file found' >&2; exit 1; fi
echo 'quality gate passed'
