#!/data/data/com.termux/files/usr/bin/bash
# manus-bridge-start.sh - เปิด Manus Bridge แบบ one-liner
# Usage: bash manus-bridge-start.sh [port]
set -u

PORT="${1:-8742}"
LOG="$HOME/puter.log"

echo "🔌 กำลังเปิด Manus Bridge..."

nohup manus-api start --port "$PORT" > "$LOG" 2>&1 &
sleep 5

if curl -s --max-time 10 "http://127.0.0.1:${PORT}/health" >/dev/null 2>&1; then
  echo "✔ Manus Bridge พร้อมใช้งาน → http://127.0.0.1:${PORT}/v1"
  echo "  Log: $LOG"
else
  echo "✗ เปิดไม่สำเร็จ — ดู log: $LOG" >&2
  tail -20 "$LOG" >&2
  exit 1
fi
