"use client";

import { createWeb3Modal, defaultConfig } from "@web3modal/ethers/react";
import { base } from "../utils/chains";

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = "615362a649b8bf6fbed2f4694edf0e91";

// 2. Set chains
export const chains = [base];

// 3. Create a metadata object
const metadata = {
  name: "Samurai Starter",
  description:
    "Samurai enables projects to raise capital on a decentralised, permissionless and interoperable environment",
  url: "https://samuraistarter.com", // origin must match your domain & subdomain
  icons: ["https://www.samuraistarter.com/samurai.svg"],
};
// 4. Create Ethers config
const ethersConfig = defaultConfig({
  /*Required*/
  metadata,

  /*Optional*/
  enableEIP6963: true, // true by default
  enableInjected: true, // true by default
  enableCoinbase: true, // true by default
  rpcUrl: process.env.NEXT_PUBLIC_BASE_RPC_HTTPS as string, // used for the Coinbase SDK
  defaultChainId: 8453, // used for the Coinbase SDK
});

// 5. Create a Web3Modal instance
createWeb3Modal({
  ethersConfig,
  chains: chains,
  projectId,
});

type Props = {
  children?: React.ReactNode;
};

export const Web3Modal = ({ children }: Props) => {
  return <>{children}</>;
};
