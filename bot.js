require("dotenv").config();
const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
const config = require("./config");
const { isProfitableSandwich } = require("./analyzer");
const { executeSandwich } = require("./executor");
const { getPairAddress, getReserves } = require("./uniswap_utils");
const { FlashbotsBundleProvider } = require("@flashbots/ethers-provider-bundle");

const provider = new ethers.JsonRpcProvider(config.RPC_URL);
let flashbotsProvider;
let authSigner;

(async () => {
  try {
    const network = await provider.getNetwork();
    console.log(`Provider Network : ${network.name}`);
    if (network.chainId != 11155111) {
      throw new Error("Provider is not connected to Sepolia testnet");
    }

    authSigner = new ethers.Wallet(ethers.Wallet.createRandom().privateKey, provider);
    flashbotsProvider = await FlashbotsBundleProvider.create(
      provider,
      authSigner,
      "https://relay.flashbots.net",
      "sepolia"
    );
    console.log("Flashbots provider initialized");
  } catch (err) {
    console.error("Error initializing Flashbots:", err);
    process.exit(1);
  }
})();

function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  fs.appendFileSync(path.join(__dirname, "bot.log"), logMessage);
  console.log(logMessage.trim());
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

provider.on("pending", async (txHash) => {
  try {
    const hash = typeof txHash === "object" && txHash.hash ? txHash.hash : txHash;
    const tx = await provider.getTransaction(hash);
    if (!tx || !tx.to || !tx.data) return;

    // Sadece Uniswap router ile ilgili işlemlerle ilgilen
    if (tx.to.toLowerCase() != config.UNISWAP_ROUTER_ADDRESS.toLowerCase()) return;

    const pairAddress = await getPairAddress(
      provider,
      config.UNISWAP_FACTORY_ADDRESS,
      config.targetTokenIn,
      config.targetTokenOut
    );

    await delay(200);

    const reserves = await getReserves(
      provider,
      pairAddress,
      config.targetTokenIn,
      config.targetTokenOut
    );

    if (!reserves) return;

    const { reservesIn, reservesOut } = reserves;

    const inputAmount = ethers.parseUnits("0.1", 18); // 0.1 WETH
    const profitable = isProfitableSandwich(inputAmount, reservesIn, reservesOut);

    if (profitable) {
      log(`🚀 [PROFITABLE] Sandwich opportunity detected!`);
      log(`🔍 TX Hash: ${hash}`);
      log(`🔍 From: ${tx.from}`);
      log(`🔍 GasPrice: ${ethers.utils.formatUnits(tx.gasPrice, "gwei")} gwei`);
      log(`📦 Reserves -> IN: ${ethers.utils.formatUnits(reservesIn, 18)}, OUT: ${ethers.utils.formatUnits(reservesOut, 6)}`);
      
      await executeSandwich(
        tx,
        config.targetTokenIn,
        config.targetTokenOut,
        inputAmount
      );

      log("⚔️ [EXECUTED] Sandwich attack attempted.");
    }

    await delay(400);
  } catch (err) {
    log(`[ERROR] ${err.stack}`);
  }
});

log("[BOT] ✅ Listening to pending mempool transactions...");
