import { api } from "./api.js";

export const ipfs = {
  async upload(metadata) {
    const result = await api.uploadMetadata(metadata);
    return result.cid;
  },
  async fetch(cid) {
    const result = await api.fetchIpfs(cid);
    return result.metadata;
  },
};
