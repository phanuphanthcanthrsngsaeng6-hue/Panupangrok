# Manus Browser Bridge Integration

## Overview
Bridge component allowing NovaAgent to use **Manus sandbox** as a remote browser backend for Playwright/Puppeteer automation when local Chromium is unavailable or for distributed workloads.

## Files Created
- `agent/tools/manus/manus_browser_bridge.py` — Main bridge tool (`manus_browser`)
- Uses existing `agent/tools/manus/manus_tool.py` for API communication

## Capabilities
| Action | Description |
|--------|-------------|
| `navigate` | Go to URL, return title + URL |
| `run_script` | Execute custom Playwright-core script |
| `screenshot` | Full-page screenshot, returns download link |
| `evaluate` | Run JS expression or extract by selector |
| `close` | Clear local task reference |

## Usage Examples

### Basic Navigation
```python
from agent.tools.manus.manus_browser_bridge import ManusBrowserBridge

bridge = ManusBrowserBridge()
result = bridge.execute({
    "action": "navigate",
    "url": "https://example.com",
    "profile": "max-ultra"
})
```

### Custom Playwright Script
```python
result = bridge.execute({
    "action": "run_script",
    "script": """
const { chromium } = require("playwright-core");
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto("https://example.com");
  const data = await page.evaluate(() => ({
    title: document.title,
    links: [...document.querySelectorAll("a")].map(a => a.href)
  }));
  console.log(JSON.stringify(data));
  await browser.close();
})();
""",
    "profile": "max-ultra"
})
```

### Screenshot
```python
result = bridge.execute({
    "action": "screenshot",
    "url": "https://example.com",
    "profile": "max-ultra"
})
# Returns with download_files=True, files saved to outputs/manus/<task_id>/
```

### Continue Existing Task
```python
result = bridge.execute({
    "action": "navigate",
    "url": "https://example.com/page2",
    "task_id": "XDmwoSwonkSpEbYhBLsH7r",  # 22-char task ID
    "profile": "max-ultra"
})
```

## Environment Requirements
- `MANUS_API_KEY` set in environment or `config.json` (`manus_api_key`)
- Manus sandbox has Chromium 156 + Playwright-core pre-installed
- Test script at `/home/ubuntu/browser-automation-test/test-browser.cjs`

## Integration Points
- Registered as tool `manus_browser` in NovaAgent tool registry
- Complements local browser tools: `browser_tool.py`, `with-chromium.sh`
- Falls back to Manus when local Chromium/CDP unavailable

## Task IDs Created
- Navigation test: (new task created each call unless `task_id` provided)
- Browser automation test: `/home/ubuntu/browser-automation-test/test-browser.cjs`

## Configuration
Add to `config.json`:
```json
{
  "manus_api_key": "sk-...",
  "manus_api_base": "https://api.manus.ai/v2"
}
```

## Security Notes
- Only communicates via Manus API (no direct sandbox shell access)
- Attachment downloads restricted to `manuscdn.com` domains
- File size limit: 100 MB
- Output directory constrained to workspace root