import { publicLayout, wirePublicHeader } from "../layout.js";
import { icons } from "../icons.js";
import { wallet } from "../hooks/wallet.js";
import { api } from "../hooks/api.js";
import { notice, setValue, value } from "../utils/dom.js";

function qrUrl(text) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(text)}`;
}

function buildShareUrl(id) {
  return `${location.origin}${location.pathname}#/verifier/lookup?id=${encodeURIComponent(id)}`;
}

function renderShare(id) {
  const url = buildShareUrl(id);
  setValue("#share-url", url);
  document.getElementById("share-qr").src = qrUrl(url);
  document.getElementById("share-qr-wrap").style.display = "block";
}

export function sharePage({ path }) {
  const initial = new URLSearchParams(location.hash.split("?")[1] || "").get("id") || "";
  const body = `
    <div class="container" style="padding:56px 24px; max-width:980px;">
      <p class="eyebrow">UC-07 · UC-08 · SHARE A CREDENTIAL</p>
      <h1 class="serif" style="font-size:38px; color:var(--navy); margin:8px 0 12px;">Share a credential</h1>
      <p class="muted" style="max-width:620px;">Generate a verification link and QR code for anyone to validate your credential against the on-chain ledger.</p>

      <div class="grid-2" style="margin-top:32px">
        <div class="card">
          <h3 class="card-title">Choose a credential</h3>
          <div class="field">
            <label class="label">Connect wallet to load yours</label>
            <button id="load-mine" class="btn btn-outline btn-sm">${icons.wallet()} Load my credentials</button>
          </div>
          <div class="field"><label class="label">Or enter credential ID</label>
            <input id="share-id" class="input mono" placeholder="numeric id" value="${initial}"/>
          </div>
          <div id="my-credentials" class="stack" style="margin:8px 0 16px;"></div>
          <button id="generate-share" class="btn btn-primary">${icons.link()} Generate share link</button>
        </div>

        <div class="card">
          <h3 class="card-title">Verification link</h3>
          <p class="card-desc">Send this URL or QR to the verifier.</p>
          <div id="share-qr-wrap" style="display:none; text-align:center;">
            <img id="share-qr" alt="QR" style="width:220px; height:220px; background:#fff; border-radius:10px;"/>
          </div>
          <div class="field" style="margin-top:24px">
            <label class="label">Share URL</label>
            <input id="share-url" class="input mono" readonly placeholder="generate to populate"/>
          </div>
          <div class="row">
            <button id="copy-share" class="btn btn-outline btn-sm">${icons.link()} Copy link</button>
            <a id="open-share" class="btn btn-outline btn-sm" target="_blank">${icons.search()} Open as verifier</a>
          </div>
        </div>
      </div>
    </div>
  `;
  return {
    html: publicLayout(path, body),
    mount: () => {
      wirePublicHeader();
      if (initial) renderShare(initial);
      document.getElementById("generate-share").addEventListener("click", () => {
        const id = value("#share-id");
        if (!id) return notice("Enter a credential ID", "error");
        renderShare(id);
        document.getElementById("open-share").href = buildShareUrl(id);
      });
      document.getElementById("copy-share").addEventListener("click", async () => {
        const url = document.getElementById("share-url").value;
        if (!url) return notice("Generate a link first", "error");
        await navigator.clipboard.writeText(url);
        notice("Link copied", "success");
      });
      document.getElementById("load-mine").addEventListener("click", async () => {
        try {
          const addr = wallet.address || await wallet.connect();
          const { credentialIds = [] } = await api.getStudentCredentials(addr);
          document.getElementById("my-credentials").innerHTML = credentialIds.length
            ? credentialIds.map(id => `<button data-id="${id}" class="btn btn-ghost btn-sm">#${id}</button>`).join(" ")
            : `<p class="muted">No credentials found for this wallet.</p>`;
          document.querySelectorAll("#my-credentials button").forEach(b => b.addEventListener("click", () => {
            setValue("#share-id", b.dataset.id);
            renderShare(b.dataset.id);
            document.getElementById("open-share").href = buildShareUrl(b.dataset.id);
          }));
        } catch (e) { notice(e.message, "error"); }
      });
    },
  };
}