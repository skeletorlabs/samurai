import Link from "next/link";
import Image from "next/image";
import LayoutClean from "@/components/layoutClean";
import Layout from "@/components/layout";
import { Inter } from "next/font/google";
import { useCallback, useState } from "react";
import { rocket, telegram, linkedin, op, dola, velov2 } from "@/utils/svgs";
import SSButton from "@/components/ssButton";
import TopLayout from "@/components/topLayout";
import LaunchpadCard from "@/components/launchpadCard";
import { IDO } from "@/utils/interfaces";
import IDOModal from "@/components/IDOModal";

const inter = Inter({
  subsets: ["latin"],
});

export default function Launchpad() {
  const idos: IDO[] = [
    {
      tokenImageSrc: "/ido-sample.svg",
      status: "ONGOING",
      chainImageSrc: "/samurai.svg",
      title: "Coming soon",
      description: "New IDOs are coming soon, stay tuned to don't lose it!",
      startedAt: 1692710825,
      closedAt: 0,
      access: "whitelist",
      raised: "0",
      goal: "∞",
    },
    // {
    //   tokenImage: op,
    //   status: "ONGOING",
    //   chainImageSrc: "/chain-logos/MATIC.svg",
    //   title: "Maya Protocol",
    //   description:
    //     "Maya Protocol is a THORchain-friendly fork which moves digital assets, swaps, or stakes cross-chain without the need to wrap or peg any of them. Aztec Chain, with its smart contract capabilities, is a powerful demonstration of the high potential of the Maya Protocol's design.",
    //   startedAt: 1691681894,
    //   closedAt: 0,
    //   access: "public",
    //   raised: "120000/120000 MATIC",
    //   goal: "190000 MATIC",
    // },
    // {
    //   tokenImage: velov2,
    //   status: "ENDED",
    //   chainImageSrc: "/chain-logos/AVAX.svg",
    //   title: "Maya Protocol",
    //   description:
    //     "Maya Protocol is a THORchain-friendly fork which moves digital assets, swaps, or stakes cross-chain without the need to wrap or peg any of them. Aztec Chain, with its smart contract capabilities, is a powerful demonstration of the high potential of the Maya Protocol's design.",
    //   startedAt: 1691681894,
    //   closedAt: 0,
    //   access: "public",
    //   raised: "120000/120000 AVAX",
    //   goal: "190000 AVAX",
    // },
    // {
    //   tokenImage: op,
    //   status: "ONGOING",
    //   chainImageSrc: "/chain-logos/MATIC.svg",
    //   title: "Maya Protocol",
    //   description:
    //     "Maya Protocol is a THORchain-friendly fork which moves digital assets, swaps, or stakes cross-chain without the need to wrap or peg any of them. Aztec Chain, with its smart contract capabilities, is a powerful demonstration of the high potential of the Maya Protocol's design.",
    //   startedAt: 1691681894,
    //   closedAt: 0,
    //   access: "public",
    //   raised: "120000/120000 MATIC",
    //   goal: "190000 MATIC",
    // },
    // {
    //   tokenImage: velov2,
    //   status: "ENDED",
    //   chainImageSrc: "/chain-logos/AVAX.svg",
    //   title: "Maya Protocol",
    //   description:
    //     "Maya Protocol is a THORchain-friendly fork which moves digital assets, swaps, or stakes cross-chain without the need to wrap or peg any of them. Aztec Chain, with its smart contract capabilities, is a powerful demonstration of the high potential of the Maya Protocol's design.",
    //   startedAt: 1691681894,
    //   closedAt: 0,
    //   access: "public",
    //   raised: "120000/120000 AVAX",
    //   goal: "190000 AVAX",
    // },
    // {
    //   tokenImage: op,
    //   status: "ONGOING",
    //   chainImageSrc: "/chain-logos/BSC.svg",
    //   title: "Maya Protocol",
    //   description:
    //     "Maya Protocol is a THORchain-friendly fork which moves digital assets, swaps, or stakes cross-chain without the need to wrap or peg any of them. Aztec Chain, with its smart contract capabilities, is a powerful demonstration of the high potential of the Maya Protocol's design.",
    //   startedAt: 1691681894,
    //   closedAt: 0,
    //   access: "public",
    //   raised: "120000/120000 BUSD",
    //   goal: "190000 BUSD",
    // },
    // {
    //   tokenImage: velov2,
    //   status: "ENDED",
    //   chainImageSrc: "/chain-logos/SOLANA.svg",
    //   title: "Maya Protocol",
    //   description:
    //     "Maya Protocol is a THORchain-friendly fork which moves digital assets, swaps, or stakes cross-chain without the need to wrap or peg any of them. Aztec Chain, with its smart contract capabilities, is a powerful demonstration of the high potential of the Maya Protocol's design.",
    //   startedAt: 1691681894,
    //   closedAt: 0,
    //   access: "public",
    //   raised: "120000/120000 SOL",
    //   goal: "190000 SOL",
    // },
  ];

  return (
    <Layout>
      <TopLayout background="bg-samurai-launchpad">
        <div className="flex flex-row justify-between items-center px-6 lg:px-8 xl:px-20">
          {/* TOP CONTENT */}
          <div className="sm:pt-10 lg:pt-24 relative">
            <h1 className="text-[48px] sm:text-[58px] font-black leading-[58px] sm:leading-[68px] md:mr-12 xl:max-w-[1000px] text-samurai-red ">
              Samurai <span className="text-white">Launchpad</span>
            </h1>
            <p
              className={`leading-normal pt-6 lg:text-xl xl:max-w-[900px] ${inter.className}`}
            >
              Advising, guiding, and accelerating the most novel and innovative
              projects in the Web3 space, Samurai Starter brings together a
              knowledgeable and active community of crowdfunding participants
              who are dedicated to furthering the fundamental ideas of the
              cryptocurrency movement.
            </p>
            <div className="flex flex-col lg:flex-row pt-16 gap-5 z-20">
              <SSButton isLink href="#participate">
                Get Started
              </SSButton>
            </div>
          </div>
          <Image
            src="/samurai-launchpad-icon.svg"
            width={350}
            height={350}
            alt="incubation"
            className="rounded-[8px] hidden xl:block opacity-40 xl:opacity-100"
            placeholder="blur"
            blurDataURL="/thumb.png"
          />
        </div>
      </TopLayout>

      {/* HOW TO PARTICIPATE */}
      <div
        id="participate"
        className="flex items-center gap-12 px-6 lg:px-8 xl:px-20 py-24  w-full bg-white/10 text-white border-t border-samurai-red/50 border-dotted"
      >
        <div className="flex flex-col relative">
          <h2 className="text-4xl lg:text-5xl font-bold">
            How to <span className="text-samurai-red">participate</span>
          </h2>
          <p
            className={`relative mt-3 leading-normal pt-3 text-[20px]  ${inter.className}`}
          >
            Follow these easy steps to become an active member of the Samurai
            Starter community →
          </p>

          <div className="w-full flex flex-col gap-10 flex-wrap mt-14 text-2xl lg:text-3xl">
            <div className="flex items-center gap-3">
              <span
                className={`w-[50px] text-7xl text-samurai-red ${inter.className}`}
              >
                1.
              </span>
              <div className="bg-gradient-to-r from-transparent to-neutral-800 rounded-r-xl px-8 py-6 shadow-inner">
                <Link
                  href="/nft"
                  className="text-samurai-red hover:opacity-75 underline"
                >
                  Buy or rent
                </Link>{" "}
                a SamNFT to gain token offering access.
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`w-[50px] text-7xl text-samurai-red ${inter.className}`}
              >
                2.
              </span>
              <div className="bg-gradient-to-r from-transparent to-neutral-800 rounded-r-xl px-8 py-6 shadow-inner">
                <span className="text-samurai-red">Register</span> your interest
                in participating in the token offering during the whitelisting
                period.
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`w-[50px] text-7xl text-samurai-red ${inter.className}`}
              >
                3.
              </span>
              <div className="bg-gradient-to-r from-transparent to-neutral-800 rounded-r-xl px-8 py-6 shadow-inner">
                <span className="text-samurai-red">Commit</span> selected
                payment currency during the participation period. period.
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`w-[50px] text-7xl text-samurai-red ${inter.className}`}
              >
                4.
              </span>
              <div className="bg-gradient-to-r from-transparent to-neutral-800 rounded-r-xl px-8 py-6 shadow-inner">
                <span className="text-samurai-red">Claim</span> your tokens
                according to each project's vesting terms.
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`w-[50px] text-7xl text-samurai-red ${inter.className}`}
              >
                5.
              </span>
              <div className="bg-gradient-to-r from-transparent to-neutral-800 rounded-r-xl px-8 py-6 shadow-inner">
                <span className="text-samurai-red">Claim</span> your $SAM
                rewards after participating in the token offering.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Offerings */}
      <div className="flex flex-col py-10 md:py-20 w-full bg-white/20 border-t-[1px] border-samurai-red/40">
        <div className="flex flex-col px-6 lg:px-8 xl:px-20 text-white">
          <h2 className="text-4xl lg:text-5xl font-bold">
            <span className="text-samurai-red">Upcoming</span> Token Offerings
          </h2>
          <div
            className={`flex justify-center lg:justify-start items-center flex-wrap gap-10 leading-normal pt-10 xl:pt-16 text-xl ${inter.className}`}
          >
            {/* <div className="text-5xl lg:text-4xl mt-8">Coming soon!</div> */}
            {idos.map((ido: IDO, index) => (
              // <IDOModal key={index} ido={ido}>
              //   <LaunchpadCard ido={ido} />
              // </IDOModal>
              <LaunchpadCard key={index} ido={ido} />
            ))}
          </div>
        </div>
      </div>

      {/* Past */}
      {/* <div className="flex flex-col py-10 md:py-20 w-full bg-white/10 border-t-[1px] border-samurai-red/40">
        <div className="flex flex-col px-6 lg:px-8 xl:px-20 text-white">
          <h2 className="text-4xl lg:text-5xl font-bold">
            <span className="text-white/30">Past</span> Token Offerings
          </h2>
          <div
            className={`flex justify-center lg:justify-start items-center flex-wrap gap-10 leading-normal pt-10 xl:pt-16 text-xl ${inter.className}`}
          >
            {idos.map((ido: IDO, index) => (
              <LaunchpadCard key={index} ido={ido} type="light" />
            ))}
          </div>
        </div>
      </div> */}
    </Layout>
  );
}

// paul@samuraistarter.com, projects@samuraistarter.com
