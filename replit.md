# CredLedger — Blockchain Academic Credential Verification

## Project Overview

CredLedger is a blockchain-based academic credential verification platform. Students own and share tamper-proof academic credentials stored on-chain (Ethereum Sepolia testnet) with metadata pinned to IPFS via Pinata.

## Architecture

### Frontend (Vanilla JS SPA)
- **Location**: `public/`
- **Entry**: `public/index.html` → `public/js/app.js`
- **Router**: Hash-based SPA router (`public/js/router.js`)
- **Styles**: `public/assets/styles.css` (Navy + Gold academic design system)
- **Dev Server**: Vite (`vite.config.js`) on port **5000**

### Backend (Pure Java HTTP Server)
- **Location**: `backend/src/credledger/`
- **Entry**: `backend/src/credledger/Main.java`
- **Framework**: `com.sun.net.httpserver.HttpServer` (no external framework)
- **Port**: **9000** (configurable via `PORT` env var)
- **Compiled Output**: `backend/out/`
- **Recompile**: `javac -d backend/out $(find backend/src -name '*.java')`

### Smart Contract
- **Location**: `contracts/CredLedger.sol`
- **Network**: Ethereum Sepolia testnet
- **Write transactions**: Signed in browser via MetaMask (backend is read-only)

## Workflows

| Workflow | Command | Port |
|---|---|---|
| Start application | `npm run dev` | 5000 |
| Backend API | `java -cp backend/out credledger.Main` | 9000 |

## Backend Environment Variables

```
PORT=9000
PINATA_JWT=your_pinata_jwt
ETH_RPC_URL=https://sepolia.infura.io/v3/your_key
CONTRACT_ADDRESS=0xYourDeployedContract
IPFS_GATEWAY=https://gateway.pinata.cloud/ipfs/
CORS_ORIGIN=*
```

## Backend API Endpoints

| Endpoint | Description |
|---|---|
| `GET /api/health` | Service health check |
| `GET /api/config` | Returns contract address, network, IPFS gateway |
| `GET /api/role?wallet=` | Returns `{isGovernment, isRegulator, isInstitution, isStudent, profile}` |
| `GET /api/stats` | Returns `{regulatorCount, institutionCount, totalCredentials}` |
| `POST /api/ipfs/upload` | Upload metadata to IPFS via Pinata |
| `GET /api/ipfs?cid=` | Fetch IPFS content |
| `GET /api/credential?id=` | Get credential by ID |
| `GET /api/credential/student?wallet=` | Get credential IDs for student |
| `GET /api/credential/institution?wallet=` | Get credential IDs issued by institution |
| `GET /api/verify?id=` | On-chain credential verification |
| `GET /api/audit?id=` | Full audit trail for a credential |
| `GET /api/institution/activity?wallet=` | Activity events for institution wallet |
| `GET /api/student/activity?wallet=` | Activity events for student wallet |
| `GET /api/regulators` | List all regulator addresses |
| `GET /api/institutions` | List all institution addresses |
| `GET /api/regulator?wallet=` | Regulator profile |
| `GET /api/institution?wallet=` | Institution profile |

## Key Bug Fixes

### `getInstitutionActivity` event topic fix
`CredentialIssued` has institution at topic[3] (not topic[2]).
`CredentialUpdated` and `CredentialRevoked` have institution at topic[2].
Fixed in `EthereumJsonRpcService.getInstitutionActivity()` with separate queries per event type.

## Frontend Routes

- `/` — Landing page
- `/credentials` — Student credentials (auto-loads on wallet connect)
- `/share` — Share credential by ID with QR code
- `/admin` — Institution admin overview (live stats)
- `/admin/issue` — Issue a credential
- `/admin/manage` — Manage issued credentials (links to update/revoke with `?id=`)
- `/admin/update` — Update credential CID (auto-loads current CID from contract)
- `/admin/revoke` — Revoke credential (auto-loads holder wallet)
- `/admin/cid` — IPFS / CID tools
- `/verifier` — Quick verify by ID or CID (fully wired)
- `/verifier/lookup` — Direct blockchain lookup
- `/verifier/scan` — QR scanner (jsQR via CDN, camera + image upload)
- `/verifier/audit` — Audit history
- `/verifier/timestamp` — Block timestamp check
- `/regulator` — Regulator overview (live stats + institution list)
- `/regulator/government` — Onboard regulators
- `/regulator/institutions` — Authorize institutions
- `/regulator/activity` — Audit activity

## Wallet Persistence

- Wallet address persisted in `localStorage` (`credledger.walletAddress`)
- Role data cached in `localStorage` (`credledger.walletRole`) — refreshed on connect
- `accountsChanged` event from MetaMask auto-switches wallet
- `chainChanged` reloads the page to resync
- Wallet button shows truncated address when connected across all console shells

## Development Notes

- `config.js` defaults `backendBaseUrl` to `http://localhost:9000`
- Backend auto-syncs contract address to frontend via `/api/config`
- Contract address overridable via localStorage: `credledger.contractAddress`
- CORS enabled via `CORS_ORIGIN` env var (default `*`)
