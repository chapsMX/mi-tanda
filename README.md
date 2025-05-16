# Mi Tanda - Decentralized Rotating Savings on Base

![Mi Tanda Logo](public/miTanda_logo.png)

## Overview

Mi Tanda is a decentralized application (dApp) implementing a ROSCA (Rotating Savings and Credit Association) system, also known as "Tanda" in Latin American countries. The platform allows groups of people to create and manage collective savings pools with rotating payouts, all managed transparently on the Base blockchain.

Built as a Farcaster Frame, Mi Tanda provides a user-friendly interface for creating, joining, and managing Tandas with Base USDC as the contribution token.

## Key Features

- **Create Tandas**: Set up new rotating savings groups with customizable parameters
- **Join Existing Tandas**: Participate in active saving groups created by others
- **Transparent Cycle Management**: Clear visibility of contribution cycles and payout schedule
- **Secure Payouts**: Smart contract-managed distribution of funds to participants
- **Farcaster Integration**: Seamless identity management via Farcaster

## Technology Stack

- **Frontend**: Next.js 14 (React), TailwindCSS
- **Blockchain**: Base L2 (Ethereum Layer 2 solution)
- **Smart Contract Interaction**: wagmi v2, viem
- **Identity & Authentication**: Coinbase's OnchainKit with Farcaster integration
- **Styling**: TailwindCSS with custom UI components

## Project Architecture

### Frontend Architecture

The project follows Next.js App Router architecture with React components and hooks:

- **App Router**: Handles dynamic routes like `/tandas/[id]`
- **React Components**: Modular UI components for different views
- **Custom Hooks**: Abstractions for blockchain interactions

### Smart Contract Integration

The dApp interacts with two main contracts:

1. **Tanda Manager Contract**: Deployed at `0x8bf9da65f4c8479f042156e2a9d723273774898b`
   - Manages creation of new tandas
   - Tracks active tandas
   - Manages participants and their statuses

2. **USDC Contract**: Standard ERC-20 token contract on Base
   - Used for contributions and payouts

### Data Flow

1. **Smart Contract → Frontend**: Data is fetched using wagmi's `useContractRead` hooks
2. **Frontend → Smart Contract**: Transactions are submitted using `Transaction` component from OnchainKit
3. **User → Smart Contract**: User interactions (create, join, contribute, claim) trigger contract functions

## Project Structure

```
mi-tanda/
├── app/                      # Next.js App Router pages
│   ├── components/           # Shared UI components
│   ├── create/               # Tanda creation page
│   ├── tandas/               # Tandas listing and details
│   │   └── [id]/             # Individual tanda details
├── lib/                      # Library code
│   ├── config/               # Configuration (wagmi, etc.)
│   ├── contracts/            # Smart contract ABIs and addresses
│   └── hooks/                # Custom React hooks
├── public/                   # Static assets
│   └── styles/               # Global styles
```

## Key Components

- **`app/create/page.tsx`**: Form for creating new tandas
- **`app/tandas/page.tsx`**: Lists all active tandas
- **`app/tandas/[id]/page.tsx`**: Detailed view for a specific tanda
- **`lib/contracts/tanda.ts`**: Defines contract ABIs and addresses
- **`lib/hooks/useTandaManager.ts`**: React hooks for interacting with the Tanda Manager contract

## Installation and Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/mi-tanda.git
   cd mi-tanda
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables (create `.env.local`):
   ```
   # Example environment variables (replace with actual values)
   NEXT_PUBLIC_BASE_URL=https://your-app-url.com
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Visit `http://localhost:3000` in your browser

## Contract Interaction

All interactions with the blockchain are done through the following mechanisms:

1. **Read Operations**: Using wagmi's `useContractRead` hooks
2. **Write Operations**: Using OnchainKit's `Transaction` component which provides:
   - Transaction status updates
   - Error handling
   - Chain switching support

## Network Configuration

The dApp is configured to work on Base network (Chain ID: 8453). It includes:
- Automatic network detection
- Prompts to switch networks if not on Base
- Error handling for network-related issues

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT License](LICENSE)

## Acknowledgements

- Built with [Next.js](https://nextjs.org/)
- Smart contract interactions with [wagmi](https://wagmi.sh/)
- Transaction management with [OnchainKit](https://onchainkit.xyz/)
- Built for [Base](https://base.org/) network
- Identity via [Farcaster](https://www.farcaster.xyz/)
