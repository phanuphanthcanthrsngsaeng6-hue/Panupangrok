const n = new RegExp("^[a-f0-9]{16}$");
function _(e, t) {
  const E = new URL(t).searchParams.get("v");
  return E && n.test(E) ? `${e}-${E}` : e;
}
export {
  _ as w
};
