import { verifierShell, wireRoleShell } from "./_shell.js";
import { pageHeader } from "../../layout.js";
import { icons } from "../../icons.js";

export function verifierScan({ path }) {
  const body = `
    ${pageHeader({
      eyebrow: "UC-10 · QR-CODE VERIFICATION",
      title: "Scan a credential QR",
      description: "Point the camera at a student's QR. The encoded reference is decoded and verified against the ledger in real time.",
    })}
    <div class="grid-2">
      <div class="card">
        <h3 class="card-title">Camera</h3>
        <p class="card-desc">Browser camera access required (getUserMedia).</p>
        <div style="aspect-ratio: 1/1; background: var(--navy-50); border-radius: 10px; display:flex; align-items:center; justify-content:center; color: var(--navy);">
          ${icons.scan()}
        </div>
        <div class="row" style="margin-top:16px">
          <button class="btn btn-primary" disabled>${icons.scan()} Start scanner</button>
          <button class="btn btn-outline" disabled>Upload image</button>
        </div>
      </div>
      <div class="card">
        <h3 class="card-title">Decoded reference</h3>
        <p class="card-desc">The QR's URL or credential ID will appear here, then auto-verify.</p>
        <div class="field"><label class="label">Decoded</label><input class="input mono" readonly placeholder="—"/></div>
        <div class="field"><label class="label">Verification status</label>
          <p><span class="pill pill-info">Awaiting scan</span></p>
        </div>
      </div>
    </div>
  `;
  return { html: verifierShell({ currentPath: path, body }), mount: wireRoleShell };
}
