export interface PriceData {
    price: number;
    timestamp: number;
    change24h: number;
    sourcesCount?: number;
    confidence?: number;
}

export interface CambrianOracleResponse {
    timestamp: number;
    proposalInstructions: any[];
    priceData: PriceData | null;
}

export interface CambrianOracleOptions {
    // AVS public key for Cambrian
    avsPublicKey?: string;
    
    // Payload image name
    payloadImage?: string;
    
    // The Power of Attorney name to use
    poaName?: string;
    
    // The proposal storage key to use
    proposalStorageKey?: string;
}