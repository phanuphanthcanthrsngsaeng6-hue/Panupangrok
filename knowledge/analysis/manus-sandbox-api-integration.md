# เชื่อม NovaAgent กับ Manus sandbox/task ผ่าน API

> Source: https://open.manus.ai/docs/v2/task.create, https://open.manus.ai/docs/v2/task.sendMessage, https://open.manus.ai/docs/v2/task.listMessages, https://open.manus.ai/docs/v2/artifacts, https://open.manus.ai/docs/v2/attachments

Manus API v2 แยกการสร้างงานใหม่กับการทำงานต่อบน sandbox/task เดิม:

- `POST /v2/task.create` สร้าง task/sandbox ใหม่แบบ asynchronous
- `POST /v2/task.sendMessage` ส่งข้อความติดตามไปยัง task ที่มีอยู่แล้ว โดยใช้ `task_id` ของ task นั้น
- `GET /v2/task.detail` ตรวจสถานะ และ `GET /v2/task.listMessages` อ่านเหตุการณ์ ผลลัพธ์ และ attachments

URL ของ task มีรูปแบบ `https://manus.im/app/{task_id}`; ID ท้าย URL ของผู้ใช้ `XDmwoSwonkSpEbYhBLsH7r` มีรูปแบบ task ID 22 ตัวอักษรที่เอกสารกำหนด แต่ยังต้องใช้ credential ที่มีสิทธิ์เพื่อยืนยันการเข้าถึงจริง

## ส่งคำสั่งเข้า sandbox เดิม

ใช้ `task.sendMessage` กับ task ID เดิม ไม่ใช่สร้าง task ใหม่ และไม่ใช้ `agent-default-main_task` ซึ่งเป็น shortcut สำหรับ agent main task โดยเฉพาะ การเรียก task เดิมต้องมี API key หรือ OAuth ที่มี scope/สิทธิ์เหมาะสม; API key ให้ full access ส่วน OAuth `create_task` จำกัดการมองเห็น task ของตัวเอง

อีกทางคือส่ง `message.task_references: [task_id]` ให้ `task.create` ใหม่ เพื่อให้ agent อ่านงานเดิมและไฟล์ได้ on-demand แต่ไม่ได้เท่ากับการสั่ง process ใน sandbox เดิมต่อ

## ดึงผลและไฟล์

- `task.listMessages` คืน `assistant_message.content` และ `attachments[]`; ใช้ `attachments[].url` ซึ่งเป็น URL ดาวน์โหลด HTTPS ชั่วคราว พร้อมจับคู่ `attachments[].path` กับ path ที่เนื้อหาคำตอบอ้างถึง
- ห้ามดาวน์โหลด `attachments[].path` โดยตรง เพราะเป็น path ภายใน runtime ของ task
- URL ลงนามมีอายุจำกัด; ขอ `task.listMessages` ใหม่เพื่อ URL สดเมื่อ URL หมดอายุ
- `GET /v2/artifact.list` แสดง generated outputs ใน Manus Library แต่ไม่รวม input files ชั่วคราวจาก `file.upload`
- `GET /v2/file.detail` ใช้กับไฟล์ที่เคยอัปโหลดเข้า API; ถ้า status เป็น uploaded จะได้ `download_url` ชั่วคราว (ไม่ใช่วิธีค้นหาไฟล์ใน sandbox)

## ขอบเขตที่ยืนยันได้

API เปิดให้คุยกับ task ที่ได้รับอนุญาตและอ่านผล/attachments ได้ แต่เอกสารไม่ระบุ endpoint สำหรับเปิด shell หรือ mount filesystem ของ sandbox โดยตรง การส่งคำสั่งให้ task ทำงานแล้วรับไฟล์ผลลัพธ์จึงเป็นทางเชื่อมที่รองรับ ไม่ใช่การเข้าถึง shell โดยตรง

## สถานะการตรวจ

ตรวจเอกสารสาธารณะและไฟล์ bridge ที่แนบ; ไม่ได้เรียก API, ส่ง task, ดาวน์โหลดไฟล์จากบัญชี หรือยืนยันสิทธิ์กับ task จริง เพราะไม่มี credential/profile ที่ตั้งค่าใน runtime ระหว่างการตรวจ
