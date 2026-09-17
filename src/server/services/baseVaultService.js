const { ethers } = require('ethers');
const {
  BASE_RPC_URL,
  BASE_RPC_TIMEOUT_MS,
  BASE_VAULT_ADDRESS,
  BASE_VAULT_ABI
} = require('../config/baseVault');

class BaseVaultService {
  constructor() {
    this.provider = new ethers.providers.JsonRpcProvider({
      url: BASE_RPC_URL,
      timeout: BASE_RPC_TIMEOUT_MS
    });
    this.contract = new ethers.Contract(BASE_VAULT_ADDRESS, BASE_VAULT_ABI, this.provider);
  }

  async getVaultData() {
    try {
      const [currentEpochDay, currentEpochReward, currentDailyReward, totalAssets] = await Promise.all([
        this.contract.getCurrentEpochDay(),
        this.contract.getCurrentEpochReward(),
        this.contract.getCurrentDailyReward(),
        this.contract.totalAssets()
      ]);

      return {
        contract: BASE_VAULT_ADDRESS,
        network: 'Base Mainnet',
        currentEpochDay: currentEpochDay.toString(),
        currentEpochReward: currentEpochReward.toString(),
        currentDailyReward: currentDailyReward.toString(),
        totalAssets: totalAssets.toString()
      };
    } catch (error) {
      const vaultError = new Error('Base vault RPC request failed');
      vaultError.name = 'BaseVaultRpcError';
      vaultError.cause = error;
      throw vaultError;
    }
  }
}

module.exports = new BaseVaultService();
