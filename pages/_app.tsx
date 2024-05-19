import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Web3Modal } from "../context/web3modal";
import StateProvider from "@/context/StateContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Web3Modal>
      <StateProvider>
        <Component {...pageProps} />
      </StateProvider>
    </Web3Modal>
  );
}
