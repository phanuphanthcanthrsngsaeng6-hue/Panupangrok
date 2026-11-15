# UI_MAP.md — แผนที่ UI ฉบับสมบูรณ์ของ NovaAgent Web Console (boss.slilelo)

> **สร้างเมื่อ:** 2026-11-14  
> **Server:** http://localhost:9899 (boss.slilelo Console)  
> **Entry Point:** `/channel/web/chat.html` (รูปแบบ SSG ใช้ `<!--#include -->`)  
> **วัตถุประสงค์:** เอกสารอ้างอิงแหล่งเดียว (single source of truth) สำหรับทุกองค์ประกอบ UI, state, routing, styling และจุดเชื่อมต่อ — แก้ไขและบำรุงรักษาได้ง่าย

---

## 1. สถาปัตยกรรมภาพรวม

### 1.1 โมเดลการประกอบหน้าเพจ
```
chat.html (entry)
├── <!--#include virtual="/templates/layout/header.html" -->
├── <!--#include virtual="/templates/layout/sidebar.html" -->
├── <!--#include virtual="/templates/layout/session-panel.html" -->
├── <!--#include virtual="/templates/layout/login.html" -->
├── <main id="app"> → วิวถูกฉีดที่นี่ (12 วิว)
│   ├── view-chat          (ค่าเริ่มต้น)
│   ├── view-agents
│   ├── view-config
│   ├── view-skills
│   ├── view-memory
│   ├── view-knowledge
│   ├── view-channels
│   ├── view-tasks
│   ├── view-logs
│   ├── view-artifacts
│   ├── view-theme
│   └── view-custom        (ไดนามิก เรนเดอร์โดย menu.js)
├── <!--#include virtual="/templates/modals/*.html" --> (12 โมดัล)
└── Scripts โหลดตามลำดับ (defer)
```

### 1.2 โซนของเลย์เอาต์
| โซน | Selector | ตำแหน่ง | พฤติกรรม |
|------|----------|----------|----------|
| Sidebar | `#sidebar` | Fixed ซ้าย, `w-52` (ย่อ: `w-14`) | Mobile เป็น drawer (`-translate-x-full`), lg: relative |
| Header | `#header` | Fixed บน, `h-14`, `z-40` | Breadcrumbs, ปุ่ม action, ภาษา, ธีม, เมนูผู้ใช้ |
| Session Panel | `#session-panel` | Fixed ขวา, `w-80` | Drawer เลื่อนออก (ประวัติ, แชทใหม่) |
| Content | `#app > .view` | Flex-1, `pt-14 lg:pt-0 pl-52 lg:pl-0` | แสดงเฉพาะ `.view.active` ตัวเดียว |
| Login Overlay | `#login-overlay` | Fixed inset, `z-[100]` | แสดงก่อนยืนยันตัวตน ซ่อนหลังล็อกอิน |

### 1.3 ทะเบียนวิว (จาก `nav.js:VIEW_META` + `menu.js:MENU_BUILTINS`)
| View ID | กลุ่ม | ป้าย Sidebar (i18n) | ไอคอน | URL Path | แท็บเริ่มต้น |
|---------|-------|---------------------|------|----------|-------------|
| `chat` | chat | `nav_chat` (对话) | `fa-comments` | `/` | — |
| `agents` | manage | `nav_agents` (Agent) | `fa-robot` | `/agents` | — |
| `config` | manage | `nav_config` (配置) | `fa-cog` | `/config` | `models` |
| `skills` | manage | `nav_skills` (能力) | `fa-magic` | `/skills` | — |
| `memory` | manage | `nav_memory` (记忆) | `fa-brain` | `/memory` | `list` |
| `knowledge` | manage | `nav_knowledge` (知识) | `fa-book` | `/knowledge` | — |
| `channels` | manage | `nav_channels` (通道) | `fa-broadcast-tower` | `/channels` | — |
| `tasks` | manage | `nav_tasks` (定时) | `fa-tasks` | `/tasks` | `tasks` |
| `logs` | monitor | `nav_logs` (日志) | `fa-terminal` | `/logs` | — |
| `artifacts` | monitor | `nav_artifacts` (产物) | `fa-cube` | `/artifacts` | — |
| `theme` | manage | `nav_theme` (主题) | `fa-palette` | `/theme` | — |
| `custom` | (ไดนามิก) | จาก menu config | จาก config | `/custom/{id}` | — |

---

## 2. เทมเพลตเลย์เอาต์ (ถูก include ใน chat.html)

### 2.1 `templates/layout/header.html` (110 บรรทัด)
**องค์ประกอบหลัก:**
- `#menu-btn` — ปุ่มแฮมเบอร์เกอร์ (mobile) → `toggleSidebar()`
- `#header-breadcrumb` — `#breadcrumb-group` + `#breadcrumb-page` + `#breadcrumb-external`
- `#artifacts-toggle-btn` — เปิด/ปิด timeline ของ artifacts (ไอคอน + badge `#artifacts-badge`)
- `#language-select` — Dropdown (4 ภาษา: zh-CN, zh-TW, en, th) → `setLanguage()`
- `#theme-toggle-btn` — สลับ dark/light → `toggleTheme()` (ไอคอน `#theme-icon`)
- `#docs-link`, `#website-link`, `#github-link` — ลิงก์ภายนอก (เปิดแท็บใหม่)
- `#logout-btn-header` — ออกจากระบบ → `handleLogout()` (ซ่อนจนกว่าจะยืนยันตัวตน)

**State:** `data-i18n` บนทุก text node; ภาษาถูกเก็บถาวรใน `localStorage.cow_lang`

### 2.2 `templates/layout/sidebar.html` (159 บรรทัด)
**โครงสร้าง:**
```
#sidebar
├── .sidebar-brand (โลโก้ + "boss.slilelo" + "控制台")
├── #sidebar-nav (nav)
│   ├── .menu-group[data-group="chat"] → view-chat
│   ├── .menu-group[data-group="manage"] → agents, config, skills, memory, knowledge, channels, tasks
│   └── .menu-group[data-group="monitor"] → logs, artifacts
├── .sidebar-divider
├── .menu-group (เมนูเวอร์ชัน) → #version-btn + dropdown (#version-menu)
└── #sidebar-collapse-btn (ปุ่มย่อ) → toggleSidebarCollapsed()
```
**พฤติกรรม:**
- หัวกลุ่มสลับคลาส `.open` (เก็บถาวรใน `localStorage.cow_sidebar_groups`)
- โหมดย่อ (rail): `w-14`, ซ่อนป้าย, tooltip ผ่าน `syncSidebarTips()`
- Mobile: overlay `#sidebar-overlay` + `-translate-x-full`
- ไฮไลต์รายการที่ใช้งานผ่าน `menuSyncActive()` (เพิ่มคลาส `.active`)

