# SUBAGENT_RULES.md — กฎการส่ง Subagent ไปทำงาน (บอสภาณุพันธ์)

> **"ไม่ทำเอง สั่งลูกน้อง ไม่ยอมรับคำตอบที่ไม่มีผลลัพธ์จริง"**

---

## 1. หลักการพื้นฐาน (First Principles)

| หลักการ | คำอธิบาย |
|----------|----------|
| **Parent = Commander** | คุณ (Parent) คือผู้ตัดสินใจ สั่งการ ตรวจสอบผลลัพธ์ — **ห้ามลงมือทำงานรายละเอียด** |
| **Subagent = Executor** | Subagent ทำงานจริง อ่านไฟล์ รันคำสั่ง เขียนโค้ด สร้างไฟล์ — **ต้องส่งมอบผลลัพธ์จริง** |
| **No Middle Management** | ไม่มีชั้นกลาง Parent สั่ง Subagent โดยตรง 1 ชั้น |
| **Results Only** | Subagent ต้องรายงาน **ผลลัพธ์ที่ตรวจสอบได้** (ไฟล์ที่สร้าง, ข้อมูลที่ดึงมา, สถานะจริง) — ไม่ใช่ "ผมจะทำ" |

---

## 2. กฎบังคับ (Enforced Rules)

### 2.1 ก่อนส่ง Subagent
- [ ] **Goal ชัดเจน**: เขียนเป็นคำสั่งเด็ดขาด 1 ประโยคบอก "ต้องได้อะไร"
- [ ] **Context ครบ**: ให้ path, constraints, decisions ที่ตัดสินแล้ว — Subagent **ไม่ได้เห็นการสนทนาของเรา**
- [ ] **Subagent Type ถูกต้อง**: `explore` (อ่านอย่างเดียว) หรือ `general-purpose` (อ่าน+เขียน+รัน)
- [ ] **Tasks แบบขนาน**: งานอิสระหลายชิ้น → ใช้ `tasks: [...]` รันพร้อมกัน

### 2.2 ขณะ Subagent ทำงาน
- **ห้าม interrump** — รอจนจบหรือ timeout
- **ห้ามช่วย** — Subagent ล้มเหลว = เปลี่ยนคำสั่ง/แบ่งงานใหม่/เรียกตัวแทนใหม่
- **Timeout default**: 120 วินาที — งานใหญ่ตั้งค่าเอง

### 2.3 หลัง Subagent เสร็จ
- [ ] **อ่านผลลัพธ์** — ต้องเห็นไฟล์/ข้อมูลจริง ไม่ใช่แค่ข้อความ
- [ ] **Verify เอง** — `read`/`bash`/`grep` ตรวจสอบผลงาน ก่อนรายงานผู้ใช้
- [ ] **รวมสรุป** — Parent รวมผลจากทุก Subagent ตัดสินใจต่อไปเอง

---

## 3. Template คำสั่งมาตรฐาน (Copy ใช้ได้เลย)

```python
subagent(
    goal="<คำสั่งเด็ดขาด: ต้องได้ผลลัพธ์อะไร>",
    context="<ข้อมูลที่ Subagent ต้องรู้: paths, constraints, decisions แล้ว, ไฟล์ที่อ่านแล้ว>",
    subagent_type="explore|general-purpose",
    # tasks=[...]  # ถ้ามีหลายงานอิสระ
)
```

**ตัวอย่างจริง:**
```python
subagent(
    goal="สร้างไฟล์ UI_MAP.md ที่มีแผนที่ UI ครบถ้วนจาก chat.html, sidebar.html, header.html, CSS 4 ไฟล์, JS core modules",
    context="Project: /data/data/com.termux/files/home/NovaAgent-Terminal\nServer: http://localhost:9899 (running)\nFiles already read: chat.html (261 lines), sidebar.html (159 lines)\nMust follow UI_MAP.md structure defined in RULE.md",
    subagent_type="general-purpose"
)
```

---

## 4. Anti-Patterns (ห้ามทำ)

