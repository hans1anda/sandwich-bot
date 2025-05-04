function isProfitableSandwich(amountIn, reservesIn, reservesOut) {
  try {
    const amountInBN = BigInt(amountIn);
    const reservesInBN = BigInt(reservesIn);
    const reservesOutBN = BigInt(reservesOut);

    // Debug: Fiyatların nasıl değiştiğini görmek
    console.log("Original Reserves In:", reservesInBN);
    console.log("Original Reserves Out:", reservesOutBN);

    const inputAmountWithFee = amountInBN * 997n;
    console.log("Input Amount with Fee:", inputAmountWithFee);

    const numerator = inputAmountWithFee * reservesOutBN;
    const denominator = reservesInBN * 1000n + inputAmountWithFee;
    const amountOut = numerator / denominator;
    console.log("Amount Out:", amountOut);

    const newReservesIn = reservesInBN + amountInBN;
    const newReservesOut = reservesOutBN - amountOut;
    console.log("New Reserves In:", newReservesIn);
    console.log("New Reserves Out:", newReservesOut);

    const precisionFactor = 1_000_000n;

    const newPrice = (newReservesOut * precisionFactor) / newReservesIn;
    const originalPrice = (reservesOutBN * precisionFactor) / reservesInBN;

    console.log("New Price:", newPrice);
    console.log("Original Price:", originalPrice);

    return newPrice < (originalPrice * 99n / 100n);
  } catch (error) {
    console.error("❌ Error in isProfitableSandwich:", error.message);
    return false;
  }
}

module.exports = {
  isProfitableSandwich,
};
