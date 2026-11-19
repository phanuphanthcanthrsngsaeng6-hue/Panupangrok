#!/usr/bin/env python3
"""เรียก Manus API ตรงๆ ที่ https://api.manus.ai โดยใช้ header x-manus-api-key จาก env MANUS_API_KEY
- คีย์อ่านจาก env เท่านั้น ไม่พิมพ์ออกจอ/ล็อก
- สร้าง task แล้ว poll คำตอบให้ (คืนค่าเรียกที่ถูกต้อง)"""
import os, sys, json, time, urllib.request, urllib.parse, urllib.error

BASE = "https://api.manus.ai"
KEY = os.environ.get("MANUS_API_KEY", "").strip()

def _req(method: str, path: str, payload=None, params=None):
    url = BASE + path
    if params:
        url += "?" + urllib.parse.urlencode(params)
    data = json.dumps(payload).encode() if payload is not None else None
    r = urllib.request.Request(url, data=data, method=method)
    r.add_header("x-manus-api-key", KEY)  # ส่งคีย์ให้ Manus (ไม่ log ค่า)
    r.add_header("Content-Type", "application/json")
    try:
        with urllib.request.urlopen(r, timeout=30) as resp:
            return json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        body = e.read().decode(errors="replace")[:1000]
        print(f"HTTP {e.code}: {body}", file=sys.stderr); sys.exit(1)

def ask(prompt: str, profile: str = "lite", timeout_s: int = 120):
    if not KEY:
        print("ERROR: MANUS_API_KEY ไม่ได้ตั้งค่า", file=sys.stderr); sys.exit(2)
    d = _req("POST", "/v2/task.create",
             {"message": {"content": [{"type": "text", "text": prompt}]},
              "agent_profile": profile})
    tid = d.get("task_id")
    if not tid:
        print("สร้าง task ไม่สำเร็จ:", json.dumps(d, ensure_ascii=False)[:500], file=sys.stderr); sys.exit(1)
    print(f"task_id={tid} url={d.get('task_url','')}")
    deadline = time.time() + timeout_s
    while time.time() < deadline:
        m = _req("GET", "/v2/task.listMessages", params={"task_id": tid})
        for msg in m.get("messages", []):
            am = msg.get("assistant_message") or {}
            if am.get("content"):
                print(am["content"]); return am["content"]
        time.sleep(5)
    print("timeout: ยังไม่มีคำตอบ", file=sys.stderr); sys.exit(3)

if __name__ == "__main__":
    ask(sys.argv[1] if len(sys.argv) > 1 else "ตอบสั้นๆ เป็นภาษาไทย: เรียก Manus สำเร็จหรือยัง")
