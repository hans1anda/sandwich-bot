const { ethers } = require("ethers");

// Uniswap V2 pair adresini hesaplamak için kullanılan fonksiyon
async function getPairAddress(provider, factoryAddress, tokenA, tokenB) {
    if (tokenA.toLowerCase() > tokenB.toLowerCase()) {
      [tokenA, tokenB] = [tokenB, tokenA];
    }
  
    const factoryABI = [
      "function getPair(address tokenA, address tokenB) external view returns (address pair)"
    ];
  
    const factoryContract = new ethers.Contract(factoryAddress, factoryABI, provider);
    const pairAddress = await factoryContract.getPair(tokenA, tokenB);
    return pairAddress;
  }
  

// Pair sözleşmesinden rezervleri almak için kullanılan fonksiyon
async function getReserves(provider, pairAddress, tokenIn, tokenOut) {
  if (!pairAddress || pairAddress === ethers.constants.AddressZero) {
    return null;
  }

  const pairABI = [
    "function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
    "function token0() external view returns (address)",
    "function token1() external view returns (address)"
  ];

  try {
    const pairContract = new ethers.Contract(pairAddress, pairABI, provider);

    const token0 = await pairContract.token0();
    const token1 = await pairContract.token1();
    const { reserve0, reserve1 } = await pairContract.getReserves();

    let reservesIn, reservesOut;

    if (tokenIn.toLowerCase() === token0.toLowerCase()) {
      reservesIn = reserve0;
      reservesOut = reserve1;
    } else {
      reservesIn = reserve1;
      reservesOut = reserve0;
    }

    return { reservesIn, reservesOut };
  } catch (error) {
    console.error(`Rezerv alinirrken hata oluştu [pair: ${pairAddress}]:`, error);
    return null;
  }
}

module.exports = {
  getPairAddress,
  getReserves
};
