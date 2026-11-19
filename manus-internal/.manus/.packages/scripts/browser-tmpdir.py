#!/usr/bin/python3
"""Allocate an owned browser directory on bounded executable memory storage."""

import os
import subprocess
import sys
import tempfile

ROOTS = ('/tmp/manus-browser', '/dev/shm')


def eligible_root(path: str) -> bool:
    if not os.path.isdir(path):
        return False
    mount = subprocess.run(
        ['findmnt', '--noheadings', '--output', 'FSTYPE,OPTIONS', '--target', path],
        capture_output=True,
        text=True,
        check=False,
        timeout=3,
    )
    fields = mount.stdout.split()
    if mount.returncode or len(fields) != 2 or fields[0] != 'tmpfs' or 'noexec' in fields[1].split(','):
        return False
    capacity = os.statvfs(path)
    return 512 * 1024**2 <= capacity.f_blocks * capacity.f_frsize <= 2 * 1024**3


def create_directory(roots=ROOTS) -> str | None:
    for root in roots:
        if eligible_root(root):
            # mkdtemp uses mode0700 and an unpredictable name. A full eligible
            # filesystem is an error; never spill its allocation to root disk.
            return tempfile.mkdtemp(prefix='manus-chromium-', dir=root)
    return None


if __name__ == '__main__':
    try:
        directory = create_directory()
        if directory is None:
            sys.exit(2)  # An unsupported Local host retains its existing setup.
        print(directory)
    except (OSError, subprocess.SubprocessError):
        print('Browser temporary memory storage is unavailable or full', file=sys.stderr)
        sys.exit(1)
