import { regulatorShell, wireRoleShell } from "./_shell.js";
import { pageHeader } from "../../layout.js";
import { icons } from "../../icons.js";
import { contract } from "../../hooks/contract.js";
import { notice, value } from "../../utils/dom.js";

export function regulatorInstitutions({ path }) {
  const body = `
    ${pageHeader({
      eyebrow: "UC-14 · INSTITUTION REGISTRY",
      title: "Authorize universities",
      description: "Universities cannot issue credentials until a regulator authorizes their wallet. Suspended institutions lose issuance rights immediately.",
    })}
    <div class="grid-2">
      <div class="card">
        <h3 class="card-title">Authorize a university</h3>
        <div class="field"><label class="label">Institution name</label><input id="institution-name" class="input" placeholder="University of Lovable"/></div>
        <div class="field"><label class="label">Accreditation ID</label><input id="accreditation-id" class="input" placeholder="UGC-12345"/></div>
        <div class="field"><label class="label">Issuer wallet</label><input id="institution-wallet" class="input mono" placeholder="0x…"/></div>
        <div class="field"><label class="label">Authorization scope</label>
          <select class="select"><option>All credential types</option><option>Degrees only</option><option>Certificates only</option></select>
        </div>
        <button id="authorize-institution" class="btn btn-gold">${icons.check()} Authorize</button>
        <p class="help">Wires to <span class="mono">contract.authorizeInstitution(addr, name)</span>.</p>
      </div>
      <div class="card">
        <h3 class="card-title">Registered institutions</h3>
        <table class="table">
          <thead><tr><th>Name</th><th>Wallet</th><th>Status</th><th></th></tr></thead>
          <tbody>
            <tr><td colspan="4" class="muted" style="text-align:center; padding:32px;">No institutions in the registry.</td></tr>
          </tbody>
        </table>
        <div class="divider"></div>
        <p class="help">Click any row to open its full activity log under <a href="#/regulator/activity">Audit Activity</a>.</p>
      </div>
    </div>
  `;
  return { html: regulatorShell({ currentPath: path, body }), mount: () => {
    wireRoleShell();
    document.getElementById("authorize-institution")?.addEventListener("click", async () => {
      try { const tx = await contract.authorizeInstitution(value("#institution-wallet"), value("#institution-name"), value("#accreditation-id")); notice(`Authorization submitted: ${tx}`, "success"); }
      catch (error) { notice(error.message, "error"); }
    });
  } };
}
