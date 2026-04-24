import { regulatorShell, wireRoleShell } from "./_shell.js";
import { pageHeader, emptyState } from "../../layout.js";
import { icons } from "../../icons.js";

export function regulatorOverview({ path }) {
  const stats = [
    { label: "Authorized institutions", value: "—" },
    { label: "Active regulators", value: "—" },
    { label: "Suspensions (90d)", value: "—" },
    { label: "Total credentials issued", value: "—" },
  ];
  const body = `
    ${pageHeader({
      eyebrow: "UC-13 → UC-15 · GOVERNANCE",
      title: "Regulator & Government",
      description: "Onboard new regulators, authorize universities, and audit institutional behavior on the public ledger.",
    })}
    <div class="grid-4">
      ${stats.map(s => `
        <div class="card flat" style="padding:18px;">
          <p class="muted" style="font-size:12px; text-transform:uppercase; letter-spacing:.1em; margin:0;">${s.label}</p>
          <p class="serif" style="font-size:32px; color:var(--gold); margin:6px 0 0;">${s.value}</p>
        </div>`).join("")}
    </div>
    <div style="height:24px"></div>
    ${emptyState({
      icon: icons.landmark(),
      title: "Governance feed is empty",
      description: "Authorizations, suspensions, and high-volume issuance events from monitored institutions will stream here.",
    })}
  `;
  return { html: regulatorShell({ currentPath: path, body }), mount: wireRoleShell };
}
