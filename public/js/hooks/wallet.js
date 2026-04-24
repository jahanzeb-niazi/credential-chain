// Wallet integration stub — wire this to MetaMask / ethers.js later.
// Your Java backend / Solidity layer can replace these implementations.
export const wallet = {
  isConnected: false,
  address: null,
  async connect() {
    console.log("[CredLedger] wallet.connect() — wire to MetaMask / ethers.js");
    return null;
  },
  async disconnect() { this.isConnected = false; this.address = null; },
};
