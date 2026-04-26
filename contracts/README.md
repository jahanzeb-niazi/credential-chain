# CredLedger Solidity Backend

Deploy `CredLedger.sol` with the government wallet. The deployer becomes the root government account.

## Sepolia deployment flow

1. Open Remix or your preferred Solidity tool.
2. Compile with Solidity `0.8.24` or newer.
3. Deploy `CredLedger` from the government MetaMask account on Sepolia.
4. Copy the deployed contract address into `public/js/config/config.js`.
5. Use the Government console to add regulators.
6. Regulators authorize institutions.
7. Authorized institutions issue, update, and revoke credentials.

## Source of truth

- On-chain: roles, credential owner, issuer, CID, status, timestamps, audit events.
- IPFS: credential metadata JSON and optional document references.
