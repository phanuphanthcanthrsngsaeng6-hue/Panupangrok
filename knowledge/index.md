- [MCP Orchestrator](knowledge/skills/mcp-orchestrator.md) — Central knowledge entry for MCP orchestration and integration points
- [Brand Compliance Guardian](knowledge/skills/brand-compliance-guardian.md) — Brand guidelines enforcement capability
- [Incident Playbook Automator](knowledge/skills/incident-playbook-automator.md) — Playbook automation for IR
- [Code Quality Assistant](knowledge/skills/code-quality-assistant.md) — Static analysis and code reviews guidance
- [MCP Orchestrator (implementation notes)](knowledge/skills/mcp-orchestrator.md) — Added implementation notes for integration with MCP endpoints
- [Brand Compliance Guardian (implementation notes)](knowledge/skills/brand-compliance-guardian.md) — Details on brand checks and workflow
- [Incident Playbook Automator (implementation notes)](knowledge/skills/incident-playbook-automator.md) — Playbook generation and execution notes
- [Code Quality Assistant (implementation notes)](knowledge/skills/code-quality-assistant.md) — Linting and code-review strategy

## 🛠️ Skill System Updates (Plan C)
- [mcp-orchestrator](../skills/mcp-orchestrator/SKILL.md) - Orchestrate MCP servers.
- [brand-compliance-guardian](../skills/brand-compliance-guardian/SKILL.md) - Ensure brand guidelines are met.
- [incident-playbook-automator](../skills/incident-playbook-automator/SKILL.md) - Automate incident response.
- [code-quality-assistant](../skills/code-quality-assistant/SKILL.md) - Enforce code quality standards.

**Note:** The Skill Installer now features `--update` for safe upgrades and robust logging in `guard_logs/`.

## Analysis
- [เชื่อม NovaAgent กับ Manus sandbox/task ผ่าน API](analysis/manus-sandbox-api-integration.md) — แนวทางเรียก task เดิม อ่านผล และดาวน์โหลด attachments ผ่าน Manus API v2 พร้อมข้อจำกัดสิทธิ์
- [ผลทดสอบโมเดล alias `free` ผ่าน gateway ภายในเครื่อง](analysis/free-model-gateway-test.md) — ทดสอบงานสนทนา สรุป วิเคราะห์ เขียนโค้ด JSON เครื่องมือ และ streaming
- [ผลสุ่มชื่อรุ่น/แบรนด์รูปแบบ `free`](analysis/free-pattern-probe-2026-11-14.json) — ทดสอบ 76 รูปแบบ `:free`, `/free` และ namespace แต่ไม่พบตัวที่ตอบข้อความจริง
- [ผลทดสอบรูปแบบแบรนด์/free](analysis/free-brand-probe-2026-11-14.json) — ทดสอบ Alibaba และแบรนด์อื่น 31 ชื่อ ไม่พบตัวที่ตอบข้อความจริง
- [ผลต่าง model ID ใหม่จาก gateway](analysis/free-new-model-diff-2026-11-14.json) — พบชื่อเต็มใหม่ 5 รายการที่ไม่มีใน catalog เดิม และทดสอบแล้วแต่ยังไม่มีข้อความตอบกลับ
- [ผลทดสอบค่ายโมเดลของ Puter](analysis/puter-provider-probe-2026-11-14.json) — catalog มี 5 namespace และ 1 กลุ่ม default; ยิงครบทุกกลุ่ม ผ่านข้อความจริง 3 กลุ่ม
- [รายชื่อโมเดลฟรีจาก Puter catalog](analysis/puter-free-models-2026-11-14.md) — จาก 945 โมเดล พบ Model ID ที่ระบุ free ชัดเจน 15 รายการ
- [ผลทดสอบระบบหัวหน้า–ลูกน้องสำหรับโมเดลฟรี](analysis/free-hierarchy-probe-2026-11-14.json) — แบ่งทดสอบ 3 Child จาก 15 รุ่น พบ stable 1 รุ่น และ intermittent 2 รุ่น
- [ผลทดสอบซ้ำโมเดลฟรี](analysis/free-retest-2026-11-14.json) — ยิงซ้ำ 15 รุ่น พบ stable 1 รุ่น และนำไปตั้งค่า Subagent แล้ว
- [แผนที่ทรัพยากรใน Home และโปรเจกต์](analysis/resource-inventory-2026-11-14.md) — รวบรวมโปรเจกต์ Agent/Subagent, skills, tests, docs และทรัพยากรที่ใช้สร้างทีมแข่งขัน
- [Manus Browser Bridge Integration](analysis/manus-browser-bridge-integration.md) — ลิงก์ NovaAgent กับ Manus sandbox สำหรับ browser automation, navigation, screenshots, evaluation และ script execution ผ่าน Playwright-core ใน sandbox ของ Manus
- [Manus vs Puter: ตั้งให้เท่ากัน "ทุกด้าน" ทำได้แค่ไหน](analysis/manus-vs-puter-parity.md) — พิสูจน์ว่าเพดาน 5,000 tokens เลี่ยงได้ด้วย file attachment (ทดสอบ 9,319 tokens ผ่าน) + project.instruction + sendMessage; แต่ tool calling และ token usage ทำเหมือน Puter ไม่ได้เพราะ Manus เป็น agent platform ไม่ใช่ LLM provider
- [รายงานข่าว AI รอบ 48 ชั่วโมง 13–15 พ.ย. 2026](sources/ai-news-report-2026-11-15.md) — รายงานจาก Manus 5 หมวด (โมเดล/ธุรกิจ/Nvidia-ชิป/ความปลอดภัย/ไทย-อาเซียน) พร้อม 5 จุดที่แหล่งข่าวขัดแย้งกัน
