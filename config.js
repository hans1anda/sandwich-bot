require("dotenv").config();
const { ethers } = require("ethers");


module.exports = {
  RPC_URL: process.env.RPC_URL,
  PRIVATE_KEY: process.env.PRIVATE_KEY,

  // Uniswap V2 Router (Arbitrum Sepolia)
  UNISWAP_ROUTER_ADDRESS: "0xeE567Fe1712Faf6149d80dA1E6934E354124CfE3",
  // Uniswap V2 Factory (Arbitrum Sepolia)
  UNISWAP_FACTORY_ADDRESS: "0xF62c03E08ada871A0bEb309762E260a7a6a880E6",
  TOKENS: {
    WETH: "0x4200000000000000000000000000000000000006",  // Arbitrum native WETH
    USDC: "0x0fa8781a83e46826621b3bc094ea2a0212e71b23"   // Sepolia USDC (Circle testnet version)
  },

  targetTokenIn: "0x4200000000000000000000000000000000000006", // WETH
  targetTokenOut: "0x0fa8781a83e46826621b3bc094ea2a0212e71b23", // USDC

  SLIPPAGE_TOLERANCE: 0.005, // 0.5%
  MIN_SWAP_AMOUNT: ethers.utils.parseUnits("1.0", 18), // 1 WETH minimum to consider

};
