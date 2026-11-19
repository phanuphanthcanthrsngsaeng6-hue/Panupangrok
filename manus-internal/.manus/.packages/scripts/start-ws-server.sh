#!/bin/bash
set -euo pipefail

RUNTIME_PATH=${RUNTIME_PATH:-/opt/.manus/.sandbox-runtime}
MOUNT_BASE=${MOUNT_BASE:-/mnt}
# Go 二进制在 ${RUNTIME_PATH}/bin（镜像构建与热更新都放在这里）；找不到时回退到 PATH。
WS_SERVER_BIN=${WS_SERVER_BIN:-${RUNTIME_PATH}/bin/ws-server}
WS_MOUNT_BIN=${WS_MOUNT_BIN:-${RUNTIME_PATH}/bin/ws-mount}

if [ ! -x "$WS_SERVER_BIN" ]; then
    if command -v ws-server >/dev/null 2>&1; then
        WS_SERVER_BIN="$(command -v ws-server)"
    else
        echo "ws-server binary not found: ${WS_SERVER_BIN}" >&2
        exit 1
    fi
fi

if [ ! -x "$WS_MOUNT_BIN" ]; then
    if command -v ws-mount >/dev/null 2>&1; then
        WS_MOUNT_BIN="$(command -v ws-mount)"
    else
        echo "ws-mount binary not found: ${WS_MOUNT_BIN}" >&2
        exit 1
    fi
fi

mkdir -p "$MOUNT_BASE"

# 清理残留的 ws-mount 进程和 stale FUSE 挂载（确保清理失败不影响 ws-server 启动）
cleanup_stale_ws_mount() {
    # 杀掉所有残留的 ws-mount 进程（ws-server 崩溃重启时，旧 ws-mount 会被 reparent 到 init 成为孤儿）
    if pgrep -x ws-mount >/dev/null 2>&1; then
        echo "Found orphaned ws-mount processes, killing..."
        pkill -9 -x ws-mount 2>/dev/null || true
        echo "Orphaned ws-mount processes cleaned up."
    fi

    # 清理可能残留的 stale FUSE 挂载点
    local stale_mounts
    stale_mounts=$(mount 2>/dev/null | grep "fuse" | awk '{print $3}' | grep "^${MOUNT_BASE}" || true)
    if [ -n "$stale_mounts" ]; then
        echo "Found stale FUSE mounts under ${MOUNT_BASE}, unmounting..."
        echo "$stale_mounts" | while read -r mp; do
            fusermount -uz "$mp" 2>/dev/null || true
            echo "  Unmounted: $mp"
        done
    fi
}
cleanup_stale_ws_mount || true

echo "Starting ws-server..."
echo "  bin: ${WS_SERVER_BIN}"
echo "  mount-bin: ${WS_MOUNT_BIN}"
echo "  listen: 0.0.0.0:19780"
echo "  mount base: ${MOUNT_BASE}"

exec "$WS_SERVER_BIN" --listen 0.0.0.0:19780 --mount-base "$MOUNT_BASE" --mount-bin "$WS_MOUNT_BIN"
