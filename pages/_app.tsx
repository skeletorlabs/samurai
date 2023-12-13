import "@/styles/globals.css";
import type { AppProps } from "next/app";
import StateProvider from "@/context/StateContext";

import {
  injectedWallet,
  // rainbowWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";

import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultWallets,
  RainbowKitProvider,
  midnightTheme,
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, sepolia, WagmiConfig } from "wagmi";
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  goerli,
  localhost,
  base,
} from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

const { chains, publicClient } = configureChains(
  [base],
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
