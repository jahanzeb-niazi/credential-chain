import { verifierShell, wireRoleShell } from "./_shell.js";
import { pageHeader } from "../../layout.js";
import { icons } from "../../icons.js";
import { api } from "../../hooks/api.js";
import { notice, setValue } from "../../utils/dom.js";

export function verifierScan({ path }) {
  const body = `
    ${pageHeader({
      eyebrow: "UC-10 · QR-CODE VERIFICATION",
      title: "Scan a credential QR",
      description: "Point the camera at a student's QR code. The credential ID is decoded and verified against the ledger in real time.",
    })}
    <div class="grid-2">
      <div class="card">
        <h3 class="card-title">Camera</h3>
        <p class="card-desc">Browser camera access required.</p>
        <div id="scanner-wrap" style="aspect-ratio:1/1;background:var(--navy-50,#eef0f5);border-radius:10px;overflow:hidden;position:relative;display:flex;align-items:center;justify-content:center;color:var(--navy);">
          <video id="scanner-video" style="display:none;width:100%;height:100%;object-fit:cover;" playsinline muted></video>
          <canvas id="scanner-canvas" style="display:none;position:absolute;inset:0;width:100%;height:100%;"></canvas>
          <div id="scanner-placeholder">${icons.scan()}</div>
        </div>
        <div class="row" style="margin-top:16px;">
          <button id="btn-start-scan" class="btn btn-primary">${icons.scan()} Start scanner</button>
          <button id="btn-stop-scan" class="btn btn-outline" style="display:none;">Stop</button>
          <label class="btn btn-outline" style="cursor:pointer;">
            Upload image
            <input id="upload-qr" type="file" accept="image/*" style="display:none;"/>
          </label>
        </div>
        <p id="scan-status" class="help" style="margin-top:8px;"></p>
      </div>
      <div class="card">
        <h3 class="card-title">Verification result</h3>
        <p class="card-desc">The decoded credential ID is auto-verified on-chain.</p>
        <div class="field">
          <label class="label">Decoded reference</label>
          <input id="decoded-ref" class="input mono" readonly placeholder="—"/>
        </div>
        <div class="field">
          <label class="label">Verification status</label>
          <div id="verify-status"><span class="pill pill-info">Awaiting scan</span></div>
        </div>
        <div id="verify-detail" style="margin-top:12px;"></div>
      </div>
    </div>
  `;

  return {
    html: verifierShell({ currentPath: path, body }),
    mount: () => {
      wireRoleShell();
      let stream = null;
      let rafId = null;

      async function loadJsQR() {
        if (window.jsQR) return window.jsQR;
        return new Promise((resolve, reject) => {
          const s = document.createElement("script");
          s.src = "https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js";
          s.onload = () => resolve(window.jsQR);
          s.onerror = () => reject(new Error("Failed to load QR scanner library"));
          document.head.appendChild(s);
        });
      }

      async function verifyRef(raw) {
        const decoded = extractCredentialId(raw);
        setValue("#decoded-ref", decoded || raw);
        document.getElementById("verify-status").innerHTML = `<span class="pill pill-info">Verifying…</span>`;
        document.getElementById("verify-detail").innerHTML = "";
        try {
          const data = await api.verify(decoded || raw);
          const r = data.result || data;
          const isValid = r.valid !== false && r.status !== "Revoked";
          document.getElementById("verify-status").innerHTML = isValid
            ? `<span class="pill pill-info">✓ Valid</span>`
            : `<span class="pill pill-danger">✗ Invalid / Revoked</span>`;
          document.getElementById("verify-detail").innerHTML = `
            <pre class="mono" style="font-size:11px;white-space:pre-wrap;word-break:break-all;background:var(--bg-alt,#f4f5f7);padding:10px;border-radius:8px;">${JSON.stringify(r, null, 2)}</pre>`;
        } catch (e) {
          document.getElementById("verify-status").innerHTML = `<span class="pill pill-danger">Error</span>`;
          document.getElementById("verify-detail").innerHTML = `<p class="muted">${e.message}</p>`;
        }
      }

      function extractCredentialId(raw) {
        // Handle share URLs like https://…/share?id=5 or #/share?id=5
        try {
          const url = new URL(raw);
          return url.searchParams.get("id") || raw;
        } catch (_) {}
        const m = raw.match(/[?&]id=(\d+)/);
        if (m) return m[1];
        if (/^\d+$/.test(raw.trim())) return raw.trim();
        return raw;
      }

      function scanFrame(video, canvas, jsQR) {
        if (video.readyState !== video.HAVE_ENOUGH_DATA) { rafId = requestAnimationFrame(() => scanFrame(video, canvas, jsQR)); return; }
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imgData.data, imgData.width, imgData.height, { inversionAttempts: "dontInvert" });
        if (code) {
          document.getElementById("scan-status").textContent = "QR detected!";
          stopScan();
          verifyRef(code.data);
        } else {
          rafId = requestAnimationFrame(() => scanFrame(video, canvas, jsQR));
        }
      }

      async function startScan() {
        const status = document.getElementById("scan-status");
        status.textContent = "Requesting camera…";
        try {
          const jsQR = await loadJsQR();
          stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
          const video = document.getElementById("scanner-video");
          const canvas = document.getElementById("scanner-canvas");
          video.srcObject = stream;
          video.style.display = "block";
          document.getElementById("scanner-placeholder").style.display = "none";
          await video.play();
          document.getElementById("btn-start-scan").style.display = "none";
          document.getElementById("btn-stop-scan").style.display = "";
          status.textContent = "Scanning…";
          rafId = requestAnimationFrame(() => scanFrame(video, canvas, jsQR));
        } catch (e) {
          status.textContent = e.message;
          notice(e.message, "error");
        }
      }

      function stopScan() {
        if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
        if (stream) { stream.getTracks().forEach(t => t.stop()); stream = null; }
        const video = document.getElementById("scanner-video");
        if (video) video.style.display = "none";
        const ph = document.getElementById("scanner-placeholder");
        if (ph) ph.style.display = "";
        document.getElementById("btn-start-scan").style.display = "";
        document.getElementById("btn-stop-scan").style.display = "none";
        document.getElementById("scan-status").textContent = "";
      }

      document.getElementById("btn-start-scan")?.addEventListener("click", startScan);
      document.getElementById("btn-stop-scan")?.addEventListener("click", stopScan);

      document.getElementById("upload-qr")?.addEventListener("change", async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
          const jsQR = await loadJsQR();
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
            const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imgData.data, imgData.width, imgData.height);
            if (code) verifyRef(code.data);
            else notice("No QR code found in image", "error");
          };
          img.src = URL.createObjectURL(file);
        } catch (e) { notice(e.message, "error"); }
      });
    },
  };
}
