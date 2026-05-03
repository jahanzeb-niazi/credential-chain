import { config } from "../config/config.js";

const LS_ADDRESS = "credledger.walletAddress";
const LS_ROLE    = "credledger.walletRole";

export const wallet = {
  isConnected: false,
  address: null,
  role: null,

  async connect() {
    if (!window.ethereum) throw new Error("MetaMask is not installed. Please install it to use CredLedger.");
    await window.ethereum.request({ method: "wallet_switchEthereumChain", params: [{ chainId: config.chainIdHex }] })
      .catch(async (error) => {
        if (error.code !== 4902) throw error;
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [{ chainId: config.chainIdHex, chainName: config.chainName,
            nativeCurrency: { name: "SepoliaETH", symbol: "ETH", decimals: 18 },
            rpcUrls: ["https://rpc.sepolia.org"] }],
        });
      });
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    if (!accounts.length) throw new Error("No accounts found in MetaMask.");
    await this._setAddress(accounts[0]);
    return this.address;
  },

  async disconnect() {
    this.isConnected = false;
    this.address = null;
    this.role = null;
    localStorage.removeItem(LS_ADDRESS);
    localStorage.removeItem(LS_ROLE);
    this._updateButtons();
  },

  async init() {
    const saved = localStorage.getItem(LS_ADDRESS);
    if (!saved) return;
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length && accounts[0].toLowerCase() === saved.toLowerCase()) {
          this.address = accounts[0];
          this.isConnected = true;
          const savedRole = localStorage.getItem(LS_ROLE);
          this.role = savedRole ? JSON.parse(savedRole) : null;
          this._updateButtons();
          this._dispatch("walletRestored", { address: this.address, role: this.role });
          return;
        }
      } catch (_) {}
    }
    localStorage.removeItem(LS_ADDRESS);
    localStorage.removeItem(LS_ROLE);
  },

  async _setAddress(address) {
    this.address = address;
    this.isConnected = true;
    localStorage.setItem(LS_ADDRESS, address);
    this._updateButtons();
    await this._fetchRole(address);
    this._dispatch("walletConnected", { address, role: this.role });
  },

  async _fetchRole(address) {
    try {
      const { api } = await import("./api.js");
      const data = await api.getRole(address);
      this.role = {
        isGovernment:  data.isGovernment,
        isRegulator:   data.isRegulator,
        isInstitution: data.isInstitution,
        isStudent:     data.isStudent,
        profile:       data.profile,
      };
      localStorage.setItem(LS_ROLE, JSON.stringify(this.role));
      this._dispatch("walletRole", { address, role: this.role });
    } catch (_) {}
  },

  _updateButtons() {
    const addr = this.address;
    document.querySelectorAll("#connect-wallet, #connect-wallet-2").forEach(btn => {
      if (addr) {
        btn.textContent = `${addr.slice(0, 6)}…${addr.slice(-4)}`;
        btn.title = addr;
      } else {
        btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="icon"><path d="M19 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2"/><path d="M22 12h-6a2 2 0 0 0 0 4h6Z"/></svg> Connect Wallet`;
      }
    });
  },

  _dispatch(event, detail) {
    document.dispatchEvent(new CustomEvent(event, { detail, bubbles: true }));
  },
};

if (window.ethereum) {
  window.ethereum.on("accountsChanged", async (accounts) => {
    if (!accounts.length) {
      await wallet.disconnect();
      wallet._dispatch("walletDisconnected", {});
    } else if (accounts[0].toLowerCase() !== (wallet.address || "").toLowerCase()) {
      await wallet._setAddress(accounts[0]);
    }
  });
  window.ethereum.on("chainChanged", () => window.location.reload());
}

wallet.init();
