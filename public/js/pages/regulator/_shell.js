import { roleShell } from "../../layout.js";
import { icons } from "../../icons.js";
import { wallet } from "../../hooks/wallet.js";

export function regulatorShell({ currentPath, body }) {
  return roleShell({
    role: "regulator", roleLabel: "Regulator Console", accent: "gold", currentPath, body,
    items: [
      { to: "/regulator",              label: "Overview",               icon: icons.dashboard() },
      { to: "/regulator/government",   label: "Onboard Regulators",     icon: icons.landmark() },
      { to: "/regulator/institutions", label: "Authorize Institutions", icon: icons.building() },
      { to: "/regulator/activity",     label: "Audit Activity",         icon: icons.activity() },
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
