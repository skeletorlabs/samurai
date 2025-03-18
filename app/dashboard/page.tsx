"use client";
import Image from "next/image";
import { Inter } from "next/font/google";
import TopLayout from "@/app/components/topLayout";

import { shortAddress } from "../utils/shortAddress";
import Link from "next/link";

const inter = Inter({
  subsets: ["latin"],
});

export default function Dashboard() {
  return (
    <>
      <TopLayout background="bg-samurai-cyborg-fem">
        <div className="flex flex-col px-6 lg:px-8 xl:px-20 pt-10 lg:pt-24">
          <div className="flex flex-row justify-between items-center max-w-[1130px]">
            {/* TOP CONTENT */}
            <div className="w-full">
              <p className="text-[48px] sm:text-sm lg:text-lg text-white">
                Samurai
              </p>
              <p className="text-samurai-red text-3xl font-black">Dashboard</p>
            </div>
          </div>

          <div className="flex items-center mt-8 gap-5">
            {/* Overview */}
            <div
              className={`flex flex-row justify-between items-center w-full max-w-[900px] ${inter.className}`}
            >
              <div className="flex flex-col bg-black/30 backdrop-blur-md p-8 rounded-3xl w-full min-h-[520px] border border-black/20 shadow-lg shadow-black/40">
                <p className="text-white text-2xl font-bold w-full">Overview</p>

                <div className="flex items-center gap-3 mt-10">
                  <Image
                    src="/samurai.svg"
                    alt="avatar"
                    width={60}
                    height={60}
                    className="bg-black/60 rounded-full p-2 border border-white/20"
                  />
                  <div className="flex flex-col text-white">
                    <span className="text-white/70">EVM Address</span>
                    <Link
                      href={`https://basescan.org/address/0xcDe00Be56479F95b5e33De136AD820FfaE996009`}
                      className="text-2xl hover:underline hover:opacity-80"
                      target="_blank"
                    >
                      {shortAddress(
                        "0xcDe00Be56479F95b5e33De136AD820FfaE996009",
                        8
                      )}
                    </Link>
                  </div>
                </div>

                <div className="flex flex-row items-center justify-center mt-24 text-center bg-neutral-500/30 border border-white/5 rounded-full py-3 text-white/80 text-4xl w-full">
                  You started the journey on April, 2019
                </div>

                <div className="flex flex-row items-center justify-between mt-10 text-center w-full">
                  <div className="flex flex-col w-full">
                    <p className="text-white/70 text-sm">Total IDOs</p>
                    <p className="text-white text-5xl font-bold">10</p>
                    <p className="text-orange-200 text-lg">Participated</p>
                  </div>
                  <div className="flex flex-col w-full">
                    <p className="text-white/70 text-sm">Overall Allocation</p>
                    <p className="text-white text-5xl font-bold">500,000</p>
                    <p className="text-orange-200 text-lg">USDC</p>
                  </div>
                  <div className="flex flex-col w-full">
                    <p className="text-white/70 text-sm">Total Claimed</p>
                    <p className="text-white text-5xl font-bold">500,000</p>
                    <p className="text-orange-200 text-lg">Vested Tokens</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {/* Sam */}

              <div className="flex flex-col bg-neutral-500/50 backdrop-blur-md p-8 rounded-3xl w-full border border-black/20  shadow-lg shadow-black/40">
                <p className="text-white/70 text-sm">Total Tokens</p>
                <p className="text-white text-5xl font-bold">500,000</p>
                <p className="text-orange-200 text-lg">$SAM</p>
              </div>

              {/* Sam Nft */}
              <div className="flex flex-col bg-yellow-300/50 backdrop-blur-md p-8 rounded-3xl w-full border border-black/20  shadow-lg shadow-black/40">
                <p className="text-white/70 text-sm">Total NFTs</p>
                <p className="text-white text-5xl font-bold">10</p>
                <p className="text-orange-200 text-lg">SAM NFT</p>
              </div>

              {/* Sam Nft */}
              <div className="flex flex-col bg-samurai-red/50 backdrop-blur-md p-8 rounded-3xl w-full border border-black/20  shadow-lg shadow-black/40">
                <p className="text-white/70 text-sm">Samurai</p>
                <p className="text-white text-5xl font-bold">Shogun</p>
                <p className="text-orange-200 text-lg">Tier</p>
              </div>
            </div>
          </div>
        </div>
      </TopLayout>

      {/* Offerings
      <div
        id="participate"
        className="flex flex-col py-10 md:py-20 w-full bg-white/20 border-t-[1px] border-samurai-red/40"
      >
        <div className="flex flex-col px-2 lg:px-8 xl:px-20 text-white">
          <h2 className="text-4xl lg:text-5xl font-bold text-center lg:text-start">
            Recent <span className="text-samurai-red">Giveaways</span>
          </h2>
          <Giveaways />
        </div>
      </div> */}
    </>
  );
}
