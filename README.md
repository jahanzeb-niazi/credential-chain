# CredLedger — Blockchain Academic Credential Verification

CredLedger is a decentralized academic credential platform. Universities issue tamper-proof credentials on the **Ethereum Sepolia** blockchain, with metadata pinned to **IPFS** via Pinata. Students own and share their credentials directly from their wallet, and verifiers can check authenticity without contacting the issuing institution.

---

## Features

- **Government console** — onboard regulators (root of trust)
- **Regulator console** — authorize universities/institutions
- **University admin** — issue, update, and revoke credentials
- **Student portal** — view credentials, share via link + QR, full activity timeline
- **Verifier console** — verify by ID/CID, scan QR codes, view audit history
- **Wallet-based auth** — MetaMask, no passwords, role auto-detected on-chain
- **No PII on-chain** — only CIDs and hashes are stored on the blockchain

---

## Architecture

| Layer | Technology |
|---|---|
| Frontend | Vanilla JS SPA + Vite (port **5000**) |
| Backend | Pure Java (`com.sun.net.httpserver`, no framework, port **9000**) |
| Smart Contract | Solidity `0.8.24` on Ethereum Sepolia |
| Storage | IPFS via Pinata |
| Wallet | MetaMask (EIP-1193) |

**Architectural style:** Layered N-tier / Client-Server. The Java backend is read-only and orchestrates between the frontend SPA and the decentralized persistence layer (Ethereum + IPFS). All write transactions are signed in the browser via MetaMask.

---

## Project Structure

```
├── contracts/               # CredLedger.sol smart contract
├── backend/                 # Pure Java HTTP server
│   └── src/credledger/
│       ├── Main.java
│       ├── controllers/     # HTTP route controllers
│       ├── services/        # Ethereum + IPFS services
│       ├── models/          # Domain models
│       └── http/            # Router + handlers
├── public/                  # Frontend SPA
│   ├── index.html
│   ├── assets/styles.css
│   └── js/
│       ├── app.js, router.js, layout.js
│       ├── config/          # Backend URL + chain config
│       ├── hooks/           # api, wallet, contract, ipfs
│       └── pages/           # admin, regulator, verifier, credentials, share
└── vite.config.js
```

---

## Prerequisites

- **JDK 17+**
- **Node.js 18+**
- **MetaMask** browser extension (Sepolia network)
- **Pinata** account → JWT token
- **Sepolia RPC URL** (Infura / Alchemy / public)
- Sepolia ETH for gas (free from any Sepolia faucet)

---

## Setup

### 1. Deploy the smart contract

1. Open [Remix](https://remix.ethereum.org)
2. Compile `contracts/CredLedger.sol` with Solidity `0.8.24`
3. Deploy from your **government wallet** on Sepolia (the deployer becomes the root government account)
4. Copy the deployed contract address

### 2. Configure the backend

```bash
export PORT=9000
export PINATA_JWT=your_pinata_jwt
export ETH_RPC_URL=https://sepolia.infura.io/v3/your_key
export CONTRACT_ADDRESS=0xYourDeployedContract
export IPFS_GATEWAY=https://gateway.pinata.cloud/ipfs/
export CORS_ORIGIN=*
```

### 3. Build & run the backend

```bash
javac -d backend/out $(find backend/src -name '*.java')
java -cp backend/out credledger.Main
```

Backend runs at `http://localhost:9000`.

### 4. Run the frontend

```bash
npm install
npm run dev
```

Frontend runs at `http://localhost:5000`. The frontend auto-fetches the contract address from `/api/config`.

---

## Usage Flow

1. **Government** connects wallet → adds Regulator addresses
2. **Regulator** connects wallet → authorizes Institution addresses
3. **Institution** connects wallet → issues credentials to student wallets (metadata uploaded to IPFS)
4. **Student** connects wallet → views owned credentials → shares link + QR
5. **Verifier** opens shared link or scans QR → on-chain verification + audit trail

---

## Backend API

| Endpoint | Description |
|---|---|
| `GET /api/health` | Service health |
| `GET /api/config` | Contract address, chain, IPFS gateway |
| `GET /api/role?wallet=` | Detect role for a wallet |
| `GET /api/stats` | Regulator/institution/credential counts |
| `POST /api/ipfs/upload` | Pin JSON metadata to IPFS |
| `GET /api/ipfs?cid=` | Fetch IPFS content |
| `GET /api/credential?id=` | Get credential by ID |
| `GET /api/credential/student?wallet=` | Credential IDs owned by student |
| `GET /api/credential/institution?wallet=` | Credential IDs issued by institution |
| `GET /api/verify?id=` | On-chain verification |
| `GET /api/audit?id=` | Full audit trail for a credential |
| `GET /api/student/activity?wallet=` | Student activity timeline |
| `GET /api/institution/activity?wallet=` | Institution activity events |
| `GET /api/regulators` | List all regulators |
| `GET /api/institutions` | List all institutions |
| `GET /api/regulator?wallet=` | Regulator profile |
| `GET /api/institution?wallet=` | Institution profile |

All write transactions (issue, update, revoke, authorize) are signed in the browser via MetaMask — the backend never holds private keys.

---

## Security

- Role-based access control enforced on-chain in `CredLedger.sol`
- No private keys on the server — all writes signed by MetaMask
- No PII on-chain — only CIDs/hashes
- Revocations are immutable
- CORS configurable via `CORS_ORIGIN`

---

## License

Academic project — provided as-is for educational use.