require("dotenv").config();
const { ethers } = require("ethers");


module.exports = {
  RPC_URL: process.env.RPC_URL,
  PRIVATE_KEY: process.env.PRIVATE_KEY,

  // Uniswap V3 Router (Arbitrum Sepolia)
  UNISWAP_ROUTER_ADDRESS: "0x101F443B4d1b059569D643917553c771E1b9663E",

  // Real testnet token addresses on Arbitrum Sepolia
  TOKENS: {
    WETH: "0x4200000000000000000000000000000000000006",  // Arbitrum native WETH
    USDC: "0x0fa8781a83e46826621b3bc094ea2a0212e71b23"   // Sepolia USDC (Circle testnet version)
  },

  // You can adjust min amount, gas settings, slippage, etc. here later
  SLIPPAGE_TOLERANCE: 0.005, // 0.5%
  MIN_SWAP_AMOUNT: ethers.utils.parseUnits("1.0", 18), // 1 WETH minimum to consider

  // Flashbots endpoint can be added later
};
