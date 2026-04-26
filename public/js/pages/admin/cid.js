import { adminShell, wireRoleShell } from "./_shell.js";
import { pageHeader } from "../../layout.js";
import { icons } from "../../icons.js";
import { ipfs } from "../../hooks/ipfs.js";
import { notice, value, setHtml, setValue } from "../../utils/dom.js";

export function adminCid({ path }) {
  const body = `
    ${pageHeader({
      eyebrow: "UC-05 · IPFS UTILITIES",
      title: "IPFS / CID tools",
      description: "Pin standalone documents to IPFS, resolve a CID back to its metadata, or check pin status across nodes.",
    })}
    <div class="grid-2">
      <div class="card">
        <h3 class="card-title">Pin a file</h3>
        <p class="card-desc">Drag a transcript or supporting PDF to upload.</p>
        <div class="field" style="border:2px dashed var(--border); border-radius:10px; padding:32px; text-align:center;">
          ${icons.cid()}
          <p class="muted" style="margin:8px 0 0;">Drop file or click to browse</p>
        </div>
        <textarea id="cid-json" class="textarea" placeholder='{"document":"metadata"}'></textarea>
        <button id="pin-json" class="btn btn-primary">${icons.cid()} Pin to IPFS</button>
      </div>
      <div class="card">
        <h3 class="card-title">Resolve a CID</h3>
        <p class="card-desc">Fetch and preview metadata for any IPFS hash.</p>
        <div class="field"><label class="label">CID</label><input id="resolve-cid" class="input mono" placeholder="Qm… / bafy…"/></div>
        <button id="resolve-button" class="btn btn-outline">${icons.search()} Resolve</button>
        <div class="divider"></div>
        <p class="eyebrow">PREVIEW</p>
        <pre id="cid-preview" class="mono muted" style="background:var(--navy-50); padding:12px; border-radius:8px; min-height:120px;">{ "—": "—" }</pre>
      </div>
    </div>
  `;
  return { html: adminShell({ currentPath: path, body }), mount: () => {
    wireRoleShell();
    document.getElementById("pin-json")?.addEventListener("click", async () => {
      try { const cid = await ipfs.upload(JSON.parse(value("#cid-json"))); setValue("#resolve-cid", cid); notice(`Pinned ${cid}`, "success"); }
      catch (error) { notice(error.message, "error"); }
    });
    document.getElementById("resolve-button")?.addEventListener("click", async () => {
      try { const metadata = await ipfs.fetch(value("#resolve-cid")); setHtml("#cid-preview", JSON.stringify(metadata, null, 2)); }
      catch (error) { notice(error.message, "error"); }
    });
  } };
}
