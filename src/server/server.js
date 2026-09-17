const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { ethers } = require('ethers');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression and logging
app.use(compression());
app.use(morgan('combined'));

// Routes
app.use('/api/assets', require('./routes/assets'));
app.use('/api/validators', require('./routes/validators'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/ipfs', require('./routes/ipfs'));

// [amittomar]ApiTest: reads public data from the Sepolia WETH contract.
app.get('/api/amittomarApiTest', async (req, res) => {
  const rpcUrl = process.env.SEPOLIA_RPC_URL || 'https://ethereum-sepolia-rpc.publicnode.com';
  const wethAddress = '0xdd13E55209Fd76AfE204dBda4007C227904f0a81';
  const wethAbi = [
    'function name() view returns (string)',
    'function symbol() view returns (string)',
    'function totalSupply() view returns (uint256)',
    'function decimals() view returns (uint8)'
  ];

  try {
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    const weth = new ethers.Contract(wethAddress, wethAbi, provider);
    const [name, symbol, totalSupply, decimals] = await Promise.all([
      weth.name(),
      weth.symbol(),
      weth.totalSupply(),
      weth.decimals()
    ]);

    const data = {
      contract: wethAddress,
      network: 'Sepolia',
      name,
      symbol,
      totalSupply: ethers.utils.formatUnits(totalSupply, decimals)
    };

    console.log('[amittomar]ApiTest fetched contract data:', data);
    res.json(data);
  } catch (error) {
    console.error('[amittomar]ApiTest failed to fetch contract data:', error.message);
    res.status(502).json({
      error: 'Unable to fetch contract data',
      message: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
