import {
    elizaLogger,
    Action,
    HandlerCallback,
    IAgentRuntime,
    Memory,
    State,
} from "@elizaos/core";
import { createCambrianOracleService } from "../services";
import type { CambrianOracleOptions } from "../types";

// Cache for oracle results to prevent excessive calls
const cache = {
    lastResult: null as any,
    timestamp: 0,
    TTL: 5 * 60 * 1000 // 5 minutes cache TTL
};

export const getCambrianOraclePriceAction: Action = {
    name: "CAMBRIAN_GET_PRICE",
    similes: [
        "GET CRYPTO PRICE",
        "SOLANA PRICE",
        "SOL PRICE",
        "ORACLE PRICE",
        "PRICE CHECK"
    ],
    description: "Get cryptocurrency price data from Cambrian Oracle.",
    validate: async () => true,
    handler: async (
        _runtime: IAgentRuntime,
        _message: Memory,
        _state: State,
        options: CambrianOracleOptions,
        callback: HandlerCallback
    ) => {
        const cambrianService = createCambrianOracleService();
        
        // Check if we should use cached data
        const now = Date.now();
        if (cache.lastResult && (now - cache.timestamp < cache.TTL)) {
            elizaLogger.info("Using cached Cambrian Oracle data");
            const data = cache.lastResult;
            
            const date = new Date(data.priceData.timestamp * 1000);
            callback({
                text: `Current SOL price: $${data.priceData.price.toFixed(2)} (${data.priceData.change24h >= 0 ? '+' : ''}${data.priceData.change24h.toFixed(2)}% 24h)
Data sources: ${data.priceData.sourcesCount || 'Unknown'}
Confidence: ${data.priceData.confidence ? Math.round(data.priceData.confidence * 100) + '%' : 'Unknown'}
Last updated: ${date.toLocaleString()}`,
                content: data
            });
            return true;
        }

        try {
            // Get options with defaults
            const avsPublicKey = options.avsPublicKey || "57wMKYdCPiA8tn28t2ucZkxEz9Lvd9eMLDLXf5kJzR1h";
            const payloadImage = options.payloadImage || "payload-check-oracle";
            
            // Build the input parameters for the payload
            const inputParams = {
                poaName: options.poaName || "default",
                proposalStorageKey: options.proposalStorageKey || "price_oracle"
            };
            
            elizaLogger.info(`Running Cambrian payload with AVS key: ${avsPublicKey}`);
            const oracleData = await cambrianService.runOraclePayload(
                avsPublicKey,
                payloadImage,
                inputParams
            );
            
            // Cache the result
            cache.lastResult = oracleData;
            cache.timestamp = now;
            
            elizaLogger.success("Successfully fetched Cambrian Oracle data");
            
            if (oracleData.priceData) {
                const date = new Date(oracleData.priceData.timestamp * 1000);
                callback({
                    text: `Current SOL price: $${oracleData.priceData.price.toFixed(2)} (${oracleData.priceData.change24h >= 0 ? '+' : ''}${oracleData.priceData.change24h.toFixed(2)}% 24h)
Data sources: ${oracleData.priceData.sourcesCount || 'Unknown'}
Confidence: ${oracleData.priceData.confidence ? Math.round(oracleData.priceData.confidence * 100) + '%' : 'Unknown'}
Last updated: ${date.toLocaleString()}`,
                    content: oracleData
                });
            } else {
                callback({
                    text: "I was able to connect to the Cambrian Oracle, but couldn't parse the price data properly.",
                    content: oracleData
                });
            }
            return true;
        } catch (error: any) {
            elizaLogger.error("Error in Cambrian Oracle plugin handler:", error);
            callback({
                text: `Error fetching price data from Cambrian Oracle: ${error.message}`,
                content: { error: error.message },
            });
            return false;
        }
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "What's the current price of Solana?",
                },
            },
            {
                user: "{{agent}}",
                content: {
                    text: "Let me check the current Solana price for you.",
                    action: "CAMBRIAN_GET_PRICE",
                },
            }
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Check SOL price from multiple sources",
                },
            },
            {
                user: "{{agent}}",
                content: {
                    text: "I'll get you the latest SOL price data from multiple sources via Cambrian Oracle.",
                    action: "CAMBRIAN_GET_PRICE",
                    options: {
                        avsPublicKey: "57wMKYdCPiA8tn28t2ucZkxEz9Lvd9eMLDLXf5kJzR1h",
                        poaName: "mainnet1"
                    }
                },
            }
        ]
    ],
};