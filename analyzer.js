const { ethers } = require("ethers");
const config = require("./config");

function isProfitableSandwich(amountIn, reservesIn, reservesOut) {
  // Basit bir XY=K havuzu modeliyle hesap
  // Bu örnek sadece Uniswap V2 tarzı sabit çarpanlar için fikir verir
  const inputAmountWithFee = amountIn.mul(997);
  const numerator = inputAmountWithFee.mul(reservesOut);
  const denominator = reservesIn.mul(1000).add(inputAmountWithFee);
  const amountOut = numerator.div(denominator);

  // Swap sonrası oluşacak yeni fiyatı tahmin et (slippage varsa fark çıkar)
  const newReservesIn = reservesIn.add(amountIn);
  const newReservesOut = reservesOut.sub(amountOut);
  const newPrice = newReservesOut.div(newReservesIn);

  // Şimdilik basit bir karşılaştırma: kâr edilebilir mi?
  const originalPrice = reservesOut.div(reservesIn);

  return newPrice.lt(originalPrice.mul(99).div(100)); // fiyat %1 düşüyorsa fırsat olabilir
}

module.exports = {
  isProfitableSandwich
};
