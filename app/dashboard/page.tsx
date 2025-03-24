"use client";
import Image from "next/image";
import { Inter } from "next/font/google";
import TopLayout from "@/app/components/topLayout";

import { shortAddress } from "../utils/shortAddress";
import Link from "next/link";
import ChartPointsProgression from "../components/dashboard/chartPointsProgression";
import { useState, Fragment } from "react";
import { IDOs } from "../utils/constants";
import { formattedDate } from "../utils/formattedDate";
import SSSelect from "../components/ssSelect";
import ChartPointsUsage from "../components/dashboard/chartPointsUsage.tsx";
import { distribution, network } from "../utils/svgs";
import {
  CalendarDaysIcon,
  CalendarIcon,
  ChartBarIcon,
} from "@heroicons/react/20/solid";

const inter = Inter({
  subsets: ["latin"],
});

export default function Dashboard() {
  const [chartType, setChartType] = useState("Points Progression");
  const [chartInterval, setChartInterval] = useState("Monthly");
  return (
    <>
      <TopLayout background="bg-samurai-cyborg-fem">
        <div className="flex flex-col px-6 lg:px-8 xl:px-14 pt-10 lg:pt-16">
          <div className="flex flex-row justify-between items-center max-w-[1130px]">
            {/* TOP CONTENT */}
            <div className="w-full">
              <p className="text-[48px] sm:text-sm lg:text-lg text-white">
                Samurai
              </p>
              <p className="text-samurai-red text-3xl font-black">Dashboard</p>
            </div>
          </div>

          <div className="flex mt-8 gap-5">
            {/* Overview */}
            <div
              className={`flex flex-row justify-between items-center w-full ${inter.className}`}
            >
              <div className="flex flex-col bg-black/30 backdrop-blur-md py-8 rounded-3xl w-full min-h-[520px] border border-white/20 shadow-lg shadow-black/40">
                <div className="flex items-center gap-2 px-8">
                  <Image
                    src="/samurai.svg"
                    alt="avatar"
                    width={50}
                    height={50}
                    className="bg-black/60 rounded-full p-2 border border-white/20"
                  />
                  <div className="flex flex-col text-white leading-tight w-max">
                    <span className="text-white/70">EVM Address</span>
                    <Link
                      href={`https://basescan.org/address/0xcDe00Be56479F95b5e33De136AD820FfaE996009`}
                      className="2xl:text-xl hover:underline hover:opacity-80"
                      target="_blank"
                    >
                      {shortAddress(
                        "0xcDe00Be56479F95b5e33De136AD820FfaE996009",
                        8
                      )}
                    </Link>
                  </div>
                </div>

                <div className="flex flex-col gap-2 px-10 relative">
                  <div className="flex items-center gap-2 absolute top-[-50px] right-5 text-sm">
                    <ChartBarIcon width={24} height={24} />
                    <SSSelect
                      options={["Points Progression", "Points Usage"]}
                      onChange={(value) => setChartType(value)}
                    />

                    <span className="w-2" />
                    <CalendarDaysIcon width={24} height={24} />
                    <SSSelect
                      options={["6 months"]}
                      onChange={(value) => setChartInterval(value)}
                    />
                  </div>
                  {chartType === "Points Progression" ? (
                    <ChartPointsProgression />
                  ) : (
                    <ChartPointsUsage />
                  )}
                </div>

                <div className="flex flex-row items-center justify-between mt-10 text-center w-full">
                  <div className="flex flex-col w-full">
                    <p className="text-white/70 text-sm">Total IDOs</p>
                    <p className="text-white text-3xl 2xl:text-5xl font-bold">
                      10
                    </p>
                    <p className="text-orange-200 text-lg">Participated</p>
                  </div>
                  <div className="flex flex-col w-full">
                    <p className="text-white/70 text-sm">Overall Allocation</p>
                    <p className="text-white text-3xl 2xl:text-5xl font-bold">
                      500,000
                    </p>
                    <p className="text-orange-200 text-lg">USDC</p>
                  </div>
                  <div className="flex flex-col w-full">
                    <p className="text-white/70 text-sm">Total Claimed</p>
                    <p className="text-white text-3xl 2xl:text-5xl font-bold">
                      500,000
                    </p>
                    <p className="text-orange-200 text-lg">Vested Tokens</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {/* Sam Nft */}
              <div className="flex flex-col justify-center bg-samurai-red/50 backdrop-blur-md p-8 rounded-3xl w-max border border-white/20  shadow-lg shadow-black/40">
                <p className="text-white text-4xl 2xl:text-6xl font-bold">Shogun</p>
                <p className="text-orange-200 text-lg">Tier</p>
              </div>

              {/* Sam */}
              <div className="flex flex-col justify-center bg-neutral-500/50 backdrop-blur-md p-8 rounded-3xl w-max h-full border border-white/20  shadow-lg shadow-black/40">
                <p className="text-white/70 text-sm">Total Tokens</p>
                <p className="text-white text-4xl 2xl:text-6xl font-bold">500,000</p>
                <p className="text-orange-200 text-lg">$SAM</p>
              </div>

              {/* Sam Nft */}
              <div className="flex flex-col justify-center bg-yellow-300/50 backdrop-blur-md p-8 rounded-3xl w-max border border-white/20  shadow-lg shadow-black/40">
                <p className="text-white/70 text-sm">Total NFTs</p>
                <p className="text-white text-4xl 2xl:text-6xl font-bold">10</p>
                <p className="text-orange-200 text-lg">SAM NFT</p>
              </div>
            </div>
          </div>
        </div>
      </TopLayout>

      {/* My Allocations */}
      <div className="flex flex-col py-10 md:py-20 w-full bg-black border-t-[1px] border-samurai-red/40">
        <div className="flex items-center justify-between px-2 lg:px-8 xl:px-16 text-white mb-10">
          <h2 className="text-4xl lg:text-5xl font-bold text-center lg:text-start">
            My <span className="text-samurai-red">Allocations</span>
          </h2>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 text-white">{network}</span>
            <SSSelect
              options={["All Networks", "BASE", "BNB", "BERACHAIN"]}
              onChange={(value) => {}}
            />
            <span className="w-2" />
            <span className="w-6 h-6 text-white">{distribution}</span>
            <SSSelect
              options={[
                "All Status",
                "TGE Unlocked",
                "TGE Claimed",
                "Vesting",
                "Completed",
              ]}
              onChange={(value) => setChartInterval(value)}
            />
          </div>
        </div>
        {/* <div className="flex items-center gap-3 h-[100px] bg-red-300">asdf</div> */}

        <div className={`flex flex-col gap-1 ${inter.className}`}>
          {IDOs.map((ido, index) => (
            <div
              key={index}
              className="flex flex-row items-center py-10 px-2 lg:px-8 xl:px-16 text-white odd:bg-neutral-800 even:bg-black/20 border-t border-white/20 p-4"
            >
              <div className="flex flex-row items-center gap-4 2xl:gap-6 basis-[270px]">
                <Image
                  src={ido?.idoImageSrc}
                  alt={ido?.projectName}
                  width={70}
                  height={70}
                  className="
                    rounded-full bg-black/60 border border-white/20
                    min-w-[50px] min-h-[50px] max-w-[50px] max-h-[50px]
                    2xl:min-w-[70px] 2xl:min-h-[70px] 2xl:max-w-[70px] 2xl:max-h-[70px]
                  "
                />

                <div className="flex flex-col gap-1">
                  <p className="text-xl 2xl:text-2xl font-bold">
                    {ido?.projectName}
                  </p>
                  <p className="flex items-center justify-center bg-green-400 text-black rounded-full w-max px-3 text-sm border border-white/20">
                    Vesting
                  </p>
                </div>
              </div>

              <div className="flex basis-[270px]">
                <div className="flex items-center gap-3 text-sm 2xl:text-xl font-bold border border-white/20 bg-white/30 rounded-full py-[6px] px-5 w-max">
                  <Image
                    src={ido?.networkImageSrc}
                    alt={ido?.projectName}
                    width={30}
                    height={30}
                    className="
                      rounded-full bg-black/60 border border-white/20
                      min-w-[20px] min-h-[20px] max-w-[20px] max-h-[20px]
                      2xl:min-w-[30px] 2xl:min-h-[30px] 2xl:max-w-[30px] 2xl:max-h-[30px]
                    "
                  />
                  <span>{ido?.tokenNetwork}</span>
                </div>
              </div>

              <div className="flex flex-col basis-[200px]">
                <p className="text-sm 2xl:text-lg text-samurai-red">
                  Allocated
                </p>
                <p className="text-lg 2xl:text-xl font-bold">
                  {Number(1000).toLocaleString("en-us")} USDC
                </p>
              </div>

              <div className="flex flex-col basis-[200px]">
                <p className="text-sm 2xl:text-lg text-samurai-red">TGE Date</p>
                <p className="text-xl font-bold">{formattedDate(ido?.end)}</p>
              </div>

              <div className="flex flex-col basis-[400px] grow">
                <p className="text-sm 2xl:text-lg text-samurai-red">
                  Distribution
                </p>
                <p className="text-lg 2xl:text-xl font-bold">
                  {ido?.vestingDescription}
                </p>
              </div>

              {/* <div className="flex justify-end basis-[200px]">
                <button className="text-xl font-bold border border-white/20 bg-white/30 rounded-full py-2 px-5 w-max transition-all hover:bg-samurai-red">
                  View
                </button>
              </div> */}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
