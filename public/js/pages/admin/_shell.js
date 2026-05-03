import { roleShell } from "../../layout.js";
import { icons } from "../../icons.js";
import { wallet } from "../../hooks/wallet.js";

export function adminShell({ currentPath, body }) {
  return roleShell({
    role: "admin", roleLabel: "University Admin", accent: "navy", currentPath, body,
    items: [
      { to: "/admin",        label: "Overview",          icon: icons.dashboard() },
      { to: "/admin/issue",  label: "Issue Credential",  icon: icons.plus() },
      { to: "/admin/manage", label: "Manage Issued",     icon: icons.doc() },
      { to: "/admin/update", label: "Update Credential", icon: icons.edit() },
      { to: "/admin/revoke", label: "Revoke",            icon: icons.ban() },
      { to: "/admin/cid",    label: "IPFS / CID Tools",  icon: icons.cid() },
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
