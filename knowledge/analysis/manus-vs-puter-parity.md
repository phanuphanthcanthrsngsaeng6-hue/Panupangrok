# Manus vs Puter: ตั้งให้เท่ากัน "ทุกด้าน" ทำได้แค่ไหน

> ทดสอบจริง 2026-11-15 — ทดสอบกับ `manus-api` bridge (127.0.0.1:8742) และ Puter bridge (127.0.0.1:8741)

## คำถามตั้งต้น

"ถ้าตั้ง Manus ให้เหมือน Puter ทุกด้าน จะได้ไหม" — เพราะ Puter ใช้ได้เต็มที่ทุก feature แต่ Manus ตอบได้จำกัด

## ต้นเหตุจริง: ไม่ใช่ Manus แย่ แต่สถาปัตยกรรมต่างกัน

| | **Puter** (8741) | **Manus** (8742) |
|---|---|---|
| ประเภท | LLM API ตรง (stateless) | **Agent-as-a-Service** (stateful, async) |
| รูปแบบ | `POST /chat/completions` → response ทันที | `task.create` → poll `task.listMessages` |
| จำนวนข้อความ | ส่งได้เท่าไหร่ก็ได้ | **จำกัด ~5,000 tokens ต่อ message** |
| tool calling | function-calling schema มาตรฐาน | **ไม่มี** — Manus มี tool ของตัวเองในฝั่งเขา |
| token usage | คืนครบ | **streaming ไม่คืน** |
| Latency | วินาที | 10–45 วินาที (task dance) |

## การวัด prompt ที่ NovaAgent ส่งจริง

