const dotenv = require('dotenv');
const { ethers } = require('ethers');
const path = require('path');

// Load .env file
const envPath = path.resolve(__dirname, '.env');
const result = dotenv.config({ path: envPath });
if (result.error) {
    console.error('Error loading .env file:', result.error);
    process.exit(1);
} 

const RPC_URL = process.env.RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

if (!RPC_URL || !PRIVATE_KEY) {
    console.error('Please check your .env file for RPC_URL and PRIVATE_KEY');
    process.exit(1); 
}

async function main() {
    try {
        const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
        const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
        console.log('Bot wallet address:', await wallet.getAddress());

        provider.on('pending', async (txHash) => {
            try {
                const tx = await provider.getTransaction(txHash);
                if (!tx) return;
                if (tx.to) {
                    console.log('New transaction detected:', txHash);
                    console.log('To address:', tx.to);
                }
            } catch (err) {
                console.error('Error processing transaction:', err.message);
            }
        });
    } catch (err) {
        console.error('Error in main:', err.message);
        process.exit(1);
    }
}

main();