import Link from "next/link";
import Image from "next/image";
import Layout from "@/components/layout";
import { Inter } from "next/font/google";
import SSButton from "@/components/ssButton";
import TopLayout from "@/components/topLayout";
import LaunchpadCardNew from "@/components/launchpadCardNew";
import { IDONEW } from "@/utils/interfaces";
import { IDO_LIST } from "@/utils/constants";

const inter = Inter({
  subsets: ["latin"],
});

export default function Launchpad() {
  return (
    <Layout>
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
            <div className="flex flex-col lg:flex-row mt-12 gap-5 z-20">
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

      {/* Offerings */}
      <div className="flex flex-col py-10 md:py-20 w-full bg-white/20 border-t-[1px] border-samurai-red/40">
        <div className="flex flex-col px-6 lg:px-8 xl:px-20 text-white">
          <h2 className="text-4xl lg:text-5xl font-bold">
            <span className="text-samurai-red">Upcoming</span> Token Offerings
          </h2>
          <div
            className={`flex justify-center lg:justify-start items-center flex-wrap gap-10 leading-normal pt-10 xl:pt-16 text-xl ${inter.className}`}
          >
            {IDO_LIST.map((ido: IDONEW, index) => (
              <LaunchpadCardNew key={index} ido={ido} />
            ))}
          </div>
        </div>
      </div>

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
