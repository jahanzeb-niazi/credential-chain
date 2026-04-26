import { regulatorShell, wireRoleShell } from "./_shell.js";
import { pageHeader } from "../../layout.js";
import { icons } from "../../icons.js";
import { contract } from "../../hooks/contract.js";
import { notice, value } from "../../utils/dom.js";

export function regulatorGovernment({ path }) {
  const body = `
    ${pageHeader({
      eyebrow: "UC-13 · ONBOARD A REGULATOR",
      title: "Add a regulator",
      description: "Government agencies and accreditation bodies are added by the system root. Each gets a wallet address with policy-level permissions.",
    })}
    <div class="grid-2">
      <div class="card">
        <h3 class="card-title">New regulator</h3>
        <div class="field"><label class="label">Agency name</label><input id="regulator-name" class="input" placeholder="Ministry of Higher Education"/></div>
        <div class="field"><label class="label">Country / jurisdiction</label><input id="regulator-jurisdiction" class="input" placeholder="ISO code, e.g. IN, US-CA"/></div>
        <div class="field"><label class="label">Wallet address</label><input id="regulator-wallet" class="input mono" placeholder="0x…"/></div>
        <div class="field"><label class="label">Permissions</label>
          <div class="stack">
            <label class="row"><input type="checkbox" checked/> Authorize institutions</label>
            <label class="row"><input type="checkbox" checked/> Suspend institutions</label>
            <label class="row"><input type="checkbox"/> Add other regulators</label>
          </div>
        </div>
        <button id="add-regulator" class="btn btn-gold">${icons.landmark()} Add regulator</button>
        <p class="help">Wires to <span class="mono">contract.addRegulator(address)</span>.</p>
      </div>
      <div class="card">
        <h3 class="card-title">Active regulators</h3>
        <p class="card-desc">Currently configured governance addresses.</p>
        <table class="table">
          <thead><tr><th>Agency</th><th>Wallet</th><th>Status</th></tr></thead>
          <tbody>
            <tr><td colspan="3" class="muted" style="text-align:center; padding:32px;">No regulators loaded.</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
  return { html: regulatorShell({ currentPath: path, body }), mount: () => {
    wireRoleShell();
    document.getElementById("add-regulator")?.addEventListener("click", async () => {
      try { const tx = await contract.addRegulator(value("#regulator-wallet"), value("#regulator-name"), value("#regulator-jurisdiction")); notice(`Regulator transaction submitted: ${tx}`, "success"); }
      catch (error) { notice(error.message, "error"); }
    });
  } };
}
