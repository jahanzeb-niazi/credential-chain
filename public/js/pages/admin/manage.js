import { adminShell, wireRoleShell } from "./_shell.js";
import { pageHeader, emptyState } from "../../layout.js";
import { icons } from "../../icons.js";
import { wallet } from "../../hooks/wallet.js";
import { api } from "../../hooks/api.js";
import { ipfs } from "../../hooks/ipfs.js";
import { notice, fmtTime } from "../../utils/dom.js";

export function adminManage({ path }) {
  const body = `
    ${pageHeader({
      eyebrow: "UC-02 · ACTIVE LEDGER",
      title: "Manage issued credentials",
      description: "Browse credentials issued by your institution. Filter, inspect on-chain status, jump to update or revoke flows.",
      actions: `<button id="reload-issued" class="btn btn-outline btn-sm">${icons.search()} Load my issuance history</button>`,
    })}
    <div class="card" style="padding:0; overflow:hidden;">
      <div id="issued-list" style="padding:24px;">
        ${emptyState({ icon: icons.doc(), title: "Connect institution wallet", description: "Click 'Load my issuance history' to query the contract for credentials issued by your wallet." })}
      </div>
    </div>
  `;
  return { html: adminShell({ currentPath: path, body }), mount: () => {
    wireRoleShell();
    document.getElementById("reload-issued")?.addEventListener("click", async () => {
      try {
        const addr = wallet.address || await wallet.connect();
        const { credentialIds = [] } = await api.getInstitutionCredentials(addr);
        if (!credentialIds.length) { document.getElementById("issued-list").innerHTML = `<p class="muted">No credentials issued yet from ${addr}.</p>`; return; }
        const cards = await Promise.all(credentialIds.map(async (id) => {
          try {
            const { credential } = await api.getCredential(id);
            let title = `Credential #${id}`;
            try { if (credential.cid) { const m = await ipfs.fetch(credential.cid); const obj = typeof m === "string" ? JSON.parse(m) : m; title = obj.title || obj.credentialType || title; } } catch (_) {}
            const status = credential.status === "Revoked" ? `<span class="pill pill-danger">Revoked</span>` : `<span class="pill pill-info">Active</span>`;
            return `<div class="card"><div class="row between"><h3 class="card-title">${title}</h3>${status}</div><p class="muted">Issued ${fmtTime(credential.issuedAt)}</p><p class="mono" style="font-size:12px; word-break:break-all;">Holder: ${credential.student}</p><p class="mono" style="font-size:12px; word-break:break-all;">CID: ${credential.cid}</p><div class="row"><a class="btn btn-outline btn-sm" href="#/admin/update">${icons.edit()} Update</a><a class="btn btn-danger btn-sm" href="#/admin/revoke">${icons.ban()} Revoke</a></div></div>`;
          } catch (e) { return `<div class="card"><h3 class="card-title">Credential #${id}</h3><p class="muted">${e.message}</p></div>`; }
        }));
        document.getElementById("issued-list").innerHTML = `<div class="grid-3">${cards.join("")}</div>`;
      } catch (e) { notice(e.message, "error"); }
    });
  } };
}
