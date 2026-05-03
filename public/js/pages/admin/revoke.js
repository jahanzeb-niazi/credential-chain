import { adminShell, wireRoleShell } from "./_shell.js";
import { pageHeader } from "../../layout.js";
import { icons } from "../../icons.js";
import { contract } from "../../hooks/contract.js";
import { api } from "../../hooks/api.js";
import { notice, value, setValue } from "../../utils/dom.js";

export function adminRevoke({ path }) {
  const body = `
    ${pageHeader({
      eyebrow: "UC-04 · REVOKE A CREDENTIAL",
      title: "Revoke credential",
      description: "Permanently mark a credential as revoked on-chain. Verifiers will see the revocation and the reason from this point forward.",
    })}
    <div class="card" style="max-width:760px;">
      <div class="field">
        <label class="label">Credential ID</label>
        <div class="row">
          <input id="credential-id" class="input mono" placeholder="numeric id" style="flex:1"/>
          <button id="load-holder" class="btn btn-outline btn-sm">${icons.search()} Load</button>
        </div>
      </div>
      <div class="field">
        <label class="label">Holder wallet <span class="muted">(loaded from contract)</span></label>
        <input id="holder-wallet" class="input mono" readonly placeholder="loaded from contract"/>
      </div>
      <div class="field">
        <label class="label">Credential title</label>
        <input id="cred-title" class="input" readonly placeholder="loaded from IPFS"/>
      </div>
      <div class="field">
        <label class="label">Revocation reason</label>
        <select id="revoke-reason" class="select">
          <option>Fraud / forgery discovered</option>
          <option>Grade reversal</option>
          <option>Disciplinary action</option>
          <option>Issued in error</option>
          <option>Other</option>
        </select>
      </div>
      <div class="field">
        <label class="label">Public note (optional)</label>
        <textarea id="revoke-note" class="textarea" rows="3" placeholder="Visible to anyone querying this credential."></textarea>
      </div>
      <div class="notice" style="margin-bottom:16px;">
        Revocation is permanent and irreversible on-chain. The credential's full history stays immutably recorded.
      </div>
      <button id="confirm-revoke" class="btn btn-danger">${icons.ban()} Confirm revoke</button>
      <p class="help">Calls <span class="mono">contract.revokeCredential(credId, reason)</span>.</p>
    </div>
  `;

  return {
    html: adminShell({ currentPath: path, body }),
    mount: () => {
      wireRoleShell();

      async function loadHolder(id) {
        if (!id) return;
        try {
          const { credential } = await api.getCredential(id);
          setValue("#holder-wallet", credential.student || "");
          if (credential.status === "Revoked") {
            notice(`Credential #${id} is already revoked`, "error");
          }
          if (credential.cid) {
            try {
              const { ipfs } = await import("../../hooks/ipfs.js");
              const meta = await ipfs.fetch(credential.cid);
              const obj = typeof meta === "string" ? JSON.parse(meta) : meta;
              setValue("#cred-title", obj.title || obj.credentialType || `Credential #${id}`);
            } catch (_) { setValue("#cred-title", `Credential #${id}`); }
          }
          notice(`Credential #${id} loaded`, "success");
        } catch (e) {
          notice(e.message, "error");
        }
      }

      // Pre-populate from URL param
      const presetId = new URLSearchParams(location.hash.split("?")[1] || "").get("id") || "";
      if (presetId) {
        setValue("#credential-id", presetId);
        loadHolder(presetId);
      }

      document.getElementById("load-holder")?.addEventListener("click", () => {
        loadHolder(value("#credential-id").trim());
      });

      document.getElementById("credential-id")?.addEventListener("keydown", (e) => {
        if (e.key === "Enter") loadHolder(value("#credential-id").trim());
      });

      document.getElementById("confirm-revoke")?.addEventListener("click", async () => {
        try {
          const credId = value("#credential-id").trim();
          if (!credId) throw new Error("Enter a credential ID");
          const reason = value("#revoke-reason");
          const note   = value("#revoke-note").trim();
          const fullReason = note ? `${reason}: ${note}` : reason;
          const tx = await contract.revokeCredential(credId, fullReason);
          notice(`Revocation submitted: ${tx}`, "success");
        } catch (e) { notice(e.message, "error"); }
      });
    },
  };
}
