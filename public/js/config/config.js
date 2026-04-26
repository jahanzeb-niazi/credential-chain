export const config = {
  backendBaseUrl: localStorage.getItem("credledger.backendBaseUrl") || "http://localhost:9090",
  chainIdHex: "0xaa36a7",
  chainName: "Sepolia",
  contractAddress: localStorage.getItem("credledger.contractAddress") || "0x0000000000000000000000000000000000000000",
};

export function isContractConfigured() {
  return /^0x[a-fA-F0-9]{40}$/.test(config.contractAddress) && config.contractAddress !== "0x0000000000000000000000000000000000000000";
}
