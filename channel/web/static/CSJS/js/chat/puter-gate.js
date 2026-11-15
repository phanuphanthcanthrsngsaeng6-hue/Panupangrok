/* Puter gate — ล็อกอิน Puter อัตโนมัติเมื่อเริ่มแชทครั้งแรก
 *
 * หลักการ (จาก PUTER_REFERENCE.md):
 *  - puter.auth.signIn() ต้องถูกเรียกจาก user gesture (click) เท่านั้น
 *    ไม่งั้น browser จะบล็อก popup → error 'popup_blocked'
 *  - Puter ไม่มี getToken() และไม่มี server-side OAuth → เรียก puter.ai.chat()
 *    จากเบราว์เซอร์โดยตรง ผู้ใช้จ่ายเครดิตเอง (User-Pays Model)
 *
 * ลำดับการทำงาน:
 *  1. ตรวจ puter.auth.isSignedIn()
 *  2. ถ้ายังไม่ล็อกอิน → แสดงแบนเนอร์ "เชื่อมต่อ Puter"
 *  3. ผู้ใช้คลิก → signIn() → popup
 *  4. สำเร็จ → บันทึกสถานะ + ใช้ puter.ai.chat() ได้ทันที
 */

const PuterGate = (() => {
    let signedIn = false;
    let user = null;
    let gateEl = null;

    function _t(th, en) {
        const lang = (typeof currentLang !== 'undefined' ? currentLang : 'th');
        return lang === 'en' ? en : th;
    }

    function _sdkReady() {
        return typeof puter !== 'undefined' && puter.auth;
    }

    /* ใช้ element ที่วางไว้ในหน้า (ไม่สร้างปุ่มลอย) */
    function _el() {
        if (!gateEl) gateEl = document.getElementById('puter-gate');
        return gateEl;
    }

    function _render() {
        const el = _el();
        if (!el) return;
        if (!_sdkReady() || signedIn) {
            el.classList.add('hidden');
            return;
        }
        el.classList.remove('hidden');
        const msg = el.querySelector('#puter-gate-msg');
        const btn = el.querySelector('#puter-gate-btn');
        if (msg) msg.textContent =
            _t('เชื่อมต่อ Puter เพื่อใช้โมเดล AI (ไม่ต้องมี API key)',
               'Connect Puter to use AI models (no API key needed)');
        if (btn && !btn.__bound) {
            btn.__bound = true;
            btn.textContent = _t('ล็อกอิน Puter', 'Sign in with Puter');
            btn.addEventListener('click', () => { signIn(); });
        }
    }

    async function refresh() {
        if (!_sdkReady()) {
            signedIn = false;
            _render();
            return false;
        }
        try {
            signedIn = !!puter.auth.isSignedIn();
            if (signedIn) {
                try { user = await puter.auth.getUser(); } catch (_) {}
            }
        } catch (_) {
            signedIn = false;
        }
        _render();
        return signedIn;
    }

    async function signIn() {
        if (!_sdkReady()) {
            console.warn('[PuterGate] SDK ยังไม่โหลด');
            return false;
        }
        try {
            await puter.auth.signIn();
            await refresh();
            if (signedIn) {
                console.log('[PuterGate] ล็อกอินสำเร็จ:', user && (user.username || user.email));
                if (window.showToast) showToast(_t('เชื่อมต่อ Puter สำเร็จ', 'Connected to Puter'));
            }
            return signedIn;
        } catch (e) {
            const code = (e && (e.error || e.code)) || '';
            console.warn('[PuterGate] signIn ล้มเหลว:', code, e && e.msg);
            if (code === 'popup_blocked') {
                alert(_t('Popup ถูกบล็อก — กรุณาอนุญาต popup แล้วคลิกอีกครั้ง',
                         'Popup blocked — allow popups and click again'));
            } else if (code === 'auth_window_closed') {
                // ผู้ใช้ยกเลิกเอง ไม่ต้องแจ้ง
            } else {
                console.warn('[PuterGate] error:', e);
            }
            return false;
        }
    }

    async function signOut() {
        if (!_sdkReady()) return;
        try { await puter.auth.signOut(); } catch (_) {}
        signedIn = false;
        user = null;
        _render();
    }

    /* เรียก puter.ai.chat() — ใช้ได้หลังล็อกอินเท่านั้น */
    async function chat(prompt, options = {}) {
        if (!_sdkReady()) throw new Error('puter SDK not loaded');
        if (!signedIn) {
            const ok = await signIn();
            if (!ok) throw new Error('not signed in to Puter');
        }
        return puter.ai.chat(prompt, options);
    }

    /* เรียกแบบสตรีม — คืน async iterable */
    async function chatStream(prompt, options = {}) {
        return chat(prompt, Object.assign({}, options, { stream: true }));
    }

    function isSignedIn() { return signedIn; }
    function getUser() { return user; }

    /* แสดงแบนเนอร์เมื่อผู้ใช้เริ่มพิมพ์/โฟกัสช่องแชทครั้งแรก */
    function arm() {
        const input = document.getElementById('chat-input');
        if (!input || input.__puterArmed) return;
        input.__puterArmed = true;
        const trigger = () => { refresh(); };
        input.addEventListener('focus', trigger, { once: true });
    }

    document.addEventListener('DOMContentLoaded', () => {
        // element ในหน้าโหลดพร้อม view-chat แล้ว — รอเล็กน้อยให้ SDK พร้อม
        setTimeout(() => { refresh(); arm(); }, 600);
    });
    // view-chat ถูกสร้าง/สลับได้ภายหลัง → เผื่อ refresh อีกครั้งหลัง boot
    window.addEventListener('load', () => setTimeout(refresh, 1500));

    return { refresh, signIn, signOut, chat, chatStream, isSignedIn, getUser, arm };
})();

window.PuterGate = PuterGate;