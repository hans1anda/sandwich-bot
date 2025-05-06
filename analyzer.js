function isProfitableSandwich(amountIn, reservesIn, reservesOut, decimalsIn = 18, decimalsOut = 6, slippageTolerance = 0.005) {
  try {
      const amountInBN = BigInt(amountIn);
      const reservesInBN = BigInt(reservesIn);
      const reservesOutBN = BigInt(reservesOut);

      const inputAmountWithFee = amountInBN * 997n / 1000n; // %0.3 fee

      const amountOut = (inputAmountWithFee * reservesOutBN) / (reservesInBN + inputAmountWithFee);

      const newReservesIn = reservesInBN + amountInBN;
      const newReservesOut = reservesOutBN - amountOut;

      const slippageNumerator = BigInt(Math.floor((1 - slippageTolerance) * 10000));
      const slippageDenominator = 10000n;

      const normalizationFactor = BigInt(10) ** BigInt(decimalsIn - decimalsOut); // USDC'yi WETH ölçeğine getir

      // Fiyatları WETH cinsinden karşılaştır
      const originalPriceNumerator = reservesOutBN * normalizationFactor * slippageDenominator;
      const originalPriceDenominator = reservesInBN * (slippageDenominator * BigInt(10) ** BigInt(decimalsOut)); // Orijinalin paydasını da ölçeklendir

      const newPriceNumerator = newReservesOut * normalizationFactor * slippageDenominator;
      const newPriceDenominator = newReservesIn * (slippageDenominator * BigInt(10) ** BigInt(decimalsOut)); // Yeninin paydasını da ölçeklendir

      console.log("Original Price Numerator:", originalPriceNumerator);
      console.log("Original Price Denominator:", originalPriceDenominator);
      console.log("New Price Numerator:", newPriceNumerator);
      console.log("New Price Denominator:", newPriceDenominator);
      console.log("Slippage Numerator:", slippageNumerator);
      console.log("Slippage Denominator:", slippageDenominator);

      return (newPriceNumerator * originalPriceDenominator * slippageNumerator) < (originalPriceNumerator * newPriceDenominator);

  } catch (error) {
      console.error("❌ Error in isProfitableSandwich:", error.message);
      return false;
  }
}

module.exports = {
  isProfitableSandwich,
};