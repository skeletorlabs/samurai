export type Chain = {
  chainId: number;
  name: string;
  currency: string;
  explorerUrl: string;
  rpcUrl: string;
};

export const unknown: Chain = {
  chainId: 0,
  name: "Solana",
  currency: "SOL",
  explorerUrl: "https://",
  rpcUrl: "https://",
};

export const base: Chain = {
  chainId: 8453,
  name: "Base",
  currency: "ETH",
  explorerUrl: "https://basescan.org",
  rpcUrl: process.env.NEXT_PUBLIC_BASE_RPC_HTTPS as string,
};

export const berachain: Chain = {
  chainId: 80094,
  name: "Berachain",
  currency: "BERA",
  explorerUrl: "https://berascan.com",
  rpcUrl: "https://rpc.berachain.com",
};

export const polygon: Chain = {
  chainId: 137,
  name: "Polygon",
  currency: "POL",
  explorerUrl: "https://polygonscan.com",
  rpcUrl: "https://polygon-mainnet.infura.io",
};

export const bnb: Chain = {
  chainId: 56,
  name: "BNB",
  currency: "BNB",
  explorerUrl: "https://bscscan.com/",
  rpcUrl: "https://binance.llamarpc.com",
};

export const arbitrum: Chain = {
  chainId: 42161,
  name: "Arbitrum",
  currency: "ETH",
  explorerUrl: "https://arbiscan.io",
  rpcUrl: "https://arbitrum.llamarpc.com",
};

export const solana: Chain = {
  chainId: 0,
  name: "Solana",
  currency: "SOL",
  explorerUrl: "https://",
  rpcUrl: "https://",
};
