require("dotenv").config();
const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
const config = require("./config");
const { isProfitableSandwich } = require("./analyzer");
const { executeSandwich } = require("./executor");
const { getPairAddress, getReserves } = require("./uniswap_utils");
const { FlashbotsBundleProvider } = require("@flashbots/ethers-provider-bundle");

const provider = new ethers.providers.JsonRpcProvider(config.RPC_URL);

let flashbotsProvider;
let authSigner;

(async () => {
  try {
    const network = await provider.getNetwork();
    console.log("Provider Network:", network);
    if (network.chainId !== 11155111) {
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

    log(`🕵️‍♂️ [PENDING] New tx detected: ${hash}`);
    log(`🔍 From: ${tx.from}`);
    log(`🔍 To: ${tx.to}`);
    log(`🔍 GasPrice: ${ethers.utils.formatUnits(tx.gasPrice, "gwei")} gwei`);

    // Sadece Uniswap router ile ilgili işlemlerle ilgilen
    if (tx.to.toLowerCase() === config.UNISWAP_ROUTER_ADDRESS.toLowerCase()) {
      log(`✅ [SWAP CANDIDATE] Uniswap V2 tx detected`);
      log(`🔍 To Address: ${tx.to}`);
      log(`🔍 Is this Uniswap V2 Router? ${tx.to.toLowerCase() === config.Unis.toLowerCase()}`);

      return;
    }

    // Pair adresi alınır
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

    if (!reserves) {
      console.warn(`Rezervler alinamadi: ${config.targetTokenIn} - ${config.targetTokenOut}`);
      return;
    }
    
    
    const { reservesIn, reservesOut } = reserves;

    log(`📦 Reserves -> IN: ${ethers.utils.formatUnits(tx.gasPrice, "gwei")}, OUT: ${ethers.utils.formatUnits(reservesOut, 6)}`);

    // Simülasyon
    const inputAmount = ethers.parseUnits("0.1", 18); // 0.1 WETH
    const profitable = isProfitableSandwich(inputAmount, reservesIn, reservesOut);

    if (profitable) {
      log("🚀 [PROFITABLE] Sandwich opportunity detected!");
      await executeSandwich(
        tx,
        config.targetTokenIn,
        config.targetTokenOut,
        inputAmount
      );
      log("⚔️ [EXECUTED] Sandwich attack attempted.");
    } else {
      log("💤 [SKIPPED] Not profitable.");
    }

    await delay(400); // işlem başına biraz daha bekleme

  } catch (err) {
    log(`[ERROR] ${err.stack}`);
  }
});

log("[BOT] ✅ Listening to pending mempool transactions...");
