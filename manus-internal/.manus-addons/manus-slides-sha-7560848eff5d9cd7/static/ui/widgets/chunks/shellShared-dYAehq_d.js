import { a as u, b as I, d as l, e as E } from "./hostSurface-DyLQqBF-.js";
const f = "manus.addon.widget/v2", U = "chrome_close", N = "chrome_share_menu", S = "chrome_share_menu_hover", D = "preview_view", M = "default_preview_view", L = "auth_refresh", C = "locate_in_task", R = "favorite", O = "connector_delivery", y = "send_user_message", h = "host_menu";
function i(t) {
  return typeof t == "object" && t !== null && !Array.isArray(t);
}
function W(t, n) {
  if (!t || !n)
    return t;
  try {
    const _ = new URL(t, window.location.href);
    return _.searchParams.set("locale", n), _.toString();
  } catch {
    return t;
  }
}
function T(t, n) {
  if (t === null || typeof t != "object" || !("moduleUrl" in t) || typeof t.moduleUrl != "string" || /^https?:\/\//i.test(t.moduleUrl))
    return t;
  try {
    return { ...t, moduleUrl: new URL(t.moduleUrl, n).toString() };
  } catch {
    return t;
  }
}
function g(t, n) {
  const _ = /* @__PURE__ */ new Map(), A = (e) => {
    n.getFrameWindow()?.postMessage({ protocol: n.protocol, ...e }, "*");
  }, c = (e) => {
    if (!(e instanceof CustomEvent) || !i(e.detail))
      return;
    const o = typeof e.detail.id == "string" ? e.detail.id : "", s = o ? _.get(o) : void 0;
    s && (_.delete(o), A({ type: "ack", requestId: s, result: e.detail }));
  }, a = (e, o) => {
    t.dispatchEvent(new CustomEvent(e, { detail: o, bubbles: !0, composed: !0 }));
  };
  return {
    connect() {
      t.addEventListener(E, c);
    },
    disconnect() {
      t.removeEventListener(E, c), _.clear();
    },
    handleFrameMessage(e) {
      const o = typeof e.type == "string" ? e.type : "";
      if (o === "toast")
        return i(e.data) && a(u, e.data), !0;
      if (o === "track")
        return i(e.data) && typeof e.data.event == "string" && a(I, e.data), !0;
      if (o === "dialog") {
        const s = typeof e.requestId == "string" ? e.requestId : "", r = i(e.data) ? e.data : void 0;
        if (!s || !r || typeof r.id != "string" || r.action !== "open")
          return s && A({ type: "error", requestId: s, error: "dialog_request_invalid" }), !0;
        _.set(r.id, s);
        const d = r.kind === "custom" ? {
          ...r,
          props: {
            ...i(r.props) ? r.props : {},
            dialog_id: r.id
          }
        } : r;
        return a(l, T(d, n.moduleBaseUrl)), !0;
      }
      return !1;
    }
  };
}
export {
  f as M,
  W as a,
  U as b,
  g as c,
  h as d,
  N as e,
  S as f,
  D as g,
  M as h,
  L as i,
  C as j,
  R as k,
  O as l,
  y as m
};
