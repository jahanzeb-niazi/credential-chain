import { verifierShell, wireRoleShell } from "./_shell.js";
import { pageHeader } from "../../layout.js";
import { icons } from "../../icons.js";

export function verifierTimestamp({ path }) {
  const body = `
    ${pageHeader({
      eyebrow: "UC-12 · TIMESTAMP VERIFICATION",
      title: "When was this credential issued?",
      description: "Pulls the Ethereum block timestamp for the issuance transaction. Block timestamps are immutable and cannot be backdated.",
    })}
    <div class="card">
      <div class="row">
        <input class="input mono" placeholder="Credential ID or CID" style="flex:1"/>
        <button class="btn btn-primary">Resolve timestamp</button>
      </div>
    </div>
    <div class="card" style="margin-top:24px; text-align:center; padding:48px 24px;">
      <div style="display:inline-flex; color:var(--gold);">${icons.clock()}</div>
      <p class="eyebrow" style="margin-top:14px">BLOCK TIMESTAMP</p>
      <p class="serif" style="font-size:42px; color:var(--navy); margin:8px 0 4px;">— : — : — UTC</p>
      <p class="muted">Block #— · Tx 0x…</p>
      <p class="muted" style="max-width:460px; margin:24px auto 0; font-size:13px;">
        The Ethereum protocol enforces monotonic block timestamps. Once written, this value is part of the global consensus state — universities cannot rewrite it after the fact.
      </p>
    </div>
  `;
  return { html: verifierShell({ currentPath: path, body }), mount: wireRoleShell };
}
