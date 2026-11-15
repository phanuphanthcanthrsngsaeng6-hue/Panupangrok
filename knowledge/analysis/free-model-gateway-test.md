# ผลทดสอบโมเดล alias `free` ผ่าน gateway ภายในเครื่อง

> Source: การทดสอบจริงกับ `http://127.0.0.1:8741/v1` ในโปรเจกต์ NovaAgent-Terminal

## สรุป

alias `free` ตอบกลับสำเร็จและใช้งานงานจริงได้บางประเภท แต่ยังไม่เสถียรทุกคำขอ จึงควรใช้ร่วมกับ fallback และการตรวจจับคำตอบว่าง

## ผลทดสอบ

- คำขอสนทนาภาษาไทยทั่วไป: HTTP 200 แต่ข้อความว่าง — ไม่ผ่าน
- การสรุปข้อความ: ผ่าน ได้ bullet ภาษาไทย
- การคำนวณและให้เหตุผลสั้น ๆ: ผ่าน
- การเขียนโค้ด Python: ผ่าน
- การบังคับรูปแบบ JSON: ผ่าน
- คำขอเชิงความปลอดภัย: HTTP 200 แต่ข้อความว่าง — ไม่ผ่าน
- การเรียกเครื่องมือ: ผ่านการสร้าง tool call โดยเลือก `get_status` และ arguments `{}`
- Streaming: HTTP 200 แต่ไม่พบข้อความ — ไม่ผ่าน

## ข้อสรุปเชิงปฏิบัติ

1. `free` เหมาะกับงานสรุป วิเคราะห์สั้น ๆ เขียนโค้ด และงานที่ต้องการ JSON
2. ต้องตรวจทั้ง HTTP status และข้อความตอบกลับ ห้ามถือว่า HTTP 200 แปลว่าสำเร็จ
3. ถ้าข้อความว่างหรือ streaming ไม่มี delta ให้ลองใหม่หรือสลับ fallback
4. การสร้าง tool call ใช้ได้ แต่ยังควรทดสอบรอบต่อไปด้วยการส่งผลลัพธ์เครื่องมือกลับเข้าโมเดล
5. ยังไม่ควรใช้ `free` เป็นเส้นทางเดียวสำหรับงานสนทนาและงานที่ต้องตอบต่อเนื่อง

## สถานะการผูกเข้ากับ Subagent (อัปเดต 2026-11-14)

- เพิ่มการตั้งค่า route เฉพาะ Subagent ในโค้ดแล้ว: `model=free`, `provider=openai`, `use_model_override=true`
- ส่ง settings ผ่าน `run_tasks` → `_run_one` → `_build_child` แล้ว
- เพิ่ม `clone_for_subagent()` ใน `AgentLLMModel` เพื่อแยก routing state ของ Child ออกจาก Parent
- เพิ่มค่าลง `config.json` แล้ว: `model=free`, `provider=openai`, `use_model_override=true`
- ตรวจ syntax ของ `agent/subagent/runner.py` และ `bridge/agent_bridge.py` ผ่าน
- ทดสอบ isolation ของ Parent/Child ผ่าน: Child ได้ route `openai/free` และ Parent ไม่ถูกเปลี่ยน state
- ยังไม่ได้ยืนยันการยิง Subagent จริงครบวงจรผ่าน gateway หลังการเปลี่ยนแปลง
- ดังนั้นสถานะที่ถูกต้องคือ **ผูกค่าและกลไกแยก state เสร็จแล้ว แต่ยังรอ end-to-end runtime test**

## รายชื่อรุ่นที่มี tag `free` ใน catalog ของโปรเจกต์

ตรวจจาก `puter_models_list.json` พบรายการเหล่านี้:

### Infron

- `infron:apodex/apodex-1.1-mini:free`
- `infron:deepseek/deepseek-v4.1-flash:free`
- `infron:inclusionai/ling-3.1-flash:free`
- `infron:internlm/atria-dawn-preview:free`
- `infron:qwen/qwen3.8-27b-abliterated-cyber:free`
- `infron:qwen/qwen3.8-27b:free`

### OpenRouter

- `openrouter:cohere/north-mini-code:free`
- `openrouter:google/gemma-4-26b-a4b-it:free`
- `openrouter:google/gemma-4-31b-it:free`
- `openrouter:liquid/lfm-2.5-2.6b:free`
- `openrouter:minimax/minimax-m3.1-flash:free`
- `openrouter:nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free`
- `openrouter:nvidia/nemotron-3-super-120b-a12b:free`
- `openrouter:nvidia/nemotron-3-ultra-550b-a55b:free`
- `openrouter:nvidia/nemotron-3.5-content-safety:free`
- `openrouter:nvidia/nemotron-3.5-lightning:free`
- `openrouter:nvidia/nemotron-3.5-super-vl:free`
- `openrouter:openrouter/free`
- `openrouter:recursive/flint-v1.0:free`
- `openrouter:xingchen-agi/xing4.0-29b-a4b:free`

### OpenCode

- `opencode/beam-free`
- `opencode/deepseek-v4.1-flash-free`
- `opencode/flint-40b-free`
- `opencode/glm-5.3-flash-free`
- `opencode/mimo-v2.6-flash-free`
- `opencode/nemotron-3-ultra-free`
- `opencode/nemotron-3.5-lightning-free`
- `opencode/nemotron-3.5-super-vl-free`

รายการข้างต้นเป็นรายการที่ catalog ระบุว่ามี tag หรือชื่อ `free` เท่านั้น ยังไม่ใช่ผลยืนยันว่าทุกตัวตอบผ่าน gateway ปัจจุบัน ส่วน `qwen/free`, `deepseek/free`, `gemini/free` แบบสั้น ไม่พบเป็นรายการตรงใน catalog นี้

