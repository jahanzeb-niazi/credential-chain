import { publicLayout, wirePublicHeader } from "../layout.js";
import { icons } from "../icons.js";

export function landingPage({ path }) {
  const features = [
    { icon: icons.shield(), title: "Tamper-proof", desc: "Every credential is anchored on Ethereum. Issuers, dates and statuses are part of immutable consensus." },
    { icon: icons.cid(), title: "IPFS-backed metadata", desc: "Rich credential payloads live on IPFS, addressed by content. Records cannot be silently rewritten." },
    { icon: icons.lock(), title: "Selective disclosure", desc: "Share only what a verifier needs — a single course, a degree, or a date — using cryptographic proofs." },
  ];
  const consoles = [
    { badge: "STUDENTS", title: "My Credentials", desc: "View, download and selectively share what you've earned.", to: "/credentials", icon: icons.users() },
    { badge: "UNIVERSITIES", title: "Issue & Manage", desc: "Mint credentials on-chain, update or revoke when policy requires.", to: "/admin", icon: icons.building() },
    { badge: "VERIFIERS", title: "Trustless Verify", desc: "Validate any credential directly against the ledger — no email needed.", to: "/verifier", icon: icons.shield() },
    { badge: "REGULATORS", title: "Audit & Govern", desc: "Authorize institutions, audit on-chain activity, suspend bad actors.", to: "/regulator", icon: icons.landmark() },
  ];
  const steps = [
    { h: "University issues", p: "Admin uploads metadata to IPFS, calls issueCredential(student, cid) on the smart contract." },
    { h: "Student receives", p: "Credential appears in the student's wallet. Ownership is on-chain — nobody can take it away." },
    { h: "Verifier checks", p: "A recruiter scans a QR or pastes a credential ID. The contract returns issuer, status, timestamp." },
    { h: "Regulator audits", p: "Government bodies query institutional activity logs and authorize or suspend issuers." },
  ];

  const body = `
    <section class="hero">
      <div class="container">
        <p class="eyebrow">CREDLEDGER · ON-CHAIN ACADEMIC CREDENTIALS</p>
        <h1>Diplomas you actually own,<br/>verified in seconds.</h1>
        <p>Universities issue tamper-proof credentials to a student's wallet. Employers verify them directly against the blockchain. Regulators audit the entire system in the open.</p>
        <div class="actions">
          <a class="btn btn-primary btn-lg" href="#/credentials">${icons.users()} I'm a student</a>
          <a class="btn btn-outline btn-lg" href="#/verifier">${icons.shield()} Verify a credential</a>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <p class="eyebrow" style="text-align:center">WHY CREDLEDGER</p>
        <h2>Three things paper diplomas can't do</h2>
        <p class="sub">Built on Ethereum, IPFS and zero-knowledge friendly proofs.</p>
        <div class="grid-3">
          ${features.map(f => `
            <div class="feature-card">
              <div class="icon-box">${f.icon}</div>
              <h3>${f.title}</h3>
              <p>${f.desc}</p>
            </div>`).join("")}
        </div>
      </div>
    </section>

    <section class="section" style="background:#f5f1e833;">
      <div class="container">
        <p class="eyebrow" style="text-align:center">FOUR CONSOLES</p>
        <h2>One ledger, four perspectives</h2>
        <p class="sub">Each stakeholder gets a focused workspace, all reading from the same source of truth.</p>
        <div class="grid-4">
          ${consoles.map(c => `
            <a class="console-card" href="#${c.to}">
              <span class="badge">${c.badge}</span>
              <h3>${c.title}</h3>
              <p>${c.desc}</p>
              <span class="row" style="color:var(--gold); font-weight:500; font-size:13px;">Open ${icons.arrowRight()}</span>
            </a>`).join("")}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container" style="max-width:760px">
        <p class="eyebrow" style="text-align:center">HOW IT WORKS</p>
        <h2>Issuance to verification, end-to-end</h2>
        <div class="steps card" style="margin-top:32px">
          ${steps.map((s, i) => `
            <div class="step">
              <div class="num">${i + 1}</div>
              <div>
                <h4>${s.h}</h4>
                <p>${s.p}</p>
              </div>
            </div>`).join("")}
        </div>
      </div>
    </section>
  `;

  return {
    html: publicLayout(path, body),
    mount: () => wirePublicHeader(),
  };
}