### 2.3 `templates/layout/session-panel.html` (20 บรรทัด)
**โครงสร้าง:**
```
#session-panel (fixed ขวา, w-80, ซ่อนเป็นค่าเริ่มต้น)
├── .session-panel-header — "历史会话" + ปุ่มปิด
├── #new-chat-menu-btn — dropdown (新对话 / 多Agent对话)
└── #session-list — เติมข้อมูลโดย `renderSessionList()`
```

### 2.4 `templates/layout/login.html` (33 บรรทัด)
**โครงสร้าง:**
```
#login-overlay
└── .login-card
    ├── h1 "boss.slilelo" + คำบรรยาย "控制台"
    ├── #login-form
    │   ├── #login-password (type=password, สลับด้วย #toggle-pwd)
    │   ├── #login-error (ซ่อน)
    │   └── #login-btn (ปิดจนกว่าจะพิมพ์)
    └── ส่วนท้าย: ข้อมูลเวอร์ชัน
```
**ลำดับการทำงาน:** `POST /auth/login` → ตั้ง cookie → `openAuthGate()` → `initApp()` → `routeApply()`

---

## 3. วิว (11 วิวในระบบ + 1 ไดนามิก)

### 3.1 `view-chat` — `templates/views/chat.html` (285 บรรทัด)
**ส่วนประกอบ:**
| ส่วน | Selector | หน้าที่ |
|---------|----------|---------|
| หน้าจอต้อนรับ | `#chat-welcome` | แสดงเมื่อยังไม่มีข้อความ; ปุ่มลัด (grid 4 การ์ด) |
| พื้นที่ข้อความ | `#chat-messages` | รายการเลื่อนได้ของ `.user-message-group` / `.bot-message-group` |
| ปุ่มเลื่อนลง FAB | `#scroll-to-bottom-btn` | ปรากฏเมื่อเลื่อนขึ้น; → `scrollChatToBottom(true)` |
| การ์ด Composer | `.composer-card` | ช่องป้อน + toolbar + workspace panel |
| Workspace Panel | `#workspace-panel` | แท็บ: Preview (`#workspace-preview`) / Files (`#workspace-files`) |

**แถบเครื่องมือ Composer (ซ้าย→ขวา):**
1. `#attach-btn` → `toggleAttachMenu()` (ไฟล์/โฟลเดอร์/เสียง)
2. `#workspace-toggle-btn` → เปิด/ปิด workspace panel
3. `#permission-btn` → `togglePermissionMenu()` (preset สิทธิ์)
4. `#model-btn` → `toggleModelMenu()` (เลือกโมเดล)
5. `#agent-btn` → `toggleAgentMenu()` (เลือก agent)
6. `#optimize-btn` → `optimizePrompt()` (ปรับปรุง prompt)
7. `#mic-btn` → `toggleVoiceRecording()` (ป้อนด้วยเสียง)
8. `#steer-btn` → `steerActiveTask()` (แสดงระหว่างสตรีม)
9. `#send-btn` → `sendMessage()` / `requestCancel()` (สลับโหมด)

**Workspace Panel:**
- แท็บ: `#ws-tab-preview` / `#ws-tab-files` (role=tablist)
- Preview: `#workspace-preview-content` (iframe หรือเรนเดอร์ artifact)
- Files: `#workspace-files-list` (ไฟล์ที่อัปโหลด พร้อมปุ่มลบ)

**State Keys (จาก state.js):**
- `sessionId` (localStorage `cow_session_id`)
- `activeAgentId` (localStorage `cow_active_agent`)
- `pendingAttachments[]` — `{file_path, file_name, file_type, preview_url, _uploading}`
- `activeRequestId`, `sendBtnMode` ('send'|'cancel')
- `historyPage`, `historyHasMore`, `historyLoading`

### 3.2 `view-config` — `templates/views/config.html` (433 บรรทัด)
**แท็บ (role=tablist):** `#config-tab-models` (模型配置), `#config-tab-agent` (Agent配置)
**Pane:** `#config-pane-models` (ค่าเริ่มต้น), `#config-pane-agent` (ซ่อน)

**แท็บ Models — 5 การ์ด:**
| การ์ด | องค์ประกอบหลัก |
|------|--------------|
| Model Config | Dropdown provider (`#model-provider-select` → `cfg-dropdown`), Dropdown model (`#model-select`), ช่อง API Key (`#model-api-key` + ปุ่มปิดบัง), API Base (`#model-api-base`), ปุ่มบันทึก (`#model-save-btn`) |
| Agent Config | `#agent-max-context`, `#agent-max-memory`, `#agent-max-steps`, ปุ่มบันทึก |
| Security | `#security-password-hash`, `#security-session-timeout`, ปุ่มบันทึก |
| API Keys | ลิงก์แดชบอร์ด API ภายนอก (OpenAI, Anthropic, ฯลฯ) |
| System | ข้อมูลเวอร์ชัน, ปุ่มตรวจอัปเดต (`#check-update-btn`), ลิงก์ release notes |

**State:** `appConfig` แคชใน state.js; `loadConfigView()` ดึงจาก `/api/config`

### 3.3 `view-skills` — `templates/views/skills.html` (139 บรรทัด)
**เลย์เอาต์:** 3 panel (list | viewer | editor) — responsive grid
| Panel | Selector | หน้าที่ |
|-------|----------|---------|
| List | `#skill-list` | หมวดหมู่: Built-in (内置工具), MCP Servers, Skills — tree มี `data-skill-id` |
| Viewer | `#skill-viewer` | พรีวิว markdown ของ `SKILL.md` (เรนเดอร์โดย `marked.parse()`) |
| Editor | `#skill-editor` | `#skill-edit-content` (textarea) + บันทึก (`#skill-save-btn`) / ยกเลิก |

**ปฏิสัมพันธ์:**
- คลิก skill ใน list → `loadSkillPreview(id)` → แสดง viewer
- ปุ่มแก้ไข → `openSkillEditor(id)` → แสดง editor พร้อมเนื้อหา
- บันทึก → `POST /api/skill/save` → รีเฟรช list
- สร้างใหม่ → `#skill-add-btn` → `openSkillAddModal()` → โมดัล `skill-add.html`

