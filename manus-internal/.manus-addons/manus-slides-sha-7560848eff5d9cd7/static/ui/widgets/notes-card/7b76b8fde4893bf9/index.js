import { w as g } from "../../chunks/widgetTag-eqiR3RxC.js";
const d = g("manus-slides--notes-card", import.meta.url);
class h extends HTMLElement {
  _props = {};
  root;
  constructor() {
    super(), this.root = this.attachShadow({ mode: "open" });
  }
  set props(e) {
    this._props = e ?? {}, this.render();
  }
  get props() {
    return this._props;
  }
  connectedCallback() {
    this.render();
  }
  // 宿主用 Element.moveBefore 移动消息流卡片时只调用本回调（mono#3793），不走上面的重渲染，
  // notes 列表的滚动位置随之保留。空实现：卡片不持有监听或异步工作，卡内没有视口浮层。
  connectedMoveCallback() {
  }
  render() {
    const e = c(this._props.state), r = c(e?.arguments), o = m(e?.notes ?? r?.notes), s = this._props.status ?? b(e, "status") ?? "streaming", n = s === "start" || s === "streaming" || s === "argumentsFinished", p = o.map((i, l) => {
      const f = i.slide_id ? i.slide_id : i.slide_number !== void 0 ? `Page ${i.slide_number}` : `Note ${l + 1}`, x = n && l === o.length - 1 ? '<span class="caret"></span>' : "";
      return `
          <li class="entry">
            <div class="entry-label">${a(f)}</div>
            <div class="entry-note">${a(i.note ?? "")}${x}</div>
          </li>
        `;
    }).join("");
    if (this.root.innerHTML = `
      <style>
        :host { display: block; font-family: inherit; color: var(--text-primary, #1f2328); }
        .card {
          width: min(100%, 640px);
          overflow: hidden;
          border: 1px solid var(--border-dark, rgba(127, 127, 127, 0.24));
          border-radius: 12px;
          background: var(--background-menu-white, #ffffff);
        }
        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          min-height: 48px;
          padding: 10px 14px;
          border-bottom: 1px solid var(--border-main, rgba(127, 127, 127, 0.16));
          box-sizing: border-box;
        }
        .title {
          min-width: 0;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 650;
        }
        .title-text {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .icon {
          width: 18px;
          height: 18px;
          border-radius: 5px;
          border: 1.5px solid currentColor;
          position: relative;
          flex: 0 0 auto;
        }
        .icon::before {
          content: "";
          position: absolute;
          left: 4px;
          right: 4px;
          top: 4px;
          height: 1.5px;
          background: currentColor;
          box-shadow: 0 3.5px 0 currentColor, 0 7px 0 currentColor;
        }
        .status {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: var(--text-tertiary, #7b7f87);
          font-size: 13px;
          font-weight: 500;
          white-space: nowrap;
        }
        .dot {
          width: 7px;
          height: 7px;
          border-radius: 999px;
          background: #2563eb;
          animation: pulse 1.1s ease-in-out infinite;
        }
        .entries {
          list-style: none;
          margin: 0;
          padding: 10px 14px 12px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-height: 320px;
          overflow-y: auto;
        }
        .entry-label {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-tertiary, #7b7f87);
          margin-bottom: 3px;
        }
        .entry-note {
          font-size: 13px;
          line-height: 1.55;
          white-space: pre-wrap;
          word-break: break-word;
        }
        .caret {
          display: inline-block;
          width: 7px;
          height: 14px;
          margin-left: 2px;
          vertical-align: text-bottom;
          background: currentColor;
          opacity: 0.7;
          animation: blink 0.9s step-end infinite;
        }
        .empty {
          padding: 18px 14px 20px;
          color: var(--text-tertiary, #7b7f87);
          font-size: 13px;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.35; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1); }
        }
        @keyframes blink {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 0; }
        }
      </style>
      <section class="card">
        <header class="header">
          <div class="title">
            <span class="icon" aria-hidden="true"></span>
            <span class="title-text">${a(this._props.title ?? "Speaker notes")}</span>
          </div>
          ${n ? '<div class="status"><span class="dot"></span><span>Writing</span></div>' : ""}
        </header>
        ${p ? `<ul class="entries">${p}</ul>` : '<div class="empty">Waiting for speaker notes...</div>'}
      </section>
    `, n) {
      const i = this.root.querySelector(".entries");
      i && (i.scrollTop = i.scrollHeight);
    }
  }
}
function m(t) {
  return Array.isArray(t) ? t.flatMap((e) => {
    if (!u(e)) return [];
    const r = typeof e.slide_id == "string" ? e.slide_id : void 0, o = typeof e.slide_number == "number" && Number.isFinite(e.slide_number) ? e.slide_number : void 0, s = typeof e.note == "string" ? e.note : void 0;
    return r === void 0 && o === void 0 && s === void 0 ? [] : [{ slide_id: r, slide_number: o, note: s }];
  }) : [];
}
function c(t) {
  return u(t) ? t : void 0;
}
function u(t) {
  return !!t && typeof t == "object" && !Array.isArray(t);
}
function b(t, e) {
  const r = t?.[e];
  return typeof r == "string" ? r : void 0;
}
function a(t) {
  return t.replace(/[&<>]/g, (e) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[e] ?? e);
}
customElements.get(d) || customElements.define(d, h);
export {
  h as SlidesNotesCard
};
