import json
import tempfile
import unittest
from pathlib import Path

from agent.tools.base_tool import ToolResult
from agent.tools.manus.manus_browser_bridge import ManusBrowserBridge


TASK_ID = "a" * 22


class FakeManusTool:
    def __init__(self):
        self.calls = []

    def is_available(self):
        return True

    def execute(self, params):
        self.calls.append(params)
        return ToolResult.success(f"Manus task `{TASK_ID}` created")


class ManusBrowserBridgeTests(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.TemporaryDirectory()
        self.tasks_file = str(Path(self.temp_dir.name) / ".manus_browser_tasks.json")
        self.manus = FakeManusTool()
        self.bridge = ManusBrowserBridge(self.manus, self.tasks_file)

    def tearDown(self):
        self.temp_dir.cleanup()

    def test_script_action_creates_task(self):
        result = self.bridge.execute({
            "action": "script", "url": "https://example.com", "script": "console.log('ok')",
        })
        self.assertEqual(result.status, "success")
        self.assertEqual(self.manus.calls[0]["action"], "create_task")
        self.assertIn("https://example.com", self.manus.calls[0]["task"])
        self.assertIn("console.log('ok')", self.manus.calls[0]["task"])

    def test_script_with_task_id_continues_task(self):
        self.bridge.execute({
            "action": "script", "url": "https://example.com", "script": "console.log(1)",
            "task_id": TASK_ID,
        })
        self.assertEqual(self.manus.calls[0]["action"], "continue_task")
        self.assertEqual(self.manus.calls[0]["task_id"], TASK_ID)

    def test_scrape_sends_evaluate_script(self):
        self.bridge.execute({
            "action": "scrape", "url": "https://example.com", "selector": "article",
        })
        task = self.manus.calls[0]["task"]
        self.assertIn("page.evaluate", task)
        self.assertIn("article", task)
        self.assertIn("JSON.stringify", task)

    def test_navigation_sends_goto_url(self):
        self.bridge.execute({"action": "navigate", "url": "https://example.com/path"})
        task = self.manus.calls[0]["task"]
        self.assertIn("page.goto", task)
        self.assertIn("https://example.com/path", task)

    def test_persistence_and_reload(self):
        self.bridge.execute({
            "action": "script", "url": "https://example.com", "script": "console.log(2)",
        })
        saved = json.loads(Path(self.tasks_file).read_text(encoding="utf-8"))
        self.assertEqual(saved[TASK_ID]["url"], "https://example.com")
        self.assertEqual(saved[TASK_ID]["script"], "console.log(2)")

        reloaded = ManusBrowserBridge(FakeManusTool(), self.tasks_file)
        self.assertEqual(reloaded.get_saved_task(TASK_ID), saved[TASK_ID])


if __name__ == "__main__":
    unittest.main()
