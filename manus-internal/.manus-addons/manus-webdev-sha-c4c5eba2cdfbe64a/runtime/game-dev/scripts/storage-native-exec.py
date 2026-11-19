"""Keep the native process group tied to its supervisor's lifetime on Linux."""
import ctypes
import os
import signal
import subprocess
import sys

parent = int(os.environ['GAME_STORAGE_SUPERVISOR_PID'])
def parent_exited(_signal, _frame):
    os.killpg(os.getpgrp(), signal.SIGKILL)

signal.signal(signal.SIGUSR1, parent_exited)
if os.getppid() != parent:
    parent_exited(None, None)
# This launcher is the detached group leader. A supervisor SIGKILL must not
# strand Godot or a Blender importer continuing to write a discarded candidate.
if ctypes.CDLL(None, use_errno=True).prctl(1, signal.SIGUSR1, 0, 0, 0) != 0:
    sys.stderr.write('Game native process lifetime protection is unavailable\n')
    sys.exit(1)
if os.getppid() != parent:
    parent_exited(None, None)
child = subprocess.Popen(sys.argv[1:], close_fds=False)
sys.exit(child.wait())
