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

const inter = Inter({
  subsets: ["latin"],
});

export default function Tokens() {
  return (
    <>
      <TopLayout background="bg-samurai-cyborg-fem bg-cover bg-top">
        <>
          <div className="flex flex-row justify-between items-center px-6 lg:px-8 xl:px-20 pt-10 lg:pt-24 bg-transparent sm:bg-black/60 2xl:bg-transparent">
            {/* TOP CONTENT */}
            <div className="relative md:mr-12 xl:max-w-[900px]">
              <h1 className="text-[48px] sm:text-[58px] lg:text-[90px] font-black leading-[58px] sm:leading-[68px] lg:leading-[98px] text-white">
                <span className="font-bold text-samurai-red">$SAM</span> TOKEN
              </h1>
              <p
                className={`leading-normal lg:leading-relaxed pb-6 text-xl lg:text-2xl xl:max-w-[900px]  ${inter.className}`}
              >
                Powering the{" "}
                <span className="font-bold text-samurai-red">
                  Samurai Starter
                </span>{" "}
                ecosystem
              </p>
              <p
                className={`leading-normal lg:leading-[40px] pb-6 text-lg lg:text-xl xl:max-w-[900px]  ${inter.className}`}
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
                  Buy $SAM on Aerodrome
                </SSButton>
                <SSButton
                  secondary
                  isLink
                  href="https://aerodrome.finance/deposit?token0=0x4200000000000000000000000000000000000006&token1=0xed1779845520339693CDBffec49a74246E7D671b&type=-1"
                  target="blank"
                  mobile
                >
                  Provide SAM/WETH LP on Aerodrome
                </SSButton>
              </div>
            </div>
          </div>
        </>
      </TopLayout>

      {/* TOKENOMICS */}
      <div className="flex flex-col py-10 md:py-20 w-full bg-white/5 border-t border-samurai-red/50 border-dotted">
        <div className="flex flex-col px-6 lg:px-8 xl:px-20 text-white">
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
              className={`flex flex-row justify-center md:justify-start flex-wrap gap-5 text-lg pt-7 md:pt-4 text-white lg:pr-5 font-light xl:max-w-[1200px] ${inter.className}`}
            >
              <div className="bg-white/10 p-3">
                <span className="text-yellow-400 font-bold">Total Supply:</span>{" "}
                130,000,000 $SAM
              </div>
              <div className="bg-white/10 p-3">
                <span className="text-yellow-400 font-bold">
                  Token Standard:
                </span>{" "}
                ERC-20
              </div>
              <div className="bg-white/10 p-3">
                <span className="text-yellow-400 font-bold">Blockchain:</span>{" "}
                Base
              </div>
              <div className="bg-white/10 p-3">
                <span className="text-yellow-400 font-bold">
                  Token Contract:
                </span>{" "}
                <Link
                  href="https://basescan.org/token/0xed1779845520339693CDBffec49a74246E7D671b"
                  target="blank"
                  className="underline hover:text-samurai-red"
                >
                  0xe...71b
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STAKING */}
      {/* <div
        id="lock"
        className="flex flex-col pt-10 md:pt-20 pb-10  w-full bg-white/10 md:bg-white/20 border-t border-samurai-red/50 border-dotted relative"
      >
        <div className="flex flex-col text-white">
          <div className="flex flex-col text-white text-2xl pb-20">
            <div className="flex flex-col lg:flex-row w-full justify-between gap-8 px-6 lg:px-8 xl:px-20">
              <p className="font-bold text-3xl md:text-5xl md:pb-2 text-center md:text-start">
                Lock <span className="text-samurai-red">$SAM</span>
              </p>
            </div>
            <p
              className={`text-lg text-neutral-300 pt-4 max-w-[700px] px-6 lg:px-8 xl:px-20  text-center md:text-start ${inter.className}`}
            >
              Lock $SAM for a period of 3, 6, 9, or 12 months to gain launchpad
              access, ventures entry, and to accumulate Samurai Points.
            </p>

            <div className="flex flex-col xl:flex-row px-6 lg:px-8 xl:px-20">
              <LockSam />

              <div className="flex flex-col items-center w-full lg:max-w-[580px] mt-14 sm:bg-gradient-to-b from-black/30 to-black/60 sm:rounded-lg sm:border border-white/10 pt-10 sm:pb-10 xl:py-0 xl:ml-12 2xl:ml-24 sm:shadow-lg">
                <p className="flex flex-col w-full items-center xl:mt-12">
                  <Image
                    src="/samurai.svg"
                    width={300}
                    height={300}
                    alt=""
                    className="mb-10 w-[200px] md:w-[300px]"
                  />
                </p>
                <p className="font-bold text-4xl md:text-6xl pb-2 text-center">
                  <span className="text-samurai-red">Samurai</span> Points
                </p>
                <p
                  className={`text-lg text-neutral-300 pt-1 px-6 lg:px-8 xl:px-20 text-center ${inter.className}`}
                >
                  Accumulate Samurai Points by participating in token launches,
                  locking $SAM, providing SAM liquidity, or by participating in
                  Samurai Sanka.
                </p>

                <p
                  className={`text-2xl text-center text-neutral-100 pt-10 px-6 lg:px-8 xl:px-16 ${inter.className}`}
                >
                  What can{" "}
                  <span className="text-samurai-red">Samurai Points</span> be
                  used for?
                </p>
                <p
                  className={`text-4xl pt-2 font-bold ${inter.className} px-6 lg:px-8 xl:px-20`}
                >
                  REWARDS!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      <ClaimSam />
    </>
  );
}
