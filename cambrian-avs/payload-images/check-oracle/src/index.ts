// Import the compatibility layer first to patch @solana/web3.js
import './compatibility';
import axios from 'axios';
import { address, getProgramDerivedAddress } from '@solana/addresses';
import { getUtf8Codec } from '@solana/codecs';
import { AccountRole } from '@solana/instructions';
import { BN } from 'bn.js';

// Helper function to convert numbers to little-endian bytes
const toLeBytes = (n: number | string | bigint): Uint8Array =>
  new BN(String(n)).toArrayLike(Buffer, 'le', 8) as Uint8Array;

// Interface for token price data
interface TokenPriceData {
  symbol: string;
  name: string;
  price: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  timestamp: number;
}

const run = async (_input: any): Promise<void> => {
  try {
    const { poaName, proposalStorageKey } = _input;
    
    // Define constants
    const storageSpace = 3 * 25;  // Similar to check-oracle example
    const SOLANA_THRESHOLD_SIGNATURE_PROGRAM_ADDRESS = 
      address('FGgNUqGxdEYM1gVtQT5QcTbzNv4y1UPoVvXPRnooBdxo');
    
    // We'll use a custom program for storing price data
    // In a real implementation, this would be your deployed program
    const PRICE_ORACLE_PROGRAM_ADDRESS = 
      address('ECb6jyKXDTE8NjVjsKgNpjSjcv4h2E7JQ42yKqWihBQE');

    // Fetch SOL price from DeFiDive
    console.error('Fetching SOL price from DeFiDive...');
    const response = await axios.get('https://api.defidive.com/coin/sol/info');
    const priceData = response.data as TokenPriceData;
    
    console.error('Price data received:', priceData);

    // Use the same PDA derivation logic as in check-oracle
    const poaStateKey = getUtf8Codec().encode(poaName);
    const utf8Codec = getUtf8Codec();
    
    const [proposalStoragePDA] = await getProgramDerivedAddress({
      seeds: [
        utf8Codec.encode('STORAGE'),
        utf8Codec.encode(poaName),
        utf8Codec.encode(proposalStorageKey),
        toLeBytes(storageSpace)
      ],
      programAddress: SOLANA_THRESHOLD_SIGNATURE_PROGRAM_ADDRESS,
    });

    const [poaStatePDA] = await getProgramDerivedAddress({
      programAddress: SOLANA_THRESHOLD_SIGNATURE_PROGRAM_ADDRESS,
      seeds: [
        utf8Codec.encode('STATE'),
        poaStateKey
      ],
    });

    // Let's study what the original check-oracle.ts does:
    // It calls getCheckOracleInstructionDataCodec().encode() and then getBase58Codec().decode()
    
    // For our purposes, we'll create a simple serialized instruction
    // Looking at the original error, it seems Cambrian expects data to be an array of numbers
    
    // Create price data as JSON string
    const priceDataJson = JSON.stringify({
      command: 'store_sol_price',
      price: priceData.price,
      timestamp: priceData.timestamp,
      change_24h: priceData.price_change_percentage_24h
    });
    
    // Convert to Uint8Array (bytes)
    const dataBuffer = Buffer.from(priceDataJson, 'utf-8');
    
    // Convert buffer to array of numbers
    const dataArray = [...dataBuffer];

    // Create the instruction similar to check-oracle
    const res = {
      proposalInstructions: [
        {
          programAddress: PRICE_ORACLE_PROGRAM_ADDRESS,
          accounts: [
            {
              address: proposalStoragePDA,
              role: AccountRole.WRITABLE,
            },
            {
              address: poaStatePDA,
              role: AccountRole.READONLY,
            },
            {
              address: address('Sysvar1nstructions1111111111111111111111111'),
              role: AccountRole.READONLY,
            },
            {
              address: PRICE_ORACLE_PROGRAM_ADDRESS,
              role: AccountRole.READONLY,
            },
          ],
          data: dataArray
        },
      ],
    };

    // Output the result as JSON
    console.log(JSON.stringify(res));
  } catch (e) {
    // Format errors as JSON for consistency
    console.error('Error:', e);
    console.log(JSON.stringify({ error: (e as Error).message || 'Unknown error' }));
    process.exit(1);
  }
};

// Parse the input and run
const input = JSON.parse(process.env.CAMB_INPUT ?? '{}');
console.error('Input:', input);

run(input).catch((e: unknown) => {
  console.error('Fatal error:', e);
  console.log(JSON.stringify({ error: (e as Error).message || 'Unknown error' }));
  process.exit(1);
});