### 3.4 `view-agents` — `templates/views/agents.html` (120 บรรทัด)
**เลย์เอาต์:** Grid list + Detail Sidebar
| พื้นที่ | Selector | หน้าที่ |
|------|----------|---------|
| Grid | `#agents-grid` | การ์ด: avatar, ชื่อ, บทบาท, badge สถานะ, action (แก้ไข/ลบ) |
| Detail Sidebar | `#agent-detail` | แท็บ: 概况 / 能力 / 核心文件 (role=tablist) |
| Create Modal | `#create-agent-modal` | ฟอร์ม: ชื่อ, avatar, ID, บทบาท, dropdown copy-from |

**ปฏิสัมพันธ์:**
- คลิกการ์ด → `selectAgent(id)` → โหลด detail sidebar
- `#create-agent-btn` → `openCreateAgentModal()`
- แก้ไข → `openEditAgentModal(id)` (ใช้โมดัลสร้างซ้ำ)
- ลบ → `confirmDeleteAgent(id)` → โมดัล `confirm-dialog.html`

### 3.5 `view-memory` — `templates/views/memory.html` (98 บรรทัด)
**ส่วนประกอบ:**
- Header: ชื่อเรื่อง + ตัวเลือก Agent (`#memory-agent-select` → `cfg-dropdown-avatar`)
- ค้นหา: `#memory-search-input` + `#memory-search-btn`
- แท็บ (role=tablist): `#memory-tab-list` (列表), `#memory-tab-daily` (每日记忆)
- Pane: `#memory-panel-list` (ค่าเริ่มต้น), `#memory-panel-daily` (ซ่อน)
- List Panel: `#memory-file-tree` (tree ซ้อนกัน), `#memory-file-content` (ตัวอ่าน markdown)
- Daily Panel: `#memory-daily-select` (dropdown วันที่) + `#memory-daily-content`

**ปฏิสัมพันธ์:** คลิก tree → โหลดเนื้อหา; ค้นหา → กรอง tree; เลือกวัน → โหลดไฟล์วันที่

### 3.6 `view-knowledge` — `templates/views/knowledge.html` (144 บรรทัด)
**เลย์เอาต์:** Split view (Tree | Editor)
| พื้นที่ | Selector | หน้าที่ |
|------|----------|---------|
| Tree | `#knowledge-tree` | หมวดหมู่ซ้อน (sources/, concepts/, entities/, analysis/) |
| Editor | `#knowledge-editor` | `#knowledge-edit-title`, `#knowledge-edit-content` (textarea), `#knowledge-edit-tags`, `#knowledge-edit-links` |
| Preview | `#knowledge-preview` | markdown ที่เรนเดอร์แล้ว (ซ่อนระหว่างแก้ไข) |
| Actions | `#knowledge-new-btn`, `#knowledge-save-btn`, `#knowledge-delete-btn`, `#knowledge-cancel-btn` |

**ปฏิสัมพันธ์:**
- คลิก tree → โหลดเข้า editor/preview
- สร้างใหม่ → ล้าง editor, โฟกัสที่ชื่อเรื่อง
- บันทึก → `POST /api/knowledge/save` → รีเฟรช tree
- ลบ → dialog ยืนยัน
- Tags/Links: คั่นด้วยจุลภาค, แนะนำอัตโนมัติจากที่มีอยู่

### 3.7 `view-channels` — `templates/views/channels.html` (23 บรรทัด)
**เปลือกขั้นต่ำ — เติมข้อมูลโดย JS (`loadChannelsView()`):**
- Header: ชื่อเรื่อง + `#add-channel-btn` → `openAddChannelPanel()`
- `#channels-content` — grid ของการ์ด channel (ไดนามิก)
- `#channels-add-panel` — panel ซ่อนสำหรับเพิ่ม channel ใหม่ (ไดนามิก)

### 3.8 `view-tasks` — `templates/views/tasks.html`
**แท็บ (role=tablist):** `#tasks-tab-tasks` (任务), `#tasks-tab-records` (执行记录)
**Pane:** `#tasks-pane` (ค่าเริ่มต้น), `#runs-pane` (ซ่อน)
**องค์ประกอบ:**
- `#task-add-btn` → `openTaskCreateModal()`
- `#task-refresh-btn` → `refreshTasksView()`
- `#tasks-list` / `#runs-list` — grid เติมโดย JS
- สถานะ Empty/Loading พร้อม i18n keys

### 3.9 `view-logs` — `templates/views/logs.html`
**ตัวอ่านสไตล์ terminal:**
- ไฟจราจร macOS (แสดงผลอย่างเดียว)
- ป้ายชื่อไฟล์: `run.log`
- **ตัวกรอง 5 ระดับ** (checkbox, ติ๊กทั้งหมด): debug (เทา), info (ฟ้า), warning (เหลือง), error (แดง), critical (ขาวหนา)
- ตัวบ่งชี้ live: จุดเขียวเต้น + `logs_live`
- `#log-output` — monospace, `height: calc(100dvh - 272px)`, placeholder `logs_coming_msg`

### 3.10 `view-artifacts` — `templates/views/artifacts.html`
**เปลือก:** `.art-shell` → `.art-scroll` → `.art-inner`
**แถบเครื่องมือ (`.art-toolbar`):**
- ชิปตัวกรอง (role=tablist): All, Web, Doc, Image, Media, Other (`data-art-kind`)
- `#art-scope-select` — dropdown บทสนทนา/session (cfg-dropdown)
- `#art-search-input` — ค้นหาแบบ debounce
**Timeline:** `#art-list` (ไดนามิก) + `#art-sentinel` (infinite scroll)
**Pane พรีวิว (aside `#art-preview`, ซ่อน, ปรับขนาดได้):**
- Resizer: `#art-resizer` (`.workspace-resizer`)
- Header: `#art-preview-name`, `#art-preview-path`
- **8 ปุ่ม action** (ทั้งหมด `.workspace-icon-btn` พร้อม `data-tip-key`):
  1. เพิ่มเข้าแชท (`#art-btn-add`) — `artAddSelected()`
  2. กระโดดไปต้นทาง (`#art-btn-jump`) — `artJumpToSelected()`
  3. เพิ่มเข้าเมนู (`#art-btn-menu`) — `artAddSelectedToMenu()`
  4. เปิดภายนอก (`#art-btn-external`) — `artOpenSelectedExternally()`
  5. เปิดใน FS (`#art-btn-reveal`) — `artRevealSelected()`
  6. ดาวน์โหลด (`#art-btn-download`) — `artDownloadSelected()`
  7. ลบ (`#art-btn-remove`) — `artRemoveSelected()`
  8. ปิด (`#art-btn-close`) — `artClosePreview()`
