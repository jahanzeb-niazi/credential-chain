import { regulatorShell, wireRoleShell } from "./_shell.js";
import { pageHeader } from "../../layout.js";
import { icons } from "../../icons.js";
import { contract } from "../../hooks/contract.js";
import { api } from "../../hooks/api.js";
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
          <tbody id="regulators-tbody">
            <tr><td colspan="3" class="muted" style="text-align:center; padding:32px;">No regulators loaded.</td></tr>
          </tbody>
        </table>
        <button id="reload-regs" class="btn btn-outline btn-sm" style="margin-top:8px">${icons.search()} Reload registry</button>
      </div>
    </div>
  `;
  return { html: regulatorShell({ currentPath: path, body }), mount: () => {
    wireRoleShell();
    const reload = async () => {
      try {
        const { regulators = [] } = await api.listRegulators();
        if (!regulators.length) { document.getElementById("regulators-tbody").innerHTML = `<tr><td colspan="3" class="muted" style="text-align:center; padding:32px;">No regulators on-chain yet.</td></tr>`; return; }
        const rows = await Promise.all(regulators.map(async (addr) => {
          try {
            const { regulator } = await api.getRegulator(addr);
            const status = regulator.active ? `<span class="pill pill-info">Active</span>` : `<span class="pill pill-danger">Inactive</span>`;
            return `<tr><td>${regulator.name || "—"}<br/><small class="muted">${regulator.jurisdiction || ""}</small></td><td class="mono">${addr}</td><td>${status}</td></tr>`;
          } catch { return `<tr><td>—</td><td class="mono">${addr}</td><td>—</td></tr>`; }
        }));
        document.getElementById("regulators-tbody").innerHTML = rows.join("");
      } catch (e) { notice(e.message, "error"); }
    };
    document.getElementById("reload-regs")?.addEventListener("click", reload);
    reload();
    document.getElementById("add-regulator")?.addEventListener("click", async () => {
      try { const tx = await contract.addRegulator(value("#regulator-wallet"), value("#regulator-name"), value("#regulator-jurisdiction")); notice(`Regulator transaction submitted: ${tx}`, "success"); }
      catch (error) { notice(error.message, "error"); }
    });
  } };
}
