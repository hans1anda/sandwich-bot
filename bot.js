// bot.js
require("dotenv").config();
const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
const config = require("./config");
const { analyzeTransaction } = require("./analyzer");
const { executeSandwich } = require("./executor");

const { FlashbotsBundleProvider } = require("@flashbots/ethers-provider-bundle");

let flashbotsProvider;
let authSigner;

(async () => {
  authSigner = new ethers.Wallet(ethers.Wallet.createRandom().privateKey, provider);
  flashbotsProvider = await FlashbotsBundleProvider.create(
    provider,
    authSigner, 
    "https://relay.flashbots.net", 
    "goerli" 
  );
})();


const provider = new ethers.JsonRpcProvider(config.rpcUrl);

// Basit log fonksiyonu
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  fs.appendFileSync(path.join(__dirname, "bot.log"), logMessage);
  console.log(logMessage.trim());
}

provider.on("pending", async (txHash) => {
  try {
    const tx = await provider.getTransaction(txHash);
    if (!tx || !tx.to || !tx.data) return;

    // Uniswap v3 router'ı hedefleyen işlemleri filtrele
    if (tx.to.toLowerCase() !== config.routerAddress.toLowerCase()) return;

    log(`[DETECTED] Potential swap: ${txHash}`);

    const sandwichOpportunity = await analyzeTransaction(tx);
    if (sandwichOpportunity) {
      log("[BOT] Sandwich opportunity detected!");
      await executeSandwich(
        tx,
        config.targetTokenIn,
        config.targetTokenOut,
        ethers.utils.parseUnits("0.1", 18)
      );
      log("[BOT] Sandwich execution attempted.");
    }
  } catch (err) {
    log(`[ERROR] Processing tx ${txHash}: ${err.message}`);
  }
});

log("[BOT] Listening to pending mempool transactions...");
