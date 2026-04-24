import { adminShell, wireRoleShell } from "./_shell.js";
import { pageHeader } from "../../layout.js";
import { icons } from "../../icons.js";

export function adminIssue({ path }) {
  const body = `
    ${pageHeader({
      eyebrow: "UC-01 · ISSUE A NEW CREDENTIAL",
      title: "Issue credential",
      description: "Two-step pipeline: upload metadata to IPFS, then call issueCredential(student, cid) on the smart contract.",
    })}
    <div class="grid-2">
      <div class="card">
        <h3 class="card-title">Step 1 — Metadata</h3>
        <p class="card-desc">JSON payload that will be pinned to IPFS.</p>
        <div class="field"><label class="label">Student wallet</label><input class="input mono" placeholder="0x…"/></div>
        <div class="field"><label class="label">Student name</label><input class="input" placeholder="Jane Doe"/></div>
        <div class="field"><label class="label">Credential type</label>
          <select class="select"><option>Bachelor's degree</option><option>Master's degree</option><option>PhD</option><option>Certificate</option><option>Transcript</option></select>
        </div>
        <div class="field"><label class="label">Title</label><input class="input" placeholder="B.Sc. Computer Science"/></div>
        <div class="field"><label class="label">Date awarded</label><input class="input" type="date"/></div>
        <div class="field"><label class="label">Extra JSON metadata</label><textarea class="textarea" placeholder='{"gpa":"3.8","honors":"cum laude"}'></textarea></div>
        <button class="btn btn-outline" disabled>${icons.cid()} Pin to IPFS</button>
      </div>

      <div class="card">
        <h3 class="card-title">Step 2 — On-chain mint</h3>
        <p class="card-desc">Once IPFS returns a CID, call the contract.</p>
        <div class="field"><label class="label">Resolved CID</label><input class="input mono" readonly placeholder="awaiting upload…"/></div>
        <div class="field"><label class="label">Issuer wallet</label><input class="input mono" readonly placeholder="connect institution wallet"/></div>
        <div class="field"><label class="label">Estimated gas</label><input class="input mono" readonly placeholder="—"/></div>
        <button class="btn btn-primary" disabled>${icons.shield()} Issue on-chain</button>
        <p class="help">Wires to <span class="mono">contract.issueCredential(student, cid)</span>.</p>
        <div class="divider"></div>
        <div class="notice">After mint, the holder sees the credential in <a href="#/credentials">My Credentials</a> instantly.</div>
      </div>
    </div>
  `;
  return { html: adminShell({ currentPath: path, body }), mount: wireRoleShell };
}
