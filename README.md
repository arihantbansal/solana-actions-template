# Solana Actions Server Template

A simple, organized, and easy-to-use template for spinning up a Solana Actions server. Uses ExpressJS instead of OpenAPI. Inspired by [solana-actions-server](https://github.com/drift-labs/solana-actions-server/) by [Drift Labs](https://discord.gg/driftprotocol).

## What are Solana Actions

[Solana Actions](https://solana.com/docs/advanced/actions#actions) are
specification-compliant APIs that return transactions on the Solana blockchain
to be previewed, signed, and sent across a number of various contexts, including
QR codes, buttons + widgets, and websites across the internet. Actions make it
simple for developers to integrate the things you can do throughout the Solana
ecosystem right into your environment, allowing you to perform blockchain
transactions without needing to navigate away to a different app or webpage.

## What are blockchain links (blinks)

[Blockchain links](https://solana.com/docs/advanced/actions#blinks) – or blinks
– turn any Solana Action into a shareable, metadata-rich link. Blinks allow
Action-aware clients (browser extension wallets, bots) to display additional
capabilities for the user. On a website, a blink might immediately trigger a
transaction preview in a wallet without going to a decentralized app; in
Discord, a bot might expand the blink into an interactive set of buttons. This
pushes the ability to interact on-chain to any web surface capable of displaying
a URL.

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
