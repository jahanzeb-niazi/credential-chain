import { regulatorShell, wireRoleShell } from "./_shell.js";
import { pageHeader, emptyState } from "../../layout.js";
import { icons } from "../../icons.js";
import { wallet } from "../../hooks/wallet.js";
import { api } from "../../hooks/api.js";
import { notice } from "../../utils/dom.js";

export function regulatorOverview({ path }) {
  const body = `
    ${pageHeader({
      eyebrow: "UC-13 → UC-15 · GOVERNANCE",
      title: "Regulator & Government",
      description: "Onboard new regulators, authorize universities, and audit institutional behavior on the public ledger.",
    })}
    <div class="grid-4">
      <div class="card flat" style="padding:18px;">
        <p class="muted" style="font-size:12px;text-transform:uppercase;letter-spacing:.1em;margin:0;">Authorized institutions</p>
        <p id="stat-institutions" class="serif" style="font-size:32px;color:var(--gold);margin:6px 0 0;">—</p>
      </div>
      <div class="card flat" style="padding:18px;">
        <p class="muted" style="font-size:12px;text-transform:uppercase;letter-spacing:.1em;margin:0;">Active regulators</p>
        <p id="stat-regulators" class="serif" style="font-size:32px;color:var(--gold);margin:6px 0 0;">—</p>
      </div>
      <div class="card flat" style="padding:18px;">
        <p class="muted" style="font-size:12px;text-transform:uppercase;letter-spacing:.1em;margin:0;">Total credentials</p>
        <p id="stat-credentials" class="serif" style="font-size:32px;color:var(--gold);margin:6px 0 0;">—</p>
      </div>
      <div class="card flat" style="padding:18px;">
        <p class="muted" style="font-size:12px;text-transform:uppercase;letter-spacing:.1em;margin:0;">My role</p>
        <p id="stat-role" class="serif" style="font-size:18px;color:var(--gold);margin:6px 0 0;">—</p>
      </div>
    </div>
    <div style="height:24px"></div>
    <div class="card" style="padding:0;overflow:hidden;">
      <div style="padding:20px 24px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;">
        <h3 class="card-title" style="margin:0;">Registered institutions</h3>
        <button id="reload-stats" class="btn btn-outline btn-sm">${icons.search()} Refresh</button>
      </div>
      <div id="inst-list" style="padding:24px;">
        ${emptyState({
          icon: icons.landmark(),
          title: "Loading governance data",
          description: "Click Refresh to load current institution and regulator data from the contract.",
        })}
      </div>
    </div>
  `;

  return {
    html: regulatorShell({ currentPath: path, body }),
    mount: () => {
      wireRoleShell();

      async function loadStats() {
        try {
          const stats = await api.getStats();
          const el = (id) => document.getElementById(id);
          el("stat-institutions").textContent = stats.institutionCount ?? "—";
          el("stat-regulators").textContent   = stats.regulatorCount   ?? "—";
          el("stat-credentials").textContent  = stats.totalCredentials ?? "—";
        } catch (e) {
          notice(e.message, "error");
        }
      }

      async function loadInstitutions() {
        const listEl = document.getElementById("inst-list");
        listEl.innerHTML = `<p class="muted" style="text-align:center;padding:24px 0;">Loading…</p>`;
        try {
          const { institutions = [] } = await api.listInstitutions();
          if (!institutions.length) {
            listEl.innerHTML = `<p class="muted" style="text-align:center;padding:24px 0;">No institutions registered yet.</p>`;
            return;
          }
          const cards = await Promise.all(institutions.map(async (addr) => {
            try {
              const { institution } = await api.getInstitution(addr);
              const status = institution.suspended
                ? `<span class="pill pill-danger">Suspended</span>`
                : institution.authorized
                  ? `<span class="pill pill-info">Authorized</span>`
                  : `<span class="pill">Unauthorized</span>`;
              return `
              <div class="card flat" style="padding:16px;">
                <div class="row between">
                  <strong>${institution.name || "Unknown"}</strong>
                  ${status}
                </div>
                <p class="mono" style="font-size:11px;word-break:break-all;margin:4px 0;">${addr}</p>
                <p class="muted" style="font-size:12px;margin:4px 0;">Acc ID: ${institution.accreditationId || "—"}</p>
              </div>`;
            } catch (_) {
              return `<div class="card flat" style="padding:16px;"><p class="mono" style="font-size:11px;">${addr}</p></div>`;
            }
          }));
          listEl.innerHTML = `<div class="grid-3">${cards.join("")}</div>`;
        } catch (e) {
          notice(e.message, "error");
          listEl.innerHTML = `<p class="muted" style="text-align:center;padding:24px 0;">${e.message}</p>`;
        }
      }

      async function loadRole() {
        if (!wallet.address) return;
        try {
          const data = await api.getRole(wallet.address);
          const roleEl = document.getElementById("stat-role");
          if (data.isGovernment) roleEl.textContent = "Government";
          else if (data.isRegulator) roleEl.textContent = "Regulator";
          else roleEl.textContent = "Student";
        } catch (_) {}
      }

      document.getElementById("reload-stats")?.addEventListener("click", async () => {
        await loadStats();
        await loadInstitutions();
      });

      loadStats();
      loadInstitutions();
      if (wallet.address) loadRole();

      document.addEventListener("walletConnected", (e) => loadRole(), { once: true });
    },
  };
}
