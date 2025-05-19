"use client";
import Image from "next/image";
import { Inter, Roboto } from "next/font/google";
import SSButton from "@/app/components/ssButton";
import TopLayout from "@/app/components/topLayout";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import LockSam from "@/app/components/lockSam";
import ClaimSam from "@/app/components/claimSam";
import Link from "next/link";
import { SOCIALS } from "@/app/utils/constants";
import Staking from "../components/staking";
import LockSamV2 from "../components/lockSamV2";
import { chirppad } from "../utils/svgs";
import LockSamV3 from "../components/lockSamV3";
import CustomTooltip from "../components/customTooltip";
import { useCallback, useContext, useEffect, useState } from "react";
import { StateContext } from "../context/StateContext";
import {
  migratePoints,
  userInfo,
  UserPoints,
} from "../contracts_integrations/points";
import LoadingBox from "../components/loadingBox";

const inter = Inter({
  subsets: ["latin"],
});

export default function Tokens() {
  const [userPoints, setUserPoints] = useState<UserPoints | null>(null);
  const { account, signer } = useContext(StateContext);
  const [loading, setLoading] = useState(false);

  const onMigratePoints = useCallback(async () => {
    setLoading(true);
    if (signer) {
      await migratePoints(signer);
      await getUserInfo();
    }
    setLoading(false);
  }, [signer, setLoading]);

  const getUserInfo = useCallback(async () => {
    setLoading(true);
    if (account) {
      const response = await userInfo(account);
      setUserPoints(response as UserPoints);
    }
    setLoading(false);
  }, [account, setUserPoints, setLoading]);

  useEffect(() => {
    getUserInfo();
  }, [account]);
  return (
    <>
      <TopLayout background="bg-samurai-cyborg-fem bg-cover bg-top">
        <>
          <div className="flex flex-row justify-between items-center px-6 lg:px-8 xl:px-16 pt-10 bg-transparent sm:bg-black/60 2xl:bg-transparent">
            {/* TOP CONTENT */}
            <div className="relative md:mr-12 xl:max-w-[1300px]">
              <h1 className="text-[48px] sm:text-[58px] lg:text-[90px] font-black leading-[58px] sm:leading-[68px] lg:leading-[98px] text-white">
                <span className="font-bold text-samurai-red">$SAM</span> TOKEN
              </h1>
              <p
                className={`leading-normal lg:leading-relaxed pb-6 text-xl lg:text-2xl  ${inter.className}`}
              >
                Powering the{" "}
                <span className="font-bold text-samurai-red">
                  Samurai Starter
                </span>{" "}
                ecosystem
              </p>
              <p
                className={`leading-normal lg:leading-[40px] pb-6 text-lg lg:text-xl  ${inter.className}`}
              >
                {">"} Participate in{" "}
                <span className="font-bold text-white">
                  top tier token launches.
                </span>{" "}
                <br />
                {">"} Gain access to{" "}
                <span className="font-bold text-white">VC-level deals</span>.
                <br />
                {">"} Provide liquidity for{" "}
                <span className="font-bold text-white">amazing APR</span>.
                <br />
                {">"} Participate in Samurai Sanka and{" "}
                <span className="font-bold text-white">earn</span>.
              </p>
              <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-7 mt-12">
                <SSButton
                  isLink
                  target="blank"
                  href="https://aerodrome.finance/swap?from=0x4200000000000000000000000000000000000006&to=0xed1779845520339693CDBffec49a74246E7D671b"
                  mobile
                >
                  Buy $SAM on Shadow
                </SSButton>
                <SSButton
                  secondary
                  isLink
                  href="https://aerodrome.finance/deposit?token0=0x4200000000000000000000000000000000000006&token1=0xed1779845520339693CDBffec49a74246E7D671b&type=-1"
                  target="blank"
                  mobile
                >
                  Provide S/SAM on Shadow
                </SSButton>
                <SSButton
                  isLink
                  target="blank"
                  href="https://aerodrome.finance/swap?from=0x4200000000000000000000000000000000000006&to=0xed1779845520339693CDBffec49a74246E7D671b"
                  mobile
                >
                  Buy $SAM on Aerodrome
                </SSButton>
                <SSButton
                  secondary
                  isLink
                  href="https://aerodrome.finance/deposit?token0=0x4200000000000000000000000000000000000006&token1=0xed1779845520339693CDBffec49a74246E7D671b&type=-1"
                  target="blank"
                  mobile
                >
                  Provide vAMM-WETH/SAM on Aerodrome
                </SSButton>
              </div>
            </div>
          </div>
        </>
      </TopLayout>

      {/* TOKENOMICS */}
      <div className="flex flex-col py-10 md:py-20 w-full bg-white/5 border-t border-samurai-red/50 border-dotted relative">
        <div className="flex flex-col px-6 lg:px-8 xl:px-16 text-white">
          <div className="flex flex-col text-white text-2xl">
            <div className="flex flex-col md:flex-row items-center gap-3">
              <p className="font-bold text-4xl pb-2 opacity-[0.8] md:w-[400px] text-center md:text-start">
                <span className="text-samurai-red">$SAM</span> Tokenomics
              </p>
              <div className="flex items-center justify-center w-full lg:justify-start gap-8 lg:px-5 mb-1">
                {SOCIALS.slice(SOCIALS.length - 4, SOCIALS.length).map(
                  (item, index) => (
                    <Link
                      key={index}
                      href={item.href}
                      className="transition-all hover:opacity-75 text-white scale-[1.5]"
                      target="blank"
                    >
                      {item.svg}
                    </Link>
                  )
                )}
              </div>
            </div>

            <div
              className={`flex flex-row justify-center md:justify-start flex-wrap gap-5 text-lg pt-7 md:pt-4 text-white lg:pr-5 font-light ${inter.className}`}
            >
              <div className="bg-white/10 p-3">
                <span className="text-yellow-400 font-bold">Total Supply:</span>{" "}
                130,000,000 $SAM
              </div>
              <div className="bg-white/10 p-3">
                <span className="text-yellow-400 font-bold">Standard:</span>{" "}
                ERC-20
              </div>
              <div className="bg-white/10 p-3">
                <span className="text-yellow-400 font-bold">Blockchains:</span>{" "}
                Base/Sonic
              </div>
              <div className="bg-white/10 p-3">
                <span className="text-yellow-400 font-bold">
                  Base Contract:
                </span>{" "}
                <Link
                  href="https://basescan.org/token/0xed1779845520339693CDBffec49a74246E7D671b"
                  target="blank"
                  className="underline hover:text-samurai-red"
                >
                  0xe...71b
                </Link>
              </div>
              <div className="bg-white/10 p-3">
                <span className="text-yellow-400 font-bold">
                  Sonic Contract:
                </span>{" "}
                <Link
                  href="https://sonicscan.org/token/0xCC5D9cc0d781d7F41F6809c0E8356C15942b775E"
                  target="blank"
                  className="underline hover:text-samurai-red"
                >
                  0xC...75E
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center w-full lg:max-w-[1024px] gap-14 mt-20 px-6 lg:px-8 xl:px-16">
          {/* <p className="flex flex-col items-center w-max">
            <Image
              src="/samurai.svg"
              width={200}
              height={200}
              alt=""
              className="w-[100px] md:w-[120px]"
            />
          </p> */}

          <div className="flex flex-col">
            <p className="font-bold text-4xl pb-2 opacity-[0.8] md:w-[400px] text-center md:text-start">
              <span className="text-samurai-red">Samurai</span> Points
            </p>
            <p
              className={`text-lg text-neutral-300 max-w-[640px] ${inter.className}`}
            >
              Accumulate Samurai Points by participating in token launches,
              locking $SAM or by participating in Samurai Sanka.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-10 mt-10 px-6 lg:px-8 xl:px-16">
          <div className="text-center md:text-start leading-none md:leading-normal">
            <div className="text-white/40 flex justify-center sm:justify-start items-center gap-2">
              <span>My Samurai Points</span>{" "}
              <CustomTooltip disabled={!account} dark={false}>
                <div className="font-medium text-[14px] flex-wrap max-w-[220px]">
                  My Samurai Points wallet balance
                </div>
              </CustomTooltip>
            </div>
            <p className="text-2xl">
              {(userPoints?.balance || 0).toLocaleString("en-us", {
                maximumFractionDigits: 2,
              })}{" "}
            </p>
          </div>

          <div className="text-center md:text-start leading-none md:leading-normal">
            <div className="text-white/40 flex justify-center sm:justify-start items-center gap-2">
              <span>My Boost</span>{" "}
              <CustomTooltip disabled={!account} dark={false}>
                <div className="font-medium text-[14px] flex-wrap max-w-[220px]">
                  Lock SamNFTs for Samurai Points multipliers
                </div>
              </CustomTooltip>
            </div>
            <p className="text-2xl">
              {(userPoints?.boost || 0).toLocaleString("en-us", {
                maximumFractionDigits: 2,
              })}
              x
            </p>
          </div>

          {userPoints && (userPoints?.pointsToMigrate || 0) > 0 && (
            <div className="text-center md:text-start leading-none md:leading-normal">
              <div className="text-white/40 flex justify-center sm:justify-start items-center gap-2">
                <span>My Virtual Points</span>{" "}
                <CustomTooltip disabled={!account} dark={false}>
                  <div className="font-medium text-[14px] flex-wrap max-w-[220px]">
                    Samurai Points accrued from Season 1. These can be migrated
                    to Samurai Points tokens
                  </div>
                </CustomTooltip>
              </div>
              <p className="text-2xl">
                {(userPoints?.pointsToMigrate || 0).toLocaleString("en-us", {
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
          )}

          {userPoints && (userPoints?.pointsToMigrate || 0) > 0 && (
            <div className="text-center md:text-start leading-none md:leading-normal">
              <div className="text-white/40 flex justify-center sm:justify-start items-center gap-2 mb-[5px]">
                <span>Migrate to Samurai Points</span>{" "}
                <CustomTooltip disabled={!account} dark={false}>
                  <div className="font-medium text-[14px] flex-wrap max-w-[220px]">
                    Claim Samurai Points tokens for virtual points earned during
                    Season 1
                  </div>
                </CustomTooltip>
              </div>
              <button
                disabled={
                  loading ||
                  !signer ||
                  !userPoints ||
                  userPoints?.pointsToMigrate === 0
                }
                onClick={onMigratePoints}
                className={`flex items-center gap-2 justify-center text-sm p-1 self-center mt-[4px]  px-4 rounded-full hover:enabled:bg-opacity-75 ${
                  loading ||
                  !signer ||
                  !userPoints ||
                  userPoints?.pointsToMigrate === 0
                    ? "bg-white/5 text-white/5"
                    : "bg-yellow-300 text-black"
                }`}
              >
                <span>MIGRATE VIRUTAL POINTS</span>
              </button>
            </div>
          )}
        </div>
        {loading && <LoadingBox />}
      </div>

      {/* LOCK V2 AND V3 */}
      <div
        id="staking"
        className="flex flex-col pt-10 md:pt-20 pb-20 w-full bg-white/10 md:bg-white/10 border-t border-samurai-red/50 border-dotted relative"
      >
        <div className="flex flex-col px-2 lg:px-8 xl:pl-16 xl:pr-0">
          <div className="flex flex-col lg:flex-row w-full justify-between gap-8">
            <p className="font-bold text-3xl md:text-5xl text-center md:text-start">
              <span className="text-samurai-red">$SAM</span> Lock - Season 2
            </p>
          </div>
          <p
            className={`text-lg text-neutral-300 pt-4 text-center md:text-start max-w-[700px] ${inter.className}`}
          >
            Lock $SAM for a period of 3, 6, 9, or 12 months to gain launchpad
            access, ventures entry, and to accumulate Samurai Points.
          </p>
        </div>
        <div className="flex flex-col xl:flex-row px-2 lg:px-8 xl:px-16 xl:gap-8 2xl:gap-24">
          {/* v3 */}
          <div className="flex flex-col">
            <p className="text-2xl text-white/70 text-center md:text-start w-full mt-14">
              <span className="text-samurai-red">$SAM</span> Lock
            </p>
            <LockSamV3 />
          </div>

          {/* v2 */}
          <div className="flex flex-col">
            <p className="text-2xl text-white/70 text-center md:text-start w-full mt-14">
              <span className="text-samurai-red">ChirpPad</span> Launchpool Lock
            </p>
            <LockSamV2 />
          </div>
        </div>
      </div>

      {/* SAM LOCK - SEASON 1 */}
      <div
        id="lock"
        className="flex flex-col pt-10 md:pt-20 pb-10 w-full bg-white/10 md:bg-white/20 border-t border-samurai-red/50 border-dotted relative"
      >
        <div className="flex flex-col text-white">
          <div className="flex flex-col text-white text-2xl pb-20">
            <div className="flex flex-col lg:flex-row w-full justify-between gap-8 px-2 lg:px-8 xl:px-16">
              <p className="font-bold text-3xl md:text-5xl text-center md:text-start">
                <span className="text-samurai-red">$SAM</span> Lock - Season 1
              </p>
            </div>
            <p
              className={`text-lg text-neutral-300 pt-4 max-w-[700px] px-2 lg:px-8 xl:px-16 text-center md:text-start ${inter.className}`}
            >
              Lock $SAM for a period of 3, 6, 9, or 12 months to gain launchpad
              access, ventures entry, and to accumulate Samurai Points.
            </p>

            <div className="flex flex-col xl:flex-row px-2 lg:px-8 xl:px-16">
              <LockSam />
            </div>
          </div>
        </div>
      </div>

      {/* LP STAKING */}
      {/* <div
        id="staking"
        className="flex flex-col pt-10 md:pt-20 pb-10  w-full bg-white/10 md:bg-white/10 border-t border-samurai-red/50 border-dotted relative"
      >
        <div className="flex flex-col text-white">
          <div className="flex flex-col text-white text-2xl pb-20">
            <div className="flex flex-col lg:flex-row w-full justify-between gap-8 px-2 lg:px-8 xl:px-16">
              <p className="font-bold text-3xl md:text-5xl md:pb-2 text-center md:text-start">
                Stake <span className="text-samurai-red">vAMM-WETH/SAM</span>
              </p>
            </div>
            <p
              className={`text-lg text-neutral-300 pt-4 max-w-[700px] px-2 lg:px-8 xl:px-16  text-center md:text-start ${inter.className}`}
            >
              Stake vAMM-WETH/SAM for a period of 3, 6, 9, or 12 months to gain
              launchpad access, ventures entry, and to accumulate Samurai
              Points.
            </p>

            <div className="flex flex-col 2xl:flex-row px-2 lg:px-8 xl:px-16">
              <Staking />

              <div className="flex flex-col items-center w-full lg:max-w-[580px] mt-14 sm:bg-gradient-to-b from-black/30 to-black/60 sm:rounded-lg sm:border border-samurai-red/20 pt-10 sm:pb-10 2xl:ml-24 sm:shadow-lg">
                <p className="flex flex-col w-full items-center xl:mt-12">
                  <Image
                    src="/aerodrome.svg"
                    width={300}
                    height={300}
                    alt=""
                    className="mb-10 w-[140px] md:w-[200px]"
                  />
                </p>
                <p className="font-bold text-4xl md:text-6xl pb-2 text-center">
                  <span className="text-samurai-red">Samurai</span> Points
                </p>
                <p
                  className={`text-lg text-neutral-300 pt-1 px-2 lg:px-8 xl:px-20 text-center ${inter.className}`}
                >
                  Accumulate Samurai Points by participating in token launches,
                  providing SAM liquidity, or by participating in Samurai Sanka.
                </p>

                <p
                  className={`text-2xl text-center text-neutral-100 pt-10 px-2 lg:px-8 xl:px-16 ${inter.className}`}
                >
                  What can{" "}
                  <span className="text-samurai-red">Samurai Points</span> be
                  used for?
                </p>
                <p
                  className={`text-4xl pt-2 font-bold ${inter.className} px-6 lg:px-8 xl:px-14`}
                >
                  REWARDS!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </>
  );
}
