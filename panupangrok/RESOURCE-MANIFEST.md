# PanupanGrok Resource Manifest

## Canonical sources

- Runtime source: `NovaAgent-Brandable` only
- Branding: `branding/brand_config.json`
- Configuration template: `config/config.template.json`
- Tests: `tests/`
- Quality gate: `scripts/quality_gate.sh`
- Documentation: `README.md`

## Excluded by policy

- Duplicate copies from `NovaAgent-Terminal`
- `config.json`, `.env*`, secrets, tokens, credentials
- logs, databases, PIDs, browser state, user data
- `.git`, virtual environments, caches and generated artifacts
