import getpass
import sys

try:
    import requests
except ImportError:
    print("ยังไม่มี requests — ติดตั้งด้วย: python3 -m pip install requests")
    sys.exit(1)

url = "http://127.0.0.1:9899/v1/chat/completions"
token = getpass.getpass("Bearer token (กด Enter หากไม่ต้องใช้): ").strip()

headers = {"Accept": "application/json"}
if token:
    headers["Authorization"] = f"Bearer {token}"

try:
    resp = requests.post(
        url,
        headers=headers,
        json={"messages": [{"role": "user", "content": "Hello"}]},
        timeout=30,
        allow_redirects=False,
    )

    print(f"HTTP {resp.status_code}")

    if not resp.ok:
        print("คำขอไม่สำเร็จ")
        if resp.text:
            print(resp.text[:500])
        sys.exit(1)

    data = resp.json()
    content = data["choices"][0]["message"]["content"]
    print(content)

except requests.exceptions.ConnectionError:
    print("เชื่อมต่อไม่ได้ ตรวจว่า API ทำงานอยู่ที่ 127.0.0.1:9899")
    sys.exit(1)
except requests.exceptions.Timeout:
    print("หมดเวลารอคำตอบจาก API")
    sys.exit(1)
except (ValueError, KeyError, IndexError, TypeError):
    print("ได้รับคำตอบ แต่รูปแบบไม่ตรงกับ OpenAI Chat Completions")
    sys.exit(1)
except requests.exceptions.RequestException:
    print("เกิดข้อผิดพลาดระหว่างส่งคำขอ")
    sys.exit(1)
