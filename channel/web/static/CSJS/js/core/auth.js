/* Login screen, logout, and the 401 handling around fetch.
   Split out of console.js. These are classic scripts sharing one global
   scope; see channel/web/README.md before changing the load order. */

// =====================================================================
// Authentication
// =====================================================================
// Auth gate for background pollers. When a web_password is set, the /poll and
// /api/scheduler/runs loops must NOT run before the user logs in — otherwise
// they fire every few seconds with no cookie and spam the server log with
// "401 Unauthorized (credentials offered: none)". Both loops call
// requestAuthGatedStart(); the actual start is deferred until the login/auth
// check opens the gate via openAuthGate(). When no password is set the gate is
// opened immediately at startup so behavior is unchanged.
// This file loads after the pollers define their loops but before boot.js, the
// only caller that runs at load time, so the declarations are always in scope.
let authGateOpen = false;
const _pendingAuthGatedStarts = [];
function requestAuthGatedStart(fn) {
    if (authGateOpen) { fn(); return; }
    _pendingAuthGatedStarts.push(fn);
}
function openAuthGate() {
    if (authGateOpen) return;
    authGateOpen = true;
    while (_pendingAuthGatedStarts.length) {
        const fn = _pendingAuthGatedStarts.shift();
        try { fn(); } catch (_) {}
    }
}

function toggleLoginPassword() {
    const input = document.getElementById('login-password');
    const icon = document.querySelector('#login-toggle-pwd i');
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.replace('fa-eye-slash', 'fa-eye');
    }
}
window.toggleLoginPassword = toggleLoginPassword;

function showLoginScreen() {
    const overlay = document.getElementById('login-overlay');
    if (!overlay) return;
    overlay.classList.remove('hidden');
    document.getElementById('app').classList.add('hidden');

    const subtitle = document.getElementById('login-subtitle');
    const loginBtn = document.getElementById('login-btn');
    const switchBtn = document.getElementById('login-switch-mode');
    const userWrap = document.getElementById('login-username-wrap');
    const confirmWrap = document.getElementById('login-confirm-wrap');
    const errEl = document.getElementById('login-error');
    const pwdInput = document.getElementById('login-password');
    const userInput = document.getElementById('login-username');
    const confirmInput = document.getElementById('login-confirm');
    const form = document.getElementById('login-form');

    let mode = 'login';   // 'login' | 'register'

    function renderMode() {
        errEl.classList.add('hidden');
        if (mode === 'login') {
            subtitle.textContent = currentLang === 'en' ? 'Sign in to the console' : 'กรุณาเข้าสู่ระบบ';
            loginBtn.textContent = currentLang === 'en' ? 'Sign in' : 'เข้าสู่ระบบ';
            switchBtn.textContent = currentLang === 'en' ? 'Create a new account' : 'สมัครผู้ใช้ใหม่';
            confirmWrap.classList.add('hidden');
            userWrap.classList.remove('hidden');
            userInput.placeholder = currentLang === 'en' ? 'Username (blank = root)' : 'ชื่อผู้ใช้ (เว้นว่าง = root)';
        } else {
            subtitle.textContent = currentLang === 'en' ? 'Create a new account' : 'สมัครผู้ใช้ใหม่';
            loginBtn.textContent = currentLang === 'en' ? 'Create account' : 'สมัครสมาชิก';
            switchBtn.textContent = currentLang === 'en' ? 'Back to sign in' : 'กลับไปเข้าสู่ระบบ';
            confirmWrap.classList.remove('hidden');
            userWrap.classList.remove('hidden');
            userInput.placeholder = currentLang === 'en' ? 'Username (1-32 chars)' : 'ชื่อผู้ใช้ (1-32 ตัว)';
        }
    }

    switchBtn.onclick = () => {
        mode = mode === 'login' ? 'register' : 'login';
        renderMode();
        (mode === 'register' ? userInput : pwdInput).focus();
    };

    renderMode();
    pwdInput.value = '';
    userInput.value = '';
    confirmInput.value = '';
    pwdInput.focus();

    form.onsubmit = function(e) {
        e.preventDefault();
        const username = (userInput.value || '').trim();
        const pwd = pwdInput.value;
        if (!pwd) return;
        errEl.classList.add('hidden');

        if (mode === 'register') {
            if (!username) { showErr('กรุณาใส่ชื่อผู้ใช้', 'Enter a username'); return; }
            if (pwd.length < 4) { showErr('รหัสผ่านต้องอย่างน้อย 4 ตัว', 'Password must be at least 4 characters'); return; }
            if (pwd !== confirmInput.value) { showErr('รหัสผ่านไม่ตรงกัน', 'Passwords do not match'); return; }
            loginBtn.disabled = true;
            fetch('/auth/register', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({username, password: pwd})
            }).then(r => r.json()).then(data => {
                loginBtn.disabled = false;
                if (data.status === 'success') {
                    mode = 'login';
                    renderMode();
                    pwdInput.value = '';
                    confirmInput.value = '';
                    userInput.value = data.username || username;
                    errEl.classList.add('hidden');
                    pwdInput.focus();
                    // แจ้งผลด้วย toast สั้นๆ
                    if (window.showToast) showToast('สมัครสำเร็จ — เข้าสู่ระบบได้เลย');
                } else {
                    errEl.textContent = data.message || 'สมัครไม่สำเร็จ';
                    errEl.classList.remove('hidden');
                }
            }).catch(() => {
                loginBtn.disabled = false;
                errEl.textContent = 'เน็ตผิดพลาด กรุณาลองใหม่';
                errEl.classList.remove('hidden');
            });
            return false;
        }

        // ---- login ----
        loginBtn.disabled = true;
        fetch('/auth/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username: username, password: pwd})
        }).then(r => r.json()).then(data => {
            loginBtn.disabled = false;
            if (data.status === 'success') {
                overlay.classList.add('hidden');
                document.getElementById('app').classList.remove('hidden');
                const logoutBtn = document.getElementById('logout-btn-header');
                if (logoutBtn) logoutBtn.classList.remove('hidden');
                window.__identity = data.identity || 'root';
                openAuthGate();
                initApp();
            } else {
                errEl.textContent = currentLang === 'en'
                    ? (data.message || 'Wrong credentials')
                    : (data.message || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
                errEl.classList.remove('hidden');
                pwdInput.value = '';
                pwdInput.focus();
            }
        }).catch(() => {
            loginBtn.disabled = false;
            errEl.textContent = 'เน็ตผิดพลาด กรุณาลองใหม่';
            errEl.classList.remove('hidden');
        });
        return false;
    };

    function showErr(th, en) {
        errEl.textContent = currentLang === 'en' ? en : th;
        errEl.classList.remove('hidden');
    }
}

