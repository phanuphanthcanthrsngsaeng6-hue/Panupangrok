# PanupanGrok

โปรเจกต์นี้เป็น **curated build** ที่คัดเฉพาะแหล่งโค้ดหลักชุดเดียว เพื่อลดไฟล์ซ้ำและป้องกันการสั่งงานสับสน

## หลักการรวมทรัพยากร

- แหล่ง runtime canonical: โค้ดจาก `NovaAgent-Brandable` เพียงชุดเดียว
- แบรนด์ canonical: `branding/brand_config.json`
- config template canonical: `config/config.template.json`
- test canonical: `tests/`
- quality gate canonical: `scripts/quality_gate.sh`
- ไม่คัดลอก secrets, runtime state, logs, database, credentials หรือ `.git`

## ติดตั้ง

```bash
python -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
```

## ตั้งค่าและรัน

```bash
cp config/config.template.json config/config.json
BRAND_NAME=PanupanGrok python app.py
```

เติมค่า provider/token เฉพาะในเครื่อง ห้าม commit ไฟล์จริง

## ตรวจคุณภาพ

```bash
bash scripts/quality_gate.sh
```
