import { M as A, a as O, b as S } from "../../chunks/hostSurface-DyLQqBF-.js";
import { c as b } from "../../chunks/runtime.browser-BThva-we.js";
import { w as H } from "../../chunks/widgetTag-eqiR3RxC.js";
const I = 2;
function m(t) {
  if (typeof t != "object" || t === null || Array.isArray(t)) return !1;
  const e = Object.getPrototypeOf(t);
  return e === Object.prototype || e === null;
}
function f(t, e) {
  if (!t) return;
  const o = e.split(".");
  let r = t;
  for (const i of o) {
    if (!m(r) || !Object.prototype.hasOwnProperty.call(r, i))
      return;
    r = r[i];
  }
  return r;
}
function T(t, e) {
  if (Object.is(t, e)) return !1;
  if (m(t) && m(e)) {
    const o = Object.keys(t), r = Object.keys(e);
    if (o.length !== r.length) return !0;
    for (const i of o)
      if (!Object.prototype.hasOwnProperty.call(e, i) || !Object.is(t[i], e[i]))
        return !0;
    return !1;
  }
  return !0;
}
function N(t) {
  if (typeof t != "string" || t.length === 0) return !1;
  const e = t.split(".");
  return e.length > I ? !1 : e.every((o) => o.length > 0);
}
function V(t) {
  let e = t;
  const o = /* @__PURE__ */ new Set(), r = (i, n, s) => {
    try {
      i.handler(n, s);
    } catch (c) {
      setTimeout(() => {
        throw c;
      }, 0);
    }
  };
  return {
    get state() {
      return e;
    },
    watch(i, n) {
      const s = i.filter((l) => N(l) ? !0 : (console.warn(`[addon-state-watcher] dropped invalid watch key: ${l}`), !1)), c = { keys: s, handler: n };
      if (o.add(c), e !== void 0) {
        const l = s.map((a) => ({
          key: a,
          value: f(e, a),
          previous: void 0
        }));
        l.length > 0 && r(c, l, e);
      }
      return () => {
        o.delete(c);
      };
    },
    setState(i) {
      const n = e;
      e = i;
      for (const s of [...o]) {
        if (!o.has(s))
          continue;
        const c = [];
        for (const l of s.keys) {
          const a = f(n, l), d = f(i, l);
          T(a, d) && c.push({ key: l, value: d, previous: a });
        }
        c.length > 0 && r(s, c, i);
      }
    },
    clear() {
      o.clear();
    }
  };
}
async function F(t) {
  const e = t.now ?? Date.now, o = t.sleep ?? ((n) => new Promise((s) => setTimeout(s, n))), r = e() + 1320 * 1e3;
  let i = t.versionId;
  for (; e() < r; ) {
    const n = await t.request({ format: t.format, versionId: i });
    if (i && n.versionId && n.versionId !== i)
      throw new Error("export_version_changed");
    if (n.status !== "converting") return n;
    if (i = i || n.versionId, !i) throw new Error("export_version_missing");
    await o(2e3);
  }
  throw new Error("export_conversion_timeout");
}
const w = {
  /** 点击任一导出项（下载或网盘投递）。 */
  exportClick: "slides_export_click",
  /** 导出失败或用户取消。由实际执行导出的一方上报。 */
  exportFailed: "slides_export_failed"
};
function P(t) {
  return t === "html" || t === "image" || t === "pptx" ? t : void 0;
}
function E(t) {
  const e = {};
  for (const [o, r] of Object.entries(t))
    r != null && (typeof r == "string" && r === "" || typeof r == "number" && !Number.isFinite(r) || (e[o] = r));
  return e;
}
function U(t) {
  return E({
    deck_kind: "addon",
    resource_id: t.resourceId,
    version_id: t.versionId,
    slides_mode: P(t.slidesMode),
    page_count: t.pageCount
  });
}
function Z() {
  const t = globalThis.crypto;
  return t && typeof t.randomUUID == "function" ? t.randomUUID() : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
    const o = Math.random() * 16 | 0;
    return (e === "x" ? o : o & 3 | 8).toString(16);
  });
}
const x = 200, R = [
  [/\bhttps?:\/\/[^\s"'<>]+/gi, "<url>"],
  [/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "<email>"],
  [/\bbearer\s+[A-Za-z0-9._~+/-]+=*/gi, "<secret>"],
  [/\b(access_token|refresh_token|id_token|token|key|signature|sig|code|password)=[^\s&,;]+/gi, "$1=<secret>"],
  [/"[^"]*"|'[^']*'|“[^”]*”|‘[^’]*’/g, "<quoted>"],
  [/[^\s/\\"'<>]+\.(pptx?|pdf|docx?|xlsx?|key|csv|txt|md|png|jpe?g|gif|zip)\b/gi, "<file>"],
  [/\b(?=[A-Za-z_-]*\d)[A-Za-z0-9_-]{8,}\b/g, "<id>"]
];
function j(t) {
  if (!t) return;
  let e = t;
  for (const [o, r] of R)
    e = e.replace(o, r);
  if (e = e.replace(/\s+/g, " ").trim(), !!e)
    return e.length > x ? e.slice(0, x) : e;
}
function $(t) {
  return t instanceof Error ? t.message : typeof t == "string" ? t : "";
}
function G(t, e) {
  if (t && typeof t == "object")
    for (const r of ["status", "httpStatus", "statusCode"]) {
      const i = t[r];
      if (typeof i == "number" && i >= 100 && i <= 599) return i;
    }
  const o = /\bHTTP\s+(\d{3})\b/i.exec(e);
  return o ? Number(o[1]) : void 0;
}
function z(t) {
  if (t === 401) return "auth_expired";
  if (t === 403) return "permission_denied";
  if (t === 404) return "not_found";
  if (t === 408 || t === 504) return "timeout";
  if (t === 413) return "file_too_large";
  if (t === 429) return "rate_limited";
  if (t === 507) return "quota_exceeded";
  if (t >= 500) return "server_error";
}
const B = {
  export_conversion_timeout: "timeout",
  export_resource_changed: "resource_changed",
  export_version_changed: "resource_changed",
  export_card_disconnected: "resource_changed",
  export_download_url_missing: "server_error",
  export_version_missing: "server_error"
};
function q(t) {
  const e = $(t), o = G(t, e), r = B[e.trim()];
  let i = r ?? "unknown";
  if (!r) {
    const n = t instanceof Error ? t.name : "", s = o ? z(o) : void 0;
    n === "AbortError" ? i = "user_canceled" : s ? i = s : n === "TimeoutError" || /time(d)?\s?out/i.test(e) || /^Host did not acknowledge /.test(e) ? i = "timeout" : /network|failed to fetch|load failed|offline/i.test(e) && (i = "network");
  }
  return {
    errorType: i,
    errorMessage: j(e),
    httpStatus: o
  };
}
function W(t, e, o = L) {
  return { attemptId: Z(), source: t, exportType: e, startedAt: o() };
}
function D(t) {
  return {
    source: t.source,
    export_type: t.exportType,
    export_attempt_id: t.attemptId
  };
}
function K(t, e, o, r = L) {
  const i = q(o);
  return E({
    ...D(t),
    failure_stage: e,
    error_type: i.errorType,
    error_message: i.errorMessage,
    http_status: i.httpStatus,
    duration_ms: Math.max(0, Math.round(r() - t.startedAt))
  });
}
function L() {
  return typeof performance < "u" && typeof performance.now == "function" ? performance.now() : Date.now();
}
const Y = O, X = /* @__PURE__ */ new Set([
  "google_slides",
  "google_drive",
  "onedrive_personal",
  "onedrive_business"
]);
function J(t) {
  return X.has(t);
}
const y = H("manus-slides--chat-slide-card", import.meta.url), Q = 1280, ee = 720, te = "manus-slides:chat-slide-card-cover-ready", re = `<svg class="icon icon-light" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width="27" height="27" aria-hidden="true">
  <rect x="2.5" y="2.5" width="27" height="27" rx="6" fill="url(#chat-slide-card-cover-light)"/>
  <path d="M12.9529 12.3438V11.2875C12.9529 10.749 13.3894 10.3125 13.9279 10.3125H18.0716C18.6101 10.3125 19.0466 10.749 19.0466 11.2875V12.3438" stroke="#767676" stroke-width="1.21875" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M11.7344 14.7803V13.5615C11.7344 12.8884 12.28 12.3428 12.9531 12.3428H19.0469C19.72 12.3428 20.2656 12.8884 20.2656 13.5615V14.7803" stroke="#ADADAD" stroke-width="1.21875" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M20.2656 14.7803H11.7344C11.0613 14.7803 10.5156 15.3259 10.5156 15.999V20.874C10.5156 21.5471 11.0613 22.0928 11.7344 22.0928H20.2656C20.9387 22.0928 21.4844 21.5471 21.4844 20.874V15.999C21.4844 15.3259 20.9387 14.7803 20.2656 14.7803Z" stroke="white" stroke-width="1.21875" stroke-linecap="round" stroke-linejoin="round"/>
  <defs>
    <linearGradient id="chat-slide-card-cover-light" x1="25.7031" y1="2.5" x2="7.5625" y2="27.8125" gradientUnits="userSpaceOnUse">
      <stop stop-color="#3E3E3E"/>
      <stop offset="1" stop-color="#1A1A19"/>
    </linearGradient>
  </defs>
</svg>`, oe = `<svg class="icon icon-dark" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width="27" height="27" aria-hidden="true">
  <rect x="2.5" y="2.5" width="27" height="27" rx="6" fill="url(#chat-slide-card-cover-dark)"/>
  <path d="M12.9529 12.3438V11.2875C12.9529 10.749 13.3894 10.3125 13.9279 10.3125H18.0716C18.6101 10.3125 19.0466 10.749 19.0466 11.2875V12.3438" stroke="#ADADAD" stroke-width="1.21875" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M11.7346 14.7803V13.5615C11.7346 12.8884 12.2803 12.3428 12.9534 12.3428H19.0471C19.7202 12.3428 20.2659 12.8884 20.2659 13.5615V14.7803" stroke="#767676" stroke-width="1.21875" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M20.2656 14.7793H11.7344C11.0613 14.7793 10.5156 15.3249 10.5156 15.998V20.873C10.5156 21.5461 11.0613 22.0918 11.7344 22.0918H20.2656C20.9387 22.0918 21.4844 21.5461 21.4844 20.873V15.998C21.4844 15.3249 20.9387 14.7793 20.2656 14.7793Z" stroke="#34322D" stroke-width="1.21875" stroke-linecap="round" stroke-linejoin="round"/>
  <defs>
    <linearGradient id="chat-slide-card-cover-dark" x1="25.7031" y1="2.5" x2="7.5625" y2="27.8125" gradientUnits="userSpaceOnUse">
      <stop stop-color="white"/>
      <stop offset="1" stop-color="#BFBFBF"/>
    </linearGradient>
  </defs>
</svg>`, ie = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18" aria-hidden="true">
  <circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>
</svg>`, ne = `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width="20" height="20" aria-hidden="true">
  <path d="M3.55566 26.8889C3.55566 28.6071 4.94856 30 6.66678 30H25.3334C27.0517 30 28.4446 28.6071 28.4446 26.8889V9.77778L20.6668 2H6.66678C4.94856 2 3.55566 3.39289 3.55566 5.11111V26.8889Z" fill="var(--chat-slide-card-ppt-fill, #F35F4F)"/>
  <path d="M20.667 6.66647C20.667 8.38469 22.0599 9.77759 23.7781 9.77759H28.4448L20.667 1.99981V6.66647Z" fill="#FD8C80"/>
  <g opacity="0.9">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M14.1811 24.3398V20.3133H16.4864C18.8419 20.3133 20.3829 18.7712 20.3829 16.4974C20.3829 14.2332 18.8438 12.6731 16.4946 12.6731H12.4496H11.9829V24.3398H12.4496H13.7145H14.1811ZM14.1805 18.4546H15.538C17.3974 18.4546 18.1508 17.9515 18.1508 16.4971C18.1508 15.2509 17.4462 14.5479 16.2114 14.5479H14.1805V18.4546Z" fill="white"/>
  </g>
</svg>`, se = `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width="20" height="20" aria-hidden="true">
  <path d="M3.55566 26.8889C3.55566 28.6071 4.94856 30 6.66678 30H25.3334C27.0517 30 28.4446 28.6071 28.4446 26.8889V9.77778L20.6668 2H6.66678C4.94856 2 3.55566 3.39289 3.55566 5.11111V26.8889Z" fill="var(--chat-slide-card-pdf-fill, #EA5355)"/>
  <path d="M20.667 6.66647C20.667 8.38469 22.0599 9.77759 23.7781 9.77759H28.4448L20.667 1.99981V6.66647Z" fill="#F78E8F"/>
  <path opacity="0.9" fill-rule="evenodd" clip-rule="evenodd" d="M14.2558 11.6406H16.6253C16.6253 14.5907 19.1654 17.754 22.3311 18.8096L21.7897 21.1069C18.0743 20.5761 14.2345 22.1613 10.7667 24.474L9.36865 22.5629C10.6553 21.5334 11.8898 19.787 12.8045 17.7457C13.7167 15.7126 14.2558 13.509 14.2558 11.6406ZM14.2124 19.0594C14.7355 17.8898 15.1998 16.6772 15.5916 15.4489C16.5268 16.8776 17.651 18.1732 18.9337 19.3003C17.0099 19.6451 15.1273 20.2113 13.3015 20.9322C13.6247 20.317 13.9284 19.6921 14.2124 19.0594Z" fill="white"/>
</svg>`, ae = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" width="20" height="20" aria-hidden="true">
  <path d="M3.28125 2.02908C3.28125 1.4575 3.74461 0.994141 4.31619 0.994141H12.0782L16.218 5.41284V17.8431C16.218 18.4104 15.7613 18.8719 15.1941 18.878L4.32725 18.9941C3.75138 19.0002 3.28125 18.5351 3.28125 17.9592V2.02908Z" fill="#EDBF59"/>
  <path d="M12.0782 1.01031L16.2185 5.41449H12.0787L12.0782 1.01031Z" fill="#E59E4D"/>
  <path d="M13.8469 7.73337V13.3528H5.72811V7.73337H13.8469ZM6.76305 12.3178H12.812V8.76831H6.76305V12.3178Z" fill="white"/>
</svg>`, le = `<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" width="20" height="20" aria-hidden="true">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M6.85512 12.7131H1.5C1.5 13.0134 1.57789 13.3137 1.73368 13.5849L2.78522 15.3963L3.53495 16.6846C3.69074 16.9559 3.91466 17.169 4.17756 17.324L6.85512 12.7131Z" fill="#0066DA"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M15.8224 17.324C16.0854 17.169 16.3093 16.9559 16.4651 16.6847L16.7766 16.1519L18.2664 13.5849C18.4193 13.3196 18.4998 13.019 18.5 12.7131H13.1546L15.8224 17.324Z" fill="#EA4335"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M12.6777 2.6778L10.0001 7.28865L7.32255 2.6778C7.58552 2.53252 7.88727 2.44531 8.19884 2.44531H11.8014C12.1129 2.44531 12.4148 2.52281 12.6777 2.6778Z" fill="#00832D"/>
  <path d="M18.5 12.7131C18.5 12.4128 18.4125 12.1129 18.2567 11.8416L15.7934 7.57948L13.3202 3.31733C13.1645 3.04606 12.9406 2.83279 12.6777 2.6778L10.0001 7.28865L13.1546 12.7131H18.5Z" fill="#FFBA00"/>
  <path d="M6.85512 12.7131L4.17756 17.324C4.44039 17.479 4.74213 17.5564 5.05371 17.5564H14.9461C15.2577 17.5564 15.5596 17.4693 15.8224 17.324L13.1546 12.7131H6.85512Z" fill="#2684FC"/>
  <path d="M1.73368 11.8416C1.58077 12.107 1.50021 12.4072 1.5 12.7131H6.85512L10.0001 7.28865L7.32255 2.6778C7.05958 2.83279 6.83566 3.04606 6.67987 3.31733L1.73368 11.8416Z" fill="#00AC47"/>
</svg>`, _ = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" width="20" height="20" aria-hidden="true">
  <path d="M11.61 10.356C11.61 10.356 15.4679 8.1942 15.5344 8.22746C15.1657 6.78695 14.2412 5.55122 12.9634 4.79077C11.6856 4.03032 10.1585 3.80711 8.71654 4.16999C7.35995 4.51249 6.18349 5.35622 5.424 6.5313C5.45726 6.5313 11.61 10.356 11.61 10.356Z" fill="#0364B8"/>
  <path d="M7.85159 7.19588C7.14084 6.76076 6.32365 6.53056 5.49028 6.53072L5.424 6.5313C4.23347 6.54969 3.09867 7.0393 2.2693 7.89361C1.43993 8.74793 0.983565 9.89651 1.00045 11.0871C1.01492 11.9893 1.29232 12.8677 1.79864 13.6147L7.98462 12.9828L11.6097 9.49068L7.85159 7.19588Z" fill="#0F78D4"/>
  <path d="M15.5679 8.22663H15.335C14.8424 8.22298 14.3548 8.32505 13.905 8.52595L11.6434 9.45717L14.1045 12.1843L18.5611 13.5812C18.7899 13.1579 18.9327 12.6935 18.9813 12.2148C19.0299 11.7361 18.9833 11.2525 18.8442 10.7919C18.7051 10.3313 18.4762 9.90277 18.1708 9.53099C17.8653 9.15922 17.4893 8.85155 17.0645 8.62572C16.5963 8.39666 16.0879 8.2611 15.5679 8.22663Z" fill="#1490DF"/>
  <path d="M15.3354 11.6864L14.4042 11.121L12.2757 9.85721L11.6105 9.45812L9.91435 10.1898L6.62181 11.5866L5.1252 12.1853L1.7994 13.5821C2.21528 14.1758 2.76767 14.6609 3.4101 14.9966C4.05253 15.3322 4.7662 15.5087 5.49104 15.5111H15.3021C15.9632 15.5074 16.6112 15.3265 17.1786 14.9872C17.746 14.6479 18.212 14.1627 18.5282 13.5821L15.3354 11.6864Z" fill="#28A8EA"/>
</svg>`, ce = [
  { format: "pptx", label: "PPTX", icon: ne },
  { format: "pdf", label: "PDF", icon: se }
], de = [
  { key: "google_slides", label: "Convert to Google Slides", icon: ae },
  { key: "google_drive", label: "Save to Google Drive", icon: le },
  { key: "onedrive_personal", label: "Save to OneDrive (personal)", icon: _ },
  { key: "onedrive_business", label: "Save to OneDrive (work/school)", icon: _ }
];
class pe extends HTMLElement {
  _props = {};
  root;
  resizeObserver;
  menuLayer = null;
  menuOpen = !1;
  busyFormat = null;
  // 云投递移交在途去重（对齐 studio startDelivery 的 handingOffRef）：ack 返回前
  // 防连点向宿主发多条 handoff。
  deliveryHandingOff = !1;
  errorMessage = "";
  suppressNextOpenClick = !1;
  /** 宿主已设置过 props：之前的渲染（connectedCallback 先于 props）不算首帧。 */
  propsAssigned = !1;
  /** ready 事件每个元素只 dispatch 一次，之后的重渲（locale、props 变化）不再发。 */
  readyEmitted = !1;
  /** 已应用的宿主语言 + 对应的 l10n 实例（避免每次 set props 都重建）。 */
  appliedLocale;
  l10n = b();
  /** 渲染输入 diff：只有实际影响 DOM 的输入变化才重建（注册即回放,首次 setState 即首渲）。 */
  renderInputs = V();
  /** 加载失败、当前以降级渲染的封面 URL；同一 URL 不再反复重建 <img>。 */
  failedCoverUrl = "";
  /** 已重试过一次的封面 URL（每个 URL 只重试一次）。 */
  coverRetryUrl = "";
  /** 重试计数：作为渲染输入，强制同一 URL 重建一次 <img>。 */
  coverAttempt = 0;
  constructor() {
    super(), this.root = this.attachShadow({ mode: "open" }), this.renderInputs.watch(
      [
        "title",
        "mode",
        "versionId",
        // 只看生效的封面图（addon 票据 > 宿主截图）：addon 票据在场时，宿主截图 URL
        // 变化不影响 DOM，不应重建封面（slides#365）。
        "coverImage",
        "coverAttempt",
        "coverHtml",
        "coverWidth",
        "coverHeight",
        "locale",
        "actionable",
        "deliverable"
      ],
      (e) => {
        e.every((o) => o.key === "coverHtml") && this.showsCoverImage() || this.render();
      }
    );
  }
  set props(e) {
    this._props = e ?? {}, this.propsAssigned = !0;
    const o = this._props.hostContext?.client?.productName;
    this.style.setProperty(
      "--chat-slide-card-radius",
      o === "manus-agents" ? "24px" : "12px"
    );
    const r = this._props.hostContext?.locale;
    if (r && r !== this.appliedLocale) {
      this.appliedLocale = r;
      const i = b(r);
      this.l10n = i, i.ready?.then(() => {
        this.l10n === i && this.render();
      });
    }
    this.retryFailedCover(), this.renderInputs.setState({
      title: this._props.title,
      mode: this._props.mode,
      versionId: this._props.versionId,
      coverImage: this.coverImage(),
      coverAttempt: this.coverAttempt,
      coverHtml: this._props.coverHtml,
      coverWidth: this._props.coverWidth,
      coverHeight: this._props.coverHeight,
      locale: this.appliedLocale,
      actionable: typeof this._props.invokeAction == "function",
      deliverable: this.hasConnectorDelivery()
    });
  }
  get props() {
    return this._props;
  }
  /** 生效的封面图 URL：真截图优先于渲染页面（mono#1089 裁决），addon 自有票据 > 宿主注入截图。 */
  coverImage() {
    const e = typeof this._props.coverImageUrl == "string" ? this._props.coverImageUrl : "", o = typeof this._props.hostCoverImageUrl == "string" ? this._props.hostCoverImageUrl : "";
    return e || o;
  }
  showsCoverImage() {
    const e = this.coverImage();
    return !!e && e !== this.failedCoverUrl;
  }
  // 封面地址在同一 7 天签发窗口内逐字相同（slides#365，服务端展示图片规则），宿主重推
  // props 不再换出新 URL。失败的同一 URL 在下次重推时重试一次（错误响应不缓存，重试会
  // 走网络）；再失败就有意保持降级，直到 URL 变化或卡片重新挂载，最长约一个窗口。
  retryFailedCover() {
    const e = this.coverImage();
    !e || e !== this.failedCoverUrl || e === this.coverRetryUrl || (this.coverRetryUrl = e, this.failedCoverUrl = "", this.coverAttempt += 1);
  }
  connectedCallback() {
    this.addEventListener("click", this.handleClick), this.render();
  }
  disconnectedCallback() {
    this.removeEventListener("click", this.handleClick), this.resizeObserver?.disconnect(), this.detachMenuDismissListeners();
  }
  // 宿主用 Element.moveBefore 把消息流卡片移进停车区再移回（mono#3793）：声明本回调后移动
  // 不触发上面两个回调，封面 iframe 不重载。空实现：卡片始终在文档中，click /
  // ResizeObserver / 菜单 dismiss 监听继续有效；下载菜单相对 :host 绝对定位（卡片坐标，
  // 不是视口浮层），随卡片移动，无需关闭。
  connectedMoveCallback() {
  }
  handleClick = (e) => {
    if (this.suppressNextOpenClick) {
      this.suppressNextOpenClick = !1;
      return;
    }
    this.trackUserClick(e, "card_open_click", {
      ...this.deckTrackParams(),
      button_id: "open_presentation",
      source: "chat"
    }), this.dispatchEvent(new CustomEvent("open", { bubbles: !0, composed: !0 }));
  };
  hasFileDownload() {
    return typeof this._props.invokeAction == "function";
  }
  hasConnectorDelivery() {
    return this._props.hostContext?.client?.productName !== "manus-agents" && typeof this._props.onStartConnectorDelivery == "function";
  }
  hasDownloadMenu() {
    return this.hasFileDownload() || this.hasConnectorDelivery();
  }
  createCoverIframe(e, o) {
    const r = document.createElement("iframe");
    return r.className = "cover", r.setAttribute("sandbox", ""), r.setAttribute("scrolling", "no"), r.setAttribute("tabindex", "-1"), r.addEventListener("load", () => o.removeAttribute("aria-busy"), { once: !0 }), r.srcdoc = e, r;
  }
  render() {
    const e = this._props.title ?? "", o = this._props.coverHtml ?? "", r = C(this._props.coverWidth) ?? Q, i = C(this._props.coverHeight) ?? ee;
    this.root.innerHTML = `
      <style>
        /* contain: inline-size——WC 固有宽度不外泄（Notion 3a57ff657cfa81b58121d6b43d5f3db5）：
           title 的 nowrap min-content 会穿透 flex min-width:0 参与宿主 grid 轨道尺寸计算，
           超长 title 直接把宿主 grid max-w-[568px] 撑破；截断（ellipsis）也因此从不触发。
           inline-size containment 让宿主只按自身布局分配宽度，卡片内再正常收缩截断。 */
        :host { position: relative; display: block; font-family: inherit; contain: inline-size; }
        .card {
          display: flex;
          flex-direction: column;
          width: 100%;
          box-sizing: border-box;
          overflow: hidden;
          cursor: pointer;
          border: 0.5px solid var(--border-dark, rgba(127, 127, 127, 0.24));
          border-radius: var(--chat-slide-card-radius, 12px);
          background: var(--background-menu-white, #ffffff);
          transition: box-shadow 0.2s ease;
        }
        .card:hover { box-shadow: 0 7px 16px 0 var(--shadow-S, rgba(0, 0, 0, 0.08)); }
        .header {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          padding: 14px 12px;
          border-bottom: 1px solid var(--border-main, rgba(127, 127, 127, 0.16));
          box-sizing: border-box;
        }
        .icon { flex: 0 0 auto; display: block; }
        .icon-dark { display: none; }
        :host-context(.dark) .icon-light { display: none; }
        :host-context(.dark) .icon-dark { display: block; }
        :host-context(.dark) .menu-layer {
          --chat-slide-card-ppt-fill: #D85446;
          --chat-slide-card-pdf-fill: #D84D4F;
        }
        .title {
          flex: 1;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 14px;
          font-weight: 500;
          line-height: 20px;
          letter-spacing: -0.154px;
          color: var(--text-primary, #34322d);
        }
        .menu-trigger {
          flex: 0 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          margin: -4px 0;
          padding: 0;
          border: none;
          border-radius: 8px;
          background: transparent;
          color: var(--icon-secondary, #6e6e6b);
          cursor: pointer;
        }
        .menu-trigger:hover,
        .menu-trigger[aria-expanded='true'] { background: var(--fill-tsp-white-main, rgba(0, 0, 0, 0.04)); }
        .stage {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          overflow: hidden;
          background: var(--fill-tsp-white-main, rgba(0, 0, 0, 0.04));
        }
        .cover {
          position: absolute;
          top: 0;
          left: 0;
          width: ${r}px;
          height: ${i}px;
          border: none;
          background: transparent;
          transform-origin: top left;
          transform: scale(var(--cover-scale, 0.5));
          pointer-events: none;
        }
        .cover-image {
          position: absolute;
          inset: 0;
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          pointer-events: none;
        }
        .menu {
          position: absolute;
          top: 48px;
          inset-inline-end: 8px;
          z-index: 20;
          box-sizing: border-box;
          min-width: 110px;
          padding: 4px;
          border: 0.5px solid var(--border-dark, rgba(127, 127, 127, 0.24));
          border-radius: 12px;
          background: var(--background-menu-white, #ffffff);
          box-shadow: 0 4px 11px 0 var(--shadow-S, rgba(0, 0, 0, 0.08));
          cursor: default;
        }
        :host-context(.dark) .menu { box-shadow: 0 8px 32px 0 var(--shadow-L, rgba(0, 0, 0, 0.24)); }
        .menu-item {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          padding: 8px;
          border: none;
          border-radius: 8px;
          background: transparent;
          box-sizing: border-box;
          font-family: inherit;
          font-size: 14px;
          line-height: 20px;
          text-align: start;
          white-space: nowrap;
          color: var(--text-primary, #34322d);
          cursor: pointer;
        }
        .menu-item:hover { background: var(--fill-tsp-white-main, rgba(0, 0, 0, 0.04)); }
        .menu-item[disabled] {
          cursor: not-allowed;
          color: var(--text-disable, #b9b9b7);
          background: transparent;
        }
        .menu-item[disabled] .menu-item-icon { opacity: 0.4; }
        .menu-item-icon {
          flex: 0 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
        }
        .menu-separator {
          width: 100%;
          height: 1px;
          margin: 2px 0;
          background: var(--border-main, rgba(127, 127, 127, 0.16));
        }
        .menu-error {
          margin: 0;
          padding: 7px 10px;
          font-size: 12px;
          line-height: 16px;
          color: var(--text-error, #f04438);
        }
        .menu-spinner {
          display: block;
          width: 14px;
          height: 14px;
          border: 2px solid color-mix(in srgb, var(--icon-primary, #34322d) 20%, transparent);
          border-top-color: var(--icon-primary, #34322d);
          border-radius: 50%;
          animation: chat-slide-card-spin 0.8s linear infinite;
        }
        @keyframes chat-slide-card-spin { to { transform: rotate(360deg); } }
      </style>
      <section class="card" part="card">
        <header class="header">
          ${re}
          ${oe}
          <span class="title" title="${k(e)}">${h(e)}</span>
          ${this.hasDownloadMenu() ? `<button type="button" class="menu-trigger" aria-label="${k(this.l10n.t("Download"))}" aria-haspopup="menu" aria-expanded="false">${ie}</button>` : ""}
        </header>
        <div class="stage"></div>
      </section>
    `;
    const n = this.root.querySelector(".stage"), s = this.coverImage();
    if (n && s && s !== this.failedCoverUrl) {
      const a = document.createElement("img");
      a.className = "cover-image", a.alt = "", a.setAttribute("draggable", "false"), n.setAttribute("aria-busy", "true"), a.addEventListener("load", () => n.removeAttribute("aria-busy"), { once: !0 }), a.addEventListener(
        "error",
        () => {
          if (a.getRootNode() !== this.root)
            return;
          this.failedCoverUrl = s;
          const d = this._props.coverHtml ?? "";
          d ? (a.remove(), n.appendChild(this.createCoverIframe(d, n))) : n.removeAttribute("aria-busy");
        },
        { once: !0 }
      ), a.src = s, n.appendChild(a);
    } else n && o && (n.setAttribute("aria-busy", "true"), n.appendChild(this.createCoverIframe(o, n)));
    this.root.querySelector(".menu-trigger")?.addEventListener("click", (a) => {
      a.stopPropagation(), this.toggleMenu(a);
    });
    const l = document.createElement("div");
    l.className = "menu-layer", l.addEventListener("click", (a) => {
      a.stopPropagation();
    }), this.root.appendChild(l), this.menuLayer = l, this.renderMenu(), this.observeStage(r), this.emitReady();
  }
  // 首帧完成 = 宿主已设置 props 且卡片框已在文档中。宿主先设 props 再挂载时，那次渲染
  // 不在文档里，由 connectedCallback 的渲染补发。
  emitReady() {
    this.readyEmitted || !this.propsAssigned || !this.isConnected || (this.readyEmitted = !0, this.dispatchEvent(new CustomEvent(A, { bubbles: !0, composed: !0 })), this.dispatchEvent(new CustomEvent(te, { bubbles: !0, composed: !0 })));
  }
  // 菜单独立渲染：开合 / busy / error 变化只重建菜单层，不触碰卡片层（封面 iframe）。
  // 「菜单不可用」的收口也在这里：props 变化导致 hasDownloadMenu 翻转时统一清状态。
  renderMenu() {
    const e = this.menuLayer;
    if (!e)
      return;
    if (!this.hasDownloadMenu()) {
      this.menuOpen = !1, this.detachMenuDismissListeners(), e.replaceChildren();
      return;
    }
    if (this.root.querySelector(".menu-trigger")?.setAttribute("aria-expanded", this.menuOpen ? "true" : "false"), !this.menuOpen) {
      e.replaceChildren();
      return;
    }
    const r = document.createElement("div");
    r.className = "menu", r.setAttribute("role", "menu"), r.setAttribute("aria-label", "Download");
    const i = this.hasFileDownload() ? ce.map(
      (s) => `
          <button type="button" class="menu-item" role="menuitem" data-format="${s.format}" ${this.busyFormat ? "disabled" : ""}>
            <span class="menu-item-icon">${this.busyFormat === s.format ? '<span class="menu-spinner"></span>' : s.icon}</span>
            <span>${h(this.l10n.t(s.label))}</span>
          </button>`
    ).join("") : "", n = this.hasConnectorDelivery() ? de.map(
      (s) => `
          <button type="button" class="menu-item" role="menuitem" data-destination="${s.key}" ${this.busyFormat ? "disabled" : ""}>
            <span class="menu-item-icon">${s.icon}</span>
            <span>${h(this.l10n.t(s.label))}</span>
          </button>`
    ).join("") : "";
    r.innerHTML = `
      ${i}
      ${i && n ? '<div class="menu-separator" role="separator"></div>' : ""}
      ${n}
      ${this.errorMessage ? `<p class="menu-error" role="alert">${h(this.errorMessage)}</p>` : ""}
    `;
    for (const s of r.querySelectorAll("button[data-format]"))
      s.addEventListener("click", (c) => {
        c.stopPropagation();
        const l = s.dataset.format;
        (l === "pptx" || l === "pdf") && this.handleDownload(l, c);
      });
    for (const s of r.querySelectorAll("button[data-destination]"))
      s.addEventListener("click", (c) => {
        c.stopPropagation();
        const l = s.dataset.destination;
        l && this.handleDeliver(l, c);
      });
    e.replaceChildren(r);
  }
  toggleMenu(e) {
    if (this.menuOpen) {
      this.closeMenu("cancel", e);
      return;
    }
    this.menuOpen = !0, this.attachMenuDismissListeners(), this.renderMenu(), this.trackUserClick(e, "card_download_menu_show", { source: "chat" });
  }
  closeMenu(e = "cancel", o) {
    const r = this.menuOpen;
    this.menuOpen = !1, this.detachMenuDismissListeners(), this.renderMenu(), r && o?.isTrusted && this.emitTrack("card_download_menu_close", {
      close_method: e,
      source: "chat"
    });
  }
  handleDocumentPointerDown = (e) => {
    const o = e.composedPath(), r = this.root.querySelector(".menu-trigger");
    this.menuLayer && o.includes(this.menuLayer) || r && o.includes(r) || (o.includes(this) && (this.suppressNextOpenClick = !0), this.closeMenu("cancel", e));
  };
  handleDocumentKeyDown = (e) => {
    e.key === "Escape" && (e.stopPropagation(), e.preventDefault(), this.closeMenu("cancel", e));
  };
  attachMenuDismissListeners() {
    document.addEventListener("pointerdown", this.handleDocumentPointerDown), document.addEventListener("keydown", this.handleDocumentKeyDown, !0);
  }
  detachMenuDismissListeners() {
    document.removeEventListener("pointerdown", this.handleDocumentPointerDown), document.removeEventListener("keydown", this.handleDocumentKeyDown, !0);
  }
  // 与 studio 下载同通道：export_file 返回 downloadUrl（addon 短期跳转 ticket URL，302 到
  // 短命 S3 capability URL，该资产按 disposition: 'attachment' 取）。触发方式对齐宿主 webapp
  // 的下载原语，理由与取舍见下面 triggerBrowserDownload 的注释——不预留 tab（那才是空白页的
  // 来源），也不需要用户手势。
  //
  // 进度改由宿主 toast 表达（通用 toast 协议，见 ADDON_TOAST_EVENT）：转换可能返回
  // converting，由共享下载 helper 继续轮询。本卡按 id 发 show/dismiss 指令，
  // 文案（含翻译）自己出，宿主只负责渲染成它的视觉规格：loading 常驻 → 成功原地换成
  // 「下载没开始？点这里」并 5s 收起 → 失败换成错误提示 → 宿主接手开链时直接收起 loading
  // （不发终态）。
  // 注意菜单内并非完全无状态：用户在途重新打开菜单时仍会看到该项 spinner + 全菜单禁用
  // （防重复点击），只是不再把它当作唯一的进行中反馈。
  async handleDownload(e, o) {
    const r = this._props.invokeAction;
    if (!r || this.busyFormat)
      return;
    const i = `export-${e}`;
    this.busyFormat = e, this.errorMessage = "";
    const n = this.startExportAttempt(o, e);
    let s = "convert";
    this.emitToast({
      id: i,
      action: "show",
      variant: "loading",
      title: e === "pptx" ? this.l10n.t("Converting to PPTX...") : this.l10n.t("Converting to PDF...")
    }), this.closeMenu("select", o);
    let c, l;
    try {
      const a = this._props.versionId, d = await F({
        format: e,
        versionId: a,
        request: async ({ format: M, versionId: v }) => {
          if (!this.isConnected) throw new Error("export_card_disconnected");
          const u = await r("export_file", {
            format: M,
            ...v ? { versionId: v } : {}
          });
          if (!this.isConnected) throw new Error("export_card_disconnected");
          return {
            status: p(u, "status"),
            versionId: p(u, "versionId"),
            downloadUrl: p(u, "downloadUrl"),
            fileName: p(u, "fileName")
          };
        }
      });
      if (c = p(d, "downloadUrl"), !c)
        throw new Error("export_download_url_missing");
      s = "download";
      const g = p(d, "fileName");
      l = await this.requestHostOpenLink(c, g), l || he(c, g);
    } catch (a) {
      console.error("[chat-slide-card] export failed", a), this.trackExportFailed(n, s, a), this.busyFormat = null, this.emitToast({
        id: i,
        action: "show",
        variant: "error",
        title: this.l10n.t("Download failed. Please try again.")
      }), this.errorMessage = this.l10n.t("Download failed. Please try again."), this.renderMenu();
      return;
    }
    if (this.busyFormat = null, l)
      this.emitToast({ id: i, action: "dismiss" });
    else {
      const a = this.downloadHintParts();
      this.emitToast({
        id: i,
        action: "show",
        variant: "success",
        title: a.title,
        ...a.label ? { link: { label: a.label, url: c } } : {},
        autoDismissMs: 5e3
      });
    }
    this.renderMenu();
  }
  /**
   * 把导出链接交宿主打开，返回宿主是否已接手。宿主抛错按未接手处理：下载链接已经拿到，
   * 不能因为移交这一步失败就把整次导出判成失败。
   */
  async requestHostOpenLink(e, o) {
    const r = this._props.onOpenLink;
    if (!r)
      return !1;
    try {
      return (await r({ url: e, target: "_blank", download: o })).handled === !0;
    } catch (i) {
      return console.error("[chat-slide-card] open link handoff failed", i), !1;
    }
  }
  /**
   * 成功态的提示文案：复用与 studio / 宿主 FilePreviewer 完全相同的整句 key
   * （'Download not starting? <a>Click here</a>'，中英译文都已在 bundle 里），在这里按
   * `<a>` 标记拆成「正文 + 链接文案」——协议里 title 与 link.label 是分开的纯文本，宿主
   * 只按自己的视觉规格渲染链接。刻意不新增 'Click here' 这类碎片 key：i18n 提取器只识别
   * 静态 `l10n.t()`，本卡用的是实例方法（为避开 shim 改写宿主 <html lang> 的副作用），
   * 新 key 不会被提取进 bundle。
   */
  downloadHintParts() {
    const e = this.l10n.t("Download not starting? <a>Click here</a>"), o = e.replace(/<\/?a>/g, "").trim(), r = /^([\s\S]*?)<a>([\s\S]*?)<\/a>([\s\S]*)$/.exec(e), i = r ? `${r[1] ?? ""}${r[3] ?? ""}`.trim() : "", n = (r?.[2] ?? "").trim();
    return !i || !n ? { title: o || e, label: void 0 } : { title: i, label: n };
  }
  /**
   * 发一条宿主 toast 指令。监听器抛出的异常按 DOM 规范走 *report the exception*（转成
   * window 的 error 事件），不会沿 dispatchEvent 抛回这里 —— 状态机天然不受宿主展示失败
   * 影响，但错误归属也跟着变了：#211 的 `notify?.(state)` 是直接调用、宿主回调抛错由本卡
   * catch 住并 console.error，改成事件后同样的异常会逃逸成页面级 uncaught error（进宿主的
   * window.onerror / Sentry）。这里的 catch 只兜本地异常（CustomEvent 构造之类）。
   */
  emitToast(e) {
    try {
      this.dispatchEvent(
        new CustomEvent(Y, {
          detail: e,
          bubbles: !0,
          composed: !0
        })
      );
    } catch (o) {
      console.error("[chat-slide-card] toast command failed", o);
    }
  }
  deckTrackParams() {
    return U({
      resourceId: this._props.resourceId,
      versionId: this._props.versionId,
      slidesMode: this._props.mode,
      pageCount: this._props.pageCount
    });
  }
  // 合成 click 不计：返回 undefined 时本次导出的点击和失败都不报。
  startExportAttempt(e, o) {
    if (!e.isTrusted) return;
    const r = W("chat_card_menu", o);
    return this.emitTrack(w.exportClick, {
      ...this.deckTrackParams(),
      ...D(r)
    }), r;
  }
  trackExportFailed(e, o, r) {
    e && this.emitTrack(w.exportFailed, {
      ...this.deckTrackParams(),
      ...K(e, o, r)
    });
  }
  // 埋点只从受信任的用户手势上报。合成 click 仍可走原有业务路径，但不污染分析数据。
  trackUserClick(e, o, r) {
    e.isTrusted && this.emitTrack(o, r);
  }
  // 埋点是 fire-and-forget。派发失败不能影响卡片打开、导出或菜单交互。
  emitTrack(e, o) {
    try {
      this.dispatchEvent(
        new CustomEvent(S, {
          detail: { event: e, params: o },
          bubbles: !0,
          composed: !0
        })
      );
    } catch (r) {
      console.error("[chat-slide-card] track event failed", r);
    }
  }
  // 云投递与 studio 的 startDelivery 同语义：把 destination+versionId 移交给宿主注入的
  // onStartConnectorDelivery（宿主弹窗接管 OAuth/选文件夹/直传），本卡只做在途去重与
  // 失败提示。成功移交即关菜单；导出下载进行中（busyFormat）不受理，与菜单项禁用一致。
  async handleDeliver(e, o) {
    const r = this._props.onStartConnectorDelivery;
    if (!this.hasConnectorDelivery() || !r || this.busyFormat || this.deliveryHandingOff)
      return;
    this.deliveryHandingOff = !0, this.errorMessage = "", this.renderMenu();
    const i = J(e) ? this.startExportAttempt(o, e) : void 0;
    try {
      const n = this._props.versionId;
      await r({
        destination: e,
        ...n ? { versionId: n } : {},
        ...i ? { source: i.source, attemptId: i.attemptId } : {}
      }), this.closeMenu("select", o);
    } catch (n) {
      console.error("[chat-slide-card] connector delivery handoff failed", n), this.trackExportFailed(i, "handoff", n), this.errorMessage = this.l10n.t("Export failed. Please try again."), this.renderMenu();
    } finally {
      this.deliveryHandingOff = !1;
    }
  }
  observeStage(e) {
    this.resizeObserver?.disconnect();
    const o = this.root.querySelector(".stage"), r = this.root.querySelector(".cover");
    if (!o || !r)
      return;
    const i = () => {
      r.style.setProperty("--cover-scale", String(o.clientWidth / e));
    };
    i(), typeof ResizeObserver < "u" && (this.resizeObserver = new ResizeObserver(i), this.resizeObserver.observe(o));
  }
}
function C(t) {
  return typeof t == "number" && Number.isFinite(t) && t > 0 ? t : void 0;
}
function p(t, e) {
  if (typeof t != "object" || t === null || Array.isArray(t))
    return;
  const r = Object.fromEntries(Object.entries(t))[e];
  return typeof r == "string" && r.length > 0 ? r : void 0;
}
function he(t, e) {
  const o = document.createElement("a");
  o.href = t, o.target = "_blank", o.rel = "noopener noreferrer", e && (o.download = e), o.click();
}
function h(t) {
  return t.replace(/[&<>]/g, (e) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[e] ?? e);
}
function k(t) {
  return h(t).replace(/"/g, "&quot;");
}
customElements.get(y) || customElements.define(y, pe);
export {
  Y as ADDON_TOAST_EVENT,
  pe as ChatSlideCard
};
