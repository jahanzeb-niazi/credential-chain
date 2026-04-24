import { publicLayout, wirePublicHeader } from "../layout.js";
import { icons } from "../icons.js";

export function sharePage({ path }) {
  const body = `
    <div class="container" style="padding:56px 24px; max-width:980px;">
      <p class="eyebrow">UC-07 · UC-08 · SELECTIVE DISCLOSURE</p>
      <h1 class="serif" style="font-size:38px; color:var(--navy); margin:8px 0 12px;">Share a credential</h1>
      <p class="muted" style="max-width:620px;">Generate a verification link or QR code. Choose exactly which fields to disclose — keep the rest private with cryptographic proofs.</p>

      <div class="grid-2" style="margin-top:32px">
        <div class="card">
          <h3 class="card-title">Configure share</h3>
          <p class="card-desc">Pick a credential and the fields the verifier may see.</p>

          <div class="field">
            <label class="label">Credential</label>
            <select class="select" disabled>
              <option>Select a credential…</option>
            </select>
            <p class="help">Empty until your wallet is connected.</p>
          </div>

          <div class="field">
            <label class="label">Disclose fields</label>
            <div class="stack">
              <label class="row"><input type="checkbox" disabled/> Degree title</label>
              <label class="row"><input type="checkbox" disabled/> Issuing university</label>
              <label class="row"><input type="checkbox" disabled/> Date awarded</label>
              <label class="row"><input type="checkbox" disabled/> GPA / grade</label>
              <label class="row"><input type="checkbox" disabled/> Course-by-course transcript</label>
            </div>
          </div>

          <div class="field">
            <label class="label">Link expires after</label>
            <select class="select">
              <option>24 hours</option><option>7 days</option><option>30 days</option><option>Never</option>
            </select>
          </div>

          <button class="btn btn-primary" disabled>${icons.lock()} Generate proof</button>
          <p class="help">Wires to <span class="mono">zk.generateDisclosureProof()</span> in your Java layer.</p>
        </div>

        <div class="card">
          <h3 class="card-title">Verification link</h3>
          <p class="card-desc">Send this URL or QR to the verifier.</p>

          <div class="qr-placeholder">QR</div>

          <div class="field" style="margin-top:24px">
            <label class="label">Share URL</label>
            <input class="input mono" readonly value="https://credledger.app/v/—————————" />
          </div>
          <div class="row">
            <button class="btn btn-outline btn-sm">${icons.link()} Copy link</button>
            <button class="btn btn-outline btn-sm">${icons.qr()} Download QR</button>
          </div>

          <div class="divider"></div>
          <p class="eyebrow">UC-08 · PROOF DETAILS</p>
          <p class="mono muted" style="margin-top:8px; word-break:break-all;">proof: 0x… · cid: Qm… · disclosed: []</p>
        </div>
      </div>
    </div>
  `;
  return { html: publicLayout(path, body), mount: () => wirePublicHeader() };
}
