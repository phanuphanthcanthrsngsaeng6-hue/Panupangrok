#!/data/data/com.termux/files/usr/bin/bash
# nova-daemon.sh — เปิด/ปิด/เช็ก NovaAgent (9899) + Manus Bridge (8742) ให้รันถาวร
# แบบไม่ผูกกับ session ของ Termux: setsid + nohup + detach จาก tty → PPID=1
#
# Usage:
#   ./nova-daemon.sh start     # เปิดทั้งคู่ (ข้ามตัวที่รันอยู่แล้ว)
#   ./nova-daemon.sh stop      # หยุดทั้งคู่
#   ./nova-daemon.sh restart
#   ./nova-daemon.sh status
#   ./nova-daemon.sh logs [nova|bridge]
#
# หมายเหตุ: ไม่มี systemd/supervisor/pm2 ใน Termux นี้ จึงใช้ setsid เป็นตัว
#           ทำให้ process กลายเป็น session leader อิสระ (orphan → init รับเลี้ยง)
#           ตราบใดที่ Termux process ยังไม่ถูก Android ฆ่า process จะอยู่ต่อ
set -u

BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$BASE_DIR" || exit 1

NOVA_PORT="${NOVA_PORT:-9899}"
BRIDGE_PORT="${BRIDGE_PORT:-8742}"
NOVA_LOG="$BASE_DIR/logs/nova.log"
BRIDGE_LOG="$BASE_DIR/manus-api/manus-api.log"
NOVA_PIDFILE="$BASE_DIR/.runtime/nova.pid"
BRIDGE_PIDFILE="$BASE_DIR/manus-api/.manus-api.pid"

mkdir -p "$BASE_DIR/logs" "$BASE_DIR/.runtime"

c_green=$'\033[32m'; c_red=$'\033[31m'; c_yellow=$'\033[33m'; c_dim=$'\033[2m'; c_reset=$'\033[0m'

http_ok() { # $1=url
  curl -s -o /dev/null --max-time 3 "$1" 2>/dev/null
}

pid_alive() { [ -n "${1:-}" ] && kill -0 "$1" 2>/dev/null; }

nova_pid() {
  if [ -f "$NOVA_PIDFILE" ]; then
    local p; p=$(cat "$NOVA_PIDFILE" 2>/dev/null)
    pid_alive "$p" && { echo "$p"; return; }
  fi
  # fallback: หา python ที่รัน app.py (cwd = BASE_DIR) หรือ path เต็ม
  pgrep -f "python3? $BASE_DIR/app.py" 2>/dev/null | head -1
  pgrep -f "python3? app\.py" 2>/dev/null | while read -r q; do
    [ "$(readlink /proc/$q/cwd 2>/dev/null)" = "$BASE_DIR" ] && { echo "$q"; break; }
  done
}

bridge_pid() {
  if [ -f "$BRIDGE_PIDFILE" ]; then
    local p; p=$(python3 -c 'import json,sys;print(json.load(open(sys.argv[1]))["pid"])' "$BRIDGE_PIDFILE" 2>/dev/null)
    pid_alive "$p" && { echo "$p"; return; }
  fi
  pgrep -f "$BASE_DIR/manus-api/src/server.js" 2>/dev/null | head -1
}

start_nova() {
  local p; p=$(nova_pid)
  if pid_alive "$p"; then
    echo "${c_yellow}• Nova รันอยู่แล้ว (PID $p)${c_reset}"
    return 0
  fi
  echo "🚀 เปิด NovaAgent :$NOVA_PORT ..."
  # setsid → session ใหม่ ไม่มี controlling tty; nohup กัน SIGHUP; & + disown
  setsid nohup python3 "$BASE_DIR/app.py" >> "$NOVA_LOG" 2>&1 < /dev/null &
  echo $! > "$NOVA_PIDFILE"
  disown 2>/dev/null || true
  for i in $(seq 1 40); do
    if http_ok "http://127.0.0.1:$NOVA_PORT/"; then
      echo "${c_green}✔ Nova พร้อม → http://127.0.0.1:$NOVA_PORT (PID $(cat "$NOVA_PIDFILE"))${c_reset}"
      return 0
    fi
    sleep 1
  done
  echo "${c_red}✗ Nova ไม่ตอบใน 40s — ดู $NOVA_LOG${c_reset}"
  tail -20 "$NOVA_LOG" 2>/dev/null
  return 1
}

