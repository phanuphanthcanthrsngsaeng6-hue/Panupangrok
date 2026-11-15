# PUTER_REFERENCE.md — เอกสารอ้างอิง Puter.js (ฉบับยืนยันจากเอกสารทางการ)

> ดึงจาก https://docs.puter.com/ เมื่อ 2026-11-14
> ทุกข้อมูลในไฟล์นี้มาจากเอกสารทางการจริง — จุดที่เอกสารไม่มี ระบุว่า **"ไม่พบในเอกสาร"**

---

## 1. การโหลด SDK

```html
<script src="https://js.puter.com/v2/"></script>
```

| ข้อ | รายละเอียด |
|-----|-----------|
| URL | `https://js.puter.com/v2/` ✅ ยืนยันจากเอกสาร |
| npm | `@heyputer/puter.js` (ระบุในหน้า Overview) |
| แพลตฟอร์ม | websites, apps, nodejs, workers |
| **ข้อบังคับ** | ต้องเสิร์ฟผ่าน **http(s)** — `file://` ใช้ไม่ได้ (จะได้ `unsupported_origin`) |
| หมายเหตุ | แอปที่ใช้ Puter.js ควรมีลิงก์ `https://developer.puter.com` ใน footer ("Powered by Puter") |

---

## 2. `puter.auth.*` — ฟังก์ชันทั้งหมด

รายการจาก `llms.txt` (เอกสารรวมทางการ):

| ฟังก์ชัน | มีจริง | หมายเหตุ |
|----------|--------|----------|
| `signIn(options)` | ✅ | เปิด popup ล็อกอิน |
| `isSignedIn()` | ✅ | คืน `true`/`false` (synchronous) |
| `signOut()` | ✅ | ออกจากระบบ |
| `getUser()` | ✅ | คืน `Promise<User>` |
| `getProfile()` | ✅ | คืน `null` ถ้าไม่มี |
| `getProfilePicture()` | ✅ | คืน `null` ถ้าไม่มี |
| `getMonthlyUsage()` | ✅ | การใช้ทรัพยากรรายเดือน |
| `getDetailedAppUsage()` | ✅ | การใช้แบบละเอียดต่อแอป |
| **`getToken()`** | ❌ **ไม่พบในเอกสาร** | ไม่มีฟังก์ชันนี้ใน SDK — token อยู่ภายใน SDK |

---

## 3. `puter.auth.signIn()` — รายละเอียดครบถ้วน

### Syntax
```js
puter.auth.signIn()
puter.auth.signIn(options)
```

### Options
| Option | Type | คำอธิบาย |
|--------|------|----------|
| `attempt_temp_user_creation` | Boolean | ให้ Puter สร้าง user ชั่วคราวอัตโนมัติ (onboard เร็ว ผู้ใช้สมัครทีหลังได้) |
| `request_auth` | Boolean | บังคับให้ popup ให้ผู้ใช้เลือกบัญชีใหม่ แม้เว็บเคยมี token แล้ว (ใช้ทำปุ่ม "สลับบัญชี") |

### Return
`Promise<SignInResult>` — resolve เมื่อล็อกอินสำเร็จ

### Error codes
| Code | สาเหตุ |
|------|--------|
| `popup_blocked` | popup ถูกบล็อก — **มักเกิดเมื่อไม่ได้เรียกจาก user action (คลิก)** |
| `auth_window_closed` | ผู้ใช้ปิดหน้าต่าง/ยกเลิก |
| `not_available_in_app` | เรียกจากแอปบน Puter (มี session อยู่แล้ว) — ใช้ `getUser()` แทน |
| `unsupported_origin` | หน้าไม่มี origin ที่ browser ยืนยันได้ (`file://` หรือ iframe ที่ไม่มี `allow-same-origin`) |

### ข้อบังคับสำคัญ
> **`puter.auth.signIn()` ต้องถูกเรียกจาก user action (เช่น click) เพราะเปิด popup — browser ส่วนใหญ่บล็อก popup ที่ไม่ได้มาจาก user interaction**

---

## 4. `puter.auth.isSignedIn()`

```js
puter.auth.isSignedIn()   // → true | false
```
- **synchronous** — ไม่ต้อง await
- ใช้ตรวจก่อนจะเรียก `signIn()`

---

## 5. `puter.auth.getUser()`

```js
const user = await puter.auth.getUser();
// user = User object (ชื่อ, email, username ฯลฯ)
```

