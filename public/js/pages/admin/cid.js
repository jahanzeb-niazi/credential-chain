import { adminShell, wireRoleShell } from "./_shell.js";
import { pageHeader } from "../../layout.js";
import { icons } from "../../icons.js";

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
        <button class="btn btn-primary" disabled>${icons.cid()} Pin to IPFS</button>
      </div>
      <div class="card">
        <h3 class="card-title">Resolve a CID</h3>
        <p class="card-desc">Fetch and preview metadata for any IPFS hash.</p>
        <div class="field"><label class="label">CID</label><input class="input mono" placeholder="Qm… / bafy…"/></div>
        <button class="btn btn-outline" disabled>${icons.search()} Resolve</button>
        <div class="divider"></div>
        <p class="eyebrow">PREVIEW</p>
        <pre class="mono muted" style="background:var(--navy-50); padding:12px; border-radius:8px; min-height:120px;">{ "—": "—" }</pre>
      </div>
    </div>
  `;
  return { html: adminShell({ currentPath: path, body }), mount: wireRoleShell };
}