function handleLogout() {
    fetch('/auth/logout', {
        method: 'POST'
    }).then(r => r.json()).then(data => {
        if (data.status === 'success') {
            window.location.reload();
        }
    }).catch(() => {
        window.location.reload();
    });
}
window.handleLogout = handleLogout;

// Intercept 401 responses globally to show login screen on session expiry
const _originalFetch = window.fetch;
window.fetch = function(...args) {
    return _originalFetch.apply(this, args).then(response => {
        if (response.status === 401) {
            const url = typeof args[0] === 'string' ? args[0] : (args[0]?.url || '');
            if (!url.startsWith('/auth/')) {
                showLoginScreen();
            }
        }
        return response;
    });
};

function initApp() {
    applyI18n();
    menuLoad();
    _applyInputTooltips();
    _restoreSessionPanel();
    refreshWorkspaceSelector();
    refreshSessionSettings();

    fetch('/api/knowledge/list').then(r => r.json()).then(data => {
        if (data.status === 'success') {
            _knowledgeTreeData = data.tree || [];
            _knowledgeRootFiles = data.root_files || [];
        }
    }).catch(() => {});

    fetch('/api/version').then(r => r.json()).then(data => {
        APP_VERSION = `v${data.version}`;
        UPDATE_META = {
            version: data.version || '',
            install_kind: data.install_kind || 'unknown',
            update_supported: !!data.update_supported,
            unsupported_reason: data.unsupported_reason || ''
        };
        _setSidebarVersionLabel(APP_VERSION);
    }).catch(() => {
        _setSidebarVersionLabel('');
    });
    chatInput.focus();
    // Last, and only from here: initApp() runs once auth has settled, on all
    // three paths into the app. Opening the routed view any earlier would
    // switch views behind the login overlay.
    routeApply();
}

