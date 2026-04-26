import { config } from "../config/config.js";

export const wallet = {
  isConnected: false,
  address: null,
  async connect() {
    if (!window.ethereum) throw new Error("MetaMask is required");
    await window.ethereum.request({ method: "wallet_switchEthereumChain", params: [{ chainId: config.chainIdHex }] }).catch(async (error) => {
      if (error.code !== 4902) throw error;
      await window.ethereum.request({ method: "wallet_addEthereumChain", params: [{ chainId: config.chainIdHex, chainName: config.chainName, nativeCurrency: { name: "SepoliaETH", symbol: "ETH", decimals: 18 }, rpcUrls: ["https://rpc.sepolia.org"] }] });
    });
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    this.address = accounts[0];
    this.isConnected = Boolean(this.address);
    document.querySelectorAll("#connect-wallet,#connect-wallet-2").forEach((button) => button.textContent = `${this.address.slice(0, 6)}…${this.address.slice(-4)}`);
    return this.address;
  },
  async disconnect() { this.isConnected = false; this.address = null; },
};
