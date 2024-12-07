"use client";
import Link from "next/link";
import Image from "next/image";
import { Inter } from "next/font/google";
import TopLayout from "@/app/components/topLayout";
import Projects from "@/app/components/projects";
import ProjectsV2 from "../components/projectsV2";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";

import { ChevronDownIcon } from "@heroicons/react/20/solid";

const inter = Inter({
  subsets: ["latin"],
});

export default function Launchpad() {
  return (
    <>
      <TopLayout background="bg-samurai-launchpad">
        <div className="flex flex-row justify-between items-center px-6 lg:px-8 xl:px-20 pt-10 lg:pt-24">
          {/* TOP CONTENT */}
          <div className="relative md:mr-12 xl:max-w-[900px]">
            <h1 className="text-[48px] sm:text-[58px] lg:text-[90px] font-black leading-[58px] sm:leading-[68px] lg:leading-[98px] text-white">
              Samurai <span className="text-samurai-red">Launchpad</span>
            </h1>
            <p
              className={`leading-normal lg:leading-relaxed pt-6 lg:text-2xl xl:max-w-[900px]  ${inter.className}`}
            >
              Advising, guiding, and accelerating the most novel and innovative
              projects in the Web3 space, Samurai Starter brings together a
              knowledgeable and active community of crowdfunding participants
              who are dedicated to furthering the fundamental ideas of the
              cryptocurrency movement.
            </p>
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

      {/* Offerings */}
      <div
        id="participate"
        className="flex flex-col py-10 md:py-20 w-full bg-white/20 border-t-[1px] border-samurai-red/40"
      >
        <div className="flex flex-col px-6 lg:px-8 xl:px-20 text-white">
          <h2 className="text-4xl lg:text-5xl font-bold">
            <span className="text-samurai-red">Recent</span> Offerings
          </h2>
          <ProjectsV2 />
        </div>

        <div className="px-6 lg:px-8 xl:px-20 text-white mt-20">
          <Disclosure>
            <DisclosureButton className="group flex items-center gap-2">
              <h2 className="text-4xl lg:text-5xl font-bold">
                <span className="text-samurai-red">Past</span> Offerings
              </h2>
              <ChevronDownIcon className="w-10 h-10 group-data-[open]:rotate-180" />
            </DisclosureButton>
            <DisclosurePanel className=" text-white">
              <Projects />
            </DisclosurePanel>
          </Disclosure>
        </div>

        {/* <div className="flex flex-col px-6 lg:px-8 xl:px-20 text-white mt-20">
          <h2 className="text-4xl lg:text-5xl font-bold">
            <span className="text-samurai-red">Past</span> Offerings
          </h2>
          <Projects />
        </div> */}
      </div>

      {/* HOW TO PARTICIPATE */}
      <div className="flex items-center gap-12 px-6 lg:px-8 xl:px-20 py-24  w-full bg-white/10 text-white border-t border-samurai-red/50 border-dotted">
        <div className="flex flex-col relative">
          <h2 className="text-4xl lg:text-5xl font-bold">
            Launchpad <span className="text-samurai-red">Tiers</span>
          </h2>
          <p
            className={`relative mt-3 leading-normal pt-3 text-[20px] text-white/70  ${inter.className}`}
          >
            Hold a{" "}
            <Link
              href="https://opensea.io/collection/samuraistarter"
              target="blank"
              className="font-bold text-white"
            >
              SamNFT
            </Link>
            , stake{" "}
            <Link href="/tokens" className="font-bold text-white">
              $SAM
            </Link>
            , or provide{" "}
            <Link
              href="https://aerodrome.finance/connect?to=%2Fdeposit%3Ftoken0%3D0x4200000000000000000000000000000000000006%26token1%3D0xed1779845520339693CDBffec49a74246E7D671b%26type%3D-1"
              target="blank"
              className="font-bold text-white"
            >
              WETH/SAM LP
            </Link>{" "}
            to be eligible to participate in the hottest{" "}
            <span className="font-bold text-white">token launches</span> in
            crypto.
          </p>

          <div className="flex flex-col gap-10 flex-wrap mt-14 text-2xl lg:text-3xl relative">
            <Image
              src="/sam-launchpad-tiers.png"
              width={2200}
              height={1200}
              alt="samurai launchpad tiers"
              // className="w-full h-full"
            />
          </div>
        </div>
      </div>

      {/* HOW TO PARTICIPATE
      <div className="flex items-center gap-12 px-6 lg:px-8 xl:px-20 py-24  w-full bg-white/10 text-white border-t border-samurai-red/50 border-dotted">
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
                className={`w-[35px] md:w-[50px] text-7xl text-samurai-red ${inter.className}`}
              >
                1.
              </span>
              <div className="text-xl md:text-2xl bg-gradient-to-r from-transparent to-neutral-800 rounded-r-xl px-8 py-6 shadow-inner">
                <Link
                  href="/nft"
                  className="text-samurai-red hover:opacity-75 underline"
                >
                  Buy
                </Link>
                {" or "}
                <Link
                  href="#"
                  className="text-samurai-red hover:opacity-75 underline"
                >
                  rent (coming soon)
                </Link>{" "}
                a SamNFT to gain token offering access.
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`w-[35px] md:w-[50px] text-7xl text-samurai-red ${inter.className}`}
              >
                2.
              </span>
              <div className="text-xl md:text-2xl bg-gradient-to-r from-transparent to-neutral-800 rounded-r-xl px-8 py-6 shadow-inner">
                <span className="text-samurai-red">Register</span> your interest
                in participating in the token offering during the whitelisting
                period.
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`w-[35px] md:w-[50px] text-7xl text-samurai-red ${inter.className}`}
              >
                3.
              </span>
              <div className="text-xl md:text-2xl bg-gradient-to-r from-transparent to-neutral-800 rounded-r-xl px-8 py-6 shadow-inner">
                <span className="text-samurai-red">Commit</span> selected
                payment currency during the participation period.
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`w-[35px] md:w-[50px] text-7xl text-samurai-red ${inter.className}`}
              >
                4.
              </span>
              <div className="text-xl md:text-2xl bg-gradient-to-r from-transparent to-neutral-800 rounded-r-xl px-8 py-6 shadow-inner">
                <span className="text-samurai-red">Claim</span> your tokens
                according to each project's vesting terms.
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`w-[35px] md:w-[50px] text-7xl text-samurai-red ${inter.className}`}
              >
                5.
              </span>
              <div className="text-xl md:text-2xl bg-gradient-to-r from-transparent to-neutral-800 rounded-r-xl px-8 py-6 shadow-inner">
                <span className="text-samurai-red">Claim</span> your $SAM
                rewards after participating in the token offering.
              </div>
            </div>
          </div>
        </div>
      </div> */}

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
    </>
  );
}
