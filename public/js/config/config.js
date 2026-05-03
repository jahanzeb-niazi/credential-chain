export const config = {
  backendBaseUrl:  localStorage.getItem("credledger.backendBaseUrl")  || "http://localhost:9000",
  chainIdHex:      "0xaa36a7",
  chainName:       "Sepolia",
  contractAddress: localStorage.getItem("credledger.contractAddress") || "0x0000000000000000000000000000000000000000",
};

export function isContractConfigured() {
  return /^0x[a-fA-F0-9]{40}$/.test(config.contractAddress)
    && config.contractAddress !== "0x0000000000000000000000000000000000000000";
}

export async function syncConfigFromBackend() {
  try {
    const res = await fetch(`${config.backendBaseUrl}/api/config`);
    if (!res.ok) return;
    const data = await res.json();
    if (data.contractAddress && data.contractAddress !== "0x0000000000000000000000000000000000000000") {
      if (!localStorage.getItem("credledger.contractAddress")) {
        config.contractAddress = data.contractAddress;
        localStorage.setItem("credledger.contractAddress", data.contractAddress);
      }
    }
  } catch (_) {}
}

syncConfigFromBackend();
