# แผนที่ทรัพยากรใน Home และโปรเจกต์

> สำรวจแบบ read-only จาก `/data/data/com.termux/files/home` โดย Subagent หลายตัว

## Home ที่ใช้งานจริง

สภาพแวดล้อมนี้ไม่มี `/home` แบบ root path โดย Home ที่ใช้งานจริงคือ:

```text
/data/data/com.termux/files/home
```

## โปรเจกต์หลัก

### NovaAgent-Brandable

```text
/data/data/com.termux/files/home/NovaAgent-Brandable
```

ทรัพยากรเด่น:

- `agent/`, `agents/`, `subagents/`
- `agent/admin.py` — การจัดการ Agent, workspace, knowledge และ skills
- `agent/chat/service.py` — ChatService และการทำงานของ Agent/ทีม
- `channel/` — adapter ของหลายช่องทาง
- `bridge/`, `core/`, `expert_system/`
- `knowledge/`, `memory/`, `skills/`, `plugins/`
- `tasks_api/`, `scheduler/`
- `subagents/team.json`
- `tests/`, `scripts/`, `README.md`, `AGENT.md`, `RULE.md`

### NovaAgent-Terminal

```text
/data/data/com.termux/files/home/NovaAgent-Terminal
```

ทรัพยากรเด่น:

- `agent/subagent/runner.py` — fan-out และรัน Subagent แบบขนาน
- `agent/multiagent/`, `agent/team.py`, `agent/team_addressing.py`
- `agent/routing.py`, `channel/routing.py`, `bridge/agent_bridge.py`
- `agent/protocol/`, `agent/prompt/`, `agent/memory/`
- `skills/`, `platform_contract/`, `platform_contract_tests/`
- `review_lab/`
- `provider_adapter_test.py`, `provider_contract_test.py`, `security_remediation_test.py`
- `PROJECT-MAP.md`, `DASHBOARD.md`, `GLOSSARY.md`
- `nova-start.sh`, `nova-stop.sh`, `pipeline.sh`
- browser automation และ Ollama integration scripts

## ทรัพยากรสำหรับทีม Agent

```text
/data/data/com.termux/files/home/NovaAgent-Terminal/agent/subagent/
/data/data/com.termux/files/home/NovaAgent-Terminal/agent/multiagent/
/data/data/com.termux/files/home/NovaAgent-Terminal/agent/team.py
/data/data/com.termux/files/home/NovaAgent-Terminal/agent/team_addressing.py
/data/data/com.termux/files/home/NovaAgent-Terminal/agent/routing.py
/data/data/com.termux/files/home/NovaAgent-Terminal/agent/registry.py
```

ความสามารถที่ยืนยันจากการสำรวจ:

- ส่งงานหลาย Subagent พร้อมกัน
- แยก task และผลลัพธ์ตาม index
- routing ตาม Agent/channel
- delegation และ teammate orchestration
- แยก workspace/identity ของ Agent

## ทรัพยากรด้าน Skills และ Tools

กลุ่มที่เหมาะกับการสร้างระบบแข่งขันและคัดผล:

- `mcp-orchestrator` — orchestration ของ MCP tools
- `mcp-builder` — สร้าง integration/tool interface
- `code-quality-assistant` — reviewer ประเมินคุณภาพ
- `code-assistant`, `codex-engineer` — implementation หลายแนวทาง
- `tdd` — ใช้ test เป็นเกณฑ์ตัดสิน
- `webapp-testing` — ตรวจผล UI/เว็บแบบ runtime
- `grill-me`, `grilling` — ตรวจจุดอ่อนและ counterexample
- `retro` — สรุปบทเรียนหลังการแข่งขัน
- `handoff` — ส่งต่องานและ context
- `knowledge-wiki` — บันทึกหลักฐานและผลตัดสิน

แหล่ง Skill หลัก:

```text
/data/data/com.termux/files/home/NovaAgent-Terminal/skills/
/data/data/com.termux/files/home/cow/skills/
```

## ทรัพยากรด้านเอกสารและการทดสอบ

ไฟล์สำคัญ:

```text
NovaAgent-Terminal/README.md
NovaAgent-Terminal/PROJECT-MAP.md
NovaAgent-Terminal/GLOSSARY.md
NovaAgent-Terminal/docs/
NovaAgent-Terminal/platform_contract_tests/
NovaAgent-Terminal/tests/
NovaAgent-Terminal/provider_contract_test.py
NovaAgent-Terminal/provider_adapter_test.py
NovaAgent-Terminal/security_remediation_test.py
```

เหมาะสำหรับ:

- ทำความเข้าใจสถาปัตยกรรม
- ตรวจ regression
- ตรวจ provider/model contract
- ตรวจความปลอดภัย
- สร้างเกณฑ์คัดเลือกผลลัพธ์ของ Agent

## ฐานความรู้และผลทดลอง

```text
NovaAgent-Terminal/knowledge/index.md
NovaAgent-Terminal/knowledge/analysis/
NovaAgent-Terminal/knowledge/concepts/
NovaAgent-Terminal/knowledge/entities/
NovaAgent-Terminal/knowledge/sources/
```

ผลทดลองโมเดลที่มีอยู่ เช่น:

- `free-retest-2026-11-14.json`
- `free-hierarchy-probe-2026-11-14.json`
- `free-placement-probe-2026-11-14.json`
- `puter-free-models-2026-11-14.md`
- `puter-provider-probe-2026-11-14.json`
- `free-model-gateway-test.md`

## ทรัพยากรปฏิบัติการ

```text
NovaAgent-Terminal/nova-start.sh
NovaAgent-Terminal/nova-stop.sh
NovaAgent-Terminal/pipeline.sh
NovaAgent-Terminal/inspect-page.js
NovaAgent-Terminal/multi-tabs.js
NovaAgent-Terminal/nova-computer.js
NovaAgent-Terminal/ollama_api.py
NovaAgent-Terminal/ollama_proxy_client.py
```

## ไฟล์ที่ต้องหลีกเลี่ยงการเปิดเผย

สำรวจพบชื่อไฟล์ที่อาจมีข้อมูลลับหรือข้อมูล runtime แต่ไม่ได้อ่านค่าออกมา:

```text
NovaAgent-Terminal/config.json
NovaAgent-Terminal/.preview_secret
NovaAgent-Terminal/user_datas.pkl
NovaAgent-Terminal/session_prefs.json
/data/data/com.termux/files/home/.ssh/
/data/data/com.termux/files/home/.bash_history
```

## สรุปการนำไปใช้ต่อ

ลำดับที่เหมาะสมสำหรับสร้างทีมแข่งขัน:

1. ใช้ `agent/subagent/runner.py` เป็นแกน fan-out
2. ใช้ `agent/team.py` และ `agent/multiagent/` สำหรับโครงสร้างทีม
3. ใช้ `tdd`, `code-quality-assistant`, `grilling` เป็น reviewer/quality gate
4. ใช้ `platform_contract_tests/` และ provider tests เป็นเกณฑ์ runtime
5. ใช้ `knowledge/analysis/` เก็บหลักฐานและผลการแข่งขัน
6. หลีกเลี่ยงการอ่านหรือส่งต่อ config/secret/runtime data

ไม่มีไฟล์ใดถูกแก้ไขหรือลบระหว่างการสำรวจนี้
