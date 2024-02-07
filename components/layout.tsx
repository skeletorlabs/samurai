import Head from "next/head";
import { Roboto } from "next/font/google";
import { ReactElement, useContext } from "react";
import { ToastContainer } from "react-toastify";
import { Analytics } from "@vercel/analytics/react";

import Footer from "./footer";
import BottomNav from "./bottomNav";

import "react-toastify/dist/ReactToastify.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "500", "900"],
});

interface layout {
  children: ReactElement | ReactElement[];
}

export default function Layout({ children }: layout) {
  return (
    <>
      <Head>
        <title>Samurai Starter</title>
        <meta
          name="description"
          content="Samurai enables projects to raise capital on a decentralised, permissionless and interoperable environment"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

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

      <main className={roboto.className}>
        <div className="flex flex-col w-full h-full items-center text-white/90">
          {children}
          <Footer />
          <Analytics />
        </div>
        <BottomNav />
      </main>
    </>
  );
}
