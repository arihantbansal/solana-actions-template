# Solana Actions Server Template

A simple, organized, and easy-to-use template for spinning up a Solana Actions server. Uses ExpressJS instead of OpenAPI. Inspired by [solana-actions-server](https://github.com/drift-labs/solana-actions-server/) by [Drift Labs](https://discord.gg/driftprotocol).

## Prerequisites

- Node.js
- npm or yarn
- A .env file with necessary configurations

## Installation

1. **Fork and clone the repository:**

   ```bash
   git clone https://github.com/arihantbansal/solana-actions-template
   cd solana-actions-template
   ```

2. **Install dependencies:**

   ```bash
    npm install
    # or
    yarn install
   ```

3. **Create a .env file:**

   ```bash
   cp .env.example .env
   ```

   Update the .env file with your configurations.

4. **Start the server**

   ```bash
    npm run dev
    # or
    yarn dev
   ```

## Routes

`GET /blinks/donate`

`POST /transactions/donate?amount=<amount>&dest=<destPubKey>`

```
Content-Type: application/json
{
  "account": "<account-public-key>"
}
```