- Body: `#art-preview-body` (`.workspace-preview-content`)
- Meta: `#art-preview-meta`

### 3.11 `view-theme` — `templates/views/theme.html`
**ขั้นต่ำ:** Header + `#theme-options` (role=radiogroup, responsive grid 1/2/4 คอลัมน์)
**เติมข้อมูลโดย:** `renderThemeOptions()` จาก `theme.js` ใช้ `THEME_OPTIONS` (10 ธีม)

### 3.12 `view-custom` — `templates/views/custom.html`
**คอนเทนเนอร์เดียว:** `#menu-page-body` (`.menu-page-body`)
**ไดนามิกทั้งหมด:** เรนเดอร์โดย `menuShowPage(id)` ตาม config ของรายการเมนู (iframe, webview, artifact preview)

---

## 4. โมดัล (12 ไฟล์ใน `templates/modals/`)

| ไฟล์โมดัล | ตัวเรียก | หน้าที่ | องค์ประกอบหลัก |
|------------|---------|---------|--------------|
| `confirm-dialog.html` | `showConfirm()` แบบ global | ยืนยัน ใช่/ไม่ | `#confirm-title`, `#confirm-message`, `#confirm-ok`, `#confirm-cancel` |
| `custom-provider.html` | Config → Add Provider | ผู้ให้บริการโมเดลกำหนดเอง | ฟอร์ม: ชื่อ, api_base, models[], headers |
| `folder-picker.html` | Composer → อัปโหลดโฟลเดอร์ | ตัวเลือกโฟลเดอร์เนทีฟ | `<input type="file" webkitdirectory>` |
| `knowledge-dialog.html` | Chat → แทรก knowledge | เลือกเอกสาร knowledge | ตัวเลือก tree + preview |
| `mcp-editor.html` | Skills → Add MCP | config MCP server | ฟอร์ม: ชื่อ, command, args, env |
| `menu-editor.html` | Sidebar → แก้ไขเมนู | ตัวสร้างเมนูลาก-วาง | จัดเรียงกลุ่ม/รายการ, ตัวเลือกไอคอน |
| `rename-dialog.html` | action เปลี่ยนชื่อต่างๆ | เปลี่ยนชื่อ entity | ช่องป้อน + ยืนยัน |
| `run-detail.html` | Tasks → บันทึกการรัน | รายละเอียดการรัน | timeline, logs, artifacts |
| `skill-add.html` | Skills → สร้างใหม่ | สร้างโครง skill | ชื่อ, หมวดหมู่, เลือก template |
| `task-edit.html` | Tasks → แก้ไขงาน | config cron/task | schedule, command, params |
| `team-chat.html` | Chat → Multi-agent | เลือก agent สำหรับแชท | การ์ด agent แบบเลือกหลายตัว |
| `vendor.html` | Config → Vendor APIs | API key ภายนอก | ช่อง key ต่อ vendor |

**รูปแบบร่วม:** ทุกโมดัลใช้ `.modal-overlay` + `.modal-card`, จัดกลาง, `z-[60]`, ESC ปิด, คลิก overlay ปิด

---

## 5. ระบบดีไซน์ (CSS)

### 5.1 ลำดับการโหลด (chat.html บรรทัด 43-56)
```css
1. base.css           → Reset, viewport, scrollbar, .view/.active, chat grid
2. sessions.css       → สไตล์ session panel
3. components.css     → Dropdown, modal, tooltip, chip, card, form
4. markdown.css       → Prose, code block, mermaid, table
5. chat.css           → Composer, bubble, streaming, popover, voice, timeline
6. workspace.css      → Workspace panel, preview, file list, resizer
7. knowledge.css      → Knowledge tree, editor, preview
8. agents.css         → Agent grid, card, detail sidebar
9. artifacts.css      → Artifact timeline, preview pane, chip
10. menu.css         → Menu editor, custom view
11. call.css         → UI สายเสียง/วิดีโอ (ยังไม่ใช้งาน)
12. theme-thinking.css → Reasoning bubble, tool step, streaming
13. theme-tools.css  → UI การรัน tool, substep, live preview
14. theme-aurora.css → เอฟเฟกต์พื้นหลัง aurora (ทางเลือก)
```

### 5.2 Design Token หลัก (จาก `base.css` + `components.css` + `chat.css`)
| Token | ค่า | การใช้ |
|-------|-------|-------|
| `--bg` | `#0A0A0A` | พื้นหลังหน้า |
| `--bg-elevated` | `#111` | การ์ด, panel |
| `--border` | `rgba(255,255,255,0.1)` | เส้นขอบ |
| `--text` | `#E5E5E5` | ข้อความหลัก |
| `--text-muted` | `#888` | ข้อความรอง |
| `--primary` | `#00B4D8` | สีเน้น, ลิงก์, สถานะ active |
| `--primary-hover` | `#0096B5` | Hover |
| `--danger` | `#EF4444` | ลบ, error |
| `--success` | `#22C55E` | สำเร็จ, live |
| `--warning` | `#F59E0B` | คำเตือน |
| `--radius` | `12px` | การ์ด, ปุ่ม |
| `--radius-sm` | `8px` | ช่องป้อน, chip |
| `--shadow` | `0 4px 24px rgba(0,0,0,0.4)` | โมดัล, dropdown |
| `--font-sans` | `Inter, system-ui` | ข้อความ UI |
| `--font-mono` | `JetBrains Mono, Fira Code` | โค้ด, log |
| `--dvh` | `100dvh` | ความสูง viewport บนมือถือ |

### 5.3 คลาสคอมโพเนนต์ (จาก `components.css` + `chat.css`)
| คลาส | หน้าที่ | ตัวแปร |
|-------|---------|----------|
| `.cfg-dropdown` | Dropdown สากล | `-avatar`, `-sm`, `-multi`, `-flip`, `-disabled` |
| `.modal-overlay` / `.modal-card` | คอนเทนเนอร์โมดัล | — |
| `.tooltip` / `[data-tip-key]` | Tooltip ตอน hover (i18n) | — |
| `.chip` | ป้ายกรอง/ป้ายชื่อ | `.active`, `.disabled` |
| `.btn` | ฐานปุ่ม | `.btn-primary`, `.btn-ghost`, `.btn-danger`, `.btn-icon` |
| `.composer-card` | การ์ดป้อนแชท | — |
| `.popover` | เมนูลอย | ตำแหน่ง `.popover-anchor-*` |
| `.tool-streaming` | ขั้น tool แบบ live | `.tool-detail`, `.tool-header` |
| `.thinking-stream-pre` | Reasoning bubble | `.thinking-header`, `.thinking-full` |
| `.voice-pill` | เครื่องเล่นเสียง TTS | — |
| `.workspace-resizer` | ตัวแบ่งที่ลากได้ | แนวนอน/แนวตั้ง |

