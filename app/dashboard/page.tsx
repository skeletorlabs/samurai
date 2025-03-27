"use client";
import Image from "next/image";
import { Inter } from "next/font/google";
import TopLayout from "@/app/components/topLayout";

import { shortAddress } from "../utils/shortAddress";
import Link from "next/link";
import ChartPointsProgression from "../components/dashboard/chartPointsProgression";
import { useState, Fragment, useContext, useEffect } from "react";
import { IDO_CHAINS, IDOs } from "../utils/constants";
import { formattedDate } from "../utils/formattedDate";
import SSSelect from "../components/ssSelect";
import ChartPointsUsage from "../components/dashboard/chartPointsUsage.tsx";
import { distribution, network } from "../utils/svgs";
import {
  CalendarDaysIcon,
  CalendarIcon,
  ChartBarIcon,
} from "@heroicons/react/20/solid";
import UserList from "../components/dashboard/userList";
import { chains } from "../context/web3modal";
import { StateContext } from "../context/StateContext";
import { userInfo } from "../contracts_integrations/dashboard";
import LoadingBox from "../components/loadingBox";
import { DashboardUserDetails } from "../utils/interfaces";

const inter = Inter({
  subsets: ["latin"],
});

export default function Dashboard() {
  const [chartType, setChartType] = useState("Points Progression");
  const [chartInterval, setChartInterval] = useState("Monthly");
  const [filterChain, setFilterChain] = useState("All Networks");
  const [filterStatus, setFilterStatus] = useState("All Status");
  const [userDetails, setUserDetails] = useState<DashboardUserDetails | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const { signer } = useContext(StateContext);

  const getUserInfo = async () => {
    setLoading(true);
    if (signer) {
      const response = await userInfo(signer);
      if (response) setUserDetails(response);
    }
    setLoading(false);
  };

  useEffect(() => {
    getUserInfo();
  }, [signer]);

  console.log(userDetails);
  return (
    <div className="flex flex-col relative">
      <TopLayout background="bg-samurai-cyborg-fem">
        <div className="flex flex-col px-6 lg:px-8 xl:px-14 ">
          <div className="flex flex-row justify-between items-center max-w-[1130px]">
            {/* TOP CONTENT */}
            <div className="w-full">
              <p className="text-[48px] sm:text-sm lg:text-lg text-white">
                Samurai
              </p>
              <p className="text-samurai-red text-3xl font-black">Dashboard</p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row mt-8 gap-5">
            {/* Overview */}
            <div
              className={`flex flex-col lg:flex-row lg:justify-between lg:items-center w-full ${inter.className}`}
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
                  <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:absolute lg:top-[-50px] lg:right-5 text-sm">
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
                      {userDetails?.userIdos.length}
                    </p>
                    <p className="text-orange-200 text-lg">Participated</p>
                  </div>
                  <div className="flex flex-col w-full">
                    <p className="text-white/70 text-sm">Overall Allocation</p>
                    <p className="text-white text-3xl 2xl:text-5xl font-bold">
                      {userDetails?.totalAllocated.toLocaleString("en-us")}
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

            <div
              className={`flex flex-row lg:flex-col gap-4 flex-wrap lg:flex-nowrap`}
            >
              {/* Tier */}
              <div className="flex flex-col justify-center bg-samurai-red/50 backdrop-blur-md py-5 px-8 rounded-3xl w-max border border-white/20  shadow-lg shadow-black/40">
                <p className="text-white text-4xl 2xl:text-5xl">
                  {userDetails?.tier}
                </p>
                <p className="text-orange-200 text-lg">Tier</p>
              </div>

              {/* Sam */}
              <div className="flex flex-col justify-center bg-neutral-500/50 backdrop-blur-md p-8 rounded-3xl w-max h-full border border-white/20  shadow-lg shadow-black/40">
                <p className="text-white/70 text-sm">Total Tokens</p>
                <p className="text-white text-4xl 2xl:text-5xl">
                  {userDetails?.samBalance.toLocaleString("en-us")}
                </p>
                <p className="text-orange-200 text-lg">$SAM</p>
              </div>

              {/* Points */}
              <div className="flex flex-col justify-center bg-emerald-300/30 backdrop-blur-md py-5 px-8 rounded-3xl w-max h-full border border-white/20  shadow-lg shadow-black/40">
                <p className="text-white text-2xl 2xl:text-4xl">
                  {userDetails?.points.toLocaleString("en-us")}
                </p>
                <p className="text-orange-200 text-lg">Points</p>
              </div>

              {/* Sam Nft */}
              <div className="flex flex-col justify-center bg-yellow-300/50 backdrop-blur-md py-5 px-8 rounded-3xl w-max border border-white/20  shadow-lg shadow-black/40">
                <p className="text-white text-4xl 2xl:text-5xl">
                  {userDetails?.nftBalance}
                </p>
                <p className="text-orange-200 text-lg">SAM NFT</p>
              </div>
            </div>
          </div>
        </div>
      </TopLayout>

      {/* My Allocations */}
      <div className="hidden lg:flex flex-col py-10 md:py-20 w-full bg-black border-t-[1px] border-samurai-red/40">
        <div className="flex items-center justify-between px-2 lg:px-8 xl:px-16 text-white mb-10">
          <h2 className="text-4xl lg:text-5xl font-bold text-center lg:text-start">
            My <span className="text-samurai-red">Allocations</span>
          </h2>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 text-white">{network}</span>
            <SSSelect
              options={["All Networks"].concat(
                IDO_CHAINS.map((item: any) => item?.name)
              )}
              onChange={(value) => setFilterChain(value)}
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
              onChange={(value) => setFilterStatus(value)}
            />
          </div>
        </div>
        {/* <div className="flex items-center gap-3 h-[100px] bg-red-300">asdf</div> */}

        <UserList
          IDOs={userDetails?.userIdos || []}
          allocations={userDetails?.allocations || {}}
          phases={userDetails?.phases || {}}
          filterChain={filterChain}
          filterStatus={filterStatus}
        />
      </div>

      {/* Loading */}
      {loading && <LoadingBox />}
    </div>
  );
}
