# CredLedger — Blockchain Academic Credential Verification

## Project Overview

CredLedger is a blockchain-based academic credential verification platform. Students can own and share tamper-proof academic credentials stored on-chain (Ethereum Sepolia testnet) with metadata pinned to IPFS via Pinata.

## Architecture

### Frontend (Vanilla JS SPA)
- **Location**: `public/`
- **Entry**: `public/index.html` → `public/js/app.js`
- **Router**: Hash-based SPA router (`public/js/router.js`)
- **Styles**: `public/assets/styles.css` (Navy + Gold academic design system)
- **Dev Server**: Vite (`vite.config.js`) on port **5000**
- **Build Output**: `dist/`

### Backend (Pure Java HTTP Server)
- **Location**: `backend/src/credledger/`
- **Entry**: `backend/src/credledger/Main.java`
- **Framework**: `com.sun.net.httpserver.HttpServer` (no external framework)
- **Default Port**: **9000** (configurable via `PORT` env var)
- **Compiled Output**: `backend/out/`

### Smart Contract
- **Location**: `contracts/CredLedger.sol`
- **Network**: Ethereum Sepolia testnet
- **Write transactions**: Signed in browser via MetaMask

## Workflows

| Workflow | Command | Port | Type |
|---|---|---|---|
| Start application | `npm run dev` | 5000 | webview |
| Backend API | `java -cp backend/out credledger.Main` | 9000 | console |

## Backend Environment Variables

Copy from `backend/.env.example`:

```
PORT=9000
PINATA_JWT=your_pinata_jwt
ETH_RPC_URL=https://sepolia.infura.io/v3/your_key
CONTRACT_ADDRESS=0xYourDeployedContract
IPFS_GATEWAY=https://gateway.pinata.cloud/ipfs/
CORS_ORIGIN=*
```

## Key Frontend Routes

- `/` — Landing page
- `/credentials` — Student credentials view
- `/share` — Share credential
- `/admin/*` — Institution admin (issue, manage, update, revoke, CID)
- `/verifier/*` — Verifier dashboard (lookup, scan, audit, timestamp)
- `/regulator/*` — Regulator dashboard (government, institutions, activity)

## Backend API Endpoints

- `GET /api/health`
- `POST /api/ipfs/upload` — Upload metadata to IPFS via Pinata
- `GET /api/ipfs?cid=...` — Fetch IPFS content
- `GET /api/credential?id=...`
- `GET /api/credential/student?wallet=...`
- `GET /api/credential/institution?wallet=...`
- `GET /api/verify?id=...`
- `GET /api/audit?id=...`
- `GET /api/institution/activity?wallet=...`

## Development Notes

- Frontend uses `config.backendBaseUrl` (defaults to `http://localhost:9000`)
- Backend URL and contract address are configurable via localStorage in the browser
- Write transactions (issue, revoke, update) are signed with MetaMask in the browser
- CORS is enabled via `CORS_ORIGIN` env var (default: `*`)

## Deployment

Configured as a **static** deployment:
- Build: `npm run build` (Vite bundles `public/` to `dist/`)
- Serve: `dist/` directory

To recompile the Java backend: `javac -d backend/out $(find backend/src -name '*.java')`