### 5.4 ระบบธีม (theme.js + theme-tools.css)
**10 ธีม** (`THEME_OPTIONS`): default, ocean, forest, sunset, midnight, rose, amber, violet, aurora, high-contrast
**ใช้งานผ่าน:** `data-theme` บน `<html>` + override CSS custom properties
**เก็บถาวรใน:** `localStorage.cow_theme`
**ไดอะแกรม Mermaid** เรนเดอร์ใหม่เมื่อเปลี่ยนธีมผ่าน `rerenderMermaidDiagrams()`

---

## 6. สถาปัตยกรรม JavaScript

### 6.1 ลำดับการโหลด (chat.html บรรทัด 150-180, ทั้งหมด `defer`)
```
1. /static/CSJS/js/core/nav.js        → routing วิว, sidebar
2. /static/CSJS/js/core/router.js     → ซิงค์ URL ↔ view/tab
3. /static/CSJS/js/core/menu.js       → CRUD เมนู sidebar, custom view
4. /static/CSJS/js/core/theme.js      → สลับธีม
5. /static/CSJS/js/core/auth.js       → login gate, init แอป
6. /static/CSJS/js/core/utils.js      → helper ร่วม, คัดลอกโค้ด, scroll
7. /static/CSJS/js/chat/state.js      → session แชท, flow การส่ง, SSE
8. /static/CSJS/js/chat/send.js       → SSE streaming, ประมวลผล event
9. /static/CSJS/js/chat/render.js     → DOM ข้อความ, โหลดประวัติ
10. /static/CSJS/js/workspace.js      → workspace panel, preview, ไฟล์
11. /static/CSJS/js/call.js           → สายเสียง/วิดีโอ (stub)
12. /static/CSJS/js/boot.js           → bootstrap แอป (initApp, i18n)
```

### 6.2 สรุปโมดูลหลัก

| โมดูล | บรรทัด | Export หลัก | หน้าที่หลัก |
|--------|-------|-------------|------------------------|
| `nav.js` | 236 | `navigateTo()`, `toggleSidebar()`, `toggleSidebarCollapsed()`, `menuSyncActive()` | สลับวิว, สถานะ sidebar, drawer มือถือ |
| `router.js` | 191 | `routeEnterView()`, `routeNoteTab()`, `routeApply()`, `_routeParse()`, `_routePath()` | แยกวิเคราะห์ URL, จัดการ history, ซิงค์แท็บ |
| `menu.js` | 297 | `menuLoad()`, `menuApply()`, `menuRenderSidebar()`, `menuOpenItem()`, `menuShowPage()` | CRUD เมนู sidebar, เรนเดอร์ custom view |
| `theme.js` | 77 | `applyTheme()`, `setTheme()`, `renderThemeOptions()`, `toggleTheme()` | สลับธีม, เรนเดอร์ mermaid ใหม่ |
| `auth.js` | 178 | `initApp()`, `showLoginScreen()`, `handleLogout()`, `requestAuthGatedStart()` | login gate, flow ล็อกอิน, init หลังยืนยันตัวตน |
| `utils.js` | 231 | `formatTime()`, `escapeHtml()`, `scrollChatToBottom()`, `applyHighlighting()`, `injectCopyButton()` | helper ร่วม, คัดลอกโค้ด, auto-scroll |
| `state.js` | 932 | `sendMessage()`, `startSSE()`, `handleFileSelect()`, `loadOrCreateSessionId()`, `regenerateResponse()` | สถานะ session แชท, อัปโหลด, วงจร SSE |
| `send.js` | ~1000 | `startSSE()`, `processSSEItem()`, `ensureBotEl()`, `renderAccumulatedAnswer()`, `closeBubble()` | ประมวลผล event SSE, เรนเดอร์ bubble |
| `render.js` | ~1000 | `createUserMessageEl()`, `createBotMessageEl()`, `loadHistory()`, `renderStepsHtml()`, `parseAttachmentMarkers()` | DOM ข้อความ, แบ่งหน้าประวัติ, resume |

### 6.3 ตัวแปร State หลัก (ข้ามโมดูล)
| ตัวแปร | โมดูล | ขอบเขต | การเก็บถาวร |
|----------|--------|-------|-------------|
| `currentView` | nav.js | Global | — |
| `routeTab` | router.js | Global | URL |
| `menuDoc` / `menuSaved` | menu.js | Global | localStorage `cow_menu` |
| `currentTheme` | theme.js | Global | localStorage `cow_theme` |
| `authGateOpen` | auth.js | Global | — |
| `sessionId` | state.js | ต่อ session | localStorage `cow_session_id` |
| `activeAgentId` | state.js | ต่อ session | localStorage `cow_active_agent` |
| `activeStreams` | state.js | Global | — |
| `streamBuffers` | state.js | Global | — |
| `pendingAttachments` | state.js | ต่อ session | — |
| `appConfig` | state.js | Global | หน่วยความจำ (จาก `/api/config`) |

### 6.4 เส้นทางการไหลของ Event (เส้นทางสำคัญ)

**การนำทาง:**
```
คลิก Sidebar → handler คลิก nav.js:#sidebar-nav
  → menuOpenItem(id) หรือ navigateTo(viewId, tab)
  → router.js:routeEnterView(view, tab)
  → router.js:_routeWrite(view, tab)
  → nav.js:_switchToView(viewId)
  → แสดง .view#view-{viewId}, ซ่อนตัวอื่น
  → ตัวโหลดเฉพาะวิว (loadConfigView, loadSkillsView, ฯลฯ)
  → menuSyncActive()
```

**การส่งแชท:**
```
คลิก #send-btn → state.js:sendMessage()
  → POST /message {session_id, message, stream, attachments...}
  → เมื่อสำเร็จ: state.js:startSSE(requestId, ...)
  → EventSource /stream?request_id=...
  → send.js:processSSEItem(item) ต่อ event
  → เรนเดอร์ bubble ผ่าน helper ใน render.js
  → เมื่อเสร็จ: closeBubble(), settlePendingTools(), reloadHistoryView()
  → เมื่อยกเลิก: requestCancel() → POST /cancel
```

