import { d as l } from "../../../chunks/hostSurface-DyLQqBF-.js";
import { c as n } from "../../../chunks/runtime.browser-BThva-we.js";
const p = "manus-slides--template-upload-dialog", d = 50 * 1024 * 1024;
class c extends HTMLElement {
  _props = {};
  root;
  appliedLocale;
  l10n = n();
  constructor() {
    super(), this.root = this.attachShadow({ mode: "open" });
  }
  set props(e) {
    this._props = e && typeof e == "object" ? e : {};
    const t = this._props.hostContext?.locale;
    if (t !== this.appliedLocale) {
      this.appliedLocale = t;
      const a = n(t);
      this.l10n = a, a.ready?.then(() => {
        this.l10n === a && this.render();
      });
    }
    this.render();
  }
  get props() {
    return this._props;
  }
  connectedCallback() {
    this.render();
  }
  /** 把选中的文件交回宿主；宿主收窗后转发结果给发起方。 */
  submit(e) {
    const t = this._props.dialog_id;
    if (!t)
      return;
    const a = this.root.querySelector(".share-input"), r = {
      file: e,
      shareToTeam: !!a?.checked
    }, s = {
      id: t,
      action: "close",
      reason: "submit",
      data: r
    };
    this.dispatchEvent(
      new CustomEvent(l, {
        detail: s,
        bubbles: !0,
        composed: !0
      })
    );
  }
  render() {
    const e = (r) => this.l10n.t(r), t = this._props.feedback_url;
    this.root.innerHTML = `
      <style>
        :host { display: block; font-family: inherit; color: var(--text-primary, #34322d); }
        .desc {
          margin: 0; padding: 0 20px 12px;
          font-size: 14px; line-height: 20px; letter-spacing: -0.154px;
          color: var(--text-secondary, #858481);
        }
        .share {
          display: flex; align-items: center; gap: 8px; padding: 0 24px 12px;
          font-size: 14px; line-height: 20px; cursor: pointer;
        }
        .share-input { width: 16px; height: 16px; accent-color: var(--text-primary, #34322d); }
        .area-wrap { padding: 0 20px; }
        .area {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 10px; height: 200px; padding: 24px; cursor: pointer; text-align: center;
          border: 1px dashed var(--border-main, #0000001f); border-radius: 12px;
          transition: border-color 120ms ease, background 120ms ease;
        }
        .area:hover { border-color: var(--border-dark, #34322d29); }
        .area.dragging {
          border-color: var(--text-blue, #4a5bd6); background: var(--fill-blue, #4a5bd60f);
        }
        .area p { margin: 0; font-size: 14px; line-height: 20px; letter-spacing: -0.154px; }
        .link { color: var(--text-blue, #4a5bd6); }
        .feedback { padding: 12px 24px 24px; text-align: center; }
        .feedback a {
          font-size: 13px; line-height: 18px; text-decoration: underline;
          color: var(--text-secondary, #858481);
        }
      </style>
      <p class="desc">${o(
      e(
        "Upload branded slides — Manus detects your colors, fonts, and logo, learns your style, and saves it as your personal template."
      )
    )}</p>
      ${this._props.team_account ? `<label class="share"><input type="checkbox" class="share-input" />${o(
      e("Share with my team")
    )}</label>` : ""}
      <div class="area-wrap">
        <div class="area">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M10 4v12M4 10h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          </svg>
          <p><span>${o(e("Drag a pptx file or "))}</span><span class="link">${o(
      e("click to upload")
    )}</span></p>
        </div>
      </div>
      <input type="file" class="file" accept=".ppt,.pptx" hidden />
      ${t ? `<div class="feedback"><a target="_blank" rel="noreferrer">${o(
      e("Share your feedback")
    )}</a></div>` : ""}
    `;
    const a = this.root.querySelector(".feedback a");
    a && t && (a.href = t), this.wireUpload();
  }
  /** 选文件（点击 / 拖放）；只做格式与大小校验，能否转换由服务端判定。 */
  wireUpload() {
    const e = this.root.querySelector(".area"), t = this.root.querySelector(".file");
    if (!e || !t)
      return;
    const a = (r) => {
      if (r) {
        if (!/\.pptx?$/i.test(r.name) || r.size > d) {
          const s = e.querySelector("p");
          s && (s.textContent = this.l10n.t(
            "Please upload a valid PowerPoint (.ppt, .pptx) file"
          ));
          return;
        }
        this.submit(r);
      }
    };
    e.addEventListener("click", () => t.click()), t.addEventListener("change", () => a(t.files?.[0]));
    for (const r of ["dragenter", "dragover"])
      e.addEventListener(r, (s) => {
        s.preventDefault(), e.classList.add("dragging");
      });
    e.addEventListener("dragleave", () => e.classList.remove("dragging")), e.addEventListener("drop", (r) => {
      r.preventDefault(), e.classList.remove("dragging"), a(r.dataTransfer?.files?.[0]);
    });
  }
}
function o(i) {
  return i.replace(
    /[&<>"']/g,
    (e) => e === "&" ? "&amp;" : e === "<" ? "&lt;" : e === ">" ? "&gt;" : e === '"' ? "&quot;" : "&#39;"
  );
}
customElements.get(p) || customElements.define(p, c);
export {
  c as TemplateUploadDialog
};
