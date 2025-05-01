
# Sandwich Trading Bot for Uniswap V3 (Arbitrum Sepolia Testnet)

Welcome to the  **Sandwich Trading Bot** , a tool designed for educational purposes to explore sandwich trading strategies on Uniswap V3 within the Arbitrum Sepolia testnet. This bot monitors the mempool to detect and execute front-running trades, commonly known as "sandwich" trades.

> **⚠️ Warning** : This project is under active development and intended solely for learning and experimentation. Sandwich trading is a high-risk strategy that can result in financial losses. Thoroughly understand the risks and implement robust security measures before considering any real-world use. Never use real funds without extensive testing.

---

## Table of Contents

* Overview
* Prerequisites
* Installation
* Configuration
* Running the Bot
* Project Structure
* How It Works
* Disclaimer
* Contributing
* License

---

## Overview

This bot leverages Node.js and ethers.js to interact with the Uniswap V3 protocol on the Arbitrum Sepolia testnet. It listens for pending transactions in the mempool, identifies potential swap opportunities, and attempts to execute profitable sandwich trades by front-running and back-running target transactions.

---

## Prerequisites

Before setting up the bot, ensure you have the following:

* **Node.js** (v16 or higher) and **npm** installed. Download from nodejs.org.
* A wallet with an Arbitrum Sepolia testnet private key.
* Access to an Arbitrum Sepolia RPC endpoint (e.g., via Alchemy, Infura, or a public node).
* Basic familiarity with Ethereum, Uniswap V3, and JavaScript.

---

## Installation

Follow these steps to set up the project locally:

1. **Clone the repository** :

```bash
   git clone <your_project_repo_address>
   cd <your_project_folder>
```

1. **Install dependencies** :

```bash
   npm install
```

1. **Set up the** `.env`  **file** : Create a `.env` file in the project root and add the following:

   ```
   RPC_URL=<Your Arbitrum Sepolia RPC URL>
   PRIVATE_KEY=<Your bot wallet's private key>
   ```

   > **🔐 Security Note** : Never share or commit your private key. Ensure `.env` is listed in `.gitignore`.
   >
2. **Add Uniswap V3 Router ABI** :

* Create an `abis` folder in the project root.
* Download the Uniswap V3 Router ABI (`uniswapV3Router.json`) from Etherscan or the Uniswap documentation.
* Place the ABI file in the `abis` folder.

---

## Configuration

The bot’s configuration is managed in `config.js`. Key settings include:

```javascript
require("dotenv").config();

module.exports = {
  RPC_URL: process.env.RPC_URL,
  PRIVATE_KEY: process.env.PRIVATE_KEY,
  // Uniswap V3 Router address on Arbitrum Sepolia
  UNISWAP_ROUTER_ADDRESS: "0x101F443B4d1b059569D643917553c771E1b9663E",
  // Real testnet token addresses on Arbitrum Sepolia
  TOKENS: {
    WETH: "0x4200000000000000000000000000000000000006", // Arbitrum native WETH
    USDC: "0x0fa8781a83e46826621b3bc094ea2a0212e71b23"  // Sepolia USDC (Circle testnet)
  },
  // Slippage tolerance (e.g., 0.5%)
  SLIPPAGE_TOLERANCE: 0.005,
  // Minimum swap amount to consider (e.g., 1 WETH)
  MIN_SWAP_AMOUNT: ethers.utils.parseUnits("1.0", 18),
  // Flashbots endpoint (optional, for future use)
};
```

* **RPC_URL** : Your Arbitrum Sepolia RPC endpoint.
* **PRIVATE_KEY** : The private key of the wallet used for trading.
* **TOKENS** : Token addresses for WETH and USDC on Arbitrum Sepolia.
* **SLIPPAGE_TOLERANCE** : Maximum acceptable slippage (0.5% by default).
* **MIN_SWAP_AMOUNT** : Minimum swap size to consider for sandwich trades.

---

## Running the Bot

To start the bot, run:

```bash
node bot.js
```

The bot will:

* Connect to the Arbitrum Sepolia testnet via the provided RPC URL.
* Monitor the mempool for pending Uniswap V3 transactions.
* Analyze transactions for sandwich opportunities.
* Log activities to the console and a `bot.log` file.

> **Tip** : Monitor the console output for real-time updates on detected opportunities and trade executions.

---

## Project Structure

The project is organized as follows:

```
.
├── abis/
│   └── uniswapV3Router.json  # Uniswap V3 Router ABI
├── bot.js                    # Main bot logic for mempool monitoring
├── config.js                 # Configuration settings
├── .env                      # Environment variables (RPC URL, private key)
├── executor.js               # Logic for executing sandwich trades
├── analyzer.js               # Transaction analysis for sandwich opportunities
├── package.json              # Node.js dependencies and scripts
├── package-lock.json         # Dependency lock file
└── README.md                 # Project documentation
```

---

## How It Works

The bot operates through the following components:

* **bot.js** : The core script that:
* Loads configurations from `.env` and `config.js`.
* Establishes a Web3 provider to monitor the mempool.
* Filters transactions targeting the Uniswap V3 Router.
* Calls `analyzer.js` to evaluate sandwich opportunities and `executor.js` to execute trades.
* **analyzer.js** : Analyzes pending transactions to identify profitable sandwich opportunities using a basic price slippage check. Future enhancements could include more advanced profitability calculations.
* **executor.js** : Executes sandwich trades by:
* Sending a front-running buy transaction before the target swap.
* Sending a back-running sell transaction after the target swap.
* Interacting with the Uniswap V3 Router contract.
* **config.js** : Centralizes bot settings, including token addresses, slippage tolerance, and minimum swap amounts.
* **abis/uniswapV3Router.json** : Contains the ABI for the Uniswap V3 Router contract, enabling contract interactions.

---

## Disclaimer

This bot is a proof-of-concept for educational purposes only. Sandwich trading involves significant risks, including:

* **Financial Loss** : Market volatility or failed transactions can lead to losses.
* **Security Risks** : Mishandling private keys or insecure configurations can result in funds being compromised.
* **Legal and Ethical Considerations** : Ensure compliance with local regulations and platform terms of service.

The developers are not responsible for any losses or damages resulting from the use of this bot. Use at your own risk and only with testnet funds during development.

---

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -m "Add YourFeature"`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a pull request.

Please ensure your code follows the project’s style and includes appropriate tests.
