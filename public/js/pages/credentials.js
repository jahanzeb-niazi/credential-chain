import { publicLayout, wirePublicHeader, emptyState } from "../layout.js";
import { icons } from "../icons.js";
import { wallet } from "../hooks/wallet.js";
import { api } from "../hooks/api.js";
import { ipfs } from "../hooks/ipfs.js";
import { notice, setHtml, fmtTime } from "../utils/dom.js";

async function renderList(address) {
  const target = document.getElementById("credentials-list");
  target.innerHTML = `<p class="muted">Loading credentials for ${address}…</p>`;
  try {
    const { credentialIds = [] } = await api.getStudentCredentials(address);
    if (!credentialIds.length) {
      target.innerHTML = emptyState({
        icon: icons.cap(),
        title: "No credentials in this wallet yet",
        description: "When a university issues a credential to your address, it will appear here automatically.",
      });
      return;
    }
    const cards = await Promise.all(credentialIds.map(async (id) => {
      try {
        const { credential } = await api.getCredential(id);
        let metaTitle = `Credential #${id}`;
        try {
          if (credential.cid) {
            const meta = await ipfs.fetch(credential.cid);
            const m = typeof meta === "string" ? JSON.parse(meta) : meta;
            metaTitle = m.title || m.credentialType || metaTitle;
          }
        } catch (_) {}
        const status = credential.status === "Revoked"
          ? `<span class="pill pill-danger">Revoked</span>`
          : `<span class="pill pill-info">Active</span>`;
        return `
        <div class="card">
          <div class="row between"><h3 class="card-title">${metaTitle}</h3>${status}</div>
          <p class="muted">Issued ${fmtTime(credential.issuedAt)}</p>
          <p class="mono" style="font-size:12px; word-break:break-all;">CID: ${credential.cid}</p>
          <div class="row" style="margin-top:12px">
            <a class="btn btn-outline btn-sm" href="#/verifier/lookup?id=${id}">${icons.search()} Verify</a>
            <a class="btn btn-primary btn-sm" href="#/share?id=${id}">${icons.link()} Share</a>
          </div>
        </div>`;
      } catch (e) {
        return `<div class="card"><h3 class="card-title">Credential #${id}</h3><p class="muted">${e.message}</p></div>`;
      }
    }));
    target.innerHTML = `<div class="grid-3">${cards.join("")}</div>`;
  } catch (e) {
    target.innerHTML = emptyState({ icon: icons.cap(), title: "Could not load credentials", description: e.message });
  }
}

async function renderHistory(address) {
  const target = document.getElementById("credentials-history");
  target.innerHTML = `<p class="muted">Loading on-chain history…</p>`;
  try {
    const { events = [] } = await api.studentActivity(address);
    if (!events.length) { target.innerHTML = `<p class="muted">No activity yet.</p>`; return; }
    target.innerHTML = `<div class="timeline">${events.map(e => `
      <div class="tl-item">
        <h5>${e.type}</h5>
        <p class="meta">Block #${e.blockNumber} · <span class="mono">${e.transactionHash.slice(0,18)}…</span></p>
      </div>`).join("")}</div>`;
  } catch (e) {
    target.innerHTML = `<p class="muted">${e.message}</p>`;
  }
}

export function credentialsPage({ path }) {
  const body = `
    <div class="container" style="padding:56px 24px;">
      <p class="eyebrow">UC-06 · OWN YOUR ACADEMIC RECORD</p>
      <h1 class="serif" style="font-size:38px; color:var(--navy); margin:8px 0 12px;">My Credentials</h1>
      <p class="muted" style="max-width:620px;">Every degree, certificate and transcript ever issued to your wallet — anchored on Ethereum and stored on IPFS.</p>

      <div class="row between" style="margin:32px 0 16px;">
        <div class="row"><button id="reload-credentials" class="btn btn-outline btn-sm">${icons.search()} Reload</button></div>
        <a class="btn btn-primary btn-sm" href="#/share">${icons.link()} Share a credential</a>
      </div>

      <div id="credentials-list">${emptyState({
        icon: icons.cap(),
        title: "Connect your wallet to view credentials",
        description: "Your wallet address is used to query the smart contract for credentials issued to you.",
        action: `<button class="btn btn-primary" id="connect-wallet-2">${icons.wallet()} Connect Wallet</button>`,
      })}</div>

      <h2 class="serif" style="font-size:24px; color:var(--navy); margin:48px 0 12px;">Activity timeline</h2>
      <div id="credentials-history"><p class="muted">Connect a wallet to load history.</p></div>
    </div>
  `;
  return {
    html: publicLayout(path, body),
    mount: async () => {
      wirePublicHeader();
      const load = async () => {
        try {
          const address = wallet.address || await wallet.connect();
          await renderList(address);
          await renderHistory(address);
        } catch (e) { notice(e.message, "error"); }
      };
      document.getElementById("connect-wallet-2")?.addEventListener("click", load);
      document.getElementById("reload-credentials")?.addEventListener("click", load);
      if (wallet.address) await load();
    },
  };
}