**Auth Gate:**
```
fetch ใดๆ → auth.js:fetch wrapper ดักจับ 401
  → showLoginScreen()
  → ผู้ใช้ส่งฟอร์ม → POST /auth/login
  → สำเร็จ → openAuthGate() → poller ที่ต่อคิวเริ่มทำงาน
  → initApp() → routeApply() → menuLoad() → knowledge preload
```

---

## 7. API Endpoints (เรียกจาก Frontend)

### 7.1 Auth & Config
| Method | Endpoint | เรียกจาก | หน้าที่ |
|--------|----------|-------------|---------|
| POST | `/auth/login` | auth.js | ล็อกอิน, ตั้ง session cookie |
| POST | `/auth/logout` | auth.js | ออกจากระบบ, ล้าง cookie |
| GET | `/api/version` | auth.js:initApp | ข้อมูลเวอร์ชันแอป |
| GET | `/api/config` | state.js, config view | config เซิร์ฟเวอร์ (โมเดล, limit) |
| GET | `/api/menu` | menu.js:menuLoad | โครงสร้างเมนูที่ผู้ใช้บันทึก |
| POST | `/api/menu` | menu.js (บันทึก) | บันทึกโครงสร้างเมนู |

### 7.2 Chat & Streaming
| Method | Endpoint | เรียกจาก | หน้าที่ |
|--------|----------|-------------|---------|
| POST | `/message` | state.js:sendMessage | ส่งข้อความ, คืน `request_id` |
| GET | `/stream?request_id=` | state.js:startSSE | สตรีม SSE สำหรับคำตอบ |
| POST | `/cancel` | state.js:requestCancel | ยกเลิกคำขอที่กำลังทำงาน |
| POST | `/upload` | state.js:handleFileSelect | อัปโหลดไฟล์/โฟลเดอร์ (multipart) |
| POST | `/api/voice/asr` | state.js:sendVoiceMessage | เสียงเป็นข้อความ |
| POST | `/api/voice/tts` | render.js:manual TTS | ข้อความเป็นเสียง |
| POST | `/api/prompt/optimize` | state.js:optimizePrompt | ปรับปรุง prompt |
| GET | `/api/history` | render.js:loadHistory | ประวัติข้อความแบบแบ่งหน้า |
| POST | `/api/messages/delete` | state.js, render.js | ลบคู่ข้อความ |

### 7.3 Knowledge & Memory
| Method | Endpoint | เรียกจาก | หน้าที่ |
|--------|----------|-------------|---------|
| GET | `/api/knowledge/list` | auth.js:initApp, knowledge view | ต้นไม้ knowledge |
| GET | `/api/knowledge/read` | knowledge view | อ่านเอกสารเดี่ยว |
| POST | `/api/knowledge/save` | knowledge view | สร้าง/อัปเดตเอกสาร |
| POST | `/api/knowledge/delete` | knowledge view | ลบเอกสาร |
| GET | `/api/memory/list` | memory view | ต้นไม้ไฟล์ memory |
| GET | `/api/memory/read` | memory view | อ่านไฟล์ memory |
| POST | `/api/memory/write` | memory view | เขียนไฟล์ memory |

### 7.4 Agents, Skills, Tasks, Channels
| Method | Endpoint | เรียกจาก | หน้าที่ |
|--------|----------|-------------|---------|
| GET | `/api/agents` | agents view | รายการ agent |
| POST | `/api/agents` | agents view | สร้าง agent |
| PUT | `/api/agents/{id}` | agents view | อัปเดต agent |
| DELETE | `/api/agents/{id}` | agents view | ลบ agent |
| GET | `/api/skills` | skills view | รายการ skill |
| POST | `/api/skill/save` | skills view | บันทึก skill |
| GET | `/api/tasks` | tasks view | รายการ task |
| POST | `/api/tasks` | tasks view | สร้าง task |
| GET | `/api/channels` | channels view | รายการ channel |
| POST | `/api/channels` | channels view | เพิ่ม channel |

### 7.5 Artifacts & Logs
| Method | Endpoint | เรียกจาก | หน้าที่ |
|--------|----------|-------------|---------|
| GET | `/api/artifacts` | artifacts view | รายการ artifact (แบ่งหน้า, กรองได้) |
| GET | `/api/artifacts/{id}` | artifacts view | เนื้อหา artifact |
| DELETE | `/api/artifacts/{id}` | artifacts view | ลบ artifact |
| GET | `/api/logs/stream` | logs view | สตรีม log แบบ live (SSE) |

---

## 8. ระบบภาษา (i18n)

### 8.1 ภาษาที่รองรับ (4)
| Code | ป้าย | ชื่อภาษาท้องถิ่น |
|------|-------|-------------|
| `zh-CN` | 简体中文 | จีนตัวย่อ |
| `zh-TW` | 繁體中文 | จีนตัวเต็ม |
| `en` | English | อังกฤษ |
| `th` | ภาษาไทย | ไทย |

### 8.2 การนำไปใช้
- **Translation map:** โหลดจาก `/static/CSJS/js/i18n/{lang}.json` (ผ่าน boot.js)
- **เครื่องหมาย DOM:** `data-i18n="key"` บน text node, `data-i18n-placeholder="key"` บน input
- **Tooltip:** `data-tip-key="key"` → `components.css` แสดงตอน hover
- **Runtime:** `setLanguage(lang)` → อัปเดตทุก `[data-i18n]`, เก็บ `localStorage.cow_lang`, เรียก `syncSidebarTips()`

### 8.3 Namespace i18n หลัก (จากเทมเพลต)
| Namespace | วิวที่ใช้ |
|-----------|-------------|
| `nav_*` | sidebar.html (ป้าย nav ทั้งหมด) |
| `chat_*` | chat.html (ต้อนรับ, composer, action) |
| `config_*` | config.html (แท็บ, การ์ด, ฟิลด์) |
| `skills_*` | skills.html (หมวดหมู่, action) |
| `agents_*` | agents.html (grid, detail, modal) |
| `memory_*` | memory.html (แท็บ, tree, ค้นหา) |
| `knowledge_*` | knowledge.html (tree, editor, action) |
| `channels_*` | channels.html (ชื่อเรื่อง, เพิ่ม, การ์ด) |
| `tasks_*` | tasks.html (แท็บ, ปุ่ม, empty) |
| `logs_*` | logs.html (ชื่อเรื่อง, ตัวกรอง, live) |
| `artifacts_*` | artifacts.html (ตัวกรอง, ค้นหา, action พรีวิว) |
| `theme_*` | theme.html (ชื่อเรื่อง, ตัวเลือก) |
| `common_*` | Global (บันทึก, ยกเลิก, ลบ, ยืนยัน, กำลังโหลด, error) |

