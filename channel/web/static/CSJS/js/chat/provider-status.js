/* Read-only provider health and Manus balance for the mobile-first composer. */

function _providerStatusCard(id, info, extra) {
    const card = document.getElementById(`provider-status-${id}`);
    if (!card) return;
    const state = info && info.status ? info.status : 'error';
    const labels = {
        ready: 'พร้อมใช้งาน',
        login_expired: 'ต้องล็อกอินใหม่',
        quota_exceeded: 'โควตาเต็ม',
        unavailable: 'เชื่อมต่อไม่ได้',
        error: 'ตรวจสอบไม่สำเร็จ',
    };
    card.classList.remove('is-loading', 'is-ready', 'is-error', 'is-muted');
    card.classList.add(state === 'ready' ? 'is-ready' : 'is-error');
    const title = card.querySelector('strong');
    const message = card.querySelector('small');
    if (title) title.textContent = id === 'codex' ? 'GPT / Codex' : 'Manus';
    if (message) message.textContent = extra || (info && info.message) || labels[state] || state;
    const dot = card.querySelector('.provider-status-dot');
    if (dot) dot.setAttribute('aria-label', labels[state] || state);
}

function _formatProviderCredit(value) {
    if (value === null || value === undefined || value === '') return 'ไม่พบข้อมูลเครดิต';
    if (typeof value === 'object') {
        for (const key of ['availableCredits', 'available_credits', 'credits', 'balance']) {
            if (value[key] !== undefined) return _formatProviderCredit(value[key]);
        }
        return 'มีข้อมูลเครดิต';
    }
    return `คงเหลือ ${String(value)}`;
}

function _latestManusUsage(payload) {
    const usage = payload && payload.recent_usage;
    const rows = Array.isArray(usage) ? usage : (usage && (usage.data || usage.items));
    if (!Array.isArray(rows) || !rows.length) return '';
    const row = rows[0] || {};
    const actual = row.credit_usage ?? row.creditUsage;
    return actual === undefined ? '' : `ใช้จริงล่าสุด ${String(actual)}`;
}

async function refreshProviderStatus() {
    const refresh = document.getElementById('provider-status-refresh');
    if (refresh) refresh.classList.add('is-spinning');
    try {
        const response = await fetch('/api/provider-status', { cache: 'no-store' });
        const data = await response.json();
        if (data.status !== 'success') throw new Error(data.message || 'status unavailable');
        _providerStatusCard('codex', data.providers && data.providers.codex);
        const manus = data.providers && data.providers.manus;
        const credit = manus && manus.status === 'ready'
            ? `${_formatProviderCredit(manus.available_credits_value ?? manus.available_credits)}${_latestManusUsage(manus) ? ` · ${_latestManusUsage(manus)}` : ''}`
            : null;
        _providerStatusCard('manus', manus, credit);
    } catch (error) {
        _providerStatusCard('codex', { status: 'error', message: 'อ่านสถานะ Provider ไม่ได้' });
        _providerStatusCard('manus', { status: 'error', message: 'อ่านเครดิต Manus ไม่ได้' });
    } finally {
        if (refresh) refresh.classList.remove('is-spinning');
    }
}

window.refreshProviderStatus = refreshProviderStatus;
