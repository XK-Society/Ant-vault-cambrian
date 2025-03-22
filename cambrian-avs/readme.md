# Cambrian Oracle Check Payload

This repository contains a Solana payload implementation for Cambrian's AVS (Actively Validated Services) system. It specifically implements a check-oracle payload that verifies oracle states in the Cambrian ecosystem.

## 🌟 Overview

This project demonstrates the integration between the Cambrian AVS and operators using a containerized payload. The payload generates Solana instructions that check oracle states based on provided parameters, enabling decentralized verification of oracle data.

## 🏗️ Architecture

The system consists of three main components:

1. **AVS (Actively Validated Services)** - The central service that coordinates proposal execution
2. **Operators** - Nodes that execute payloads and vote on proposals
3. **Payload Containers** - Docker containers that generate the specific instructions to be executed on-chain

### Flow Diagram

```
                           ┌───────────────┐
                           │     Client    │
                           │   (External)  │
                           └───────┬───────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────┐
│                   Cambrian AVS                     │
│                                                    │
│  ┌─────────────┐        ┌─────────────────────┐   │
│  │ API Service │◄──────►│ Proposal Management │   │
│  └─────────────┘        └──────────┬──────────┘   │
│                                     │              │
│                         ┌───────────▼────────────┐ │
│                         │  WebSocket Notifier    │ │
│                         └───────────┬────────────┘ │
└─────────────────────────────────────┼──────────────┘
                                      │
                 ┌────────────────────┼─────────────────────┐
                 │                    │                     │
                 ▼                    ▼                     ▼
        ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
        │    Operator 1   │  │    Operator 2   │  │    Operator 3   │
        │                 │  │                 │  │                 │
        │ ┌─────────────┐ │  │ ┌─────────────┐ │  │ ┌─────────────┐ │
        │ │Docker Engine│ │  │ │Docker Engine│ │  │ │Docker Engine│ │
        │ └──────┬──────┘ │  │ └──────┬──────┘ │  │ └──────┬──────┘ │
        └────────┼────────┘  └────────┼────────┘  └────────┼────────┘
                 │                    │                     │
                 ▼                    ▼                     ▼
         ┌──────────────┐    ┌──────────────┐      ┌──────────────┐
         │Payload Image │    │Payload Image │      │Payload Image │
         │(Check Oracle)│    │(Check Oracle)│      │(Check Oracle)│
         └──────────────┘    └──────────────┘      └──────────────┘
```

## 🔄 User Flow

1. **Proposal Initiation**:
   - A client submits a proposal to the AVS
   - The AVS validates and stores the proposal

2. **Operator Notification**:
   - The AVS notifies all connected operators via WebSocket
   - Operators receive the proposal with relevant parameters

3. **Payload Execution**:
   - Each operator executes the payload image in their Docker environment
   - The payload generates the specific Solana instructions based on the parameters
   - The payload outputs a JSON result with the instructions to execute

4. **Consensus Formation**:
   - Operators submit their results back to the AVS
   - The AVS collects results and forms consensus

5. **Transaction Execution**:
   - Once consensus is reached, the AVS builds a Solana transaction
   - The transaction is signed and submitted to the Solana blockchain
   - Results are recorded and can be viewed on a block explorer

## 📦 Project Components

### Payload Image (This Repository)

The core of this repository is the check-oracle payload implementation:

- **compatibility.ts**: Provides compatibility between different versions of Solana SDK packages
- **index.ts**: Main payload code that generates check-oracle instructions

### AVS Service

The AVS service manages proposals and coordinates operators:

- Listens for incoming proposals
- Notifies operators via WebSocket
- Collects and processes operator votes
- Executes on-chain transactions

### Operators

Operators are decentralized nodes that:

- Connect to the AVS via API and WebSocket
- Execute payload containers when notified
- Parse payload results and submit votes
- Participate in consensus formation

## 🔧 Technical Challenges

During development, several challenges were addressed:

1. **SDK Compatibility Issues**:
   - The `@cambrianone/oracle-client` package expected functions from the older unified `@solana/web3.js` SDK
   - Newer Solana SDKs use a modular approach with functions spread across multiple packages
   - A compatibility layer was created to bridge this gap

2. **JSON Output Formatting**:
   - The operator expected pure JSON output, but debug logs were contaminating the output
   - The solution was to ensure all output is valid JSON and remove all console logs

3. **Type Safety**:
   - Proper TypeScript typing was implemented to ensure type safety
   - Type assertions were used where necessary for error handling

## 🚀 Getting Started

### Prerequisites

- Node.js (>= 16.x)
- Docker
- Yarn or npm

### Installation

1. Clone this repository:
   ```
   git clone <repository-url>
   cd check-oracle-payload
   ```

2. Install dependencies:
   ```
   yarn install
   ```

3. Build the project:
   ```
   yarn build
   ```

4. Build the Docker image:
   ```
   docker build -t check-oracle-payload .
   ```

### Configuration

The payload accepts the following parameters via environment variables:

- `CAMB_INPUT`: JSON string containing:
  - `poaName`: Name of the POA (Power of Attorney)
  - `proposalStorageKey`: Key for proposal storage

## 📚 Reference

### Related Projects

- [Cambrian AVS](https://github.com/cambrianone/camb-avs)
- [Cambrian Operator](https://github.com/cambrianone/camb-operator)

### Key Solana Programs

- Threshold Signature Program: `FGgNUqGxdEYM1gVtQT5QcTbzNv4y1UPoVvXPRnooBdxo`
- Oracle Program: `ECb6jyKXDTE8NjVjsKgNpjSjcv4h2E7JQ42yKqWihBQE`

## Tutorial

Install the camb client
```bash
npm i --global @cambrianone/camb-client@latest
```

Scaffold AVS and initialize PoA onchain
```bash
camb init -t avs <AVS directory>
```
example:
camb init -t avs demo-avs

just enter all for the demo purpose
Enter admin private key or press enter to generate a new one :
- add your dev wallet private key
Enter Cambrian Consensus Program name or press enter to generate a new one:
create your avs name
- avs-demo

List all avs
```bash
camb avs list
```

Start avs:
```bash
camb avs run -u <AVS pubkey>
```

Build Oracle Update Container image:
```bash
git clone https://github.com/cambrianone/oracle-update-examples
cd ./oracle-update-examples/current-date/container-stream
docker build -t oracle-update-current-date .
```

Scaffolding operators
Before scaffolding the operators make sure instance of AVS is already running.
```bash
camb init -t operator <operator 1 directory>
camb init -t operator <operator 2 directory>
camb init -t operator <operator 3 directory>
```
List installed operator nodes (outputs voter public keys)
```bash
camb operator list -a <AVS public key>
```

Start operators:
```bash
camb operator run -u <voter public key>
```

Build payload container image:
```bash
git clone https://github.com/cambrianone/payload-images
cd ./payload-images/check-oracle
docker build -t payload-check-oracle .
```
test the payload:
```bash
camb payload run-container -a <AVS public key> payload-check-oracle
```

## 🧪 Testing

To test the payload locally:

```bash
export CAMB_INPUT='{"poaName":"testdevnet1","proposalStorageKey":"demo"}'
node dist/index.js
```

You should see a valid JSON output with the proposal instructions.

## 📄 License

This project is licensed under the [MIT License](LICENSE).