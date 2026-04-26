export function value(selector) {
  return document.querySelector(selector)?.value?.trim() || "";
}

export function setValue(selector, val) {
  const el = document.querySelector(selector);
  if (el) el.value = val ?? "";
}

export function setText(selector, val) {
  const el = document.querySelector(selector);
  if (el) el.textContent = val ?? "";
}

export function setHtml(selector, val) {
  const el = document.querySelector(selector);
  if (el) el.innerHTML = val ?? "";
}

export function notice(message, type = "info") {
  let el = document.getElementById("app-notice");
  if (!el) {
    el = document.createElement("div");
    el.id = "app-notice";
    el.className = "toast";
    document.body.appendChild(el);
  }
  el.className = `toast ${type}`;
  el.textContent = message;
  setTimeout(() => el.remove(), 4200);
}

export function fmtTime(seconds) {
  if (!seconds) return "—";
  return new Date(Number(seconds) * 1000).toLocaleString();
}
