const { ethers } = require("ethers");
const config = require("./config");

const iface = new ethers.Interface([
  "function exactInputSingle((address,address,uint24,address,uint256,uint256,uint160))"
]);

async function listenPendingTransactions() {
  const provider = new ethers.providers.JsonRpcProvider(config.RPC_URL);

  provider.on("pending", async (txHash) => {
    try {
      const tx = await provider.getTransaction(txHash);
      if (!tx || !tx.to) return;

      if (tx.to.toLowerCase() === config.UNISWAP_ROUTER_ADDRESS.toLowerCase()) {
        const parsed = iface.parseTransaction({ data: tx.data });

        if (parsed.name === "exactInputSingle") {
          const [params] = parsed.args;
          const tokenIn = params.tokenIn;
          const tokenOut = params.tokenOut;
          const amountIn = params.amountIn;

          console.log("🎯 Detected Uniswap exactInputSingle:");
          console.log("From:", tx.from);
          console.log("Token In:", tokenIn);
          console.log("Token Out:", tokenOut);
          console.log("Amount In:", formatUnits(toBigInt(amountIn), 18)
        );
        }
      }
    } catch (err) {
      // ignore decoding errors
    }
  });
}

listenPendingTransactions();
