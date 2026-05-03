import { adminShell, wireRoleShell } from "./_shell.js";
import { pageHeader } from "../../layout.js";
import { icons } from "../../icons.js";
import { ipfs } from "../../hooks/ipfs.js";
import { contract } from "../../hooks/contract.js";
import { api } from "../../hooks/api.js";
import { notice, value, setValue } from "../../utils/dom.js";

export function adminUpdate({ path }) {
  const body = `
    ${pageHeader({
      eyebrow: "UC-03 · CORRECT OR AMEND",
      title: "Update a credential",
      description: "Replace the IPFS metadata pointer for an existing credential. The previous CID stays in the chain history — updates are append-only.",
    })}
    <div class="card" style="max-width:760px;">
      <div class="field">
        <label class="label">Credential ID</label>
        <div class="row">
          <input id="credential-id" class="input mono" placeholder="numeric id" style="flex:1"/>
          <button id="load-credential" class="btn btn-outline btn-sm">${icons.search()} Load</button>
        </div>
      </div>
      <div class="field">
        <label class="label">Current CID <span class="muted">(loaded from contract)</span></label>
        <input id="current-cid" class="input mono" readonly placeholder="will load when you click Load"/>
      </div>
      <div class="field">
        <label class="label">Holder wallet</label>
        <input id="holder-wallet" class="input mono" readonly placeholder="loaded from contract"/>
      </div>
      <div class="field">
        <label class="label">New metadata (JSON)</label>
        <textarea id="new-metadata" class="textarea" rows="6" placeholder='{"title":"BSc Computer Science","gpa":"3.8","graduationYear":"2024"}'></textarea>
      </div>
      <div class="field">
        <label class="label">New CID <span class="muted">(after pinning)</span></label>
        <input id="new-cid" class="input mono" readonly placeholder="awaiting IPFS upload"/>
      </div>
      <div class="row">
        <button id="pin-new-cid" class="btn btn-outline">${icons.cid()} Pin new CID</button>
        <button id="submit-update" class="btn btn-primary">${icons.edit()} Submit update</button>
      </div>
      <p class="help">Calls <span class="mono">contract.updateCredential(credId, newCid)</span>. The old CID remains discoverable via audit history.</p>
    </div>
  `;

  return {
    html: adminShell({ currentPath: path, body }),
    mount: () => {
      wireRoleShell();

      async function loadCredential(id) {
        if (!id) return;
        try {
          const { credential } = await api.getCredential(id);
          setValue("#current-cid", credential.cid || "");
          setValue("#holder-wallet", credential.student || "");
          if (credential.cid) {
            try {
              const meta = await ipfs.fetch(credential.cid);
              const obj = typeof meta === "string" ? JSON.parse(meta) : meta;
              setValue("#new-metadata", JSON.stringify(obj, null, 2));
            } catch (_) {}
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
        loadCredential(presetId);
      }

      document.getElementById("load-credential")?.addEventListener("click", () => {
        loadCredential(value("#credential-id").trim());
      });

      document.getElementById("credential-id")?.addEventListener("keydown", (e) => {
        if (e.key === "Enter") loadCredential(value("#credential-id").trim());
      });

      document.getElementById("pin-new-cid")?.addEventListener("click", async () => {
        try {
          const raw = value("#new-metadata").trim();
          if (!raw) throw new Error("Enter new metadata JSON first");
          const cid = await ipfs.upload(JSON.parse(raw));
          setValue("#new-cid", cid);
          notice("New CID pinned to IPFS: " + cid, "success");
        } catch (e) { notice(e.message, "error"); }
      });

      document.getElementById("submit-update")?.addEventListener("click", async () => {
        try {
          const credId = value("#credential-id").trim();
          const newCid = value("#new-cid").trim();
          if (!credId) throw new Error("Enter a credential ID");
          if (!newCid) throw new Error("Pin a new CID first");
          const tx = await contract.updateCredential(credId, newCid);
          notice(`Update submitted: ${tx}`, "success");
        } catch (e) { notice(e.message, "error"); }
      });
    },
  };
}
