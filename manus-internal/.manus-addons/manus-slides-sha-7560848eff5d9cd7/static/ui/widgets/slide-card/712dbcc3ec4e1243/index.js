import { w as g } from "../../chunks/widgetTag-eqiR3RxC.js";
const c = g("manus-slides--slide-card", import.meta.url), l = 1280, b = 720;
class m extends HTMLElement {
  _props = {};
  root;
  resizeObserver;
  constructor() {
    super(), this.root = this.attachShadow({ mode: "open" });
  }
  set props(t) {
    this._props = t ?? {}, this.render();
  }
  get props() {
    return this._props;
  }
  connectedCallback() {
    this.render();
  }
  disconnectedCallback() {
    this.resizeObserver?.disconnect();
  }
  // 宿主用 Element.moveBefore 移动消息流卡片时只调用本回调（mono#3793），不走上面的断开 /
  // 重连重建。空实现：卡片始终在文档中，ResizeObserver 继续有效；卡内没有视口浮层。
  connectedMoveCallback() {
  }
  render() {
    const t = p(this._props.state), r = p(t?.arguments), s = n(t, "html") ?? n(r, "text_html_code") ?? "", o = n(t, "slideId") ?? n(r, "slide_id") ?? f(t?.slideNumber) ?? f(r?.slide_number), i = this._props.status ?? n(t, "status") ?? "streaming", h = i === "start" || i === "streaming" || i === "argumentsFinished";
    this.root.innerHTML = `
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
          top: 5px;
          height: 1.5px;
          background: currentColor;
          box-shadow: 0 4px 0 currentColor;
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
        .stage {
          position: relative;
          aspect-ratio: 16 / 9;
          overflow: hidden;
          background: #f4f4f5;
        }
        .slide-render {
          width: ${l}px;
          height: ${b}px;
          transform-origin: top left;
          transform: scale(var(--slide-scale, 0.5));
          background: #ffffff;
          color: #111827;
        }
        .empty {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-tertiary, #7b7f87);
          font-size: 13px;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.35; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1); }
        }
      </style>
      <section class="card">
        <header class="header">
          <div class="title">
            <span class="icon" aria-hidden="true"></span>
            <span class="title-text">${v(o ? `Slide ${o}` : this._props.title ?? "Slide draft")}</span>
          </div>
          ${h ? '<div class="status"><span class="dot"></span><span>Writing</span></div>' : ""}
        </header>
        <div class="stage">
          <div class="slide-render"></div>
          ${s ? "" : '<div class="empty">Waiting for slide HTML...</div>'}
        </div>
      </section>
    `;
    const a = this.root.querySelector(".slide-render");
    if (a && s) {
      const d = x(s);
      a.innerHTML = d.styles + d.body, a.querySelectorAll("script").forEach((u) => {
        u.remove();
      });
    }
    this.observeStage();
  }
  observeStage() {
    this.resizeObserver?.disconnect();
    const t = this.root.querySelector(".stage"), r = this.root.querySelector(".slide-render");
    if (!t || !r)
      return;
    const s = () => {
      const o = t.clientWidth / l;
      r.style.setProperty("--slide-scale", String(o));
    };
    s(), typeof ResizeObserver < "u" && (this.resizeObserver = new ResizeObserver(s), this.resizeObserver.observe(t));
  }
}
function x(e) {
  const r = new DOMParser().parseFromString(e, "text/html");
  r.querySelectorAll("script").forEach((i) => {
    i.remove();
  });
  const s = Array.from(r.head.querySelectorAll("style")).map((i) => `<style>${i.textContent ?? ""}</style>`).join(""), o = r.body?.innerHTML?.trim() || e;
  return { styles: s, body: o };
}
function p(e) {
  return y(e) ? e : void 0;
}
function y(e) {
  return !!e && typeof e == "object" && !Array.isArray(e);
}
function n(e, t) {
  const r = e?.[t];
  return typeof r == "string" ? r : void 0;
}
function f(e) {
  return typeof e == "number" && Number.isFinite(e) ? String(e) : void 0;
}
function v(e) {
  return e.replace(/[&<>]/g, (t) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[t] ?? t);
}
customElements.get(c) || customElements.define(c, m);
export {
  m as SlideHTMLCard
};
