const { ethers } = require("ethers");
const config = require("./config");

function isProfitableSandwich(amountIn, reservesIn, reservesOut) {
  // Convert inputs to BigNumber if they aren't already
  const amountInBN = ethers.BigNumber.isBigNumber(amountIn)
    ? amountIn
    : ethers.BigNumber.from(amountIn);
  const reservesInBN = ethers.BigNumber.isBigNumber(reservesIn)
    ? reservesIn
    : ethers.BigNumber.from(reservesIn);
  const reservesOutBN = ethers.BigNumber.isBigNumber(reservesOut)
    ? reservesOut
    : ethers.BigNumber.from(reservesOut);

  // Basit bir XY=K havuzu modeliyle hesap
  // Bu örnek sadece Uniswap V2 tarzı sabit çarpanlar için fikir verir
  const inputAmountWithFee = amountInBN.mul(997);
  const numerator = inputAmountWithFee.mul(reservesOutBN);
  const denominator = reservesInBN.mul(1000).add(inputAmountWithFee);
  const amountOut = numerator.div(denominator);

  // Swap sonrası oluşacak yeni fiyatı tahmin et (slippage varsa fark çıkar)
  const newReservesIn = reservesInBN.add(amountInBN);
  const newReservesOut = reservesOutBN.sub(amountOut);
  const newPrice = newReservesOut.div(newReservesIn);

  // Şimdilik basit bir karşılaştırma: kâr edilebilir mi?
  const originalPrice = reservesOutBN.div(reservesInBN);

  return newPrice.lt(originalPrice.mul(99).div(100)); // fiyat %1 düşüyorsa fırsat olabilir
}

module.exports = {
  isProfitableSandwich,
};