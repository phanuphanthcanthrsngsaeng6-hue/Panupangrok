function h(e, i) {
  return e ? e.disabled ? !0 : !!i && !!e.disabled_when_quality_mode?.includes(i) : !1;
}
const u = "manus-slides--style-switch", d = (e, i, o, a) => `<svg xmlns="http://www.w3.org/2000/svg" width="${e}" height="${e}" viewBox="0 0 ${i} ${i}" fill="none" stroke="currentColor" stroke-width="${a}" stroke-linecap="round" stroke-linejoin="round">${o}</svg>`, b = {
  document: (e) => d(e, 24, '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M10 4v4"/><path d="M2 8h20"/><path d="M6 4v4"/>', "2"),
  image: (e) => d(e, 24, '<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>', "2"),
  presentation: (e) => d(e, 16, '<path d="M1.33325 2H14.6666"/><path d="M14 2V9.33333C14 9.68696 13.8595 10.0261 13.6095 10.2761C13.3594 10.5262 13.0203 10.6667 12.6667 10.6667H3.33333C2.97971 10.6667 2.64057 10.5262 2.39052 10.2761C2.14048 10.0261 2 9.68696 2 9.33333V2"/><path d="M4.66675 14.0013L8.00008 10.668L11.3334 14.0013"/><path d="M10.6666 4.66797L8.33325 7.0013L6.99992 5.66797L5.33325 7.33464"/>', "1.33333")
}, v = d(16, 24, '<path d="m6 9 6 6 6-6"/>', "2"), w = d(18, 24, '<path d="M20 6 9 17l-5-5"/>', "2");
function x(e, i) {
  const o = e ? b[e] : void 0;
  return o ? o(i) : "";
}
class y extends HTMLElement {
  _props = {};
  open = !1;
  root;
  onDocumentPointerDown = (i) => {
    this.open && !i.composedPath().includes(this) && (this.open = !1, this.render());
  };
  onDocumentKeyDown = (i) => {
    this.open && i.key === "Escape" && (this.open = !1, this.render());
  };
  constructor() {
    super(), this.root = this.attachShadow({ mode: "open" });
  }
  set props(i) {
    this._props = i ?? {}, this.render();
  }
  get props() {
    return this._props;
  }
  connectedCallback() {
    document.addEventListener("pointerdown", this.onDocumentPointerDown), document.addEventListener("keydown", this.onDocumentKeyDown), this.render();
  }
  disconnectedCallback() {
    document.removeEventListener("pointerdown", this.onDocumentPointerDown), document.removeEventListener("keydown", this.onDocumentKeyDown);
  }
  render() {
    const i = this._props.value, o = this._props.options ?? [], a = o.find((t) => t.value === i) ?? o[0];
    this.root.innerHTML = `
      <style>
        :host { display: inline-block; position: relative; font-family: inherit; }
        button { font-family: inherit; }
        .trigger {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          height: 32px;
          border: 1px solid var(--border-main, #0000001f);
          cursor: pointer;
          padding-inline: 7px 8px;
          border-radius: 999px;
          font-size: 14px;
          font-weight: 400;
          line-height: 20px;
          letter-spacing: -0.15px;
          color: var(--text-secondary, #535350);
          background: transparent;
          transition: background 120ms ease;
        }
        .trigger:hover { background: var(--fill-tsp-white-main, rgba(0, 0, 0, 0.04)); }
        .trigger-icon {
          display: inline-flex;
          width: 16px;
          height: 16px;
          align-items: center;
          justify-content: center;
          color: var(--icon-tertiary, #8f8f8c);
        }
        .chevron {
          display: inline-flex;
          color: var(--icon-tertiary, #8f8f8c);
          transition: transform 120ms ease;
        }
        .chevron.open { transform: rotate(180deg); }
        .menu {
          position: fixed;
          inset: auto;
          margin: 0;
          z-index: 1000;
          width: 322px;
          max-width: calc(100vw - 32px);
          display: flex;
          flex-direction: column;
          padding: 4px;
          border: none;
          border-radius: 12px;
          background: var(--background-menu-white, #ffffff);
          outline: 0.5px solid var(--slide-mode-menu-border, #00000024);
          outline-offset: -0.5px;
          box-shadow: 0 4px 11px 0 var(--slide-mode-menu-shadow, #00000026);
          backdrop-filter: blur(40px);
        }
        .option {
          display: flex;
          align-items: flex-start;
          min-height: 36px;
          width: 100%;
          border: none;
          cursor: pointer;
          text-align: start;
          padding: 8px 8px 8px 12px;
          border-radius: 10px;
          background: transparent;
          color: var(--text-primary, #34322d);
        }
        .option:hover { background: var(--fill-tsp-white-light, rgba(0, 0, 0, 0.03)); }
        .option.selected { background: var(--fill-tsp-white-light, rgba(0, 0, 0, 0.03)); }
        /* 压暗打在子元素而不是按钮本体：::after tooltip 不能跟着半透明。 */
        .option[disabled] { cursor: not-allowed; position: relative; }
        .option[disabled] > * { opacity: 0.5; }
        .option[disabled]:hover { background: transparent; }
        /* 禁用态 hover tooltip（样式对齐主站 Tooltip black variant：暗底白字圆角）。
           disabled 按钮不派发 JS 鼠标事件但 CSS :hover 仍然命中，纯 CSS 实现。 */
        .option[data-tooltip]::after {
          content: attr(data-tooltip);
          position: absolute;
          bottom: calc(100% + 4px);
          left: 50%;
          transform: translateX(-50%);
          width: max-content;
          max-width: 280px;
          padding: 4px 8px;
          border-radius: 8px;
          background: var(--background-menu-tooltips, #34322d);
          color: var(--text-white, #ffffff);
          font-size: 12px;
          line-height: 16px;
          font-weight: 400;
          white-space: normal;
          text-align: start;
          pointer-events: none;
          opacity: 0;
          visibility: hidden;
          transition: opacity 120ms ease 0ms, visibility 0ms 120ms;
          z-index: 1;
        }
        .option[data-tooltip]:hover::after {
          opacity: 1;
          visibility: visible;
          transition: opacity 120ms ease 100ms, visibility 0ms 100ms;
        }
        .option-icon {
          display: flex;
          width: 16px;
          height: 20px;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          color: var(--icon-secondary, #535350);
        }
        .body {
          margin-inline-start: 8px;
          display: flex;
          width: 220px;
          flex-shrink: 0;
          flex-direction: column;
          align-items: flex-start;
        }
        .label-row {
          display: flex;
          height: 20px;
          width: 100%;
          align-items: center;
          gap: 6px;
        }
        .label {
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 14px;
          font-weight: 400;
          color: var(--text-primary, #34322d);
        }
        .badge {
          display: flex;
          height: 18px;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          align-self: flex-start;
          border: 1px solid var(--border-dark, #00000029);
          border-start-start-radius: 8px;
          border-start-end-radius: 10px;
          border-end-end-radius: 10px;
          border-end-start-radius: 0;
          padding-inline: 6px;
          font-size: 12px;
          font-weight: 500;
          line-height: 16px;
          color: var(--text-tertiary, #8f8f8c);
        }
        .description {
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          font-size: 12px;
          font-weight: 400;
          color: var(--text-tertiary, #8f8f8c);
        }
        .check {
          margin-inline-start: 16px;
          display: flex;
          width: 34px;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          align-self: stretch;
          padding-inline: 8px;
          color: var(--icon-primary, #34322d);
          visibility: hidden;
        }
        .check.active { visibility: visible; }
      </style>
      <button type="button" class="trigger" aria-haspopup="listbox" aria-expanded="${this.open}">
        <span class="trigger-icon">${x(a?.icon, 16)}</span>
        <span>${a ? p(a.label) : ""}</span>
        <span class="chevron ${this.open ? "open" : ""}">${v}</span>
      </button>
      ${this.open ? `<div class="menu" role="listbox" aria-label="Slides style" popover="manual">
              ${o.map((t) => {
      const n = t.value === (i ?? a?.value), r = h(t, this._props.quality_mode), s = r && t.disabled_tooltip ? ` data-tooltip="${f(t.disabled_tooltip)}"` : "";
      return `<button type="button" class="option ${n ? "selected" : ""}" role="option" aria-selected="${n}" ${r ? "disabled" : ""}${s} data-value="${f(t.value)}">
                    <span class="option-icon">${x(t.icon, 16)}</span>
                    <span class="body">
                      <span class="label-row">
                        <span class="label">${p(t.label)}</span>
                        ${t.badge ? `<span class="badge">${p(t.badge)}</span>` : ""}
                      </span>
                      ${t.description ? `<span class="description">${p(t.description)}</span>` : ""}
                    </span>
                    <span class="check ${n ? "active" : ""}">${w}</span>
                  </button>`;
    }).join("")}
            </div>` : ""}
    `;
    const c = this.root.querySelector(".trigger"), l = this.root.querySelector(".menu");
    if (c && l && typeof l.showPopover == "function") {
      l.showPopover();
      const t = c.getBoundingClientRect(), n = l.getBoundingClientRect(), r = 12, s = 8, g = Math.min(
        Math.max(t.left, r),
        window.innerWidth - n.width - r
      ), m = window.innerHeight - t.bottom >= n.height + s ? t.bottom + s : Math.max(r, t.top - n.height - s);
      l.style.left = `${g}px`, l.style.top = `${m}px`;
    }
    c?.addEventListener("click", () => {
      this.open = !this.open, this.render();
    }), this.root.querySelectorAll(".option").forEach((t) => {
      t.addEventListener("click", () => {
        const n = t.dataset.value, r = o.find((s) => s.value === n);
        if (!(!n || h(r, this._props.quality_mode))) {
          if (this.open = !1, n === this._props.value) {
            this.render();
            return;
          }
          this.dispatchEvent(
            new CustomEvent("slides-style-change", {
              // Host merges the selected option's declared `data` (mode / imageModel) into the
              // first-message extData.addon.data (mono#877) — carry it in the detail so the
              // host's generic `detail.data` merge actually receives the per-option params.
              detail: { value: n, data: r?.data },
              bubbles: !0,
              composed: !0
            })
          ), this.render();
        }
      });
    });
  }
}
function p(e) {
  return e.replace(/[&<>]/g, (i) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[i] ?? i);
}
function f(e) {
  return e.replace(/"/g, "&quot;");
}
customElements.get(u) || customElements.define(u, y);
export {
  y as SlidesStyleSwitch
};
