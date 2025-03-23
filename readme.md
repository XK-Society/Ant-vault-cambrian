# Ant Vault 
Cambrian Hack 2025
# ElizaOS Cambrian Oracle Integration
## 🌟 Overview

This project combines the power of ElizaOS AI agents with Cambrian's multi-source oracle system to create intelligent agents that can access, analyze, and act on real-time cryptocurrency price data from multiple sources.

By integrating these two advanced technologies, we've created a system that can:

- Fetch real-time SOL price data from multiple sources via Cambrian Oracle
- Access this data directly within ElizaOS AI agents
- Provide rich, confidence-weighted pricing information
- Enable automated responses and trading strategies based on real-time market data

## 🚀 Key Features

- **Multi-Source Data**: Aggregates cryptocurrency price data from multiple sources
- **Confidence Metrics**: Provides confidence scores based on source agreement
- **Seamless Integration**: Works directly with ElizaOS agent framework
- **Caching System**: Optimizes performance with intelligent caching
- **Simple CLI Interface**: Easy to use with the Cambrian CLI

## 📋 Prerequisites

- [ElizaOS](https://github.com/elizaos/eliza) installed
- [Node.js 23+](https://nodejs.org/en/download/)
- [pnpm](https://pnpm.io/installation)
- [Cambrian CLI](https://github.com/cambrianone/camb-client) installed

## 🛠️ Installation

### 1. Set Up ElizaOS

First, make sure you have ElizaOS installed and running:

```bash
# Clone ElizaOS repository
git clone https://github.com/elizaos/eliza.git
cd eliza

# Install dependencies and build
pnpm i
pnpm build
```

### 2. Install Cambrian CLI

Install the Cambrian CLI tool globally:

```bash
npm i --global @cambrianone/camb-client@latest
```

### 3. Install the Oracle Plugin

Add the Cambrian Oracle plugin to your ElizaOS installation:

```bash
# Navigate to your ElizaOS packages directory
cd packages

# Clone the plugin repository
git clone https://github.com/your-username/elizaos-plugin-cambrian-oracle.git

# Install plugin dependencies
cd elizaos-plugin-cambrian-oracle
npm install
npm run build
```

### 4. Configure Your ElizaOS Agent

Add the plugin to your agent's character.json file:

```json
{
  "name": "Crypto Assistant",
  "instructions": [
    "You are a helpful crypto assistant that provides up-to-date cryptocurrency price information.",
    "When asked about cryptocurrency prices, use the Cambrian Oracle to get the latest data."
  ],
  "plugins": [
    "@elizaos-plugins/plugin-cambrian-oracle"
  ]
}
```

## 🔧 Usage

### Starting Your Agent

```bash
# Start ElizaOS with your character
pnpm start --characters="path/to/your/character.json"

# In another terminal, start the client
pnpm start:client
```

### Example Interactions

Once your agent is running, you can interact with it to get cryptocurrency price data:

```
User: What's the current price of Solana?
Agent: Let me check that for you.
      [Fetches data from Cambrian Oracle]
      Current SOL price: $123.45 (+2.34% 24h)
      Data sources: 3
      Confidence: 98%
      Last updated: March 24, 2025, 10:30:45 AM

User: How reliable is that price?
Agent: The current SOL price information has a confidence rating of 98%, 
      which means there's strong agreement among the 3 data sources.
      This is a highly reliable price estimate.
```

### Advanced Configuration

You can customize the plugin's behavior by modifying the `environment.ts` file:

```typescript
// Default Cambrian AVS public key
export const DEFAULT_AVS_PUBLIC_KEY = "57wMKYdCPiA8tn28t2ucZkxEz9Lvd9eMLDLXf5kJzR1h";

// Default payload image name
export const DEFAULT_PAYLOAD_IMAGE = "payload-check-oracle";
```

## 🧩 How It Works

### Architecture

<div align="center">
  <img src="./docs/images/architecture.png" alt="Architecture Diagram" width="80%" />
</div>

1. **ElizaOS Agent** - Interacts with users and determines when to fetch price data
2. **Cambrian Oracle Plugin** - Bridges ElizaOS and Cambrian systems
3. **Cambrian CLI** - Executes the multi-source oracle payload
4. **Oracle Payload** - Fetches and aggregates price data from multiple sources
5. **Data Sources** - Multiple price APIs (DeFiDive, CoinGecko, Binance, etc.)

### Data Flow

1. User asks agent about cryptocurrency prices
2. ElizaOS agent invokes the `CAMBRIAN_GET_PRICE` action
3. Plugin executes the Cambrian CLI command
4. Cambrian oracle payload fetches data from multiple sources
5. Price data is aggregated with confidence metrics
6. Results are parsed and formatted by the plugin
7. ElizaOS agent presents the data to the user

## 📦 Project Structure

```
elizaos-plugin-cambrian-oracle/
├── src/
│   ├── actions/
│   │   └── getCambrianOraclePrice.ts    # Action implementation
│   ├── environment.ts                   # Configuration settings
│   ├── examples.ts                      # Example interactions
│   ├── index.ts                         # Plugin entry point
│   ├── services.ts                      # Oracle service implementation
│   └── types.ts                         # Type definitions
├── package.json                         # Package configuration
├── README.md                            # Documentation
└── tsconfig.json                        # TypeScript configuration
```

## 🛣️ Roadmap

- [ ] Add support for more cryptocurrencies beyond SOL
- [ ] Implement historical price data retrieval
- [ ] Create visualization components for price trends
- [ ] Add sentiment analysis from news sources
- [ ] Develop automated trading strategies

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
