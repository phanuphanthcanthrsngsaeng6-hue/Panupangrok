"""Filesystem admission shared with Sandbox storageguard; no project data is removed."""
import errno
import fcntl
import json
import os
import re
import stat
import sys
import uuid

MARGIN = 2 * 1024 ** 3

def start(pid):
    try:
        with open('/proc/%d/stat' % pid) as source:
            return source.read().rsplit(')', 1)[1].split()[19]
    except FileNotFoundError:
        if sys.platform.startswith('linux'):
            return None
        try:
            os.kill(pid, 0)
            return ''
        except ProcessLookupError:
            return None

def regular(path):
    value = os.lstat(path)
    if not stat.S_ISREG(value.st_mode) or value.st_uid != os.getuid() or value.st_size > 4096:
        raise ValueError('invalid storage reservation file')

def main(request):
    directory = '/tmp/manus-storage-reservations-%d' % os.getuid()
    try:
        os.mkdir(directory, 0o700)
    except FileExistsError:
        pass
    info = os.lstat(directory)
    if not stat.S_ISDIR(info.st_mode) or info.st_uid != os.getuid() or info.st_mode & 0o077:
        raise ValueError('invalid storage reservation directory')
    lock = os.open(directory + '/admission.lock', os.O_CREAT | os.O_RDWR | os.O_NOFOLLOW, 0o600)
    try:
        regular(directory + '/admission.lock')
        fcntl.flock(lock, fcntl.LOCK_EX)
        if request['action'] == 'release':
            if not re.fullmatch(r'[a-f0-9]{32}', request['id']):
                raise ValueError('invalid reservation identity')
            path = directory + '/' + request['id'] + '.json'
            try:
                regular(path)
                with open(path) as source:
                    value = json.load(source)
                if value['pid'] == request['pid'] and value['process_start'] == start(request['pid']):
                    os.unlink(path)
            except FileNotFoundError:
                pass
            return {}
        filesystem = os.statvfs(request['path'])
        device = str(os.stat(request['path']).st_dev)
        reserved_bytes = reserved_inodes = 0
        for name in os.listdir(directory):
            pending = re.fullmatch(r'\.pending-([1-9][0-9]*)-[a-f0-9]{32}', name)
            if pending and start(int(pending[1])) is None:
                regular(directory + '/' + name)
                os.unlink(directory + '/' + name)
                continue
            if not name.endswith('.json'):
                continue
            path = directory + '/' + name
            try:
                regular(path)
                with open(path) as source:
                    value = json.load(source)
            except FileNotFoundError:
                # Go releases reservations by unlinking without taking this lock.
                continue
            if (not isinstance(value.get('pid'), int) or value['pid'] <= 0 or
                    not isinstance(value.get('process_start'), str) or not isinstance(value.get('device'), str) or
                    not isinstance(value.get('bytes'), int) or value['bytes'] < 0 or
                    not isinstance(value.get('inodes'), int) or value['inodes'] < 0):
                raise ValueError('invalid storage reservation record')
            if start(value['pid']) != value['process_start']:
                try:
                    os.unlink(path)
                except FileNotFoundError:
                    pass
                continue
            if value['device'] == device:
                reserved_bytes += value['bytes']
                reserved_inodes += value['inodes']
        available = filesystem.f_bavail * filesystem.f_frsize
        fraction = filesystem.f_blocks * filesystem.f_frsize // 10
        margin = max(MARGIN, min(4 * 1024 ** 3, fraction) if request.get('local') else fraction)
        required = margin + reserved_bytes + request['bytes']
        required_inodes = 4096 + reserved_inodes + request['inodes']
        if available < required or (filesystem.f_files and filesystem.f_favail < required_inodes):
            return {'error': 'GAME_STORAGE_CAPACITY', 'availableBytes': available, 'requiredBytes': required,
                    'availableInodes': filesystem.f_favail, 'requiredInodes': required_inodes}
        identifier = uuid.uuid4().hex
        value = {'pid': request['pid'], 'process_start': start(request['pid']), 'device': device,
                 'bytes': request['bytes'], 'inodes': request['inodes']}
        if value['process_start'] is None:
            raise ValueError('storage reservation owner exited')
        path = directory + '/' + identifier + '.json'
        pending = directory + '/.pending-%d-%s' % (request['pid'], identifier)
        try:
            with open(pending, 'x') as output:
                os.chmod(pending, 0o600)
                json.dump(value, output)
            os.replace(pending, path)
        finally:
            try:
                os.unlink(pending)
            except FileNotFoundError:
                pass
        return {'id': identifier, 'marginBytes': margin}
    finally:
        os.close(lock)

try:
    print(json.dumps(main(json.load(sys.stdin))))
except OSError as error:
    print(json.dumps({'error': 'GAME_STORAGE_CAPACITY' if error.errno in [errno.ENOSPC, errno.EDQUOT] else 'GAME_STORAGE_ADMISSION_UNAVAILABLE'}))
except Exception:
    # Never propagate environment, paths, or arbitrary filesystem contents.
    print(json.dumps({'error': 'GAME_STORAGE_ADMISSION_UNAVAILABLE'}))
