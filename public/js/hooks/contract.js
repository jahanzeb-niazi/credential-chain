import { config, isContractConfigured } from "../config/config.js";
import { wallet } from "./wallet.js";
import { api } from "./api.js";

const selectors = {
  issueCredential: "90c7c49c",
  updateCredential: "46a4cacb",
  revokeCredential: "957a3205",
  addRegulator: "915a7ba2",
  authorizeInstitution: "19897656",
  suspendInstitution: "ed536494",
};

export const contract = {
  async issueCredential(student, cid)        { return send(selectors.issueCredential, ["address", "string"], [student, cid]); },
  async revokeCredential(credId, reason)     { return send(selectors.revokeCredential, ["uint256", "string"], [credId, reason]); },
  async updateCredential(credId, newCid)     { return send(selectors.updateCredential, ["uint256", "string"], [credId, newCid]); },
  async getCredential(idOrCid)               { return (await api.getCredential(idOrCid)).credential; },
  async getCredentialsByHolder(addr)         { return (await api.getStudentCredentials(addr)).credentialIds || []; },
  async getInstitutionActivity(instAddr)     { return (await api.institutionActivity(instAddr)).events || []; },
  async authorizeInstitution(addr, name, accreditationId = "ACCREDITED") { return send(selectors.authorizeInstitution, ["address", "string", "string"], [addr, name, accreditationId]); },
  async suspendInstitution(addr)             { return send(selectors.suspendInstitution, ["address"], [addr]); },
  async addRegulator(addr, name = "Regulator", jurisdiction = "GLOBAL") { return send(selectors.addRegulator, ["address", "string", "string"], [addr, name, jurisdiction]); },
  async getBlockTimestamp(credId)            { return (await api.verify(credId)).result?.credential?.issuedAt || null; },
};

async function send(selector, types, values) {
  if (!window.ethereum) throw new Error("MetaMask is required");
  if (!isContractConfigured()) throw new Error("Set deployed contract address in Settings first");
  const from = wallet.address || await wallet.connect();
  const data = "0x" + selector + encodeParams(types, values);
  return window.ethereum.request({ method: "eth_sendTransaction", params: [{ from, to: config.contractAddress, data }] });
}

function encodeParams(types, values) {
  const head = [];
  const tail = [];
  let offset = types.length * 32;
  types.forEach((type, index) => {
    const value = values[index];
    if (type === "string") {
      const encoded = encodeString(value);
      head.push(word(offset));
      tail.push(encoded);
      offset += encoded.length / 2;
    } else if (type === "address") head.push(addressWord(value));
    else if (type === "uint256") head.push(word(BigInt(value)));
  });
  return head.join("") + tail.join("");
}

function word(value) { return BigInt(value).toString(16).padStart(64, "0"); }
function addressWord(value) {
  if (!/^0x[a-fA-F0-9]{40}$/.test(value)) throw new Error("Invalid Ethereum address");
  return value.slice(2).toLowerCase().padStart(64, "0");
}
function encodeString(value) {
  const bytes = new TextEncoder().encode(String(value));
  const hex = [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
  const padded = hex.padEnd(Math.ceil(hex.length / 64) * 64, "0");
  return word(bytes.length) + padded;
}