start_bridge() {
  local p; p=$(bridge_pid)
  if pid_alive "$p" || http_ok "http://127.0.0.1:$BRIDGE_PORT/health"; then
    echo "${c_yellow}• Manus Bridge รันอยู่แล้ว (PID ${p:-?})${c_reset}"
    return 0
  fi
  echo "🔌 เปิด Manus Bridge :$BRIDGE_PORT ..."
  # cli.js ใช้ spawn detached:true + unref() อยู่แล้ว → ไม่ต้อง setsid
  manus-api start --port "$BRIDGE_PORT" >> "$BRIDGE_LOG" 2>&1 < /dev/null
  for i in $(seq 1 20); do
    if http_ok "http://127.0.0.1:$BRIDGE_PORT/health"; then
      echo "${c_green}✔ Bridge พร้อม → http://127.0.0.1:$BRIDGE_PORT/v1${c_reset}"
      return 0
    fi
    sleep 1
  done
  echo "${c_red}✗ Bridge ไม่ตอบใน 20s — ดู $BRIDGE_LOG${c_reset}"
  return 1
}

stop_nova() {
  local p; p=$(nova_pid)
  if pid_alive "$p"; then
    echo "🛑 หยุด Nova (PID $p)"
    kill "$p" 2>/dev/null
    for i in $(seq 1 15); do pid_alive "$p" || break; sleep 1; done
    pid_alive "$p" && { echo "${c_yellow}• ไม่ยอมจบ → SIGKILL${c_reset}"; kill -9 "$p" 2>/dev/null; }
  else
    echo "${c_dim}• Nova ไม่ได้รัน${c_reset}"
  fi
  rm -f "$NOVA_PIDFILE"
}

stop_bridge() {
  if command -v manus-api >/dev/null 2>&1; then
    echo "🛑 หยุด Manus Bridge"
    manus-api stop >/dev/null 2>&1 || true
  else
    local p; p=$(bridge_pid); pid_alive "$p" && kill "$p" 2>/dev/null
  fi
  rm -f "$BRIDGE_PIDFILE"
}

status() {
  echo "── NovaAgent-Terminal ─────────────────────────"
  local np bp
  np=$(nova_pid); bp=$(bridge_pid)
  if pid_alive "$np"; then
    printf "  Nova   : ${c_green}UP${c_reset}  pid=%s  port=%s  http=%s\n" "$np" "$NOVA_PORT" \
      "$(curl -s -o /dev/null -w '%{http_code}' --max-time 3 http://127.0.0.1:$NOVA_PORT/ 2>/dev/null)"
  else
    printf "  Nova   : ${c_red}DOWN${c_reset}  port=%s\n" "$NOVA_PORT"
  fi
  if pid_alive "$bp"; then
    printf "  Bridge : ${c_green}UP${c_reset}  pid=%s  port=%s  http=%s\n" "$bp" "$BRIDGE_PORT" \
      "$(curl -s -o /dev/null -w '%{http_code}' --max-time 3 http://127.0.0.1:$BRIDGE_PORT/health 2>/dev/null)"
  else
    printf "  Bridge : ${c_red}DOWN${c_reset}  port=%s\n" "$BRIDGE_PORT"
  fi
  echo "── Parent (PPID ควรเป็น 1 = หลุดจาก Termux session) ─"
  for p in "$np" "$bp"; do
    pid_alive "$p" && printf "  pid=%s ppid=%s cmd=%s\n" "$p" \
      "$(awk '{print $4}' /proc/$p/stat 2>/dev/null)" \
      "$(tr '\0' ' ' < /proc/$p/cmdline 2>/dev/null | cut -c1-80)"
  done
  echo "  Logs   : $NOVA_LOG | $BRIDGE_LOG"
}

case "${1:-status}" in
  start)   start_nova; start_bridge ;;
  stop)    stop_nova; stop_bridge ;;
  restart) stop_nova; stop_bridge; sleep 1; start_nova; start_bridge ;;
  status)  status ;;
  logs)
    case "${2:-nova}" in
      bridge) tail -n 60 -f "$BRIDGE_LOG" ;;
      *)      tail -n 60 -f "$NOVA_LOG" ;;
    esac ;;
  *)
    echo "Usage: $0 {start|stop|restart|status|logs [nova|bridge]}" >&2
    exit 2 ;;
esac