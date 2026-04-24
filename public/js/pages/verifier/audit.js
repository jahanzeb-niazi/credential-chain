import { verifierShell, wireRoleShell } from "./_shell.js";
import { pageHeader } from "../../layout.js";
import { icons } from "../../icons.js";

export function verifierAudit({ path }) {
  const body = `
    ${pageHeader({
      eyebrow: "UC-11 · FULL CREDENTIAL HISTORY",
      title: "Audit history",
      description: "Every event for a credential — issuance, updates, revocations — pulled from contract event logs.",
    })}
    <div class="card">
      <div class="row">
        <input class="input mono" placeholder="Credential ID or CID" style="flex:1"/>
        <button class="btn btn-primary">${icons.search()} Load history</button>
      </div>
    </div>

    <div class="card" style="margin-top:24px;">
      <h3 class="card-title">Timeline</h3>
      <p class="card-desc">No events loaded yet. Search above to query the ledger.</p>
      <div class="timeline" style="opacity:.55">
        <div class="tl-item"><h5>Credential issued</h5><p class="meta">Block #— · — UTC · 0x…</p></div>
        <div class="tl-item"><h5>Metadata updated</h5><p class="meta">Block #— · — UTC · 0x…</p></div>
        <div class="tl-item"><h5>Credential revoked</h5><p class="meta">Block #— · — UTC · 0x…</p></div>
      </div>
    </div>
  `;
  return { html: verifierShell({ currentPath: path, body }), mount: wireRoleShell };
}