ตัวอย่างจากเอกสาร:
```js
puter.auth.getUser().then(function(user) {
    puter.print(JSON.stringify(user));
});
```

---

## 6. `puter.ai.chat()` — ครบทุก overload

### Syntax
```js
puter.ai.chat(prompt)
puter.ai.chat(prompt, options = {})
puter.ai.chat(prompt, testMode = false, options = {})
puter.ai.chat(prompt, media, testMode = false, options = {})
puter.ai.chat(prompt, [mediaURLArray], testMode = false, options = {})
puter.ai.chat([messages], testMode = false, options = {})
```

### Options ครบ (จากเอกสาร)
| Option | Type | คำอธิบาย |
|--------|------|----------|
| `model` | String | โมเดลที่ใช้ — **default: `gpt-5.4-nano`** มี 500+ โมเดล |
| `serviceSpeed` | String | `"standard"` / `"fast"` / `"ultrafast"` (เร็วขึ้นอาจแพงขึ้น) |
| `stream` | Boolean | เปิด streaming (default `false`) |
| `max_tokens` | Number | จำนวน token สูงสุด |
| `temperature` | Number | 0–2 (ต่ำ=แน่นอน, สูง=สุ่ม) |
| `reasoning_effort` / `reasoning.effort` | String | `none`,`minimal`,`low`,`medium`,`high`,`xhigh`,`max` |
| `thinking` | Object\|null | `{type: "adaptive"\|"enabled"\|"disabled"\|"between_tools", budgetTokens?, display?}` |
| `verbosity` / `text.verbosity` | String | `low`/`medium`/`high` (OpenAI เท่านั้น) |
| `tools` | Array | นิยามฟังก์ชันให้ AI เรียก |
| `toolChoice` | String\|Object | `"auto"` / `"none"` / `"required"` / `{type:"tool",name:"..."}` |
| `parallelToolCalls` | Boolean | ให้เรียกหลาย tool พร้อมกัน |
| `streamToolInput` | Boolean | สตรีม argument ของ tool (`tool_use_start`/`tool_input_delta`) |
| `normalize` | Boolean | ปรับรูป response (non-streaming) |
| `compaction` | Boolean\|Object | บีบอัด context อัตโนมัติในบทสนทนายาว |
| `signal` | AbortSignal | ยกเลิกคำขอ |
| `provider` | String | ระบุ provider เช่น `openrouter`, `infron` |
| `fallback` | Boolean | default `true` — ลอง provider อื่นถ้าตัวแรกพลาด |
| `outputFormat` | Object | `{type:"json_schema", schema, name?, strict?}` |
| `stopSequences` | Array<String> | หยุดเมื่อเจอคำเหล่านี้ |

### testMode
`puter.ai.chat(prompt, true)` — **ทดสอบโดยไม่ใช้เครดิต**

### Return value
- **ไม่ stream** → `Promise<ChatResponse>` object
- **`stream: true`** → **async iterable** ของ `ChatResponseChunk` (ใช้ `for await...of`)

### Error handling (streaming)
| กรณี | พฤติกรรม |
|------|----------|
| provider error | chunk ที่มี `type: "error"` + `message` |
| network ล่ม | throw `{message, code: "network_error"}` |
| JSON เสีย | throw `{message, code: "invalid_stream_response"}` |
| ไม่มีข้อมูล 15 นาที | throw `{message, code: "request_timeout"}` |
| `serviceSpeed` ผิด | reject `invalid_service_speed` |

> **หมายเหตุ:** หยุด stream = หยุดรับ output แต่โมเดลยังตอบจนจบและคิดเงินเต็ม

---

## 7. รายชื่อโมเดล

- เรียกดูด้วย `puter.ai.listModels()` และ `puter.ai.listModelProviders()`
- หน้ารายการเต็ม: `https://developer.puter.com/ai/models/`
- provider ที่ระบุในเอกสาร: OpenAI, Anthropic, Google, Alibaba Cloud, xAI, Mistral, OpenRouter, Infron
- **default model = `gpt-5.4-nano`**

---

## 8. Flow ที่แนะนำสำหรับเว็บคอนโซล

