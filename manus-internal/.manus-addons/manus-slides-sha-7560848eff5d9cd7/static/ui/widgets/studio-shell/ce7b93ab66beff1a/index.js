import { M as f, c as k, a as U, b as F, d as P, e as A, f as w, g as D, h as O, i as x, j as N, k as H, l as E, m as W } from "../../chunks/shellShared-dYAehq_d.js";
import { c as _ } from "../../chunks/hostSurface-DyLQqBF-.js";
import { w as G } from "../../chunks/widgetTag-eqiR3RxC.js";
const B = "manus-addon:hostFullscreen", V = "manus-addon:hostFullscreenChanged", y = G("manus-slides--studio-shell", import.meta.url), q = 500, Y = 12, K = 30 * 1e3, b = 300 * 1e3, j = 2e3, z = 300 * 1e3;
function R(o) {
  return typeof o == "object" && o !== null && !Array.isArray(o);
}
function l(o) {
  return R(o) ? o : {};
}
function h(o, e) {
  const t = o[e];
  return typeof t == "string" ? t : void 0;
}
function g(o) {
  if (!o)
    return "";
  const e = l(o.resource);
  return h(e, "uri") ?? h(e, "resourceUri") ?? h(l(o), "resourceUri") ?? o.uri ?? "";
}
function T(o) {
  return h(l(o?.frontend), "url") ?? "";
}
function I(o) {
  const e = l(o?.events), t = l(o?.api);
  return h(e, "stream") ?? h(t, "eventStreamUrl") ?? h(t, "event_stream_url") ?? "";
}
function S(o) {
  const e = l(o?.auth);
  return `${h(e, "type") ?? ""}:${h(e, "token") ?? ""}`;
}
function L(o) {
  return [I(o), S(o)].join("\0");
}
function X(o, e) {
  const t = l(o?.auth), i = t.expiresAt, r = t.expiresInSeconds, s = typeof r == "number" && Number.isFinite(r) && r > 0 ? r * 1e3 : b * 2, a = typeof i == "number" && Number.isFinite(i) && i > 0 ? i * 1e3 : typeof r == "number" && Number.isFinite(r) && r > 0 ? e + s : void 0;
  if (a !== void 0)
    return a - Math.min(b, s / 2);
}
function $(o, e) {
  const t = l(o?.auth), i = t.expiresAt, r = t.expiresInSeconds;
  return typeof i == "number" && Number.isFinite(i) && i > 0 ? i * 1e3 : typeof r == "number" && Number.isFinite(r) && r > 0 ? e + r * 1e3 : 0;
}
function J(o) {
  return o === "initial" ? { action: "retry", stage: "same_url_retry" } : o === "same_url_retry" ? { action: "refresh_auth", stage: "refreshed_auth" } : { action: "stop", stage: "refreshed_auth" };
}
function C(o) {
  const e = l(o), { x: t, y: i, width: r, height: s } = e;
  if (!(typeof t != "number" || typeof i != "number" || typeof r != "number" || typeof s != "number" || ![t, i, r, s].every(Number.isFinite)))
    return { x: t, y: i, width: r, height: s };
}
function Q(o) {
  return o === "sidebar" || o === "center" || o === "full_page" ? o : void 0;
}
function M(o, e = 0) {
  const t = [];
  for (const i of o) {
    const r = l(i), s = h(r, "id"), a = h(r, "label");
    if (!s || !a)
      continue;
    const d = e === 0 && Array.isArray(r.children) ? M(r.children, 1) : [];
    t.push({
      id: s,
      label: a,
      ...h(r, "role") ? { role: h(r, "role") } : {},
      ...h(r, "icon") ? { icon: h(r, "icon") } : {},
      ...r.disabled === !0 ? { disabled: !0 } : {},
      ...r.destructive === !0 ? { destructive: !0 } : {},
      ...d.length > 0 ? { children: d } : {}
    });
  }
  return t;
}
function Z(o) {
  return R(o) && typeof o.type == "string";
}
const m = {
  locale: "en",
  mobile: !1,
  theme: "light",
  viewer: "user",
  share: null
}, ee = [
  "allow-forms",
  "allow-popups",
  "allow-downloads",
  "allow-modals",
  "allow-orientation-lock",
  "allow-pointer-lock",
  "allow-presentation",
  "allow-top-navigation-by-user-activation",
  "allow-scripts",
  "allow-popups-to-escape-sandbox"
].join(" "), te = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; geolocation; microphone; camera; fullscreen *;";
class ie extends HTMLElement {
  root;
  iframe = null;
  // iframe 可见性观察（预热架构，webapp mono#557 打开性能批）：宿主关侧栏时 iframe
  // 隐藏保活（visibility:hidden + inert，焦点被 inert 踢出），重开只翻可见性、不再
  // 触发 load——focus-on-load 不会重放。这里观察布局可见性，从 hidden 恢复时把焦点
  // 交还 iframe（同一守卫：宿主输入中不抢）。IO 只响应布局可见性，切浏览器 tab 不误触。
  iframeLoaded = !1;
  // 收到展示信号时 iframe 还没 load 完：挂起，load 后补聚焦。
  pendingKeyboardFocus = !1;
  currentProps = {};
  connected = !1;
  // widget 握手状态（语义同 AddonWidgetHost 的同名 ref）。
  widgetReady = !1;
  widgetSubscribed = !1;
  contentRevealTimer;
  // 代 widget 在顶层文档对 iframe 元素全屏（Chrome 148+ OOPIF 内请求会挂起）。
  // 状态变化（含浏览器 ESC/系统退出）经 changed 消息回推 widget。
  hostFullscreenActive = !1;
  fullscreenChangeListener;
  postHostFullscreenChanged(e) {
    this.postToWidget({
      protocol: f,
      type: V,
      active: e
    });
  }
  notifyHostFullscreen() {
    const e = this.iframe !== null && this.root.fullscreenElement === this.iframe;
    e !== this.hostFullscreenActive && (this.hostFullscreenActive = e, this.postHostFullscreenChanged(e));
  }
  handleHostFullscreenRequest(e) {
    if (e === "exit") {
      this.iframe && this.root.fullscreenElement === this.iframe && document.exitFullscreen().catch(() => {
      });
      return;
    }
    if (e === "enter") {
      if (this.iframe && this.root.fullscreenElement === this.iframe) {
        this.postHostFullscreenChanged(!0);
        return;
      }
      if (!this.iframe || typeof this.iframe.requestFullscreen != "function") {
        this.postHostFullscreenChanged(!1);
        return;
      }
      try {
        this.iframe.requestFullscreen().catch((t) => {
          console.warn("[studio-shell] iframe requestFullscreen failed", t), this.postHostFullscreenChanged(!1);
        });
      } catch (t) {
        console.warn("[studio-shell] iframe requestFullscreen threw", t), this.postHostFullscreenChanged(!1);
      }
    }
  }
  lastReportedStatus;
  activeDescriptor;
  activeResourceUri = "";
  resourceGeneration = 0;
  initResendTimer;
  messageListener;
  hostSurface = k(this, {
    protocol: f,
    moduleBaseUrl: import.meta.url,
    getFrameWindow: () => this.iframe?.contentWindow
  });
  commandListener = (e) => {
    !(e instanceof CustomEvent) || !R(e.detail) || typeof e.detail.name != "string" || this.postToWidget({
      protocol: f,
      type: "command",
      resourceUri: this.activeResourceUri,
      command: e.detail
    });
  };
  eventSource = null;
  eventSourceGeneration = 0;
  eventSourceRecoveryTimer;
  authRefreshTimer;
  authRefreshInFlight = null;
  authRefreshing = !1;
  nextAuthRefreshAtMs;
  authExpiresAtMs = 0;
  pageResumeListener;
  preparedOpenLink = null;
  preparedOpenLinkTimer;
  constructor() {
    super(), this.root = this.attachShadow({ mode: "open" });
  }
  set props(e) {
    const t = this.currentProps;
    this.currentProps = e ?? {}, this.connected && this.applyPropsDiff(t, this.currentProps);
  }
  get props() {
    return this.currentProps;
  }
  connectedCallback() {
    this.connected = !0, this.renderFrame(), this.messageListener = (e) => {
      !this.iframe || e.source !== this.iframe.contentWindow || this.handleWidgetMessage(l(e.data));
    }, window.addEventListener("message", this.messageListener), this.fullscreenChangeListener = () => this.notifyHostFullscreen(), document.addEventListener("fullscreenchange", this.fullscreenChangeListener), this.addEventListener(_, this.commandListener), this.hostSurface.connect(), this.pageResumeListener = () => {
      this.currentProps.onRefreshAuth && this.nextAuthRefreshAtMs !== void 0 && Date.now() >= this.nextAuthRefreshAtMs && this.runAuthRefresh();
    }, window.addEventListener("focus", this.pageResumeListener), document.addEventListener("visibilitychange", this.pageResumeListener), this.adoptDescriptor(this.currentProps.descriptor, { initial: !0 });
  }
  disconnectedCallback() {
    this.connected = !1, this.stopInitResendLoop(), this.closeEventSource(), this.clearAuthRefreshTimer(), this.closePreparedOpenLink(), this.clearContentRevealTimer(), this.messageListener && (window.removeEventListener("message", this.messageListener), this.messageListener = void 0), this.fullscreenChangeListener && (document.removeEventListener("fullscreenchange", this.fullscreenChangeListener), this.fullscreenChangeListener = void 0), this.hostFullscreenActive = !1, this.pageResumeListener && (window.removeEventListener("focus", this.pageResumeListener), document.removeEventListener("visibilitychange", this.pageResumeListener), this.pageResumeListener = void 0), this.removeEventListener(_, this.commandListener), this.hostSurface.disconnect(), this.pendingKeyboardFocus = !1, this.iframe = null, this.root.replaceChildren();
  }
  /** props 重赋值时的推送：资源面走 adoptDescriptor,可变状态一律全量 stateChanged
   * （宿主 Renderer 已浅比较拦截无变化重设;iframe SDK 按订阅 key diff,重复帧无害）。 */
  applyPropsDiff(e, t) {
    if (this.syncLoadingTheme(), t.descriptor !== e.descriptor && this.adoptDescriptor(t.descriptor, { initial: !1 }), this.iframe && !this.contentRevealed && t.hostContext && t.hostContext.locale !== (e.hostContext ?? m).locale) {
      const i = T(this.activeDescriptor);
      i && (this.widgetReady = !1, this.widgetSubscribed = !1, this.reportStatus("loading"), this.ensureIframe(i), this.startInitResendLoop());
    }
    if (t.viewContext?.visible && e.viewContext?.visible === !1 && this.requestKeyboardFocus(), this.widgetReady && this.hostCapabilities(t).join(" ") !== this.hostCapabilities(e).join(" ")) {
      this.sendInit();
      return;
    }
    this.postStateChanged();
  }
  /** 全量轻量 state（协议 AddonWidgetState 五域中 widget 链的四域）。visible 随
   * viewContext 下发：Studio 的预览埋点按它判断面板是否对用户可见（预热实例不计打开）。 */
  buildState() {
    const e = this.currentProps, t = {
      hostContext: e.hostContext ?? m
    };
    return e.viewContext && (t.viewContext = { ...e.viewContext }), e.favoriteState && (t.favoriteState = { isFavorite: e.favoriteState.isFavorite }), e.sessionOngoing !== void 0 && (t.sessionState = { ongoing: e.sessionOngoing }), t;
  }
  postStateChanged() {
    this.widgetReady && this.postToWidget({
      protocol: f,
      type: "stateChanged",
      resourceUri: this.activeResourceUri,
      state: this.buildState()
    });
  }
  /** descriptor 采纳（初装/替换）：资源切换重置握手门并重开 init 循环；同资源换发
   * （auth/SSE 连接签名变化）只重启受影响面（对齐 applyActiveDescriptor + mono#833）。 */
  adoptDescriptor(e, t) {
    const i = this.activeDescriptor, r = this.activeResourceUri, s = L(i);
    this.activeDescriptor = e, this.activeResourceUri = g(e);
    const a = T(e);
    if (!a) {
      this.revealContent(), this.reportStatus("error");
      return;
    }
    const d = r !== this.activeResourceUri;
    d && (this.resourceGeneration += 1), t.initial || d ? (this.widgetReady = !1, this.widgetSubscribed = !1, this.reportStatus("loading"), this.ensureIframe(a), this.startInitResendLoop()) : this.widgetSubscribed && s !== L(e) && this.subscribeAddonEvents(void 0, "initial"), this.scheduleAuthRefresh();
  }
  renderFrame() {
    const e = document.createElement("style");
    e.textContent = `
      :host { display: block; width: 100%; height: 100%; }
      .shell { position: relative; width: 100%; height: 100%; overflow: hidden;
        --loading-background: #f8f8f7; --loading-color: #34322d; }
      .shell[data-theme="dark"] { --loading-background: #1a1a19; --loading-color: #dadada; }
      iframe { display: block; width: 100%; height: 100%; border: 0; opacity: 0; pointer-events: none; }
      .loading { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
        background: var(--background-gray-main, var(--loading-background));
        color: var(--icon-primary, var(--loading-color)); }
      .spinner { box-sizing: border-box; width: 24px; height: 24px; border: 3px solid;
        border-color: color-mix(in srgb, currentColor 20%, transparent); border-top-color: currentColor;
        border-radius: 50%; animation: spin 1s linear infinite; }
      .shell[data-content-ready] iframe { opacity: 1; pointer-events: auto; }
      .shell[data-content-ready] .loading { display: none; }
      @keyframes spin { to { transform: rotate(360deg); } }
    `;
    const t = document.createElement("div");
    t.className = "shell";
    const i = document.createElement("div");
    i.className = "loading";
    const r = document.createElement("div");
    r.className = "spinner", i.append(r), t.append(i), this.root.replaceChildren(e, t), this.syncLoadingTheme();
  }
  syncLoadingTheme() {
    const e = this.root.querySelector(".shell");
    e && (e.dataset.theme = (this.currentProps.hostContext ?? m).theme);
  }
  clearContentRevealTimer() {
    this.contentRevealTimer !== void 0 && (window.clearTimeout(this.contentRevealTimer), this.contentRevealTimer = void 0);
  }
  get contentRevealed() {
    return this.root.querySelector(".shell")?.hasAttribute("data-content-ready") ?? !1;
  }
  revealContent() {
    if (this.clearContentRevealTimer(), this.contentRevealed) return;
    const e = this.root.querySelector(".shell");
    e && (e.setAttribute("data-content-ready", ""), this.currentProps.onContentReveal?.());
  }
  ensureIframe(e) {
    const t = this.root.querySelector(".shell");
    if (!t)
      return;
    this.currentProps.hostContext || console.warn(
      "[studio-shell] hostContext missing at iframe creation, falling back to locale",
      m.locale
    );
    const i = U(
      e,
      (this.currentProps.hostContext ?? m).locale
    );
    if (this.iframe && this.iframe.src === i)
      return;
    t.removeAttribute("data-content-ready"), this.clearContentRevealTimer(), this.contentRevealTimer = window.setTimeout(() => this.revealContent(), 2e4), this.iframe?.remove();
    const r = document.createElement("iframe");
    r.title = this.activeDescriptor?.title ?? "Slides studio", r.setAttribute("sandbox", ee), r.setAttribute("allow", te), r.setAttribute("allowfullscreen", ""), r.addEventListener("load", () => {
      this.iframeLoaded = !0, this.sendInit();
      const s = this.pendingKeyboardFocus || this.currentProps.viewContext?.visible !== !1;
      this.pendingKeyboardFocus = !1, s && this.focusIframeForKeyboard(r);
    }), r.src = i, this.iframe = r, this.iframeLoaded = !1, t.append(r);
  }
  /**
   * 宿主声明面板转为展示态时收回键盘焦点。iframe 尚未 load（首开要先拉 widget）时
   * 挂起，由 load 回调补上——宿主无需感知 iframe 生命周期。
   */
  requestKeyboardFocus() {
    if (this.iframe && this.iframeLoaded) {
      this.focusIframeForKeyboard(this.iframe);
      return;
    }
    this.pendingKeyboardFocus = !0;
  }
  focusIframeForKeyboard(e) {
    const t = document.activeElement;
    t instanceof HTMLElement && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable) || e.focus();
  }
  postToWidget(e) {
    const t = this.iframe?.contentWindow;
    t && t.postMessage(e, "*");
  }
  hostCapabilities(e = this.currentProps) {
    const t = e.hostContext?.client?.productName === "manus-agents";
    return [
      ...e.onRequestClose ? [F] : [],
      ...e.onHostMenuChange ? [P] : [],
      ...!t && e.onOpenShareMenu ? [A] : [],
      ...!t && e.onOpenShareMenu && e.onShareMenuHover ? [w] : [],
      ...e.onRequestPreviewView ? [D] : [],
      ...e.onSetDefaultPreviewView ? [O] : [],
      ...e.onRefreshAuth ? [x] : [],
      ...e.onLocateInTask ? [N] : [],
      ...e.favoriteState && e.onToggleFavorite ? [H] : [],
      ...!t && e.onStartConnectorDelivery ? [E] : [],
      ...e.onSendUserMessage ? [W] : []
    ];
  }
  sendInit(e = this.activeDescriptor) {
    e && this.postToWidget({
      protocol: f,
      type: "init",
      resourceUri: g(e),
      descriptor: e,
      renderData: e.renderData,
      state: this.buildState(),
      hostCapabilities: this.hostCapabilities()
    });
  }
  /** init 重发循环（对齐 AddonWidgetHost：500ms × 12，直到 widget subscribe）。 */
  startInitResendLoop() {
    this.stopInitResendLoop(), this.sendInit();
    let e = 0;
    this.initResendTimer = window.setInterval(() => {
      if (this.widgetSubscribed || e >= Y) {
        this.stopInitResendLoop();
        return;
      }
      e += 1, this.sendInit();
    }, q);
  }
  stopInitResendLoop() {
    this.initResendTimer !== void 0 && (window.clearInterval(this.initResendTimer), this.initResendTimer = void 0);
  }
  reportStatus(e) {
    e !== this.lastReportedStatus && (this.lastReportedStatus = e, this.currentProps.onStatusChange?.(e));
  }
  ack(e, t, i = this.activeResourceUri) {
    e && this.postToWidget({
      protocol: f,
      type: "ack",
      requestId: e,
      resourceUri: i,
      result: t
    });
  }
  fail(e, t, i = this.activeResourceUri) {
    e && this.postToWidget({
      protocol: f,
      type: "error",
      requestId: e,
      resourceUri: i,
      error: t
    });
  }
  async handleWidgetMessage(e) {
    if (h(e, "protocol") !== f)
      return;
    const t = h(e, "type"), i = h(e, "requestId"), r = h(e, "resourceUri"), s = this.currentProps;
    if (t === "ready") {
      const n = !this.widgetReady;
      this.widgetReady = !0, n && this.sendInit();
      return;
    }
    if (t === "contentReady") {
      (!r || r === this.activeResourceUri) && (this.revealContent(), this.reportStatus("ready"));
      return;
    }
    if (t === B) {
      this.handleHostFullscreenRequest(h(e, "action") ?? "");
      return;
    }
    if (this.hostSurface.handleFrameMessage(e))
      return;
    if (t === "subscribeAddonEvents") {
      this.widgetSubscribed = !0, this.widgetReady = !0, this.subscribeAddonEvents(i, "initial");
      return;
    }
    if (t === "authRefresh") {
      if (!i || !s.onRefreshAuth || !r || r !== this.activeResourceUri) {
        this.fail(i, "auth_refresh_failed");
        return;
      }
      try {
        const n = await this.refreshAuth();
        this.adoptDescriptor(n, { initial: !1 }), this.ack(i, { descriptor: n }, r);
      } catch {
        this.fail(i, "auth_refresh_failed");
      }
      return;
    }
    if (t === "requestClose") {
      this.ack(i, { closed: !!s.onRequestClose }), s.onRequestClose?.();
      return;
    }
    if (t === "locateInTask") {
      this.ack(i, { located: !!s.onLocateInTask }), s.onLocateInTask?.();
      return;
    }
    if (t === "toggleFavorite") {
      this.ack(i, { applied: !!(s.favoriteState && s.onToggleFavorite) }), s.onToggleFavorite?.();
      return;
    }
    if (t === "requestPreviewView" || t === "setDefaultPreviewView") {
      const n = t === "requestPreviewView" ? s.onRequestPreviewView : s.onSetDefaultPreviewView, c = Q(e.view ?? l(e.data).view), u = !r || r === this.activeResourceUri;
      if (!n || !c || !u || !i) {
        this.fail(i, "preview_view_request_invalid");
        return;
      }
      n(c), this.ack(i, { applied: !0 });
      return;
    }
    if (t === "openShareMenu") {
      const n = l(e.data).anchor ?? e.anchor, c = C(n);
      if (!this.hostCapabilities().includes(A) || !s.onOpenShareMenu || n !== void 0 && !c) {
        this.fail(i, "Share menu is unavailable");
        return;
      }
      const u = this.iframe?.getBoundingClientRect();
      s.onOpenShareMenu(
        c ? {
          x: c.x + (u?.left ?? 0),
          y: c.y + (u?.top ?? 0),
          width: c.width,
          height: c.height
        } : void 0
      ), this.ack(i, { opened: !0 });
      return;
    }
    if (t === "setShareMenuHover") {
      const n = l(e.data), c = "anchor" in n ? n.anchor : e.anchor, u = c === null ? null : C(c);
      if (!this.hostCapabilities().includes(w) || !s.onShareMenuHover || u === void 0) {
        this.fail(i, "Share menu is unavailable");
        return;
      }
      const p = this.iframe?.getBoundingClientRect();
      s.onShareMenuHover(
        u && {
          x: u.x + (p?.left ?? 0),
          y: u.y + (p?.top ?? 0),
          width: u.width,
          height: u.height
        }
      ), this.ack(i, { applied: !0 });
      return;
    }
    if (t === "setHostMenu") {
      const n = l(e.data).items ?? e.items;
      if (!s.onHostMenuChange || !Array.isArray(n)) {
        this.fail(i, "host_menu_unavailable");
        return;
      }
      s.onHostMenuChange(M(n)), this.ack(i, { applied: !0 });
      return;
    }
    if (t === "startConnectorDelivery") {
      const n = l(e.data), c = h(n, "destination");
      if (!this.hostCapabilities().includes(E) || !s.onStartConnectorDelivery || !c) {
        this.fail(i, "connector_delivery_unavailable");
        return;
      }
      this.ack(i, { accepted: !0 }), s.onStartConnectorDelivery({
        resourceUri: r ?? this.activeResourceUri,
        destination: c,
        versionId: h(n, "versionId"),
        source: h(n, "source"),
        attemptId: h(n, "attemptId")
      });
      return;
    }
    if (t === "openLink") {
      await this.handleOpenLink(i, r, l(e.data));
      return;
    }
    if (t === "sendUserMessage") {
      const n = l(l(e.data).message ?? e.message), c = n.mode, u = h(n, "text");
      if (c !== "submit" && c !== "queue" && c !== "auto") {
        this.fail(i, "user_message_invalid");
        return;
      }
      if (!s.onSendUserMessage || !u) {
        this.fail(i, "user_message_unavailable");
        return;
      }
      const p = l(n.resource);
      try {
        const v = await s.onSendUserMessage({
          resourceUri: h(p, "uri") ?? r ?? this.activeResourceUri,
          versionId: h(p, "versionId"),
          mode: c,
          text: u,
          ...R(n.extData) ? { extData: n.extData } : {},
          ...Array.isArray(n.annotations) ? { annotations: n.annotations.filter(Z) } : {}
        });
        this.ack(i, v);
      } catch (v) {
        this.fail(i, v instanceof Error ? v.message : "user_message_failed");
      }
      return;
    }
    if (t !== "action")
      return;
    const a = h(e, "actionName");
    if (!i || !a)
      return;
    if (!s.onAction) {
      this.fail(i, "Widget action is unavailable");
      return;
    }
    const d = e.prepareOpenLink === !0 || l(e.data).prepareOpenLink === !0;
    d && this.prepareOpenLink();
    try {
      const n = await s.onAction({
        resourceUri: r ?? this.activeResourceUri,
        actionName: a,
        arguments: l(e.arguments)
      });
      n.descriptor && this.adoptDescriptor(n.descriptor, { initial: !1 }), this.postToWidget({
        protocol: f,
        type: "ack",
        requestId: i,
        resourceUri: this.activeResourceUri,
        descriptor: n.descriptor,
        result: n.result
      });
    } catch (n) {
      d && this.closePreparedOpenLink(), this.fail(i, n instanceof Error ? n.message : "Widget action failed");
    }
  }
  // ---- openLink（薄壳跑在宿主 origin，行为对齐 addonWidgetOpenLinkUtils） ----
  prepareOpenLink() {
    this.closePreparedOpenLink();
    const e = window.open("about:blank", "_blank");
    e && (e.opener = null, this.preparedOpenLink = {
      get closed() {
        return e.closed;
      },
      navigate(t) {
        e.location.replace(t);
      },
      close() {
        e.close();
      }
    }, this.preparedOpenLinkTimer = window.setTimeout(() => {
      this.closePreparedOpenLink();
    }, z));
  }
  takePreparedOpenLink() {
    this.preparedOpenLinkTimer !== void 0 && (window.clearTimeout(this.preparedOpenLinkTimer), this.preparedOpenLinkTimer = void 0);
    const e = this.preparedOpenLink;
    return this.preparedOpenLink = null, e;
  }
  closePreparedOpenLink() {
    this.takePreparedOpenLink()?.close();
  }
  async handleOpenLink(e, t, i) {
    const r = h(i, "url"), s = i.target ?? "_blank", a = typeof i.download == "string" && i.download.trim() ? i.download.trim() : void 0;
    let d;
    try {
      d = r ? new URL(r) : void 0;
    } catch {
      d = void 0;
    }
    if (!e || !t || t !== this.activeResourceUri || !d || d.protocol !== "http:" && d.protocol !== "https:" || s !== "_blank" && s !== "_self") {
      this.closePreparedOpenLink(), this.fail(e, "open_link_request_invalid");
      return;
    }
    if (this.currentProps.onOpenLink)
      try {
        if ((await this.currentProps.onOpenLink({
          url: d.toString(),
          target: s,
          download: a
        })).handled) {
          this.closePreparedOpenLink(), this.ack(e, { opened: !0 });
          return;
        }
      } catch {
      }
    const n = this.takePreparedOpenLink();
    if (n && !n.closed) {
      if (!a && s === "_blank") {
        n.navigate(d.toString()), this.ack(e, { opened: !0 });
        return;
      }
      n.close();
    }
    const c = document.createElement("a");
    c.href = d.toString(), c.target = a ? "_self" : s, c.rel = "noopener noreferrer", a && (c.download = a), c.click(), this.ack(e, { opened: !0 });
  }
  // ---- SSE（薄壳持有 EventSource，错误恢复阶梯同 addonEventStreamRecovery） ----
  closeEventSource() {
    this.eventSourceRecoveryTimer !== void 0 && (window.clearTimeout(this.eventSourceRecoveryTimer), this.eventSourceRecoveryTimer = void 0), this.eventSourceGeneration += 1, this.eventSource?.close(), this.eventSource = null;
  }
  subscribeAddonEvents(e, t) {
    this.closeEventSource();
    const i = this.activeDescriptor, r = g(i), s = I(i);
    if (!s || typeof EventSource > "u") {
      this.ack(e, { subscribed: !1 }, r);
      return;
    }
    const a = new EventSource(s), d = this.eventSourceGeneration;
    let n = t;
    this.eventSource = a;
    const c = (u) => {
      if (u instanceof MessageEvent)
        try {
          const p = JSON.parse(u.data);
          this.postToWidget({
            protocol: f,
            type: "addonEvents",
            resourceUri: r,
            events: [p]
          });
        } catch {
        }
    };
    a.addEventListener("addonEvents", c), a.onmessage = c, a.onopen = () => {
      this.eventSource === a && (n = "initial");
    }, a.onerror = () => {
      if (this.eventSource !== a || this.eventSourceGeneration !== d || a.readyState !== EventSource.CLOSED)
        return;
      this.postToWidget({
        protocol: f,
        type: "addonEvents",
        resourceUri: r,
        events: [{ type: "manus.widget.event_stream_error", target: r }]
      });
      const u = J(n);
      u.action === "stop" || this.eventSourceRecoveryTimer !== void 0 || (this.eventSourceRecoveryTimer = window.setTimeout(() => {
        if (this.eventSourceRecoveryTimer = void 0, !(this.eventSource !== a || this.eventSourceGeneration !== d)) {
          if (u.action === "retry") {
            this.subscribeAddonEvents(void 0, u.stage);
            return;
          }
          this.refreshAuth().then((p) => {
            this.eventSource !== a || this.eventSourceGeneration !== d || (this.adoptDescriptor(p, { initial: !1 }), this.subscribeAddonEvents(void 0, u.stage));
          }).catch(() => {
          });
        }
      }, j));
    }, this.ack(e, { subscribed: !0 }, r);
  }
  // ---- auth 刷新（被动 authRefresh + 主动到期前刷新，语义同 AddonWidgetHost） ----
  refreshAuth() {
    const e = this.currentProps.onRefreshAuth;
    if (!e)
      return Promise.reject(new Error("auth_refresh_unavailable"));
    const t = this.activeResourceUri;
    if (!t)
      return Promise.reject(new Error("auth_refresh_resource_missing"));
    if (this.authRefreshInFlight)
      return this.authRefreshInFlight;
    const i = this.resourceGeneration, r = S(this.activeDescriptor), s = Promise.resolve().then(() => e(t)).then((a) => {
      if (i !== this.resourceGeneration || this.activeResourceUri !== t)
        throw new Error("auth_refresh_resource_changed");
      if (g(a) !== t)
        throw new Error("auth_refresh_resource_mismatch");
      return S(this.activeDescriptor) !== r ? this.activeDescriptor : a;
    });
    return this.authRefreshInFlight = s, s.finally(() => {
      this.authRefreshInFlight === s && (this.authRefreshInFlight = null);
    });
  }
  clearAuthRefreshTimer() {
    this.authRefreshTimer !== void 0 && (window.clearTimeout(this.authRefreshTimer), this.authRefreshTimer = void 0);
  }
  scheduleAuthRefresh(e = this.activeDescriptor) {
    this.clearAuthRefreshTimer();
    const t = Date.now();
    this.authExpiresAtMs = $(e, t), this.nextAuthRefreshAtMs = X(e, t), this.currentProps.onRefreshAuth && this.nextAuthRefreshAtMs !== void 0 && this.connected && (this.authRefreshTimer = window.setTimeout(
      () => this.runAuthRefresh(),
      Math.max(0, this.nextAuthRefreshAtMs - t)
    ));
  }
  runAuthRefresh() {
    !this.currentProps.onRefreshAuth || !this.connected || this.authRefreshing || (this.authRefreshing = !0, this.refreshAuth().then((e) => {
      this.connected && (this.adoptDescriptor(e, { initial: !1 }), this.sendInit(e));
    }).catch(() => {
      const e = this.authExpiresAtMs - Date.now();
      this.connected && e > 0 && (this.authRefreshTimer = window.setTimeout(
        () => this.runAuthRefresh(),
        Math.min(K, e)
      ));
    }).finally(() => {
      this.authRefreshing = !1;
    }));
  }
}
customElements.get(y) || customElements.define(y, ie);
export {
  ie as StudioShell
};
