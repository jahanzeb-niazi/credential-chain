import { roleShell } from "../../layout.js";
import { icons } from "../../icons.js";
import { wallet } from "../../hooks/wallet.js";

export function verifierShell({ currentPath, body }) {
  return roleShell({
    role: "verifier", roleLabel: "Verifier", accent: "navy", currentPath, body,
    items: [
      { to: "/verifier",           label: "Quick Verify",    icon: icons.dashboard() },
      { to: "/verifier/lookup",    label: "Direct Lookup",   icon: icons.shield() },
      { to: "/verifier/scan",      label: "Scan QR",         icon: icons.scan() },
      { to: "/verifier/audit",     label: "Audit History",   icon: icons.history() },
      { to: "/verifier/timestamp", label: "Timestamp Check", icon: icons.clock() },
    ],
  });
}

export function wireRoleShell() {
  const cw = document.getElementById("connect-wallet");
  if (cw) {
    cw.addEventListener("click", () =>
      wallet.connect().catch(e =>
        import("../../utils/dom.js").then(m => m.notice(e.message, "error"))
      )
    );
    wallet._updateButtons();
  }
}