```js
// 1. ตรวจสถานะ (ไม่ต้อง await)
if (!puter.auth.isSignedIn()) {
    // 2. ต้องเรียกจากคลิกของผู้ใช้
    await puter.auth.signIn();
}

// 3. ได้ข้อมูลผู้ใช้
const user = await puter.auth.getUser();

// 4. ถามโมเดล (ไม่ต้องมี API key)
const resp = await puter.ai.chat("สวัสดี", { model: "gpt-5.4-nano" });
console.log(resp.message?.content ?? resp.text ?? resp);
```

### Streaming
```js
const stream = await puter.ai.chat("เล่าเรื่องสั้น", {
    model: "gemini-2.5-flash-lite",
    stream: true
});
for await (const chunk of stream) {
    if (chunk?.type === 'error') { console.error(chunk.message); break; }
    process.stdout.write(chunk?.text ?? '');
}
```

### ยกเลิก
```js
const ctrl = new AbortController();
const stream = await puter.ai.chat("...", { stream: true, signal: ctrl.signal });
// ctrl.abort();  → หยุด
```

---

## 9. ข้อจำกัดและข้อควรระวัง

| ข้อ | รายละเอียด |
|-----|-----------|
| **ต้องเป็น user gesture** | `signIn()` ต้องมาจาก click — เด้งอัตโนมัติตอนโหลดหน้าจะโดน `popup_blocked` |
| **ต้อง http(s)** | `file://` ใช้ไม่ได้ |
| **ไม่มี `getToken()`** | token อยู่ภายใน SDK — ส่งต่อ backend ไม่ได้ตรงๆ |
| **ไม่มี server-side OAuth** | **ไม่พบในเอกสาร** — Puter เป็น client-side SDK |
| **ไม่มี API key** | ผู้ใช้จ่ายเครดิตเอง (User-Pays Model) |
| **timeout 15 นาที** | ทั้งตอนรอ response และตอน stream หยุด |
| **iframe** | ต้องมี `allow-same-origin` |
| **บิล** | หยุด stream ก็ยังคิดเงินเต็ม (โมเดลตอบจบแล้ว) |

---

## 10. ลิงก์อ้างอิง

| หัวข้อ | URL |
|--------|-----|
| เอกสารหลัก | https://docs.puter.com/ |
| เอกสารรวม (AI) | https://docs.puter.com/llms.txt |
| เอกสารเต็ม | https://docs.puter.com/llms-full.txt |
| Auth | https://docs.puter.com/Auth/index.md |
| signIn | https://docs.puter.com/Auth/signIn/index.md |
| isSignedIn | https://docs.puter.com/Auth/isSignedIn/index.md |
| getUser | https://docs.puter.com/Auth/getUser/index.md |
| ai.chat | https://docs.puter.com/AI/chat/index.md |
| listModels | https://docs.puter.com/AI/listModels/index.md |
| listModelProviders | https://docs.puter.com/AI/listModelProviders/index.md |
| Rate limits | https://docs.puter.com/rate-limits-and-quotas/index.md |
| User-Pays Model | https://docs.puter.com/user-pays-model/index.md |
| Security | https://docs.puter.com/security/index.md |
| Getting Started | https://docs.puter.com/getting-started/index.md |
| รายชื่อโมเดล | https://developer.puter.com/ai/models/ |
| Playground | https://docs.puter.com/playground/ |
| GitHub | https://github.com/HeyPuter/puter |

---

## 11. สรุปสำหรับนำไปใช้ใน NovaAgent Console

| ต้องการ | วิธี |
|---------|------|
| ล็อกอิน Puter ตอนเริ่มแชท | `isSignedIn()` → ถ้า false → `signIn()` จาก click handler |
| ใช้โมเดลไม่ต้องมี key | `puter.ai.chat(prompt, {model})` |
| สตรีม | `{stream: true}` + `for await` |
| เปลี่ยนโมเดล | `{model: "..."}` — ดูรายชื่อที่ `listModels()` |
| ตรวจผู้ใช้ | `getUser()` |
| ออกจากระบบ Puter | `signOut()` |
| ทดสอบไม่ใช้เครดิต | `puter.ai.chat(prompt, true)` (testMode) |

**ข้อจำกัดที่ต้องออกแบบให้รับมือ:**
- `signIn()` **ต้องมาจากคลิก** → ใช้ปุ่ม "เชื่อมต่อ Puter" หรือ hook ที่ปุ่มส่งข้อความครั้งแรก
- **ไม่มี getToken()** → ต้องเรียก `puter.ai.chat()` จากเบราว์เซอร์ (client-side) เท่านั้น