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
  DisclaimerComponent,
  midnightTheme,
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, sepolia, WagmiConfig } from "wagmi";
import { base } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

import { defineChain } from "viem";

// const Disclaimer: DisclaimerComponent = ({ Text, Link }) => (
//   <Text>
//     By connecting your wallet, you agree to the{" "}
//     <Link href="https://termsofservice.xyz">Terms of Service</Link> and
//     acknowledge you have read and understand the protocol{" "}
//     <Link href="https://disclaimer.xyz">Disclaimer</Link>
//   </Text>
// );

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
  [localhost],
  [
    publicProvider(),
    jsonRpcProvider({
      rpc: (chain) => ({
        http:
          chain !== base
            ? localhost.rpcUrls.default.http.toString()
            : (process.env.NEXT_PUBLIC_BASE_RPC_HTTPS as string),
        webSocket:
          chain !== base
            ? localhost.rpcUrls.default.http.toString()
            : (process.env.NEXT_PUBLIC_BASE_WSS as string),
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
        // appInfo={{
        //   disclaimer: Disclaimer,
        // }}
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
