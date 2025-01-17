import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

import StateProvider from "@/app/context/StateContext";
import { Web3Modal } from "@/app/context/web3modal";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./components/footer";
import BottomNav from "./components/bottomNav";
import Footer2 from "./components/footer2";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "500", "900"],
});

export const metadata: Metadata = {
  title: "Samurai Starter",
  description:
    "Samurai enables projects to raise capital on a decentralised, permissionless and interoperable environment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <StateProvider>
          <div className="flex flex-col w-full h-full items-center text-white/90">
            <ToastContainer
              containerId="toast-notification"
              position="top-right"
              autoClose={6000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick={false}
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark"
            />
            <Web3Modal>{children}</Web3Modal>
            {/* <Footer /> */}
            <Footer2 />
          </div>
          <BottomNav />
        </StateProvider>

        {/* NEWSLETTER */}
        {/* <script
          src="//web.webformscr.com/apps/fc3/build/loader.js"
          async
          sp-form-id="0229cc821b515da43f09d3b34f142798efa2f98d40eb42d322744cb90dca5100"
        ></script> */}
      </body>
    </html>
  );
}
