import { verifierShell, wireRoleShell } from "./_shell.js";
import { pageHeader } from "../../layout.js";
import { icons } from "../../icons.js";

export function verifierOverview({ path }) {
  const body = `
    ${pageHeader({
      eyebrow: "UC-09 → UC-12 · TRUSTLESS VERIFICATION",
      title: "Quick Verify",
      description: "Paste any credential reference and confirm authenticity directly against the ledger. No university round-trip required.",
    })}
    <div class="card" style="max-width:760px;">
      <div class="field"><label class="label">Credential reference</label>
        <input class="input mono" placeholder="Credential ID, IPFS CID, share URL, or holder wallet"/>
      </div>
      <div class="row">
        <button class="btn btn-primary" disabled>${icons.shield()} Verify on-chain</button>
        <a class="btn btn-outline" href="#/verifier/scan">${icons.scan()} Scan QR instead</a>
      </div>
      <p class="help">Routes to <span class="mono">contract.getCredential(idOrCid)</span> and validates issuer authorization, holder and revocation status.</p>
    </div>

    <div class="grid-3" style="margin-top:32px">
      <a class="card" href="#/verifier/lookup">
        <h3 class="card-title">Direct lookup</h3>
        <p class="muted">Query by ID, CID, or holder address — UC-09.</p>
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
  return { html: verifierShell({ currentPath: path, body }), mount: wireRoleShell };
}
