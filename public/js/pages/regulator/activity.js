import { regulatorShell, wireRoleShell } from "./_shell.js";
import { pageHeader, emptyState } from "../../layout.js";
import { icons } from "../../icons.js";

export function regulatorActivity({ path }) {
  const body = `
    ${pageHeader({
      eyebrow: "UC-15 · INSTITUTIONAL AUDIT",
      title: "Audit institution activity",
      description: "Pull the full on-chain history for any institution: credentials issued, updated, revoked — with timestamps. Flag or suspend if policy is violated.",
      actions: `<button class="btn btn-danger" disabled>${icons.ban()} Suspend issuance rights</button>`,
    })}
    <div class="card">
      <div class="row">
        <input class="input mono" placeholder="Institution wallet or accreditation ID" style="flex:1"/>
        <button class="btn btn-primary">${icons.search()} Load activity</button>
      </div>
    </div>

    <div class="grid-3" style="margin-top:24px">
      <div class="card flat" style="padding:18px;">
        <p class="muted" style="font-size:12px; text-transform:uppercase; letter-spacing:.1em; margin:0;">Issued (all-time)</p>
        <p class="serif" style="font-size:30px; color:var(--navy); margin:6px 0 0;">—</p>
      </div>
      <div class="card flat" style="padding:18px;">
        <p class="muted" style="font-size:12px; text-transform:uppercase; letter-spacing:.1em; margin:0;">Updated</p>
        <p class="serif" style="font-size:30px; color:var(--navy); margin:6px 0 0;">—</p>
      </div>
      <div class="card flat" style="padding:18px;">
        <p class="muted" style="font-size:12px; text-transform:uppercase; letter-spacing:.1em; margin:0;">Revoked</p>
        <p class="serif" style="font-size:30px; color:var(--navy); margin:6px 0 0;">—</p>
      </div>
    </div>

    <div style="height:24px"></div>
    ${emptyState({
      icon: icons.activity(),
      title: "No activity loaded",
      description: "Search for an institution above. Activity is read from contract events filtered by issuer address.",
    })}
  `;
  return { html: regulatorShell({ currentPath: path, body }), mount: wireRoleShell };
}
