import { adminShell, wireRoleShell } from "./_shell.js";
import { pageHeader } from "../../layout.js";
import { icons } from "../../icons.js";
import { ipfs } from "../../hooks/ipfs.js";
import { contract } from "../../hooks/contract.js";
import { notice, value, setValue } from "../../utils/dom.js";

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
        <div class="field"><label class="label">Student wallet</label><input id="student-wallet" class="input mono" placeholder="0x…"/></div>
        <div class="field"><label class="label">Student name</label><input id="student-name" class="input" placeholder="Jane Doe"/></div>
        <div class="field"><label class="label">Credential type</label>
          <select id="credential-type" class="select"><option>Bachelor's degree</option><option>Master's degree</option><option>PhD</option><option>Certificate</option><option>Transcript</option></select>
        </div>
        <div class="field"><label class="label">Title</label><input id="credential-title" class="input" placeholder="B.Sc. Computer Science"/></div>
        <div class="field"><label class="label">Date awarded</label><input id="date-awarded" class="input" type="date"/></div>
        <div class="field"><label class="label">Extra JSON metadata</label><textarea id="extra-json" class="textarea" placeholder='{"gpa":"3.8","honors":"cum laude"}'></textarea></div>
        <button id="pin-metadata" class="btn btn-outline">${icons.cid()} Pin to IPFS</button>
      </div>

      <div class="card">
        <h3 class="card-title">Step 2 — On-chain mint</h3>
        <p class="card-desc">Once IPFS returns a CID, call the contract.</p>
        <div class="field"><label class="label">Resolved CID</label><input id="resolved-cid" class="input mono" readonly placeholder="awaiting upload…"/></div>
        <div class="field"><label class="label">Issuer wallet</label><input id="issuer-wallet" class="input mono" readonly placeholder="connect institution wallet"/></div>
        <div class="field"><label class="label">Estimated gas</label><input class="input mono" readonly placeholder="—"/></div>
        <button id="issue-onchain" class="btn btn-primary">${icons.shield()} Issue on-chain</button>
        <p class="help">Wires to <span class="mono">contract.issueCredential(student, cid)</span>.</p>
        <div class="divider"></div>
        <div class="notice">After mint, the holder sees the credential in <a href="#/credentials">My Credentials</a> instantly.</div>
      </div>
    </div>
  `;
  return { html: adminShell({ currentPath: path, body }), mount: () => {
    wireRoleShell();
    document.getElementById("pin-metadata")?.addEventListener("click", async () => {
      try {
        const extra = value("#extra-json") ? JSON.parse(value("#extra-json")) : {};
        const cid = await ipfs.upload({ studentWallet: value("#student-wallet"), studentName: value("#student-name"), credentialType: value("#credential-type"), title: value("#credential-title"), dateAwarded: value("#date-awarded"), extra, createdAt: new Date().toISOString() });
        setValue("#resolved-cid", cid);
        notice("Metadata pinned to IPFS", "success");
      } catch (error) { notice(error.message, "error"); }
    });
    document.getElementById("issue-onchain")?.addEventListener("click", async () => {
      try {
        const tx = await contract.issueCredential(value("#student-wallet"), value("#resolved-cid"));
        notice(`Transaction submitted: ${tx}`, "success");
      } catch (error) { notice(error.message, "error"); }
    });
  } };
}
