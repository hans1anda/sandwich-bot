const { parseUnits } = require("ethers");
const { isProfitableSandwich } = require("./analyzer");
const config = require("./config"); // Eğer config'den slippage alacaksanız

const scenarios = [
  {
    name: "Profitable scenario",
    amountIn: parseUnits("0.1", 18),
    reservesIn: parseUnits("10", 18),
    reservesOut: parseUnits("20000", 6),
  },
  {
    name: "Unprofitable scenario (too much slippage)",
    amountIn: parseUnits("5", 18),
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

  const result = isProfitableSandwich(
    amountInBigInt,
    reservesInBigInt,
    reservesOutBigInt,
    18,
    6, 
    config.SLIPPAGE_TOLERANCE
  );
  console.log("📈 Profitable:", result);
}