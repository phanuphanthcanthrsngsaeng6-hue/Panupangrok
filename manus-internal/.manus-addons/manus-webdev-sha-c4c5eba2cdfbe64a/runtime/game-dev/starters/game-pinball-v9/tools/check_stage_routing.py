#!/usr/bin/env python3
"""Exercise Next Stage in a temporary project; never rewrite source stage JSON."""
import argparse
import json
from pathlib import Path
import re
import shutil
import subprocess
import tempfile

parser = argparse.ArgumentParser()
parser.add_argument('--native', action='store_true')
parser.add_argument('--godot', default='/Applications/Godot.app/Contents/MacOS/Godot')
args = parser.parse_args()
source = Path(__file__).resolve().parents[1]
with tempfile.TemporaryDirectory(prefix='pinball-stage-route-') as directory:
    project = Path(directory) / 'project'
    shutil.copytree(source, project, ignore=shutil.ignore_patterns('.git', 'dist', 'captures', 'test-output', '.manus-game-tools', '__pycache__'))
    settings = project / 'project.godot'
    app_name = 'Pinball Routing Check ' + Path(directory).name
    contents = settings.read_text()
    contents = re.sub(r'(?m)^config/name=.*$', 'config/name=' + json.dumps(app_name), contents, count=1)
    assert 'config/name=' + json.dumps(app_name) in contents, 'Isolated test app name was not installed.'
    settings.write_text(contents)
    registry_path = project / 'config/stages.json'
    registry = json.loads(registry_path.read_text())
    registry['stages'] = registry['stages'][:1]
    first_config = project / registry['stages'][0]['configuration'].removeprefix('res://')
    variant = json.loads(first_config.read_text())
    variant['physics']['gravity'] = 550
    variant['gameplay']['balls'] = 2
    (project / 'config/route-second.json').write_text(json.dumps(variant))
    second = dict(registry['stages'][0], id='route-second', configuration='res://config/route-second.json')
    registry['stages'].append(second)
    registry_path.write_text(json.dumps(registry))
    command = [args.godot] + ([] if args.native else ['--headless']) + ['--path', str(project), '--script', 'tools/pinball_stage_route_check.gd']
    run = subprocess.run(command, capture_output=True, text=True, timeout=60)
    output = run.stdout + run.stderr
    print(output, end='')
    # Only this fixture's unique Godot profile is eligible for cleanup.
    for line in output.splitlines():
        if line.startswith('ROUTE_USER_DIR:'):
            profile = Path(line.partition(':')[2])
            if profile.name == app_name and profile.is_dir(): shutil.rmtree(profile)
    if run.returncode or 'ERROR:' in output or 'WARNING:' in output or '[pinball-stage-route] PASS:' not in output:
        raise SystemExit(run.returncode or 1)
