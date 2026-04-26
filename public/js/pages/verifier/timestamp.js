import { verifierShell, wireRoleShell } from "./_shell.js";
import { pageHeader } from "../../layout.js";
import { icons } from "../../icons.js";
import { api } from "../../hooks/api.js";
import { notice, value, setText, fmtTime } from "../../utils/dom.js";

export function verifierTimestamp({ path }) {
  const body = `
    ${pageHeader({
      eyebrow: "UC-12 · TIMESTAMP VERIFICATION",
      title: "When was this credential issued?",
      description: "Pulls the Ethereum block timestamp for the issuance transaction. Block timestamps are immutable and cannot be backdated.",
    })}
    <div class="card">
      <div class="row">
        <input id="timestamp-id" class="input mono" placeholder="Credential ID" style="flex:1"/>
        <button id="resolve-timestamp" class="btn btn-primary">Resolve timestamp</button>
      </div>
    </div>
    <div class="card" style="margin-top:24px; text-align:center; padding:48px 24px;">
      <div style="display:inline-flex; color:var(--gold);">${icons.clock()}</div>
      <p class="eyebrow" style="margin-top:14px">BLOCK TIMESTAMP</p>
      <p id="timestamp-value" class="serif" style="font-size:42px; color:var(--navy); margin:8px 0 4px;">— : — : — UTC</p>
      <p id="timestamp-meta" class="muted">Credential #—</p>
      <p class="muted" style="max-width:460px; margin:24px auto 0; font-size:13px;">
        The Ethereum protocol enforces monotonic block timestamps. Once written, this value is part of the global consensus state — universities cannot rewrite it after the fact.
      </p>
    </div>
  `;
  return { html: verifierShell({ currentPath: path, body }), mount: () => {
    wireRoleShell();
    document.getElementById("resolve-timestamp")?.addEventListener("click", async () => {
      try { const { result } = await api.verify(value("#timestamp-id")); setText("#timestamp-value", fmtTime(result.credential.issuedAt)); setText("#timestamp-meta", `Credential #${result.credential.id} · ${result.credential.status}`); }
      catch (error) { notice(error.message, "error"); }
    });
  } };
}
