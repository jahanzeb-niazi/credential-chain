import { icons } from "./icons.js";

export function siteHeader(currentPath) {
  const isActive = (p) => (currentPath === p || (p !== "/" && currentPath.startsWith(p))) ? "active" : "";
  return `
  <header class="site-header">
    <div class="inner">
      <a class="brand" href="#/">
        <span class="brand-mark">${icons.cap()}</span>
        <span class="brand-name">CredLedger</span>
      </a>
      <nav class="nav-links">
        <a href="#/" class="${currentPath === "/" ? "active" : ""}">Home</a>
        <a href="#/credentials" class="${isActive("/credentials")}">My Credentials</a>
        <a href="#/share" class="${isActive("/share")}">Share</a>
        <div class="dropdown" id="consoles-dd">
          <a href="#" id="consoles-trigger">Consoles ${icons.chevron()}</a>
          <div class="dropdown-menu">
            <div class="label">Switch role</div>
            <a href="#/credentials">${icons.users()}<span>Student / Graduate</span></a>
            <a href="#/admin">${icons.building()}<span>University Admin</span></a>
            <a href="#/verifier">${icons.shield()}<span>Verifier</span></a>
            <a href="#/regulator">${icons.landmark()}<span>Regulator / Government</span></a>
          </div>
        </div>
      </nav>
      <button class="btn btn-primary btn-sm" id="connect-wallet">${icons.wallet()} Connect Wallet</button>
    </div>
  </header>`;
}

export function siteFooter() {
  return `
  <footer class="site-footer">
    <div class="inner">
      <span class="brand-name serif" style="color:var(--navy)">CredLedger</span>
      <span>© ${new Date().getFullYear()} CredLedger. Verifiable credentials on Ethereum.</span>
    </div>
  </footer>`;
}

export function publicLayout(currentPath, body) {
  return `${siteHeader(currentPath)}<main>${body}</main>${siteFooter()}`;
}

export function roleShell({ role, roleLabel, accent = "navy", currentPath, items, body }) {
  const navItems = items.map(it => {
    const active = currentPath === it.to ? "active" : "";
    return `<a href="#${it.to}" class="${active}">${it.icon}<span>${it.label}</span></a>`;
  }).join("");
  return `
  <div class="role-shell">
    <aside class="role-sidebar ${accent}">
      <a class="brand top" href="#/">
        <span class="brand-mark">${icons.cap()}</span>
        <span class="brand-name" style="font-size:18px">CredLedger</span>
      </a>
      <div class="console-label">
        <small>Console</small>
        <h2>${roleLabel}</h2>
      </div>
      <nav class="role-nav">${navItems}</nav>
      <div class="bottom"><a href="#/">← Back to home</a></div>
    </aside>
    <div class="role-main">
      <header class="role-topbar">
        <span class="crumb">${roleLabel} · CredLedger</span>
        <button class="btn btn-primary btn-sm" id="connect-wallet">${icons.wallet()} Connect Wallet</button>
      </header>
      <main class="role-content"><div class="inner">${body}</div></main>
    </div>
  </div>`;
}

export function pageHeader({ eyebrow, title, description, actions = "" }) {
  return `
  <div class="page-header">
    <div>
      ${eyebrow ? `<p class="eyebrow">${eyebrow}</p>` : ""}
      <h1>${title}</h1>
      ${description ? `<p>${description}</p>` : ""}
    </div>
    ${actions ? `<div class="actions">${actions}</div>` : ""}
  </div>`;
}

export function emptyState({ icon, title, description, action = "" }) {
  return `
  <div class="empty">
    <div class="icon-circle">${icon}</div>
    <h3>${title}</h3>
    <p>${description}</p>
    ${action ? `<div class="cta">${action}</div>` : ""}
  </div>`;
}

export function wirePublicHeader() {
  const trigger = document.getElementById("consoles-trigger");
  const dd = document.getElementById("consoles-dd");
  if (trigger && dd) {
    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      dd.classList.toggle("open");
    });
    document.addEventListener("click", (e) => {
      if (!dd.contains(e.target)) dd.classList.remove("open");
    });
  }
  _wireWalletButton();
}

export function wireRoleHeader() {
  _wireWalletButton();
}

function _wireWalletButton() {
  import("./hooks/wallet.js").then(({ wallet }) => {
    const btns = document.querySelectorAll("#connect-wallet, #connect-wallet-2");
    btns.forEach(btn => {
      btn.addEventListener("click", () =>
        wallet.connect().catch(e =>
          import("./utils/dom.js").then(m => m.notice(e.message, "error"))
        )
      );
    });
    wallet._updateButtons();
  });
}
