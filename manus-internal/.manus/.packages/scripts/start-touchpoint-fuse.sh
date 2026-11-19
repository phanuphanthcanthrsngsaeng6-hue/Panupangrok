#!/bin/bash
set -euo pipefail

TOUCHPOINT_FUSE_BIN=${TOUCHPOINT_FUSE_BIN:-/usr/local/bin/manus-touchpoint-fuse}
TOUCHPOINT_CONFIG=${TOUCHPOINT_CONFIG:-/home/ubuntu/.touchpoint/runtime/touchpoint-fuse-config.json}
TOUCHPOINT_MOUNT_PATH=${TOUCHPOINT_MOUNT_PATH:-/mnt/touchpoint}

if [ ! -x "$TOUCHPOINT_FUSE_BIN" ]; then
    echo "touchpoint fuse binary not found: ${TOUCHPOINT_FUSE_BIN}" >&2
    exit 1
fi

if [ ! -f "$TOUCHPOINT_CONFIG" ]; then
    echo "touchpoint fuse config not found: ${TOUCHPOINT_CONFIG}" >&2
    exit 1
fi

mkdir -p "$TOUCHPOINT_MOUNT_PATH"

# 清理可能残留的 stale FUSE 挂载（确保清理失败不影响 touchpoint-fuse 启动）
cleanup_stale_touchpoint_mount() {
    if ! mountpoint -q "$TOUCHPOINT_MOUNT_PATH" 2>/dev/null; then
        return 0
    fi

    local fusermount_bin
    fusermount_bin="$(command -v fusermount3 || command -v fusermount || true)"
    if [ -z "$fusermount_bin" ]; then
        echo "Found mounted touchpoint path but no fusermount binary is available: ${TOUCHPOINT_MOUNT_PATH}" >&2
        return 0
    fi

    echo "Found stale touchpoint mount at ${TOUCHPOINT_MOUNT_PATH}, unmounting..."
    "$fusermount_bin" -uz "$TOUCHPOINT_MOUNT_PATH" 2>/dev/null || true
}
cleanup_stale_touchpoint_mount || true

echo "Starting touchpoint-fuse..."
echo "  bin: ${TOUCHPOINT_FUSE_BIN}"
echo "  config: ${TOUCHPOINT_CONFIG}"
echo "  mount-point: ${TOUCHPOINT_MOUNT_PATH}"
exec "$TOUCHPOINT_FUSE_BIN" \
    --config "$TOUCHPOINT_CONFIG" \
    --mount-point "$TOUCHPOINT_MOUNT_PATH" \
    --read-only
