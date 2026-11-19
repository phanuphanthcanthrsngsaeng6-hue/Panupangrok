# NovaAgent Terminal

> **คิดเป็นระบบ สร้างได้จริง และตรวจสอบได้**
>
> NovaAgent คือแพลตฟอร์ม AI Agent สำหรับรันบน Terminal / Server ที่รวมการสนทนา เครื่องมือ (Tools), ความจำ (Memory), ฐานความรู้ (Knowledge) และทีมเอเจนต์ (Multi-Agent) ไว้ในที่เดียว พร้อม Web UI ปรับแต่งแบรนด์ได้

สร้างโดย **ภาณุพันธ์ (Panupan)** · แบรนด์ **boss.slilelo**
Repository: https://github.com/phanuphanthcanthrsngsaeng6-hue/Panupangrok

---

## ฟีเจอร์หลัก

- 🧠 **Multi-provider LLM** — รองรับหลายผู้ให้บริการ (OpenAI-compatible, Claude, Gemini, DeepSeek, Manus, Ollama ฯลฯ) และสลับโมเดลได้จาก config
- 🧩 **Skill / Tool System** — ขยายความสามารถด้วย Skills สำหรับงานโค้ด เว็บ UI งานเอกสาร และระบบอัตโนมัติ
- 🧠 **Layered Memory** — แยกความจำระยะสั้น รายวัน และความจำหลักแบบถาวร
- 📚 **Knowledge Workspace** — จัดเก็บความรู้เป็นไฟล์ Markdown และค้นคืนกลับมาใช้เป็นบริบทได้
- 👥 **Multi-Agent / Subagent** — แบ่งงานให้เอเจนต์ย่อยทำงานขนานกันและรวมผลกลับ
- 🌐 **Web Channel + Brandable UI** — หน้าแชทผ่านเบราว์เซอร์ ปรับชื่อแบรนด์ สี และธีมได้
- 🎙️ **Voice** — รองรับเสียงผ่าน Web Speech API / TTS เมื่ออุปกรณ์และเบราว์เซอร์รองรับ
- ⏰ **Scheduler / Tasks API** — ตั้งงานตามเวลาและจัดการงานแบบมีบันทึกสถานะ
- 🔌 **MCP / Manus Bridge** — เชื่อมต่อเครื่องมือภายนอกและ Manus API ผ่าน bridge แบบ OpenAI-compatible

---

## ข้อกำหนดระบบ (Requirements)

| รายการ | เวอร์ชันขั้นต่ำ |
|---|---|
| OS | Ubuntu / Debian / Linux (แนะนำ), macOS ก็ใช้ได้ |
| Python | 3.10 ขึ้นไป (แนะนำ 3.12) |
| Node.js | 18 ขึ้นไป (สำหรับเครื่องมือเบราว์เซอร์ / Manus Bridge) |
| Git | เวอร์ชันล่าสุด |
| RAM / Disk | RAM 2 GB ขึ้นไป, พื้นที่ว่าง 2 GB ขึ้นไป |

ตรวจเวอร์ชันบนเครื่องของคุณ:

```bash
python3 --version
node --version
git --version
```

---

## ติดตั้งบน Terminal (คู่มือทีละขั้นตอน)

### 1. ดาวน์โหลดโปรเจกต์

```bash
git clone https://github.com/phanuphanthcanthrsngsaeng6-hue/Panupangrok.git
cd Panupangrok
```

> ชื่อโฟลเดอร์หลัง clone คือ `Panupangrok` — ในเครื่อง dev ปัจจุบันโฟลเดอร์นี้คือ `NovaAgent-Terminal`

### 2. สร้าง Virtual Environment และติดตั้ง Python Dependencies

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

ตรวจสอบว่าติดตั้งสำเร็จ:

```bash
python3 -c "import aiohttp, requests, fastapi; print('OK')"
```

### 3. (ตัวเลือก) ติดตั้งเครื่องมือเบราว์เซอร์

