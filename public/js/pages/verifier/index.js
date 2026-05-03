import { verifierShell, wireRoleShell } from "./_shell.js";
import { pageHeader, emptyState } from "../../layout.js";
import { icons } from "../../icons.js";
import { api } from "../../hooks/api.js";
import { notice, value, setHtml } from "../../utils/dom.js";

export function verifierOverview({ path }) {
  const body = `
    ${pageHeader({
      eyebrow: "UC-09 → UC-12 · TRUSTLESS VERIFICATION",
      title: "Quick Verify",
      description: "Enter any credential ID or IPFS CID to confirm authenticity directly against the on-chain ledger.",
    })}
    <div class="card" style="max-width:760px;">
      <div class="field">
        <label class="label">Credential reference</label>
        <input id="quick-ref" class="input mono" placeholder="Credential ID or IPFS CID"/>
      </div>
      <div class="row">
        <button id="quick-verify" class="btn btn-primary">${icons.shield()} Verify on-chain</button>
        <a class="btn btn-outline" href="#/verifier/scan">${icons.scan()} Scan QR instead</a>
      </div>
      <p class="help">Calls <span class="mono">contract.getCredential(id)</span> and validates issuer authorization, holder, and revocation status.</p>
    </div>

    <div id="verify-result" style="max-width:760px; margin-top:16px;"></div>

    <div class="grid-3" style="margin-top:32px;">
      <a class="card" href="#/verifier/lookup">
        <h3 class="card-title">Direct lookup</h3>
        <p class="muted">Query by credential ID — UC-09.</p>
      </a>
      <a class="card" href="#/verifier/audit">
        <h3 class="card-title">Audit history</h3>
        <p class="muted">Full chain of issuance, updates and revocations — UC-11.</p>
      </a>
      <a class="card" href="#/verifier/timestamp">
        <h3 class="card-title">Timestamp check</h3>
        <p class="muted">Pull the immutable block timestamp — UC-12.</p>
      </a>
    </div>
  `;

  return {
    html: verifierShell({ currentPath: path, body }),
    mount: () => {
      wireRoleShell();

      async function doVerify() {
        const ref = value("#quick-ref").trim();
        if (!ref) { notice("Enter a credential ID or CID", "error"); return; }
        const resultEl = document.getElementById("verify-result");
        resultEl.innerHTML = `<p class="muted">Verifying…</p>`;
        try {
          const data = await api.verify(ref);
          const r = data.result || data;
          const isValid = r.valid !== false && r.status !== "Revoked";
          resultEl.innerHTML = `
            <div class="card" style="border-left:4px solid ${isValid ? "var(--green, #22c55e)" : "var(--danger)"}">
              <div class="row between">
                <h3 class="card-title">${isValid ? "✓ Credential is valid" : "✗ Credential invalid or revoked"}</h3>
                ${r.status === "Revoked" ? `<span class="pill pill-danger">Revoked</span>` : `<span class="pill pill-info">Active</span>`}
              </div>
              <pre class="mono" style="font-size:12px; white-space:pre-wrap; word-break:break-all; background:var(--bg-alt,#f4f5f7); padding:12px; border-radius:8px; margin-top:8px;">${JSON.stringify(r, null, 2)}</pre>
            </div>`;
        } catch (e) {
          resultEl.innerHTML = `<div class="card" style="border-left:4px solid var(--danger)"><p class="muted">${e.message}</p></div>`;
          notice(e.message, "error");
        }
      }

      document.getElementById("quick-verify")?.addEventListener("click", doVerify);
      document.getElementById("quick-ref")?.addEventListener("keydown", (e) => {
        if (e.key === "Enter") doVerify();
      });

      // Pre-fill from URL param (e.g. from credentials page)
      const preId = new URLSearchParams(location.hash.split("?")[1] || "").get("id");
      if (preId) {
        const inp = document.getElementById("quick-ref");
        if (inp) { inp.value = preId; doVerify(); }
      }
    },
  };
}
