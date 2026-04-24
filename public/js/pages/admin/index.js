import { adminShell, wireRoleShell } from "./_shell.js";
import { pageHeader, emptyState } from "../../layout.js";
import { icons } from "../../icons.js";

export function adminOverview({ path }) {
  const stats = [
    { label: "Active credentials", value: "—" },
    { label: "Issued (30d)", value: "—" },
    { label: "Revoked", value: "—" },
    { label: "Pending IPFS uploads", value: "—" },
  ];
  const body = `
    ${pageHeader({
      eyebrow: "UC-01 → UC-05 · ISSUER WORKSPACE",
      title: "University Admin Console",
      description: "Issue, update, and revoke credentials. Every action is signed by the institution wallet and recorded on-chain.",
      actions: `<a class="btn btn-primary" href="#/admin/issue">${icons.plus()} Issue credential</a>`,
    })}
    <div class="grid-4">
      ${stats.map(s => `
        <div class="card flat" style="padding:18px;">
          <p class="muted" style="font-size:12px; text-transform:uppercase; letter-spacing:.1em; margin:0;">${s.label}</p>
          <p class="serif" style="font-size:32px; color:var(--navy); margin:6px 0 0;">${s.value}</p>
        </div>`).join("")}
    </div>
    <div style="height:24px"></div>
    ${emptyState({
      icon: icons.activity(),
      title: "No on-chain activity yet",
      description: "Once your institution wallet starts issuing credentials, the most recent transactions will appear here with hashes and block numbers.",
      action: `<a class="btn btn-outline" href="#/admin/issue">Issue your first credential</a>`,
    })}
  `;
  return { html: adminShell({ currentPath: path, body }), mount: wireRoleShell };
}