| ส่วน | ~tokens |
|---|---:|
| AGENT.md | 1,376 |
| RULE.md | 2,267 |
| USER.md + MEMORY.md | 135 |
| knowledge/index.md | 2,105 |
| skills (78 ไฟล์) | 13,937 |
| agent/tools/*.py | 13,363 |
| **รวม** | **~33,185** |

เพดาน Manus = 5,000, bridge ตัดไว้ 4,800 → **ถูกทิ้ง 85.5%**

## 🔴 ปัญหาซ้อนของ bridge ปัจจุบัน

ไฟล์ `manus-api/src/server.js:146-171` → `buildPrompt()`:

1. เก็บ dialogue ไว้ราว 70% ก่อน (comment: "keep newest turns whole")
2. **system prompt เป็นตัวถูกตัด** เหลือเท่าที่เหลือ (`systemBudget`)
3. `truncateToTokens()` ตัดตามตัวอักษร — **ไม่รู้จักขอบเขต section/tool/skill**
4. ตัดจากหัว → ตัวตน (AGENT.md), RULE.md และคำอธิบาย tool สำคัญ **หายก่อน**
5. ก่อนมี truncate เคยเกิด **HTTP 400 (5000 estimated tokens) 8 ครั้ง** ใน log

ผลลัพธ์: Manus ได้ประวัติแชทยาว แต่ไม่รู้ว่าตัวเองเป็นใคร มีกฎอะไร มี tool อะไร

## ✅ สิ่งที่ทดสอบแล้ว "ทำให้เหมือน Puter ได้จริง"

### 1. System prompt เต็ม — ผ่าน file attachment (พิสูจน์แล้ว)

เอกสาร `task.create` ระบุชัด:
> "file parts do not count" ต่อเพดาน 5,000 tokens

**การทดสอบ:**
- สร้าง `nova-context.md` ขนาด **37,243 chars = ~9,319 tokens** (เกินเพดานเกือบ 2 เท่า)
- `POST /v2/file.upload` → ได้ `file-Pmw87K44yJgUSA3doDjYQH` + presigned URL
- `PUT` ไฟล์ขึ้น S3 → HTTP 200
- `POST /v2/task.create` แนบ `{"type":"file","file_id":...}` → **HTTP 200 ok:true**
- ถามว่า "กฎข้อ 1 บอกให้ทำอะไร" → Manus ตอบ **"กฎข้อ 1 ระบุว่า ให้ตอบเป็นภาษาไทยเสมอ"** ✅ **ถูกต้อง**

**สรุป: bypass เพดาน 5,000 tokens ได้จริง** — แนบ context เป็นไฟล์แทน text

ข้อจำกัด: ไฟล์อายุ 48 ชม. | จำกัด 512 MB/ไฟล์ | 10 GB/บัญชี | types ที่ block: `.exe .sh .bat .dmg`

### 2. Multi-turn — ผ่าน `task.sendMessage`

สร้าง task ครั้งเดียวด้วย context ใหญ่ แล้วต่อบทสนทนาด้วย `task.sendMessage` ได้ไม่จำกัดรอบ
แต่ละ message ใหม่มีเพดาน 5,000 แยกของตัวเอง → **ไม่ต้องยัด system prompt ซ้ำทุกรอบ**

### 3. คำสั่งถาวร — ผ่าน `project.instruction`

`project.create(name, instruction)` → instruction ถูก **prepend อัตโนมัติทุก task** ในโปรเจกต์นั้น
ใช้ยัดตัวตน + RULE.md ได้ถาวร **โดยไม่กิน budget 5,000 ของ message**
ส่ง `project_id` ใน `task.create` เพื่อใช้

### 4. OpenAI-compatible + streaming — มีแล้ว

bridge ทำแล้ว ทั้ง `/v1/chat/completions` และ SSE streaming (ทดสอบผ่าน 4 frames + `[DONE]`)

## ❌ สิ่งที่ "ทำเหมือน Puter ไม่ได้" — เพดานสถาปัตยกรรม

| เรื่อง | ทำไมไม่ได้ |
|---|---|
| **tool calling มาตรฐาน** | Manus เป็น agent ที่มี tool ในตัว ไม่รับ function-calling schema จากเรา NovaAgent ส่ง tool schema ไปก็ไม่มีผล |
| **token usage ใน streaming** | Manus ตอบผ่าน task/poll ไม่มี usage chunk → ตัวบอก context เพี้ยน (log เตือนชัด) |
| **latency ระดับวินาที** | ต้อง create task → poll → รอ agent ทำงาน (10–45 วิ) |
| **`visibility: hidden`** | ต้องเป็น **Trusted public client** — API key ธรรมดาได้ `PermissionDenied` 403 |
| **stateless / determinism** | Manus agent ตัดสินใจเอง มี preamble ภาษาจีนขึ้นก่อนตอบทุกครั้ง |
| **context ที่ควบคุมได้** | Agent ฝั่งเขาเลือกเองว่าจะอ่านอะไรจากไฟล์แนบ |

## 📌 บทสรุป

**ทำให้ "เหมือน Puter ทุกด้าน" ไม่ได้** เพราะรากต่างกัน: Puter เป็น LLM provider, Manus เป็น Agent platform

**แต่ทำให้ "ใช้งานได้จริงเทียบเท่า" ได้** ด้วย 3 กลไกที่พิสูจน์แล้ว:
1. file attachment → context ใหญ่ทะลุเพดาน
2. project.instruction → คำสั่งถาวรไม่กิน budget
3. task.sendMessage → multi-turn ไม่ต้องส่งซ้ำ

**ข้อสังเกตเชิงออกแบบ:** Manus เหมาะกับบทบาท **"agent ยาว"** (งานแบบรายงานข่าว AI 48 ชม. ที่ทำ 80 KB) มากกว่าเป็น **provider ของ agent ในแชท** — บทหลัง Puter/Codex ตรงกว่าและเร็วกว่า

## เอกสารอ้างอิง

- `tmp/79b88ec2_task.create.md` — สเปก task.create + Message/ContentPart schema
- `tmp/16f5965f_hidden-application-context.md` — เพดาน 5,000 + trusted client
- `tmp/9e71f4e6_file.upload.md` — limit ไฟล์
- `tmp/97f09fda_task-lifecycle.md` — flow + waiting/confirmAction
- `tmp/eb642d60_project.create.md` — instruction แชร์ทุก task
- `tmp/284338f7_agents-overview.md` — agent/subtask + shortcut `agent-default-main_task`
- `tmp/894af8cb_llms.txt` — ดัชนี API v2 ทั้งหมด

## เกี่ยวข้อง

- [เชื่อม NovaAgent กับ Manus sandbox/task ผ่าน API](manus-sandbox-api-integration.md)
- [Manus Browser Bridge Integration](manus-browser-bridge-integration.md)