ต้องใช้เฉพาะเมื่อต้องการฟีเจอร์เปิดเว็บอัตโนมัติ / ทดสอบ UI:

```bash
npm install
npx playwright install chromium
# ถ้าใช้ puppeteer ให้รันเพิ่มตามที่ package.json กำหนด
```

### 4. ตั้งค่า `config.json`

คัดลอกไฟล์ตัวอย่างแล้วแก้ไขค่าให้เป็นของคุณเอง:

```bash
cp config-template.json config.json
nano config.json
```

ตัวอย่างค่าเริ่มต้นที่สำคัญ:

```json
{
  "channel_type": "web",
  "model": "deepseek-flash",
  "deepseek_api_key": "ใส่คีย์ของคุณที่นี่",
  "open_ai_api_key": "ใส่คีย์ของคุณที่นี่",
  "open_ai_api_base": "https://api.openai.com/v1",
  "web_port": 9899,
  "agent": true,
  "knowledge": true
}
```

> ⚠️ **ห้ามใช้คีย์ตัวอย่างที่ติดมากับไฟล์ template และห้าม commit `config.json` ขึ้น Git** — ไฟล์นี้อยู่ใน `.gitignore` แล้ว แต่ต้องแน่ใจว่าไม่เผลอเปิดคีย์จริงไว้ในไฟล์ที่จะ push

ตั้งค่าแบรนด์ (ไม่บังคับ):

```bash
export BRAND_NAME="boss.slilelo"
```

### 5. รัน NovaAgent

```bash
# ต้องอยู่ใน .venv ก่อน (source .venv/bin/activate)
python app.py
```

หรือใช้คำสั่งผ่าน CLI:

```bash
python -m cli start
python -m cli status
python -m cli logs
python -m cli stop
python -m cli restart
```

### 6. เปิดใช้งาน

เปิดเบราว์เซอร์ไปที่:

```
http://localhost:9899
```

> หมายเหตุ: พอร์ตเริ่มต้นคือ **9899** (ตั้งใน `config.py` / `config.json` ดูค่า `web_port`) เอกสารเก่าบางฉบับระบุ 9999 — ให้ยึดค่าจาก `config.json` ปัจจุบัน

หยุดระบบด้วย `Ctrl+C` หรือ `python -m cli stop`

---

## การตั้งค่าเพิ่มเติม

### โมเดลและ Provider

แก้ไขใน `config.json`:

| คีย์ | ความหมาย |
|---|---|
| `model` | ชื่อโมเดลหลัก เช่น `deepseek-flash`, `gpt-4o`, `claude-sonnet-4` |
| `*_api_key` / `*_api_base` | คีย์และ endpoint ของผู้ให้บริการนั้น ๆ |
| `open_ai_api_base` | ชี้ไปยัง OpenAI หรือ gateway ภายใน (เช่น Manus Bridge / Puter) ได้ |

### CLI ที่มีให้ใช้

```bash
python -m cli help       # ดูคำสั่งทั้งหมด
python -m cli version    # ดูเวอร์ชัน
python -m cli start      # เริ่มระบบ
python -m cli stop       # หยุดระบบ
python -m cli restart    # รีสตาร์ท
python -m cli status     # สถานะการทำงาน
python -m cli logs       # ดู logs
python -m cli skill      # จัดการ Skills
python -m cli knowledge  # จัดการฐานความรู้
python -m cli backup     # สำรอง config + workspace
python -m cli restore    # กู้คืนจาก backup
```

### Services และ Ports ที่เกี่ยวข้อง

| บริการ | Port เริ่มต้น | หน้าที่ |
|---|:---:|---|
| NovaAgent Web Console | 9899 | หน้าแชทหลัก |
| Tasks API | 8002 | จัดการงาน |
| Expert API | 8001 | ตรวจโค้ด / งานผู้เชี่ยวชาญ |
| Puter Bridge (ถ้าเปิดใช้) | 8741 | LLM Gateway |
| Ollama (ถ้าเปิดใช้) | 11434 | โมเดล local |

