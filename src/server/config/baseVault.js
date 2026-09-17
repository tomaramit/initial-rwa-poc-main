const BASE_RPC_URL = process.env.BASE_RPC_URL || 'https://mainnet.base.org';
const BASE_RPC_TIMEOUT_MS = Number(process.env.BASE_RPC_TIMEOUT_MS || 10000);
const BASE_VAULT_ADDRESS = '0x9265dbc045f1b2ca8ad62824852bce936e1a51B5';

// Minimal ABI containing only the read methods used by this API.
const BASE_VAULT_ABI = [
  'function getCurrentEpochDay() view returns (uint256)',
  'function getCurrentEpochReward() view returns (uint256)',
  'function getCurrentDailyReward() view returns (uint256)',
  'function totalAssets() view returns (uint256)'
];

module.exports = {
  BASE_RPC_URL,
  BASE_RPC_TIMEOUT_MS,
  BASE_VAULT_ADDRESS,
  BASE_VAULT_ABI
};
