import "@/styles/globals.css";
import type { AppProps } from "next/app";
import StateProvider from "@/context/StateContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <StateProvider>
      <Component {...pageProps} />
    </StateProvider>
  );
}