บริการที่ไม่ได้เปิดใช้งานจะไม่พร้อมใช้งานโดยอัตโนมัติ เพียงเพราะมีรายการอยู่ในตารางนี้

---

## โครงสร้างโปรเจกต์ (โดยย่อ)

```text
Panupangrok/
├── app.py                  # จุดเริ่มต้นระบบหลัก
├── config.py               # โหลดและค่าตั้งค่าเริ่มต้น
├── config-template.json    # ตัวอย่าง config (คัดลอกเป็น config.json แล้วแก้ไข)
├── config.json             # config จริงของเครื่อง (ห้าม commit)
├── requirements.txt        # Python dependencies
├── package.json            # Node dependencies (เบราว์เซอร์ / bridge)
├── agent/                  # แกนการทำงานของ Agent
├── channel/                # Web UI และช่องทางเชื่อมต่อ
├── cli/                    # คำสั่ง CLI (python -m cli)
├── models/                 # การเชื่อมต่อ LLM providers
├── skills/                 # ชุดทักษะที่ขยายได้
├── knowledge/              # ฐานความรู้
├── memory/                 # ความจำรายวัน
├── expert_system/          # Expert API
├── tasks_api/              # Tasks API
├── manus-api/              # Manus Bridge (Node.js)
├── voice/                  # เสียง / TTS / STT
└── tests/                  # เทสต์
```

---

## การตรวจสอบก่อนส่งงาน (สำหรับนักพัฒนา)

```bash
git diff --check
python -m compileall -q voice channel/web/api channel/web/core config.py
node --check channel/web/static/CSJS/js/chat/call.js
node --check channel/web/static/CSJS/js/chat/render.js
```

การตรวจเหล่านี้จับ syntax / formatting error ได้ แต่ไม่แทนการทดสอบ integration หรือการทดสอบบนเบราว์เซอร์จริง

---

## แก้ปัญหาทั่วไป

| อาการ | วิธีแก้ |
|---|---|
| `ModuleNotFoundError` | อย่าลืม `source .venv/bin/activate` ก่อนรัน และ `pip install -r requirements.txt` |
| เปิด `localhost:9899` ไม่ได้ | ตรวจว่า `python app.py` ยังรันอยู่ และค่า `web_port` ใน `config.json` |
| 401 / 403 จาก provider | คีย์ไม่ถูกต้อง / ไม่มีสิทธิ์ — สร้างคีย์ใหม่และใส่ใน `config.json` |
| เบราว์เซอร์อัตโนมัติไม่ทำงาน | รัน `npx playwright install chromium` อีกครั้ง |
| ต้องการรีเซ็ต | หยุดระบบ (`python -m cli stop`) แล้วเริ่มใหม่ (`python -m cli start`) |

---

## ความปลอดภัย

- **ห้าม commit** API key, token, `config.json`, `.env` หรือไฟล์ credential ใด ๆ ขึ้น repository (อยู่ใน `.gitignore` แล้ว)
- ถ้าคีย์เคยหลุดออกไปแล้ว ให้ **ยกเลิกและสร้างคีย์ใหม่ทันที** ที่ผู้ให้บริการ
- พอร์ต Web Console ควรเปิดเฉพาะในเครื่อง / network ที่ไว้ใจได้ หรือตั้ง `web_password` ใน config

---

## License

MIT License — ดูรายละเอียดในไฟล์ `LICENSE`

สร้างต่อยอดจาก [CowAgent](https://github.com/zhayujie/CowAgent) และใช้โครงการโอเพนซอร์สอย่าง FastAPI, Tailwind CSS และ provider integrations ตามที่ระบุใน dependencies

<div align="center">

**สร้างด้วย 💜 โดย ภาณุพันธ์ (Panupan)**

</div>
