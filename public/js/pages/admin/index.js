import { adminShell, wireRoleShell } from "./_shell.js";
import { pageHeader, emptyState } from "../../layout.js";
import { icons } from "../../icons.js";
import { wallet } from "../../hooks/wallet.js";
import { api } from "../../hooks/api.js";
import { ipfs } from "../../hooks/ipfs.js";
import { notice, fmtTime } from "../../utils/dom.js";

export function adminOverview({ path }) {
  const body = `
    ${pageHeader({
      eyebrow: "UC-01 → UC-05 · ISSUER WORKSPACE",
      title: "University Admin Console",
      description: "Issue, update, and revoke credentials. Every action is signed by the institution wallet and recorded on-chain.",
      actions: `<a class="btn btn-primary" href="#/admin/issue">${icons.plus()} Issue credential</a>`,
    })}
    <div class="grid-4">
      <div class="card flat" style="padding:18px;">
        <p class="muted" style="font-size:12px;text-transform:uppercase;letter-spacing:.1em;margin:0;">Total issued</p>
        <p id="stat-issued" class="serif" style="font-size:32px;color:var(--navy);margin:6px 0 0;">—</p>
      </div>
      <div class="card flat" style="padding:18px;">
        <p class="muted" style="font-size:12px;text-transform:uppercase;letter-spacing:.1em;margin:0;">Active</p>
        <p id="stat-active" class="serif" style="font-size:32px;color:var(--navy);margin:6px 0 0;">—</p>
      </div>
      <div class="card flat" style="padding:18px;">
        <p class="muted" style="font-size:12px;text-transform:uppercase;letter-spacing:.1em;margin:0;">Revoked</p>
        <p id="stat-revoked" class="serif" style="font-size:32px;color:var(--navy);margin:6px 0 0;">—</p>
      </div>
      <div class="card flat" style="padding:18px;">
        <p class="muted" style="font-size:12px;text-transform:uppercase;letter-spacing:.1em;margin:0;">Updated</p>
        <p id="stat-updated" class="serif" style="font-size:32px;color:var(--navy);margin:6px 0 0;">—</p>
      </div>
    </div>
    <div style="height:24px"></div>
    <div class="card" style="padding:0;overflow:hidden;">
      <div style="padding:20px 24px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;">
        <h3 class="card-title" style="margin:0;">Recent on-chain activity</h3>
        <button id="reload-overview" class="btn btn-outline btn-sm">${icons.search()} Load activity</button>
      </div>
      <div id="overview-timeline" style="padding:24px;">
        ${emptyState({
          icon: icons.activity(),
          title: "Connect institution wallet",
          description: "Click 'Load activity' to pull your institution's on-chain event history directly from the contract.",
        })}
      </div>
    </div>
  `;

  return {
    html: adminShell({ currentPath: path, body }),
    mount: () => {
      wireRoleShell();

      async function loadOverview(addr) {
        document.getElementById("overview-timeline").innerHTML = `<p class="muted" style="text-align:center;padding:24px 0;">Loading…</p>`;
        try {
          const { credentialIds = [] } = await api.getInstitutionCredentials(addr);
          const total = credentialIds.length;
          const el = (id) => document.getElementById(id);
          el("stat-issued").textContent = total;

          let active = 0, revoked = 0;
          if (total > 0) {
            const creds = await Promise.all(
              credentialIds.slice(0, 100).map(id =>
                api.getCredential(id).then(r => r.credential).catch(() => null)
              )
            );
            creds.forEach(c => { if (!c) return; c.status === "Revoked" ? revoked++ : active++; });
          }
          el("stat-active").textContent = active;
          el("stat-revoked").textContent = revoked;

          const { events = [] } = await api.institutionActivity(addr);
          el("stat-updated").textContent = events.filter(e => e.type === "CredentialUpdated").length;

          const timeline = document.getElementById("overview-timeline");
          if (!events.length) {
            timeline.innerHTML = `<p class="muted" style="text-align:center;padding:24px 0;">No on-chain events found for this institution wallet.</p>`;
            return;
          }
          const recent = [...events].reverse().slice(0, 30);
          timeline.innerHTML = `<div class="timeline">${recent.map(e => {
            const credId = e.firstTopic ? parseInt(e.firstTopic, 16) || "" : "";
            return `<div class="tl-item">
              <h5>${e.type}${credId ? ` · Credential #${credId}` : ""}</h5>
              <p class="meta">Block <strong>#${e.blockNumber}</strong> · <span class="mono" style="font-size:11px;">${(e.transactionHash || "").slice(0, 24)}…</span></p>
            </div>`;
          }).join("")}</div>`;
        } catch (e) {
          notice(e.message, "error");
          document.getElementById("overview-timeline").innerHTML = `<p class="muted" style="text-align:center;padding:24px 0;">${e.message}</p>`;
        }
      }

      document.getElementById("reload-overview")?.addEventListener("click", async () => {
        try { const addr = wallet.address || await wallet.connect(); await loadOverview(addr); }
        catch (e) { notice(e.message, "error"); }
      });

      if (wallet.address) loadOverview(wallet.address);
    },
  };
}
