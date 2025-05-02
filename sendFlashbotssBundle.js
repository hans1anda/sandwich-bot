const { FlashbotsBundleProvider } = require("@flashbots/ethers-provider-bundle");
const { ethers } = require("ethers");

async function sendFlashbotsBundle({
  provider,
  wallet,
  targetTx, 
  frontrunTxData,
  backrunTxData,
}) {
  const authSigner = ethers.Wallet.createRandom();
  const flashbots = await FlashbotsBundleProvider.create(
    provider,
    authSigner,
    "https://relay.flashbots.net", 
    "goerli" 
  );

  const blockNumber = await provider.getBlockNumber();
  const nextBlock = blockNumber + 1;

  const bundle = [
    {
      signer: wallet,
      transaction: frontrunTxData,
    },
    {
      transaction: {
        ...targetTx, // hedef işlemi bundle’a ekliyoruz (isteğe bağlı, flashbots relay bunu tanır)
      },
    },
    {
      signer: wallet,
      transaction: backrunTxData,
    },
  ];

  const simulation = await flashbots.simulate(bundle, nextBlock);
  if ("error" in simulation) {
    console.error("[SIMULATION ERROR]", simulation.error.message);
    return;
  } else {
    console.log("[SIMULATION SUCCESS]", simulation);
  }

  const result = await flashbots.sendBundle(bundle, nextBlock);
  if ("error" in result) {
    console.error("[BUNDLE ERROR]", result.error.message);
    return;
  }

  console.log("[FLASHBOTS] Bundle sent for block", nextBlock);
}

module.exports = { sendFlashbotsBundle };
