"""Manus Browser Bridge - ใช้ Manus sandbox เป็น remote browser backend สำหรับ NovaAgent"""

from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any, Dict, Optional

from agent.tools.base_tool import BaseTool, ToolResult
from agent.tools.manus.manus_tool import ManusTool


class ManusBrowserBridge(BaseTool):
    """Bridge ให้ NovaAgent ใช้ browser automation ใน Manus sandbox"""

    name = "manus_browser"
    description = (
        "Run browser automation tasks in Manus sandbox via the Manus API. "
        "Use when local Chromium is unavailable or for distributed scraping. "
        "Supports Playwright-core scripts and returns structured results."
    )
    params = {
        "type": "object",
        "properties": {
            "action": {
                "type": "string",
                "enum": ["script", "scrape", "run_script", "navigate", "screenshot", "evaluate", "close"],
                "description": "Browser action to perform in Manus sandbox",
            },
            "url": {
                "type": "string",
                "description": "URL to navigate to (for navigate action)",
            },
            "script": {
                "type": "string",
                "description": "Playwright-core script content to execute (for run_script)",
            },
            "script_path": {
                "type": "string",
                "description": "Path to existing script in Manus sandbox (e.g., /home/ubuntu/browser-automation-test/test-browser.cjs)",
            },
            "selector": {
                "type": "string",
                "description": "CSS selector for evaluate action",
            },
            "expression": {
                "type": "string",
                "description": "JavaScript expression to evaluate in page context",
            },
            "task_id": {
                "type": "string",
                "description": "Existing Manus task ID to continue (22 chars). If omitted, creates new task.",
            },
            "profile": {
                "type": "string",
                "enum": ["standard", "lite", "max", "max-medium", "max-high", "max-extra", "max-ultra"],
                "description": "Manus agent profile",
                "default": "max-ultra",
            },
            "headless": {
                "type": "boolean",
                "description": "Run headless (default true)",
                "default": True,
            },
            "wait_until": {
                "type": "string",
                "enum": ["domcontentloaded", "load", "networkidle"],
                "description": "Wait condition for navigation",
                "default": "domcontentloaded",
            },
            "timeout": {
                "type": "integer",
                "description": "Timeout in milliseconds",
                "default": 60000,
            },
        },
        "required": ["action"],
    }

    def __init__(self, manus_tool: Optional[ManusTool] = None, tasks_file: Optional[str] = None):
        super().__init__()
        self._manus_tool = manus_tool or ManusTool()
        self._active_task_id: Optional[str] = None
        self._tasks_file = Path(tasks_file or ".manus_browser_tasks.json")
        self._tasks = self._load_tasks()

    def is_available(self) -> bool:
        return self._manus_tool.is_available()

    def execute(self, params: dict) -> ToolResult:
        action = str(params.get("action") or "").strip()

        if action == "script":
            return self._script(params)
        elif action == "scrape":
            return self._scrape(params)
        elif action == "run_script":
            return self._run_script(params)
        elif action == "navigate":
            return self._navigate(params)
        elif action == "screenshot":
            return self._screenshot(params)
        elif action == "evaluate":
            return self._evaluate(params)
        elif action == "close":
            return self._close(params)
        else:
            return ToolResult.fail(f"Unknown action: {action}")

    def _load_tasks(self) -> Dict[str, Dict[str, str]]:
        try:
            data = json.loads(self._tasks_file.read_text(encoding="utf-8"))
            return data if isinstance(data, dict) else {}
        except (OSError, ValueError):
            return {}

    def _save_task(self, task_id: str, script: str, url: str) -> None:
        if not task_id:
            return
        self._tasks[task_id] = {"script": script, "url": url}
        try:
            self._tasks_file.write_text(
                json.dumps(self._tasks, ensure_ascii=False, indent=2, sort_keys=True),
                encoding="utf-8",
            )
        except OSError:
            pass

    def get_saved_task(self, task_id: str) -> Optional[Dict[str, str]]:
        return self._tasks.get(str(task_id).strip())

    def _task_id(self, params: dict) -> Optional[str]:
        return str(params.get("task_id") or self._active_task_id or "").strip() or None

    def _create_task_and_run(self, script: str, url: str, task_id: Optional[str] = None) -> ToolResult:
        """Build a concrete Manus sandbox instruction and execute it."""
        script = str(script or "").strip()
        url = str(url or "").strip()
        if not script or not url:
            return ToolResult.fail("'url' and 'script' are required")
        task_instruction = (
            "Use Chromium 156 and playwright-core@1.65.1. Open this URL: " + url +
            "\nRun this CommonJS Playwright script exactly and return its stdout "
            "(JSON when the script prints JSON):\n\n" + script
        )
        request = {
            "action": "continue_task" if task_id else "create_task",
            "task": task_instruction,
            "profile": getattr(self, "_profile", "max-ultra"),
        }
        if task_id:
            request["task_id"] = task_id
        result = self._manus_tool.execute(request)
        if result.status == "success":
            found_id = self._extract_task_id(result.result) or task_id
            if found_id:
                self._active_task_id = found_id
                self._save_task(found_id, script, url)
        return result

    def _script(self, params: dict) -> ToolResult:
        script = str(params.get("script") or "").strip()
        url = str(params.get("url") or "").strip()
        if not script or not url:
            return ToolResult.fail("'url' and 'script' are required for script action")
        self._profile = params.get("profile", "max-ultra")
        return self._create_task_and_run(script, url, self._task_id(params))

    def _scrape(self, params: dict) -> ToolResult:
        url = str(params.get("url") or "").strip()
        if not url:
            return ToolResult.fail("'url' is required for scrape action")
        selector = str(params.get("selector") or "").strip()
        expression = str(params.get("expression") or "").strip()
        if expression:
            evaluate = f"await page.evaluate(() => ({expression}))"
        elif selector:
            evaluate = (
                "await page.evaluate((selector) => Array.from(document.querySelectorAll(selector)).map((el) => "
                "({text: el.innerText, html: el.innerHTML, attributes: Object.fromEntries(Array.from(el.attributes).map(a => [a.name, a.value]))})), "
                + json.dumps(selector) + ")"
            )
        else:
            evaluate = "await page.evaluate(() => ({title: document.title, text: document.body.innerText}))"
        script = self._json_result_script(evaluate)
        self._profile = params.get("profile", "max-ultra")
        return self._create_task_and_run(script, url, self._task_id(params))

    @staticmethod
    def _json_result_script(expression: str) -> str:
        return (
            'const { chromium } = require("playwright-core");\n'
            "(async () => { const browser = await chromium.launch({headless: true}); "
            "const page = await browser.newPage(); try { const value = " + expression +
            "; console.log(JSON.stringify(value)); } finally { await browser.close(); } })();"
        )

    def _run_script(self, params: dict) -> ToolResult:
        """รัน Playwright script ใน Manus sandbox"""
        script = params.get("script", "").strip()
        script_path = params.get("script_path", "").strip()
        task_id = params.get("task_id", "").strip()
        profile = params.get("profile", "max-ultra")

        if not script and not script_path:
            return ToolResult.fail("Either 'script' or 'script_path' is required for run_script")

        if script_path:
            task_instruction = (
                f"รันสคริปต์ Playwright ที่มีอยู่แล้ว: {script_path} "
                f"และส่งคืนผลลัพธ์ stdout/stderr แบบ raw"
            )
        else:
            # เขียน script ลงไฟล์ชั่วคราวใน sandbox แล้วรัน
            script_filename = f"nova-browser-{int(time.time())}.cjs"
            task_instruction = (
                f"สร้างไฟล์สคริปต์ Playwright ที่ /home/ubuntu/{script_filename} "
                f"ด้วยเนื้อหาต่อไปนี้ แล้วรันด้วย node และส่งคืนผลลัพธ์:\n\n{script}"
            )

        if task_id:
            result = self._manus_tool.execute({
                "action": "continue_task",
                "task_id": task_id,
                "task": task_instruction,
                "profile": profile,
            })
        else:
            result = self._manus_tool.execute({
                "action": "create_task",
                "task": task_instruction,
                "profile": profile,
            })

        if result.status == "success":
            # พยายามดึง task_id จากผลลัพธ์
            self._extract_task_id(result.result)
            return ToolResult.success(result.result)
        return result

    def _navigate(self, params: dict) -> ToolResult:
        """นำทางไปยัง URL และคืนค่า page info"""
        url = params.get("url", "").strip()
        if not url:
            return ToolResult.fail("'url' is required for navigate action")

        wait_until = params.get("wait_until", "domcontentloaded")
        timeout = params.get("timeout", 60000)

        script = self._json_result_script(
            f"await (async () => {{ await page.goto({json.dumps(url)}, {{waitUntil: {json.dumps(wait_until)}, timeout: {int(timeout)}}}); return {{url: page.url(), title: await page.title(), status: 'success'}}; }})()"
        )
        self._profile = params.get("profile", "max-ultra")
        return self._create_task_and_run(script, url, self._task_id(params))

    def _screenshot(self, params: dict) -> ToolResult:
        """ถ่ายสกรีนชอตใน Manus sandbox"""
        url = params.get("url", "").strip()
        if not url:
            return ToolResult.fail("'url' is required for screenshot")

        task_id = params.get("task_id", "").strip()
        profile = params.get("profile", "max-ultra")

        task_instruction = (
            f"เปิด {url} ด้วย Playwright headless ถ่ายสกรีนชอตเต็มหน้าจอ "
            f"บันทึกเป็นไฟล์ PNG แล้วส่งคืนลิงก์ดาวน์โหลด"
        )

        if task_id:
            result = self._manus_tool.execute({
                "action": "continue_task",
                "task_id": task_id,
                "task": task_instruction,
                "profile": profile,
                "download_files": True,
            })
        else:
            result = self._manus_tool.execute({
                "action": "create_task",
                "task": task_instruction,
                "profile": profile,
                "download_files": True,
            })

        if result.status == "success":
            self._extract_task_id(result.result)
        return result

    def _evaluate(self, params: dict) -> ToolResult:
        """ประเมิน JavaScript expression ในบริบทของเพจ"""
        url = params.get("url", "").strip()
        expression = params.get("expression", "").strip()
        selector = params.get("selector", "").strip()

        if not url or (not expression and not selector):
            return ToolResult.fail("'url' and ('expression' or 'selector') required")

        task_id = params.get("task_id", "").strip()
        profile = params.get("profile", "max-ultra")

        if expression:
            task_instruction = (
                f"เปิด {url} แล้วรัน JavaScript: {expression} "
                f"และส่งคืนผลลัพธ์เป็น JSON"
            )
        else:
            task_instruction = (
                f"เปิด {url} แล้วดึงข้อมูลจาก selector '{selector}' "
                f"และส่งคืนผลลัพธ์เป็น JSON"
            )

        if task_id:
            result = self._manus_tool.execute({
                "action": "continue_task",
                "task_id": task_id,
                "task": task_instruction,
                "profile": profile,
            })
        else:
            result = self._manus_tool.execute({
                "action": "create_task",
                "task": task_instruction,
                "profile": profile,
            })

        if result.status == "success":
            self._extract_task_id(result.result)
        return result

    def _close(self, params: dict) -> ToolResult:
        """ปิด browser session (แค่เคลียร์ task_id local)"""
        self._active_task_id = None
        return ToolResult.success("Browser session closed (local reference cleared)")

    def _extract_task_id(self, result_text: Any) -> Optional[str]:
        """พยายามดึง task_id จากข้อความผลลัพธ์"""
        # หา pattern task ID 22 ตัวอักษร
        if isinstance(result_text, dict):
            result_text = json.dumps(result_text)
        matches = re.findall(r'\b[a-zA-Z0-9]{22}\b', str(result_text or ""))
        if matches:
            self._active_task_id = matches[0]
            return matches[0]
        return None

    @property
    def active_task_id(self) -> Optional[str]:
        return self._active_task_id


# Backward compatibility function
def run_manus_browser(action: str, **kwargs) -> ToolResult:
    """Helper function สำหรับเรียกใช้งานง่ายๆ"""
    bridge = ManusBrowserBridge()
    params = {"action": action, **kwargs}
    return bridge.execute(params)
