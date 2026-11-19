import { c as l, M as n, a as m } from "../../../chunks/shellShared-dYAehq_d.js";
const u = "manus-slides--welcome", p = 420, a = 3e3, c = 500, f = 12, b = {
  locale: "en",
  mobile: !1,
  theme: "light",
  viewer: "user",
  share: null
}, g = /* @__PURE__ */ new Set(["hostContext", "auth", "embed_url"]);
function o(s) {
  return typeof s == "object" && s !== null && !Array.isArray(s);
}
function _(s) {
  if (customElements.get(s))
    return;
  class d extends HTMLElement {
    _props = {};
    root;
    iframe;
    embedReady = !1;
    missingTimedOut = !1;
    missingTimer;
    initResendTimer;
    currentFrameUrl = "";
    hostSurface = l(this, {
      protocol: n,
      moduleBaseUrl: import.meta.url,
      getFrameWindow: () => this.iframe?.contentWindow
    });
    onMessage = (t) => {
      if (!this.iframe || t.source !== this.iframe.contentWindow)
        return;
      const e = t.data;
      if (!o(e) || e.protocol !== n)
        return;
      const r = typeof e.type == "string" ? e.type : "";
      if (r === "ready") {
        const i = !this.embedReady;
        this.embedReady = !0, this.stopInitResendLoop(), this.toggleAttribute("data-ready", !0), this.nudgeHostLayoutObservers(), i && this.sendInit();
        return;
      }
      if (r === "resize") {
        const i = Number(o(e.data) ? e.data.height : void 0);
        this.iframe && Number.isFinite(i) && i > 0 && (this.iframe.style.height = `${i}px`, this.nudgeHostLayoutObservers());
        return;
      }
      if (!this.hostSurface.handleFrameMessage(e) && r === "slotEvent") {
        const i = o(e.data) ? e.data : {}, h = typeof i.name == "string" ? i.name : "";
        this.dispatchSlotEvent(h, o(i.payload) ? i.payload : {});
      }
    };
    /**
     * 高度变化(ready 的 :host 高度切换、iframe.style.height)全部发生在 shadow DOM /
     * 元素 attribute 上,宿主滚动容器(如 SimpleBar)的 MutationObserver(childList/
     * characterData)与 ResizeObserver(观察被 flex 钉死的 content 盒)都感知不到,会停留
     * 在旧的 overflow 状态,New Session 页在 welcome 撑高后卡在不可滚,直到窗口 resize
     * 强制它重算。这里在 light DOM 做一次零布局影响的 childList 变更(comment 节点
     * append+remove),让宿主任何 subtree 观察者收到「此处布局变了」。宿主没有此类观察者
     * 时是无害 no-op。
     */
    nudgeHostLayoutObservers() {
      if (!this.isConnected)
        return;
      const t = document.createComment("");
      this.appendChild(t), t.remove();
    }
    constructor() {
      super(), this.root = this.attachShadow({ mode: "open" });
    }
    set props(t) {
      const e = this._props.auth;
      if (this._props = t ?? {}, !!this.isConnected) {
        if (this.frameUrl() !== this.currentFrameUrl) {
          this.render();
          return;
        }
        if (this.embedReady) {
          if (this._props.auth !== e) {
            this.sendInit();
            return;
          }
          this.postStateChanged();
        }
      }
    }
    get props() {
      return this._props;
    }
    connectedCallback() {
      window.addEventListener("message", this.onMessage), this.hostSurface.connect(), this.render();
    }
    disconnectedCallback() {
      window.removeEventListener("message", this.onMessage), this.hostSurface.disconnect(), this.stopInitResendLoop(), clearTimeout(this.missingTimer), this.iframe = void 0, this.embedReady = !1, this.removeAttribute("data-ready");
    }
    /** slot 业务事件 → 宿主 WC 事件(宿主 slot 契约的既有事件名与 detail 语义零改动)。 */
    dispatchSlotEvent(t, e) {
      if (t === "close") {
        this.dispatchEvent(
          new CustomEvent("slides-welcome-close", {
            detail: {},
            bubbles: !0,
            composed: !0
          })
        );
        return;
      }
      if (t === "preview-template") {
        this.dispatchEvent(
          new CustomEvent("slides-template-preview-open", {
            detail: {
              ...typeof e.template_id == "string" ? { template_id: e.template_id } : {},
              ...typeof e.name == "string" ? { name: e.name } : {},
              ...Array.isArray(e.image_preview_urls) ? { image_preview_urls: e.image_preview_urls } : {}
            },
            bubbles: !0,
            composed: !0
          })
        );
        return;
      }
      (t === "payload-change" || t === "pick-prompt") && this.dispatchEvent(
        new CustomEvent("slides-launch-payload-change", {
          detail: {
            // template_id 语义随宿主契约:带键且 null = 清空选中态,不带键 = 不改
            // 选中态。页数-only 的 payload-change 与 pick-prompt 都不带该键,
            // 折叠成 null 会把用户已选模板误清掉——原样转发键的有无。
            ...e.template_id !== void 0 ? { template_id: e.template_id ?? null } : {},
            data: o(e.data) ? e.data : void 0,
            // 纯 UI 通道(mono#891 ④⑤):style 回写胶囊选中态、toast 请求宿主弹
            // 提示、input_value 注入输入框——按键的有无原样转发,不进 data。
            ...typeof e.style == "string" ? { style: e.style } : {},
            ...o(e.toast) ? { toast: e.toast } : {},
            ...typeof e.input_value == "string" ? { input_value: e.input_value } : {}
          },
          bubbles: !0,
          composed: !0
        })
      );
    }
    hostContext() {
      return this._props.hostContext ?? b;
    }
    frameUrl() {
      const t = typeof this._props.embed_url == "string" ? this._props.embed_url : "";
      return t ? m(t, this.hostContext().locale) : "";
    }
    /** slot 链的全量轻量 state:hostContext + 业务 props(基座字段与函数不进 props 域)。 */
    buildState() {
      const t = {};
      for (const [e, r] of Object.entries(this._props))
        g.has(e) || typeof r == "function" || (t[e] = r);
      return { hostContext: this.hostContext(), props: t };
    }
    sendInit() {
      this.iframe?.contentWindow?.postMessage(
        {
          protocol: n,
          type: "init",
          state: this.buildState(),
          hostCapabilities: [],
          // auth 键恒声明:SDK 按键在场性区分「显式撤销(空值)」与「partial 帧没带(沿用)」,
          // slot 链的回收依赖这里发出带键的空值帧。
          auth: this._props.auth
        },
        "*"
      );
    }
    postStateChanged() {
      this.embedReady && this.iframe?.contentWindow?.postMessage(
        { protocol: n, type: "stateChanged", state: this.buildState() },
        "*"
      );
    }
    /** init 重发循环(与 studio-shell 一致:500ms × 12,直到 iframe 回 ready)。 */
    startInitResendLoop() {
      this.stopInitResendLoop(), this.sendInit();
      let t = 0;
      this.initResendTimer = window.setInterval(() => {
        if (this.embedReady || t >= f) {
          this.stopInitResendLoop();
          return;
        }
        t += 1, this.sendInit();
      }, c);
    }
    stopInitResendLoop() {
      this.initResendTimer !== void 0 && (window.clearInterval(this.initResendTimer), this.initResendTimer = void 0);
    }
    render() {
      const t = this.frameUrl();
      this.currentFrameUrl = t, this.embedReady = !1, this.stopInitResendLoop(), this.removeAttribute("data-ready"), this.root.innerHTML = `
      <style>
        :host { display: block; height: 0; overflow: hidden; font-family: inherit; }
        :host([data-ready]) { height: auto; overflow: visible; }
        iframe {
          display: block;
          visibility: hidden;
          width: 100%;
          height: 0;
          border: none;
          border-radius: 16px;
          background: transparent;
        }
        :host([data-ready]) iframe {
          visibility: visible;
          height: ${p}px;
        }
      </style>
      ${t ? `<iframe src="${v(t)}" title="Slides welcome" scrolling="no" allow="clipboard-write"></iframe>` : ""}
    `, clearTimeout(this.missingTimer), !t && !this.missingTimedOut ? this.missingTimer = setTimeout(() => {
        this.frameUrl() || (console.error(
          `[${s}] welcome UI unavailable: missing embed_url prop (host props not delivered within ${a}ms)`
        ), this.missingTimedOut = !0, this.render());
      }, a) : t && (this.missingTimedOut = !1), this.iframe = this.root.querySelector("iframe") ?? void 0, this.iframe && this.iframe.addEventListener("load", () => this.startInitResendLoop());
    }
  }
  customElements.define(s, d);
}
function v(s) {
  return s.replace(/"/g, "&quot;");
}
_(u);
export {
  _ as defineWelcomeSlot
};
