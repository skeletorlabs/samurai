import "@/styles/globals.css";
import type { AppProps } from "next/app";
import StateProvider from "@/context/StateContext";

import {
  injectedWallet,
  walletConnectWallet,
  metaMaskWallet,
} from "@rainbow-me/rainbowkit/wallets";

import "@rainbow-me/rainbowkit/styles.css";
import {
  RainbowKitProvider,
  midnightTheme,
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, sepolia, WagmiConfig } from "wagmi";
import { base } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

import { defineChain } from "viem";

export const localhost = /*#__PURE__*/ defineChain({
  id: 31337,
  name: "Localhost",
  network: "localhost",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: { http: ["http://127.0.0.1:8545"] },
    public: { http: ["http://127.0.0.1:8545"] },
  },
});

const { chains, publicClient } = configureChains(
  [localhost, base],
  [
    publicProvider(),
    jsonRpcProvider({
      rpc: (chain) => ({
        http:
          chain.id === base.id
            ? (process.env.NEXT_PUBLIC_BASE_RPC_HTTPS as string)
            : "http://localhost:8545",
        webSocket:
          chain.id === base.id
            ? (process.env.NEXT_PUBLIC_BASE_WSS as string)
            : "wss://localhost:8545",
      }),
    }),
  ]
);
// const { connectors } = getDefaultWallets({
//   appName: "samuraistarter",
//   projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string,
//   chains,
// });

const connectors = connectorsForWallets([
  {
    groupName: "Recommended",
    wallets: [
      injectedWallet({ chains }),
      metaMaskWallet({
        chains: chains,
        projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string,
      }),
      // rainbowWallet({ projectId, chains }),
      walletConnectWallet({
        projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string,
        chains,
      }),
    ],
  },
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider
        chains={chains}
        modalSize="compact"
        theme={midnightTheme()}
      >
        <StateProvider>
          <Component {...pageProps} />
        </StateProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
