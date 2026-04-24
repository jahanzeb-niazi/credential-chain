import { registerRoute, startRouter } from "./router.js";

import { landingPage } from "./pages/landing.js";
import { credentialsPage } from "./pages/credentials.js";
import { sharePage } from "./pages/share.js";

import { adminOverview } from "./pages/admin/index.js";
import { adminIssue }    from "./pages/admin/issue.js";
import { adminManage }   from "./pages/admin/manage.js";
import { adminUpdate }   from "./pages/admin/update.js";
import { adminRevoke }   from "./pages/admin/revoke.js";
import { adminCid }      from "./pages/admin/cid.js";

import { verifierOverview }  from "./pages/verifier/index.js";
import { verifierLookup }    from "./pages/verifier/lookup.js";
import { verifierScan }      from "./pages/verifier/scan.js";
import { verifierAudit }     from "./pages/verifier/audit.js";
import { verifierTimestamp } from "./pages/verifier/timestamp.js";

import { regulatorOverview }     from "./pages/regulator/index.js";
import { regulatorGovernment }   from "./pages/regulator/government.js";
import { regulatorInstitutions } from "./pages/regulator/institutions.js";
import { regulatorActivity }     from "./pages/regulator/activity.js";

import { wallet }   from "./hooks/wallet.js";
import { contract } from "./hooks/contract.js";
import { ipfs }     from "./hooks/ipfs.js";

// Public
registerRoute("/",            landingPage);
registerRoute("/credentials", credentialsPage);
registerRoute("/share",       sharePage);

// Admin
registerRoute("/admin",         adminOverview);
registerRoute("/admin/issue",   adminIssue);
registerRoute("/admin/manage",  adminManage);
registerRoute("/admin/update",  adminUpdate);
registerRoute("/admin/revoke",  adminRevoke);
registerRoute("/admin/cid",     adminCid);

// Verifier
registerRoute("/verifier",            verifierOverview);
registerRoute("/verifier/lookup",     verifierLookup);
registerRoute("/verifier/scan",       verifierScan);
registerRoute("/verifier/audit",      verifierAudit);
registerRoute("/verifier/timestamp",  verifierTimestamp);

// Regulator
registerRoute("/regulator",              regulatorOverview);
registerRoute("/regulator/government",   regulatorGovernment);
registerRoute("/regulator/institutions", regulatorInstitutions);
registerRoute("/regulator/activity",     regulatorActivity);

// Expose integration hooks globally so your Java/Solidity/IPFS layer
// (loaded as a separate script or wired manually) can replace or call them.
window.CredLedger = { wallet, contract, ipfs };

startRouter();