| ❌ ห้ามทำ | ✅ ทำให้ถูกต้อง |
|-----------|----------------|
| ส่ง Subagent ไป "หาข้อมูล" แล้วมานั่งคิดต่อเอง | ให้ Subagent ส่งมอบ **ข้อมูลที่จัดระเบียบพร้อมตัดสินใจ** |
| ใช้ `subagent_type="general-purpose"` สำหรับงานอ่านอย่างเดียว | ใช้ `explore` สำหรับ read-only — เร็วกว่า ถูกกว่า |
| ส่ง 1 Subagent ทำงานหลายอย่างที่เกี่ยวข้องกัน | แบ่งเป็น `tasks: [...]` หลายตัว รันขนาน |
| ไม่ให้ Context ครบ แล้วโทษ Subagent "ทำผิด" | Context = ทุกอย่างที่ Subagent **ไม่ได้เห็น** จากการสนทนา |
| รับรายงาน "เสร็จแล้ว" โดยไม่ verify | `read`/`bash` ตรวจสอบไฟล์จริง ก่อนปิดเรื่อง |

---

## 5. Workflow มาตรฐาน (Standard Operating Procedure)

```
USER REQUEST
    │
    ▼
PARENT: วิเคราะห์ → แบ่งงาน → เขียน Goal/Context ชัดเจน
    │
    ▼
SEND SUBAGENT(s) ──────► SUBAGENT: ทำงานจริง (อ่าน/เขียน/รัน/สร้างไฟล์)
    │                         │
    │                         ▼
    │                  SUBAGENT: ส่งคืน Conclusion + Evidence
    │                         │
    ▼                         │
PARENT: Verify (read/bash) ◄──┘
    │
    ▼
PARENT: รวมผล → ตัดสินใจต่อ → รายงาน USER
```

---

## 6. Checklist ก่อนกด Send (บังคับ)

- [ ] Goal = **ผลลัพธ์ที่วัดได้** (ไฟล์, ข้อมูล, สถานะ) — ไม่ใช่ "กระบวนการ"
- [ ] Context มี **path เต็มทุกตัว** ที่ Subagent ต้องอ่าน/เขียน
- [ ] Context มี **constraints/decisions** ที่ตัดสินแล้ว (ห้ามให้ Subagent เดา)
- [ ] เลือก `subagent_type` ถูกต้อง
- [ ] งานอิสระหลายอย่าง → ใช้ `tasks: [...]` แทนการส่งทีละตัว

---

## 7. Escalation Protocol (เมื่อ Subagent ล้มเหลว)

1. **อ่าน error** — ดูว่า fail ที่ไหน (auth, timeout, path ผิด, logic ผิด)
2. **ปรับคำสั่ง** — Goal 具体化, Context เพิ่ม, แบ่งงานเล็กลง
3. **ส่งใหม่** — Subagent ใหม่ (ไม่ใช่ตัวเดิม) พร้อม Context ที่แก้แล้ว
4. **สูงสุด 3 รอบ** — ถ้ายังล้มเหลว Parent ต้องลงมือทำเองหรือเปลี่ยนแนวทาง

---

## 8. การบันทึก (Logging)

ทุกครั้งที่ส่ง Subagent ต้องบันทึกใน `memory/YYYY-MM-DD.md`:

```markdown
## Subagent Dispatch - <เวลา>
- **Goal**: <goal สรุป 1 บรรทัด>
- **Type**: explore | general-purpose
- **Result**: ✅ Success / ❌ Failed
- **Evidence**: <path ไฟล์ที่สร้าง/อ่าน, หรือ error>
- **Next Action**: <จะทำต่ออย่างไร>
```

---

## 9. ภาษาและ Tone

- คำสั่งให้ Subagent: **ภาษาอังกฤษ** (model เข้าใจดีกว่า) — แต่ Context ใส่ไทยได้
- รายงานให้ User: **ภาษาไทย** (ตามกฎ RULE.md)
- ไม่มีคำอ่อนไหว: "ขอให้ช่วย", "ลองดูหน่อย" → ใช้ **"สร้าง", "ดึง", "วิเคราะห์", "สร้างไฟล์"**

---

**End of Rules** — บังคับใช้ทันที ทุกครั้งที่ใช้ `subagent` tool