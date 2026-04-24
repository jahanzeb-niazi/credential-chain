import { adminShell, wireRoleShell } from "./_shell.js";
import { pageHeader, emptyState } from "../../layout.js";
import { icons } from "../../icons.js";

export function adminManage({ path }) {
  const body = `
    ${pageHeader({
      eyebrow: "UC-02 · ACTIVE LEDGER",
      title: "Manage issued credentials",
      description: "Browse credentials issued by your institution. Filter, inspect on-chain status, jump to update or revoke flows.",
    })}
    <div class="card" style="padding:0; overflow:hidden;">
      <div class="row between" style="padding:16px 20px; border-bottom:1px solid var(--border);">
        <div class="row">
          <input class="input" placeholder="Search by student, CID or credential ID" style="width:320px;"/>
          <select class="select" style="width:160px;"><option>All types</option><option>Bachelor</option><option>Master</option><option>PhD</option></select>
          <select class="select" style="width:140px;"><option>All status</option><option>Active</option><option>Revoked</option></select>
        </div>
        <a class="btn btn-primary btn-sm" href="#/admin/issue">${icons.plus()} New</a>
      </div>
      <div style="padding:24px;">
        ${emptyState({
          icon: icons.doc(),
          title: "No issued credentials in this view",
          description: "Connect the institution wallet to load on-chain history. Listings come from contract events filtered by issuer address.",
        })}
      </div>
    </div>
  `;
  return { html: adminShell({ currentPath: path, body }), mount: wireRoleShell };
}
