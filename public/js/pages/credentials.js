import { publicLayout, wirePublicHeader, emptyState } from "../layout.js";
import { icons } from "../icons.js";
import { wallet } from "../hooks/wallet.js";
import { contract } from "../hooks/contract.js";
import { notice, setHtml } from "../utils/dom.js";

export function credentialsPage({ path }) {
  const body = `
    <div class="container" style="padding:56px 24px;">
      <p class="eyebrow">UC-06 · OWN YOUR ACADEMIC RECORD</p>
      <h1 class="serif" style="font-size:38px; color:var(--navy); margin:8px 0 12px;">My Credentials</h1>
      <p class="muted" style="max-width:620px;">Every degree, certificate and transcript ever issued to your wallet — anchored on Ethereum and stored on IPFS.</p>

      <div class="row between" style="margin:32px 0 16px;">
        <div class="row">
          <button class="btn btn-outline btn-sm">All</button>
          <button class="btn btn-ghost btn-sm">Active</button>
          <button class="btn btn-ghost btn-sm">Revoked</button>
        </div>
        <a class="btn btn-primary btn-sm" href="#/share">${icons.link()} Share a credential</a>
      </div>

      <div id="credentials-list">${emptyState({
        icon: icons.cap(),
        title: "No credentials in this wallet yet",
        description: "Once a university issues a credential to your address, it will appear here automatically. Connect your wallet to load on-chain records.",
        action: `<button class="btn btn-primary" id="connect-wallet-2">${icons.wallet()} Connect Wallet</button>`,
      })}</div>

      <div class="notice" style="margin-top:32px">
        Integration hook: <span class="mono">contract.getCredentialsByHolder(address)</span> will populate this list once wired to your Solidity contract.
      </div>
    </div>
  `;
  return {
    html: publicLayout(path, body),
    mount: () => {
      wirePublicHeader();
      const b = document.getElementById("connect-wallet-2");
      if (b) b.addEventListener("click", async () => {
        try {
          const address = await wallet.connect();
          const ids = await contract.getCredentialsByHolder(address);
          setHtml("#credentials-list", ids.length ? `<div class="grid-3">${ids.map(id => `<a class="card" href="#/verifier/lookup?id=${id}"><h3 class="card-title">Credential #${id}</h3><p class="muted">Open verification record</p></a>`).join("")}</div>` : document.querySelector("#credentials-list").innerHTML);
        } catch (error) { notice(error.message, "error"); }
      });
    },
  };
}
