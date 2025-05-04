const { parseUnits } = require("ethers");
const { isProfitableSandwich } = require("./analyzer");

const scenarios = [
  {
    name: "Profitable scenario",
    amountIn: parseUnits("0.1", 18), // 0.1 WETH
    reservesIn: parseUnits("10", 18), // 10 WETH
    reservesOut: parseUnits("20000", 6), // 20,000 USDC (6 decimals)
  },
  {
    name: "Unprofitable scenario (too much slippage)",
    amountIn: parseUnits("5", 18), // 5 WETH
    reservesIn: parseUnits("10", 18),
    reservesOut: parseUnits("20000", 6),
  },
  {
    name: "Tiny reserves (not profitable)",
    amountIn: parseUnits("0.1", 18),
    reservesIn: parseUnits("0.5", 18),
    reservesOut: parseUnits("500", 6),
  }
];

for (const scenario of scenarios) {
  console.log("\n🔍 Scenario:", scenario.name);

  const amountInBigInt = BigInt(scenario.amountIn.toString());
  const reservesInBigInt = BigInt(scenario.reservesIn.toString());
  const reservesOutBigInt = BigInt(scenario.reservesOut.toString());

  const result = isProfitableSandwich(amountInBigInt, reservesInBigInt, reservesOutBigInt);
  console.log("📈 Profitable:", result);
}
