import { verifierShell, wireRoleShell } from "./_shell.js";
import { pageHeader, emptyState } from "../../layout.js";
import { icons } from "../../icons.js";

export function verifierLookup({ path }) {
  const body = `
    ${pageHeader({
      eyebrow: "UC-09 · DIRECT BLOCKCHAIN VALIDATION",
      title: "Direct lookup",
      description: "Query the smart contract by credential ID, CID, or holder wallet. The result comes straight from the immutable ledger.",
    })}
    <div class="card">
      <div class="row">
        <input class="input mono" placeholder="Credential ID, CID, or 0x wallet address" style="flex:1"/>
        <button class="btn btn-primary">${icons.search()} Lookup</button>
      </div>
    </div>
    <div style="height:24px"></div>
    ${emptyState({
      icon: icons.shield(),
      title: "Awaiting query",
      description: "Enter a reference above. The result will appear here with issuer, holder, status, IPFS metadata, and the issuing block.",
    })}
  `;
  return { html: verifierShell({ currentPath: path, body }), mount: wireRoleShell };
}
