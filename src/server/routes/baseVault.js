const express = require('express');
const baseVaultService = require('../services/baseVaultService');
const { BASE_VAULT_ADDRESS } = require('../config/baseVault');
const logger = require('../utils/logger');

const router = express.Router();

// [amittomar]ApiTest
router.get('/', async (req, res) => {
  const startedAt = Date.now();

  logger.info('base_vault_read_started', {
    requestId: req.id,
    contract: BASE_VAULT_ADDRESS
  });

  try {
    const data = await baseVaultService.getVaultData();
    logger.info('base_vault_read_succeeded', {
      requestId: req.id,
      durationMs: Date.now() - startedAt,
      contract: data.contract,
      vaultData: data
    });
    res.json(data);
  } catch (error) {
    logger.error('base_vault_read_failed', {
      requestId: req.id,
      durationMs: Date.now() - startedAt,
      error: logger.serializeError(error.cause || error)
    });
    res.status(502).json({
      error: 'Unable to fetch Base vault contract data',
      message: 'The Base RPC provider did not return vault data. Please try again shortly.'
    });
  }
});

module.exports = router;
