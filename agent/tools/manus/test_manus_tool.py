import os
import tempfile
import unittest
from unittest.mock import patch

from agent.tools.manus import manus_tool
from agent.tools.manus.manus_tool import ManusTool


class ManusToolTests(unittest.TestCase):
    def setUp(self):
        self.tool = ManusTool()
        self.tool.cancel_event = None

    def test_starts_private_task_and_returns_completed_result(self):
        calls = []

        def fake_request(method, path, api_key, *, params=None, body=None):
            calls.append((method, path, api_key, params, body))
            if path == "task.create":
                return {"ok": True, "task_id": "task-123", "task_url": "https://manus.ai/app/task-123"}
            if path == "task.detail":
                return {"ok": True, "task": {"status": "stopped", "has_running_background_jobs": False}}
            if path == "task.listMessages":
                return {"ok": True, "messages": [
                    {"type": "assistant_message", "assistant_message": {
                        "delivery_kind": "result", "content": "งานเสร็จแล้ว"
                    }}
                ]}
            self.fail(f"unexpected Manus API path: {path}")

        with patch.object(self.tool, "_api_key", return_value="dummy-key"), \
             patch.object(self.tool, "_request", side_effect=fake_request), \
             patch.object(manus_tool.time, "sleep"):
            result = self.tool.execute({"action": "create_task", "task": "ค้นคว้าเรื่องนี้", "profile": "max-high"})

        self.assertEqual(result.status, "success")
        self.assertEqual(result.result, "งานเสร็จแล้ว")
        self.assertEqual(calls[0][0:3], ("POST", "task.create", "dummy-key"))
        self.assertEqual(calls[0][4]["share_visibility"], "private")
        self.assertTrue(calls[0][4]["hide_in_task_list"])
        self.assertEqual(calls[0][4]["agent_profile"], "max-high")
        self.assertNotIn("task_id", calls[0][4])

    def test_missing_key_does_not_make_request(self):
        with patch.object(self.tool, "_api_key", return_value=""), \
             patch.object(self.tool, "_request") as request:
            result = self.tool.execute({"action": "create_task", "task": "ทำงาน"})
        self.assertEqual(result.status, "error")
        self.assertIn("not configured", result.result)
        request.assert_not_called()

    def test_rejects_unsupported_profile(self):
        with patch.object(self.tool, "_api_key", return_value="dummy-key"), \
             patch.object(self.tool, "_request") as request:
            result = self.tool.execute({"action": "create_task", "task": "ทำงาน", "profile": "invalid"})
        self.assertEqual(result.status, "error")
        self.assertIn("unsupported agent profile", result.result)
        request.assert_not_called()

    def test_inspect_existing_task_reads_result_and_attachment_without_creating(self):
        task_id = "XDmwoSwonkSpEbYhBLsH7r"
        calls = []

        def fake_request(method, path, api_key, *, params=None, body=None):
            calls.append((method, path, params, body))
            if path == "task.detail":
                return {"ok": True, "task": {"status": "stopped", "task_url": f"https://manus.im/app/{task_id}"}}
            if path == "task.listMessages":
                return {"ok": True, "messages": [{
                    "type": "assistant_message",
                    "assistant_message": {
                        "delivery_kind": "result",
                        "content": "Sandbox result",
                        "attachments": [{
                            "filename": "result.txt",
                            "url": "https://private.manuscdn.com/download?id=abc",
                            "path": "/tmp/result.txt",
                            "file_uid": "file-1",
                            "version_uid": "version-1",
                        }],
                    },
                }]}
            self.fail(f"unexpected Manus API path: {path}")

        with patch.object(self.tool, "_api_key", return_value="dummy-key"), \
             patch.object(self.tool, "_request", side_effect=fake_request):
            result = self.tool.execute({"action": "inspect_task", "task_id": task_id})

        self.assertEqual(result.status, "success")
        self.assertIn("Sandbox result", result.result)
        self.assertIn("https://private.manuscdn.com/download?id=abc", result.result)
        self.assertTrue(all(path != "task.create" for _, path, _, _ in calls))
        self.assertEqual(calls[0][2], {"task_id": task_id})

    def test_continue_existing_task_uses_send_message_on_same_task_without_create(self):
        task_id = "XDmwoSwonkSpEbYhBLsH7r"
        calls = []

        def fake_request(method, path, api_key, *, params=None, body=None):
            calls.append((method, path, params, body))
            if path == "task.sendMessage":
                return {"ok": True, "task_id": task_id}
            if path == "task.detail":
                return {"ok": True, "task": {"status": "stopped", "has_running_background_jobs": False}}
            if path == "task.listMessages":
                return {"ok": True, "messages": [{
                    "type": "assistant_message",
                    "assistant_message": {"delivery_kind": "result", "content": "Follow-up done"},
                }]}
            self.fail(f"unexpected Manus API path: {path}")

        with patch.object(self.tool, "_api_key", return_value="dummy-key"), \
             patch.object(self.tool, "_request", side_effect=fake_request), \
             patch.object(manus_tool.time, "sleep"):
            result = self.tool.execute({
                "action": "continue_task", "task_id": task_id, "task": "Continue the sandbox task"
            })

        self.assertEqual(result.status, "success")
        self.assertIn("Follow-up done", result.result)
        self.assertEqual(calls[0][0:2], ("POST", "task.sendMessage"))
        self.assertEqual(calls[0][3]["task_id"], task_id)
        self.assertTrue(all(path != "task.create" for _, path, _, _ in calls))

    def test_downloads_only_trusted_https_task_attachments(self):
        task_id = "XDmwoSwonkSpEbYhBLsH7r"
        attachment = {
            "filename": "../safe.txt",
            "url": "https://private.manuscdn.com/download?id=abc",
            "file_uid": "file-1",
            "version_uid": "v1",
        }

        class FakeResponse:
            status_code = 200
            headers = {"Content-Length": "4"}

            def iter_content(self, chunk_size):
                yield b"data"

            def close(self):
                pass

        with self.subTest("safe download"):
            with patch.object(self.tool, "_request", return_value={"ok": True, "messages": [{
                "assistant_message": {"attachments": [attachment]}
            }]}), \
                 patch.object(manus_tool.requests, "get", return_value=FakeResponse()) as download, \
                 patch.object(manus_tool.Path, "cwd", return_value=manus_tool.Path(tempfile.gettempdir())):
                with tempfile.TemporaryDirectory(dir=tempfile.gettempdir()) as temp_dir:
                    result = self.tool._download_task_attachments(task_id, "dummy-key", temp_dir)
                    expected = manus_tool.Path(temp_dir) / "safe.txt"
                    self.assertTrue(expected.is_file())
                    self.assertEqual(expected.read_bytes(), b"data")
                    self.assertIn(str(expected), result)
                    download.assert_called_once()

        with self.subTest("reject untrusted protocol"):
            bad = dict(attachment, url="http://private.manuscdn.com/file")
            with tempfile.TemporaryDirectory(dir=os.getcwd()) as temp_dir, \
                 patch.object(self.tool, "_request", return_value={"ok": True, "messages": [{
                     "assistant_message": {"attachments": [bad]}
                 }]}), patch.object(manus_tool.requests, "get") as download:
                result = self.tool._download_task_attachments(task_id, "dummy-key", temp_dir)
                download.assert_not_called()
                self.assertIn("No downloadable", result)


    def _attachment_messages(self, filename="result.txt"):
        return {"ok": True, "messages": [{
            "assistant_message": {"attachments": [{
                "filename": filename,
                "url": "https://private.manuscdn.com/download?id=abc",
                "file_uid": "file-1",
                "version_uid": "v1",
            }]}
        }]}

    def _fake_download_response(self, payload=b"data"):
        class FakeResponse:
            status_code = 200
            headers = {"Content-Length": str(len(payload))}

            def iter_content(self, chunk_size):
                yield payload

            def close(self):
                pass

        return FakeResponse()

    def test_rejects_output_dir_outside_current_workspace(self):
        with patch.object(self.tool, "_request", return_value=self._attachment_messages()):
            with self.assertRaises(manus_tool.ManusToolError) as raised:
                self.tool._download_task_attachments("task", "dummy-key", "/tmp/manus-output")
        self.assertIn("under the current workspace", str(raised.exception))

    def test_rejects_symlinked_part_file_outside_destination(self):
        with tempfile.TemporaryDirectory(dir=os.getcwd()) as temp_dir, \
             tempfile.TemporaryDirectory() as outside_dir:
            destination = manus_tool.Path(temp_dir)
            (destination / "result.txt.part").symlink_to(manus_tool.Path(outside_dir) / "outside.txt")
            with patch.object(self.tool, "_request", return_value=self._attachment_messages()), \
                 patch.object(manus_tool.requests, "get", return_value=self._fake_download_response()):
                with self.assertRaises(manus_tool.ManusToolError):
                    self.tool._download_task_attachments("task", "dummy-key", temp_dir)
            self.assertFalse((manus_tool.Path(outside_dir) / "outside.txt").exists())

    def test_generates_unique_filename_when_destination_exists(self):
        with tempfile.TemporaryDirectory(dir=os.getcwd()) as temp_dir:
            destination = manus_tool.Path(temp_dir)
            (destination / "result.txt").write_bytes(b"existing")
            with patch.object(self.tool, "_request", return_value=self._attachment_messages()), \
                 patch.object(manus_tool.requests, "get", return_value=self._fake_download_response()):
                result = self.tool._download_task_attachments("task", "dummy-key", temp_dir)
            unique = destination / "result (1).txt"
            self.assertTrue(unique.is_file())
            self.assertEqual(unique.read_bytes(), b"data")
            self.assertIn(str(unique), result)

    def test_write_failure_returns_tool_result_fail(self):
        with tempfile.TemporaryDirectory(dir=os.getcwd()) as temp_dir, \
             patch.object(self.tool, "_inspect_task", return_value="task result"), \
             patch.object(self.tool, "_request", return_value=self._attachment_messages()), \
             patch.object(manus_tool.requests, "get", return_value=self._fake_download_response()), \
             patch.object(manus_tool.os, "open", side_effect=OSError("disk full")), \
             patch.object(self.tool, "_api_key", return_value="dummy-key"):
            result = self.tool.execute({
                "action": "inspect_task",
                "task_id": "XDmwoSwonkSpEbYhBLsH7r",
                "download_files": True,
                "output_dir": temp_dir,
            })
        self.assertEqual(result.status, "error")
        self.assertIn("Could not save a Manus attachment", result.result)

    def test_task_failure_is_reported_without_fabricating_success(self):
        def fake_request(method, path, api_key, *, params=None, body=None):
            if path == "task.create":
                return {"ok": True, "task_id": "task-failed"}
            if path == "task.detail":
                return {"ok": True, "task": {"status": "error"}}
            return {"ok": True, "messages": []}

        with patch.object(self.tool, "_api_key", return_value="dummy-key"), \
             patch.object(self.tool, "_request", side_effect=fake_request), \
             patch.object(manus_tool.time, "sleep"):
            result = self.tool.execute({"action": "create_task", "task": "ทำงาน"})

        self.assertEqual(result.status, "error")
        self.assertIn("could not complete", result.result)


if __name__ == "__main__":
    unittest.main()
