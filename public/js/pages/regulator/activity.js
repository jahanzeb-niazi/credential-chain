import { regulatorShell, wireRoleShell } from "./_shell.js";
import { pageHeader, emptyState } from "../../layout.js";
import { icons } from "../../icons.js";
import { contract } from "../../hooks/contract.js";
import { api } from "../../hooks/api.js";
import { notice, value, setHtml, setText } from "../../utils/dom.js";

export function regulatorActivity({ path }) {
  const body = `
    ${pageHeader({
      eyebrow: "UC-15 · INSTITUTIONAL AUDIT",
      title: "Audit institution activity",
      description: "Pull the full on-chain history for any institution: credentials issued, updated, revoked — with timestamps. Flag or suspend if policy is violated.",
      actions: `<button id="suspend-institution" class="btn btn-danger">${icons.ban()} Suspend issuance rights</button>`,
    })}
    <div class="card">
      <div class="row">
        <input id="institution-wallet" class="input mono" placeholder="Institution wallet" style="flex:1"/>
        <button id="load-activity" class="btn btn-primary">${icons.search()} Load activity</button>
      </div>
    </div>

    <div class="grid-3" style="margin-top:24px">
      <div class="card flat" style="padding:18px;">
        <p class="muted" style="font-size:12px; text-transform:uppercase; letter-spacing:.1em; margin:0;">Issued (all-time)</p>
        <p id="issued-count" class="serif" style="font-size:30px; color:var(--navy); margin:6px 0 0;">—</p>
      </div>
      <div class="card flat" style="padding:18px;">
        <p class="muted" style="font-size:12px; text-transform:uppercase; letter-spacing:.1em; margin:0;">Updated</p>
        <p id="updated-count" class="serif" style="font-size:30px; color:var(--navy); margin:6px 0 0;">—</p>
      </div>
      <div class="card flat" style="padding:18px;">
        <p class="muted" style="font-size:12px; text-transform:uppercase; letter-spacing:.1em; margin:0;">Revoked</p>
        <p id="revoked-count" class="serif" style="font-size:30px; color:var(--navy); margin:6px 0 0;">—</p>
      </div>
    </div>

    <div style="height:24px"></div>
    <div id="activity-result">${emptyState({
      icon: icons.activity(),
      title: "No activity loaded",
      description: "Search for an institution above. Activity is read from contract events filtered by issuer address.",
    })}</div>
  `;
  return { html: regulatorShell({ currentPath: path, body }), mount: () => {
    wireRoleShell();
    document.getElementById("load-activity")?.addEventListener("click", async () => {
      try { const { events } = await api.institutionActivity(value("#institution-wallet")); setText("#issued-count", events.length); setText("#updated-count", "—"); setText("#revoked-count", "—"); setHtml("#activity-result", `<div class="card"><pre class="mono">${JSON.stringify(events, null, 2)}</pre></div>`); }
      catch (error) { notice(error.message, "error"); }
    });
    document.getElementById("suspend-institution")?.addEventListener("click", async () => {
      try { const tx = await contract.suspendInstitution(value("#institution-wallet")); notice(`Suspension submitted: ${tx}`, "success"); }
      catch (error) { notice(error.message, "error"); }
    });
  } };
}
