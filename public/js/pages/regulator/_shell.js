import { roleShell } from "../../layout.js";
import { icons } from "../../icons.js";

export function regulatorShell({ currentPath, body }) {
  return roleShell({
    role: "regulator", roleLabel: "Regulator Console", accent: "gold", currentPath, body,
    items: [
      { to: "/regulator",              label: "Overview",              icon: icons.dashboard() },
      { to: "/regulator/government",   label: "Onboard Regulators",    icon: icons.landmark() },
      { to: "/regulator/institutions", label: "Authorize Institutions",icon: icons.building() },
      { to: "/regulator/activity",     label: "Audit Activity",        icon: icons.activity() },
    ],
  });
}
export function wireRoleShell() {
  const cw = document.getElementById("connect-wallet");
  if (cw) cw.addEventListener("click", () => import("../../hooks/wallet.js").then(m => m.wallet.connect()));
}