---

## 9. Accessibility & Responsive

### 9.1 ARIA & Semantic HTML
| รูปแบบ | การนำไปใช้ |
|---------|----------------|
| Tablist | `role="tablist"` + `role="tab"` + `aria-selected` + `aria-controls` (config, tasks, artifacts, theme) |
| Radiogroup | `role="radiogroup"` + `role="radio"` + `aria-checked` (ตัวเลือกธีม) |
| Dialog/Modal | `role="dialog"` + `aria-modal="true"` + `aria-labelledby` (ทุกโมดัล) |
| Tooltip | `role="tooltip"` ผ่าน `data-tip-key` + CSS `:hover::after` |
| Live Region | `aria-live="polite"` บน `#log-output`, bubble ที่สตรีม |
| Focus Management | โมดัลกัก focus, จัดการ `tabindex` ใน dropdown |
| Landmarks | ใช้ `<nav>`, `<main>`, `<aside>`, `<header>` อย่างถูกต้อง |

### 9.2 Breakpoint แบบ Responsive (Tailwind + Custom)
| Breakpoint | Sidebar | Content | Artifacts Preview | Chat Composer |
|------------|---------|---------|-------------------|---------------|
| `< 640px` (มือถือ) | Drawer (overlay) | เต็มความกว้าง, `pt-14` | ซ่อน (slide-in) | เต็มความกว้าง, ติดล่าง |
| `640-1024px` (แท็บเล็ต) | Rail ย่อ (`w-14`) | `pl-14` | Side panel (ปรับขนาดได้) | Inline |
| `> 1024px` (เดสก์ท็อป) | เต็ม (`w-52`) หรือ rail | `pl-52` หรือ `pl-14` | Side panel | Inline |

### 9.3 การปรับให้เหมาะกับ Touch/มือถือ
- `100dvh` สำหรับความสูง viewport บนมือถือ (base.css)
- เป้าแตะที่เหมาะกับนิ้ว (ขั้นต่ำ 44px)
- ปัดเพื่อปิด drawer บนมือถือ (nav.js)
- จัดการคีย์บอร์ดเสมือน (composer ปรับขนาดอัตโนมัติ)

---

## 10. ผังการไหลของ State

### 10.1 การเริ่มต้นแอป
```
chat.html โหลด
  → Scripts โหลด (defer)
  → DOMContentLoaded
  → boot.js:initApp()
    → auth.js:initApp() → ตรวจ cookie ยืนยันตัวตน
      → ถ้าไม่ยืนยันตัวตน: showLoginScreen() → หยุด
      → ถ้ายืนยันตัวตน: openAuthGate()
        → routeApply() → navigateTo(currentView)
        → menuLoad() → เรนเดอร์ sidebar
        → loadConfigView() / loadSkillsView() / ฯลฯ (lazy)
        → เริ่ม poller เบื้องหลัง (version, knowledge)
```

### 10.2 วงจรชีวิตข้อความแชท
```
ผู้ใช้พิมพ์ → คลิก #send-btn
  → sendMessage() → POST /message
  → เซิร์ฟเวอร์คืน {request_id}
  → startSSE(requestId) → EventSource /stream
  → ต่อ event SSE แต่ละตัว:
      reasoning → renderThinkingHtml() → .thinking-stream-pre
      delta → สะสม → เรนเดอร์เป็นชุด renderAccumulatedAnswer()
      tool_start → renderToolCallsHtml() → .tool-streaming
      tool_progress → อัปเดต .tool-detail
      tool_end → settlePendingTools()
      peer_start/end → สร้าง bot bubble ที่มอบหมาย
      image/video/file/artifact → เรนเดอร์สื่อใน .media-content
      done → closeBubble(), reloadHistoryView()
  → เมื่อยกเลิก: requestCancel() → POST /cancel
```

### 10.3 การสลับวิว
```
navigateTo(view, tab)
  → router.js:routeEnterView(view, tab)
  → router.js:_routeWrite(view, tab) → history.pushState
  → nav.js:_switchToView(viewId)
    → ซ่อน .view ทั้งหมด, แสดง #view-{viewId}
    → อัปเดต breadcrumb (#breadcrumb-group, #breadcrumb-page)
    → เรียกตัวโหลดวิว (loadConfigView, loadSkillsView, ฯลฯ)
    → menuSyncActive() → ไฮไลต์รายการ sidebar
    → router.js:routeNoteTab(view, tab) ถ้าแท็บเปลี่ยน
```

---

## 11. จุดขยาย (สำหรับเพิ่มฟีเจอร์ใหม่)

### 11.1 เพิ่มวิวในระบบใหม่
1. เพิ่มรายการใน `VIEW_META` ที่ `nav.js` + `MENU_BUILTINS` ที่ `menu.js`
2. สร้าง `templates/views/{view}.html` ด้วย `<div id="view-{view}" class="view">`
3. เพิ่ม CSS (ทางเลือก) → include ในลำดับโหลดของ chat.html
4. เพิ่มตัวโหลด JS `load{View}View()` ในโมดูลที่เหมาะสม
5. เรียกตัวโหลดจาก switch case ใน `nav.js:_switchToView()`
6. เพิ่ม i18n keys สำหรับทุกข้อความ `data-i18n`
7. เพิ่ม route path ใน `router.js:ROUTE_PATHS`

### 11.2 เพิ่มโมดัลใหม่
1. สร้าง `templates/modals/{name}.html` ด้วย `.modal-overlay` + `.modal-card`
2. Include ในส่วนโมดัลของ chat.html
3. เพิ่มฟังก์ชัน `show{Name}Modal()` ในโมดูล JS ที่เกี่ยวข้อง
4. เพิ่ม `hide{Name}Modal()` + handler ESC/คลิก overlay
5. เพิ่ม i18n keys

### 11.3 เพิ่มประเภท Event SSE ใหม่
1. เซิร์ฟเวอร์ส่ง event type ใหม่ในสตรีม SSE
2. เพิ่ม case ใน switch ของ `send.js:processSSEItem()`
3. สร้าง helper เรนเดอร์ใน `render.js` ถ้าจำเป็น
4. อัปเดตโครงสร้าง DOM ของ bubble ใน `send.js:ensureBotEl()` ถ้าต้องมีพื้นที่เนื้อหาใหม่

