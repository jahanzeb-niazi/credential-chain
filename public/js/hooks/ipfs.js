// IPFS integration stub — wire to your IPFS node / gateway.
export const ipfs = {
  async upload(metadata)         { console.log("[ipfs] upload", metadata); return "Qm..." ; },
  async fetch(cid)               { console.log("[ipfs] fetch", cid); return null; },
};
