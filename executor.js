// executor.js
require("dotenv").config();
const { ethers } = require("ethers");
const config = require("./config");

const provider = new ethers.JsonRpcProvider(config.rpcUrl);
const wallet = new ethers.Wallet(config.privateKey, provider);
const routerAbi = require("./abis/uniswapV3Router.json");
const routerContract = new ethers.Contract(config.routerAddress, routerAbi, wallet);

async function executeSandwich(targetTx, tokenIn, tokenOut, amountIn) {
  console.log("[EXECUTOR] Executing front-run swap...");

  const deadline = Math.floor(Date.now() / 1000) + 60;

  try {
    // Önce front-run: bizim alım
    const tx1 = await routerContract.exactInputSingle({
      tokenIn,
      tokenOut,
      fee: 3000,
      recipient: wallet.address,
      deadline,
      amountIn,
      amountOutMinimum: 0,
      sqrtPriceLimitX96: 0,
    });
    console.log("[EXECUTOR] Front-run TX sent:", tx1.hash);
    await tx1.wait();

    // Hedef işlem zincire girer (bu senaryoda gerçek simülasyonda)

    // Sonra back-run: bizim satım
    const tx2 = await routerContract.exactInputSingle({
      tokenIn: tokenOut,
      tokenOut: tokenIn,
      fee: 3000,
      recipient: wallet.address,
      deadline,
      amountIn: ethers.utils.parseUnits("0.9", 18), // örnek satış miktarı
      amountOutMinimum: 0,
      sqrtPriceLimitX96: 0,
    });
    console.log("[EXECUTOR] Back-run TX sent:", tx2.hash);
    await tx2.wait();

    console.log("[EXECUTOR] Sandwich complete!");
  } catch (err) {
    console.error("[EXECUTOR] Error executing sandwich:", err);
  }
}

module.exports = {
  executeSandwich,
};