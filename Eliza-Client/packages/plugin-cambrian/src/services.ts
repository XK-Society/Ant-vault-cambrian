import { execSync } from "child_process";
import type { CambrianOracleResponse, PriceData } from "./types";

export const createCambrianOracleService = () => {
    const runOraclePayload = async (
        avsPublicKey: string = "57wMKYdCPiA8tn28t2ucZkxEz9Lvd9eMLDLXf5kJzR1h",
        payloadImage: string = "payload-check-oracle",
        inputParams: any = {}
    ): Promise<CambrianOracleResponse> => {
        try {
            // Run the payload using the camb CLI tool
            const command = `camb payload run-container -a ${avsPublicKey} ${payloadImage}`;
            
            // Prepare the input JSON for the payload (if needed)
            const input = JSON.stringify(inputParams);
            process.env.CAMB_INPUT = input;
            
            // Execute the command
            const output = execSync(command, { 
                encoding: 'utf-8',
                maxBuffer: 10 * 1024 * 1024, // 10MB buffer
                env: { ...process.env, CAMB_INPUT: input }
            });
            
            // Parse the output JSON
            const result = JSON.parse(output);
            
            // Extract the price data
            const priceData = extractPriceData(result);
            
            return {
                timestamp: Date.now(),
                proposalInstructions: result.proposalInstructions,
                priceData
            };
        } catch (error: any) {
            console.error("Cambrian Oracle Error:", error.message);
            throw error;
        }
    };
    
    const extractPriceData = (result: any): PriceData | null => {
        try {
            // The Cambrian oracle encodes the price data in the data field of instructions
            if (result.proposalInstructions && result.proposalInstructions.length > 0) {
                const instruction = result.proposalInstructions[0];
                if (instruction.data && Array.isArray(instruction.data)) {
                    // Convert the data array back to a string
                    const dataBuffer = Buffer.from(instruction.data);
                    const dataString = dataBuffer.toString('utf-8');
                    
                    // Parse the JSON string to extract the price information
                    const parsed = JSON.parse(dataString);
                    
                    return {
                        price: parsed.price,
                        timestamp: parsed.timestamp,
                        change24h: parsed.change_24h,
                        sourcesCount: parsed.sources_count || 1,
                        confidence: parsed.confidence || 1.0
                    };
                }
            }
            return null;
        } catch (error) {
            console.error("Error extracting price data:", error);
            return null;
        }
    };

    return { runOraclePayload };
};