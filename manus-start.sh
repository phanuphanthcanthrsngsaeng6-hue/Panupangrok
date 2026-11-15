#!/data/data/com.termux/files/usr/bin/bash
# manus-start.sh - เปิด Manus Bridge (OpenAI-compatible API over Manus)
# Usage: ./manus-start.sh [port]
set -u

PORT="${1:-8742}"
LOG="$HOME/puter.log"

echo "🔌 กำลังเปิด Manus Bridge..."

if ! command -v manus-api >/dev/null 2>&1; then
  echo "✗ ไม่พบคำสั่ง manus-api ใน PATH" >&2
  echo "  ติดตั้ง: ln -sf $HOME/NovaAgent-Terminal/manus-api/src/cli.js \$PREFIX/bin/manus-api" >&2
  exit 1
fi

nohup manus-api start --port "$PORT" > "$LOG" 2>&1 &
sleep 5

if curl -s --max-time 10 "http://127.0.0.1:${PORT}/health" >/dev/null 2>&1; then
  echo "✔ Manus Bridge พร้อมใช้งาน"
  echo "  Endpoint : http://127.0.0.1:${PORT}/v1"
  echo "  Log      : $LOG"
  echo "  หยุดด้วย  : manus-api stop"
else
  echo "✗ เปิดไม่สำเร็จ — ดู log: $LOG" >&2
  tail -20 "$LOG" >&2
  exit 1
fi
