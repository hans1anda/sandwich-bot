require("dotenv").config();
const { ethers } = require("ethers");
const config = require("./config");

const erc20Abi = [
  "function approve(address spender, uint256 amount) external returns (bool)"
];

async function approveToken() {
  try {
    const provider = new ethers.providers.JsonRpcProvider(config.RPC_URL);
    const wallet = new ethers.Wallet(config.PRIVATE_KEY, provider);

    const weth = new ethers.Contract(config.TOKENS.WETH, erc20Abi, wallet);

    const tx = await weth.approve(config.UNISWAP_ROUTER_ADDRESS, ethers.constants.MaxUint256);
    console.log("📝 Approval tx sent:", tx.hash);

    await tx.wait();
    console.log("✅ Token approved successfully for Uniswap Router:", config.UNISWAP_ROUTER_ADDRESS);
  } catch (error) {
    console.error("❌ Token approval failed:", error);
  }
}

approveToken();
