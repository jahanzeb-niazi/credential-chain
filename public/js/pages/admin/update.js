import { adminShell, wireRoleShell } from "./_shell.js";
import { pageHeader } from "../../layout.js";
import { icons } from "../../icons.js";
import { ipfs } from "../../hooks/ipfs.js";
import { contract } from "../../hooks/contract.js";
import { notice, value, setValue } from "../../utils/dom.js";

export function adminUpdate({ path }) {
  const body = `
    ${pageHeader({
      eyebrow: "UC-03 · CORRECT OR AMEND",
      title: "Update a credential",
      description: "Replace the IPFS metadata pointer for an existing credential. The previous CID stays in the chain history — updates are append-only.",
    })}
    <div class="card" style="max-width:760px;">
      <div class="field"><label class="label">Credential ID</label><input id="credential-id" class="input mono" placeholder="numeric id"/></div>
      <div class="field"><label class="label">Current CID</label><input class="input mono" readonly placeholder="will load from contract"/></div>
      <div class="field"><label class="label">New metadata (JSON)</label><textarea id="new-metadata" class="textarea" placeholder='{"title":"...","gpa":"..."}'></textarea></div>
      <div class="field"><label class="label">New CID</label><input id="new-cid" class="input mono" readonly placeholder="awaiting IPFS upload"/></div>
      <div class="field"><label class="label">Reason for update</label><input class="input" placeholder="Grade correction, name change, etc."/></div>
      <div class="row">
        <button id="pin-new-cid" class="btn btn-outline">${icons.cid()} Pin new CID</button>
        <button id="submit-update" class="btn btn-primary">${icons.edit()} Submit update</button>
      </div>
      <p class="help">Wires to <span class="mono">contract.updateCredential(credId, newCid)</span>. The old CID remains discoverable via audit history.</p>
    </div>
  `;
  return { html: adminShell({ currentPath: path, body }), mount: () => {
    wireRoleShell();
    document.getElementById("pin-new-cid")?.addEventListener("click", async () => {
      try { const cid = await ipfs.upload(JSON.parse(value("#new-metadata"))); setValue("#new-cid", cid); notice("New CID pinned", "success"); }
      catch (error) { notice(error.message, "error"); }
    });
    document.getElementById("submit-update")?.addEventListener("click", async () => {
      try { const tx = await contract.updateCredential(value("#credential-id"), value("#new-cid")); notice(`Update submitted: ${tx}`, "success"); }
      catch (error) { notice(error.message, "error"); }
    });
  } };
}
