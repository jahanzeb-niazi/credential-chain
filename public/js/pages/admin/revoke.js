import { adminShell, wireRoleShell } from "./_shell.js";
import { pageHeader } from "../../layout.js";
import { icons } from "../../icons.js";
import { contract } from "../../hooks/contract.js";
import { notice, value } from "../../utils/dom.js";

export function adminRevoke({ path }) {
  const body = `
    ${pageHeader({
      eyebrow: "UC-04 · REVOKE A CREDENTIAL",
      title: "Revoke credential",
      description: "Permanently mark a credential as revoked on-chain. Verifiers will see the revocation and the reason from this point forward.",
    })}
    <div class="card" style="max-width:760px;">
      <div class="field"><label class="label">Credential ID</label><input id="credential-id" class="input mono" placeholder="numeric id"/></div>
      <div class="field"><label class="label">Holder wallet</label><input class="input mono" readonly placeholder="loaded from contract"/></div>
      <div class="field"><label class="label">Revocation reason</label>
        <select id="revoke-reason" class="select"><option>Fraud / forgery discovered</option><option>Grade reversal</option><option>Disciplinary action</option><option>Issued in error</option><option>Other</option></select>
      </div>
      <div class="field"><label class="label">Public note (optional)</label><textarea class="textarea" placeholder="Visible to anyone querying this credential."></textarea></div>
      <div class="notice" style="margin-bottom:16px;">Revocation is permanent. The credential's history (including the original issuance) stays on-chain.</div>
      <button id="confirm-revoke" class="btn btn-danger">${icons.ban()} Confirm revoke</button>
      <p class="help">Wires to <span class="mono">contract.revokeCredential(credId, reason)</span>.</p>
    </div>
  `;
  return { html: adminShell({ currentPath: path, body }), mount: () => {
    wireRoleShell();
    document.getElementById("confirm-revoke")?.addEventListener("click", async () => {
      try { const tx = await contract.revokeCredential(value("#credential-id"), value("#revoke-reason")); notice(`Revocation submitted: ${tx}`, "success"); }
      catch (error) { notice(error.message, "error"); }
    });
  } };
}
