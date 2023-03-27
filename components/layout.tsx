import Head from "next/head";
import { Roboto } from "next/font/google";
import { ReactElement } from "react";
import Nav from "./nav";
import Footer from "./footer";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "500", "900"],
});

interface layout {
  children: ReactElement;
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
      <main className={roboto.className}>
        <div className="flex flex-col w-full h-full items-center">
          <div className="flex flex-col jutify-between w-full max-w-[1515px] h-full relative bg-art5 bg-no-repeat bg-[right_10rem_top_10rem] text-black/90">
            {/* <div className="bg-gradient-to-br from-black via-transparent to-transparent  w-[800px] h-[500px] absolute top-0 left-0" /> */}
            <Nav />
            {children}
            <Footer />
          </div>
          {/* <div className="flex flex-col justify-between text-white/90 relative  self-center bg-red-200 h-screen bg-art bg-no-repeat bg-[center_top_-3rem]"> */}
          {/* <div className="bg-gradient-to-br from-red-900 via-transparent to-transparent opacity-70 w-[600px] h-[500px] absolute top-0 left-0" />
            <Nav />
            {children}
            <Footer /> */}
          {/* </div> */}
        </div>
      </main>
    </>
  );
}
