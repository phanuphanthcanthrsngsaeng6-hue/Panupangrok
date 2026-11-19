#!/bin/bash
set -euo pipefail

# Ensure x11vnc is running on :0 and expose websocket on 5901
if ! pgrep -f "x11vnc -display :0" >/dev/null 2>&1; then
	echo "x11vnc not running; supervisor should manage it"
fi

# --web was previously pointed at /opt/.manus/.packages/chrome-extensions/manus-helper,
# a vestige of the manus-helper Chrome extension era. The Go vnc-proxy binary
# (cmd/vnc-proxy/main.go lines 43-46) only registers a static file handler when
# --web is explicitly passed; without it only the /vnc and /websockify
# WebSocket-proxy routes register, which is what real VNC consumers (Neko, external
# clients) actually hit. The previous --web value was serving Chrome extension
# internals (manifest.json, content.ts.js) over HTTP for no purpose. See
# pkg/runtime/TODO.md for the Go-runtime extension removal context. The positional
# args (5901 localhost:5900) are no-ops under the Go binary (it uses -l / -t flags)
# but match its defaults; kept as a port-topology hint and to preserve Python
# websockify CLI compatibility if the binary is ever swapped.
exec websockify 5901 localhost:5900