### 11.4 เพิ่มธีมใหม่
1. เพิ่มรายการใน `THEME_OPTIONS` ที่ `theme.js`
2. สร้าง override CSS custom property (inline ใน theme.css ได้ หรือไฟล์ใหม่)
3. เพิ่ม mapping ธีม mermaid ถ้าจำเป็น
4. ธีมจะปรากฏใน theme view อัตโนมัติผ่าน `renderThemeOptions()`

### 11.5 เพิ่มภาษา i18n ใหม่
1. สร้าง `/static/CSJS/js/i18n/{lang}.json` พร้อมทุก key
2. เพิ่ม `<option value="{lang}">` ใน `#language-select` ที่ header.html
3. เพิ่มใน `SUPPORTED_LANGS` ที่ boot.js/i18n loader
4. ทดสอบทุกวิวหาคำแปลที่ขาด

---

## 12. รายการไฟล์ (อ้างอิงด่วน)

### 12.1 เทมเพลต
```
/channel/web/
├── chat.html                                    # Entry (261 บรรทัด)
├── templates/
│   ├── layout/
│   │   ├── header.html                          # 110 บรรทัด
│   │   ├── sidebar.html                         # 159 บรรทัด
│   │   ├── session-panel.html                   # 20 บรรทัด
│   │   └── login.html                           # 33 บรรทัด
│   ├── views/
│   │   ├── chat.html                            # 285 บรรทัด
│   │   ├── config.html                          # 433 บรรทัด
│   │   ├── skills.html                          # 139 บรรทัด
│   │   ├── agents.html                          # 120 บรรทัด
│   │   ├── memory.html                          # 98 บรรทัด
│   │   ├── knowledge.html                       # 144 บรรทัด
│   │   ├── channels.html                        # 23 บรรทัด
│   │   ├── tasks.html                           # ~80 บรรทัด
│   │   ├── logs.html                            # ~60 บรรทัด
│   │   ├── artifacts.html                       # ~120 บรรทัด
│   │   ├── theme.html                           # ~30 บรรทัด
│   │   └── custom.html                          # ~15 บรรทัด
│   └── modals/ (12 ไฟล์)
```

### 12.2 Static Assets
```
/channel/web/static/CSJS/
├── css/ (14 ไฟล์)
│   ├── base.css, sessions.css, components.css, markdown.css
│   ├── chat.css, workspace.css, knowledge.css, agents.css
│   ├── artifacts.css, menu.css, call.css
│   ├── theme-thinking.css, theme-tools.css, theme-aurora.css
└── js/
    ├── core/
    │   ├── nav.js (236), router.js (191), menu.js (297)
    │   ├── theme.js (77), auth.js (178), utils.js (231)
    ├── chat/
    │   ├── state.js (932), send.js (~1000), render.js (~1000)
    ├── workspace.js, call.js, boot.js
    └── i18n/{zh-CN,zh-TW,en,th}.json
```

---

## 13. บันทึกการบำรุงรักษา

### 13.1 ปัญหาที่ทราบ / หนี้ทางเทคนิค
| พื้นที่ | ปัญหา | ความรุนแรง |
|------|-------|----------|
| `send.js` / `render.js` | ไฟล์ถูกตัดในการวิเคราะห์ (~1000+ บรรทัดแต่ละไฟล์) — ต้องอ่านเต็มเพื่อแผนที่สมบูรณ์ | สูง |
| `chat.css` | 1295 บรรทัด — ควรแยกเป็น composer.css, bubbles.css, streaming.css | กลาง |
| `components.css` | 812 บรรทัด — ระบบ dropdown ควรถูกแยกออก | กลาง |
| Sidebar มือถือ | ไม่มีท่าทางปัดเพื่อเปิด (มีแค่แฮมเบอร์เกอร์) | ต่ำ |
| Artifacts preview | Resizer แนวนอนเท่านั้น — ควรมีแนวตั้งสำหรับพรีวิวสูง? | ต่ำ |
| i18n | คำแปลไทยยังไม่ครบในบางวิว | กลาง |

### 13.2 การ Refactor ที่แนะนำ
1. **แยก `chat.css`** → composer, bubbles, streaming, popovers, timeline
2. **แยกระบบ dropdown** → `dropdown.js` + `dropdown.css` (ปัจจุบันอยู่ใน components.css + inline ในเทมเพลต)
3. **รวมระบบโมดัล** → คลาส `Modal` เดียวแทน 12 การ implement แบบ inline
4. **Virtualize รายการยาว** → artifacts timeline, memory tree, knowledge tree (ปัจจุบันเป็น DOM เต็ม)
5. **เพิ่ม TypeScript** → มี JSDoc type แต่ไม่มีการตรวจสอบตอนคอมไพล์

---

## 14. เริ่มต้นอย่างรวดเร็วสำหรับนักพัฒนา

### 14.1 รันในเครื่อง
```bash
cd /data/data/com.termux/files/home/NovaAgent-Terminal
python3 -m channel.web.web_channel  # เริ่มที่ :9899
# หรือใช้ process ที่มีอยู่บน :9899
```

### 14.2 ไฟล์หลักที่ต้องแก้สำหรับงานทั่วไป
| งาน | ไฟล์ที่ต้องแก้ |
|------|---------------|
| เพิ่มรายการ sidebar | `nav.js:VIEW_META`, `menu.js:MENU_BUILTINS`, `sidebar.html` |
| วิวใหม่ | `templates/views/{view}.html`, `nav.js`, `router.js`, CSS |
| โมดัลใหม่ | `templates/modals/{name}.html`, โมดูล JS ที่เกี่ยวข้อง |
| เปลี่ยนสี | `chat.html` tailwind.config + CSS custom properties ใน base.css |
| เพิ่ม i18n key | ทุกเทมเพลต + `/static/CSJS/js/i18n/*.json` |
| Event SSE ใหม่ | `send.js:processSSEItem()`, helper ใน `render.js` |
| ธีมใหม่ | `theme.js:THEME_OPTIONS`, override CSS |

### 14.3 เคล็ดลับการดีบัก
- **ดู state ปัจจุบัน:** `console.log({currentView, routeTab, menuDoc, activeStreams})`
- **บังคับ auth gate:** `authGateOpen = false; showLoginScreen()`
- **ตรวจ SSE:** แท็บ Network → `/stream?request_id=...` → EventStream
- **สลับธีม:** `setTheme('aurora')` ใน console
- **Dump เมนู:** `console.log(menuDoc)`

---

**สิ้นสุด UI_MAP.md** — เอกสารนี้เป็นแหล่งความจริงเดียวสำหรับ UI ของ NovaAgent Web Console อัปเดตเมื่อเพิ่ม/แก้ไขวิว, คอมโพเนนต์, state หรือ API
