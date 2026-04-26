import { verifierShell, wireRoleShell } from "./_shell.js";
import { pageHeader, emptyState } from "../../layout.js";
import { icons } from "../../icons.js";
import { api } from "../../hooks/api.js";
import { notice, value, setHtml } from "../../utils/dom.js";

export function verifierLookup({ path }) {
  const body = `
    ${pageHeader({
      eyebrow: "UC-09 · DIRECT BLOCKCHAIN VALIDATION",
      title: "Direct lookup",
      description: "Query the smart contract by credential ID, CID, or holder wallet. The result comes straight from the immutable ledger.",
    })}
    <div class="card">
      <div class="row">
        <input id="lookup-id" class="input mono" placeholder="Credential ID" style="flex:1"/>
        <button id="lookup-button" class="btn btn-primary">${icons.search()} Lookup</button>
      </div>
    </div>
    <div id="lookup-result" style="height:24px"></div>
    <div id="lookup-empty">${emptyState({
      icon: icons.shield(),
      title: "Awaiting query",
      description: "Enter a reference above. The result will appear here with issuer, holder, status, IPFS metadata, and the issuing block.",
    })}</div>
  `;
  return { html: verifierShell({ currentPath: path, body }), mount: () => {
    wireRoleShell();
    document.getElementById("lookup-button")?.addEventListener("click", async () => {
      try {
        const { result } = await api.verify(value("#lookup-id"));
        setHtml("#lookup-empty", "");
        setHtml("#lookup-result", `<div class="result-box"><strong>${result.message}</strong><pre class="mono">${JSON.stringify(result, null, 2)}</pre></div>`);
      } catch (error) { notice(error.message, "error"); }
    });
  } };
}
