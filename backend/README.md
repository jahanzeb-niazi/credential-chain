# CredLedger Pure Java Backend

Pure Java backend using `com.sun.net.httpserver.HttpServer` and OOP services/controllers. No framework is used.

## Requirements

- JDK 17+
- Pinata JWT
- Sepolia RPC URL
- Deployed `CredLedger` contract address

## Configure

Copy `.env.example` values into your shell environment:

```bash
export PORT=9090
export PINATA_JWT=your_pinata_jwt
export ETH_RPC_URL=https://sepolia.infura.io/v3/your_key
export CONTRACT_ADDRESS=0xYourDeployedContract
export IPFS_GATEWAY=https://gateway.pinata.cloud/ipfs/
```

## Run

```bash
javac -d backend/out $(find backend/src -name '*.java')
java -cp backend/out credledger.Main
```

## Main APIs

- `GET /api/health`
- `POST /api/ipfs/upload` JSON credential metadata -> `{ cid, url }`
- `GET /api/ipfs?cid=...`
- `GET /api/credential?id=1`
- `GET /api/credential/student?wallet=0x...`
- `GET /api/credential/institution?wallet=0x...`
- `GET /api/verify?id=1`
- `GET /api/audit?id=1`
- `GET /api/institution/activity?wallet=0x...`

Write transactions are signed in the browser with MetaMask for safety.