## ผลยิงจริงและตัวกรองสุดท้าย (2026-11-14)

ยิงทั้งหมด 37 ชื่อผ่าน `http://127.0.0.1:8741/v1/chat/completions` ด้วยคำขอสั้นและกรองโดยต้องมีข้อความตอบจริง ไม่ถือ HTTP 200 อย่างเดียว:

- **Stable / ผ่านซ้ำ 2 ครั้ง:** `infron:qwen/qwen3.8-27b:free`
- **Intermittent / ผ่าน 1 จาก 2 ครั้ง:** `openrouter:google/gemma-4-31b-it:free`
- **ไม่ผ่านในรอบนี้:** alias `free` (HTTP 200 แต่ข้อความว่าง 2 จาก 2 ครั้ง)
- ชื่อสั้น `qwen/free`, `deepseek/free`, `gemini/free`, `llama/free`, `mistral/free`, `glm/free`, `claude/free` ตอบ `Model not found`

ผลดิบถูกเก็บไว้ที่ `knowledge/analysis/free-model-probe-2026-11-14.json` และควรใช้เฉพาะรายการ Stable เป็น pool หลักจนกว่าจะมีการทดสอบซ้ำ

## ผลสุ่มรูปแบบชื่อ `free` (2026-11-14)

สุ่มและยิงทดสอบ 76 ชื่อจากรูปแบบ:

- `ชื่อรุ่น:free`
- `ชื่อรุ่น/free`
- `ชื่อแบรนด์/free`
- `openrouter:ชื่อรุ่น:free`
- `infron:ชื่อรุ่น:free`

ผล: **ผ่าน 0/76** ไม่มีชื่อใดตอบข้อความจริงในรอบนี้ แม้บางชื่ออาจตอบ HTTP สำเร็จแต่ไม่มี content หรือถูก gateway ปฏิเสธ ดังนั้นไม่ควรสร้าง alias ด้วยการเติม `:free` หรือ `/free` เอง ต้องใช้ model ID เต็มที่ gateway resolve ได้จาก catalog/การทดสอบจริงเท่านั้น

ผลดิบ: `knowledge/analysis/free-pattern-probe-2026-11-14.json`

## ผลทดสอบรูปแบบ `แบรนด์/free` (2026-11-14)

ทดสอบ 31 ชื่อ เช่น:

- `alibaba/free`
- `qwen/free`
- `google/free`
- `meta/free`
- `mistral/free`
- `nvidia/free`
- `minimax/free`
- `cohere/free`
- `deepseek/free`
- `openrouter/free`
- `infron/free`

ผล: **ผ่าน 0/31**

- ส่วนใหญ่ตอบ `Model not found`
- `openrouter/free` ตอบ HTTP 200 แต่ไม่มีข้อความ จึงไม่ผ่าน
- ไม่พบรูปแบบแบรนด์เดี่ยวที่ gateway ใช้งานได้

ข้อสรุป: ต้องใช้ model ID เต็ม เช่น `infron:qwen/qwen3.8-27b:free` ไม่ใช่เพียง `alibaba/free` หรือ `qwen/free`

## ชื่อเต็มใหม่จาก `/v1/models` ที่ไม่มีใน catalog เดิม

เปรียบเทียบ gateway catalog กับ `puter_models_list.json` พบชื่อใหม่ 5 รายการ:

- `openrouter:baidu/ernie-5.5-flash-preview:free`
- `openrouter:inclusionai/ling-3.2-flash:free`
- `openrouter:liquid/lfm-3-1.7b:free`
- `openrouter:particle-ai/particle-1:free`
- `openrouter:thinkingmachines/inkling-2-small:free`

ยิงทดสอบแล้ว:

- 4 รายการตอบ HTTP 200 แต่ content ว่าง
- `openrouter:thinkingmachines/inkling-2-small:free` ตอบ HTTP 500: authentication failed
- ดังนั้น **ยังไม่มีรายการใหม่ที่ผ่านเกณฑ์ข้อความจริง**

ผลต่าง: `knowledge/analysis/free-new-model-diff-2026-11-14.json`
ผลยิง: `knowledge/analysis/free-new-model-probe-2026-11-14.json`

## กลุ่มค่าย/namespace ใน catalog ของ Puter

จาก `GET http://127.0.0.1:8741/v1/models` พบ 6 กลุ่ม:

- `unprefixed` — 182 รุ่น (กลุ่ม default ไม่ระบุค่ายในชื่อ)
- `kimi` — 1 รุ่น
- `zhipu` — 2 รุ่น
- `infron` — 369 รุ่น
- `openrouter` — 365 รุ่น
- `togetherai` — 26 รุ่น

จึงนับเป็น **5 ค่ายที่มี namespace ชัดเจน + 1 กลุ่ม default**

ยิงทดสอบตัวแทนครบทุกกลุ่ม:

- ผ่าน: `qwen-flash`, `infron:qwen/qwen3.8-27b:free`, `openrouter:google/gemma-4-31b-it:free`
- ไม่ผ่านใน probe: `kimi/kimi-k3` (provider unavailable), `zhipu/glm-5.3` (content ว่าง), `togetherai:deepseek-ai/deepseek-v4.1-flash` (content ว่าง)

หมายเหตุ: การยิงนี้คือ **ครบทุกกลุ่มค่าย** ไม่ใช่ยิงครบทั้ง 945 รุ่นทีละตัว

## Related

- [MCP Orchestrator](../skills/mcp-orchestrator.md) — แนวคิดการประสานเครื่องมือภายนอก
