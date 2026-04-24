import { adminShell, wireRoleShell } from "./_shell.js";
import { pageHeader } from "../../layout.js";
import { icons } from "../../icons.js";

export function adminUpdate({ path }) {
  const body = `
    ${pageHeader({
      eyebrow: "UC-03 · CORRECT OR AMEND",
      title: "Update a credential",
      description: "Replace the IPFS metadata pointer for an existing credential. The previous CID stays in the chain history — updates are append-only.",
    })}
    <div class="card" style="max-width:760px;">
      <div class="field"><label class="label">Credential ID</label><input class="input mono" placeholder="0x… or numeric id"/></div>
      <div class="field"><label class="label">Current CID</label><input class="input mono" readonly placeholder="will load from contract"/></div>
      <div class="field"><label class="label">New metadata (JSON)</label><textarea class="textarea" placeholder='{"title":"...","gpa":"..."}'></textarea></div>
      <div class="field"><label class="label">Reason for update</label><input class="input" placeholder="Grade correction, name change, etc."/></div>
      <div class="row">
        <button class="btn btn-outline" disabled>${icons.cid()} Pin new CID</button>
        <button class="btn btn-primary" disabled>${icons.edit()} Submit update</button>
      </div>
      <p class="help">Wires to <span class="mono">contract.updateCredential(credId, newCid)</span>. The old CID remains discoverable via audit history.</p>
    </div>
  `;
  return { html: adminShell({ currentPath: path, body }), mount: wireRoleShell };
}
