#!/bin/bash
set -euo pipefail

# Ensure XDG_RUNTIME_DIR exists with 0700 perms before chromium starts.
# Chromium otherwise logs "error: XDG_RUNTIME_DIR not set in the
# environment." on every cold start. The supervisor env (4-chrome.conf)
# sets XDG_RUNTIME_DIR=/tmp/runtime-ubuntu; we just need to create it
# and tighten its perms. chmod is best-effort: if the dir already
# exists with the right owner from a prior run, mode bits are kept.
xdg_runtime_dir="${XDG_RUNTIME_DIR:-/tmp/runtime-ubuntu}"
mkdir -p "$xdg_runtime_dir"
chmod 0700 "$xdg_runtime_dir" 2>/dev/null || true

# Wait for sandbox-runtime health check to pass
while ! curl -s http://localhost:8330/healthz -o /dev/null -w "%{http_code}" | grep -q "200"; do
    echo "[chrome] Waiting for sandbox-runtime to be ready..."
    sleep 1
done

echo "sandbox-runtime is ready, starting chrome..."
# Execute the original chrome startup script
exec /opt/.manus/.packages/scripts/start-chrome.sh