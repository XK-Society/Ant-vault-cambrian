import { Plugin } from "@elizaos/core";
import { getCambrianOraclePriceAction } from "./actions/getCambrianOraclePrice";

export const cambrianOraclePlugin: Plugin = {
    name: "cambrian-oracle",
    description: "Cambrian Oracle integration plugin for Eliza",
    actions: [getCambrianOraclePriceAction],
    evaluators: [],
    providers: [],
};

export default cambrianOraclePlugin;