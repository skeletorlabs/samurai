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
import { telegram } from "../utils/svgs";

const inter = Inter({
  subsets: ["latin"],
});

const portfolio = [
  "/ventures/1.png",
  "/ventures/2.png",
  "/ventures/3.png",
  "/ventures/4.png",
  "/ventures/5.png",
  "/ventures/6.svg",
  "/ventures/7.png",
  "/ventures/8.png",
  "/ventures/9.png",
  "/ventures/10.png",
  "/ventures/11.png",
  "/ventures/12.png",
];

export default function Ventures() {
  return (
    <>
      <TopLayout background="bg-samurai-incubator">
        <>
          <div className="flex flex-row justify-between items-center px-6 lg:px-8 xl:px-20 pt-10 lg:pt-24 bg-transparent sm:bg-black/60 2xl:bg-transparent">
            {/* TOP CONTENT */}
            <div className="relative md:mr-12 xl:max-w-[1000px]">
              <h1 className="text-[48px] sm:text-[58px] lg:text-[90px] font-black leading-[58px] sm:leading-[68px] lg:leading-[98px] text-white">
                Access{" "}
                <span className="font-bold text-samurai-red">early-round</span>{" "}
                token opportunities in the{" "}
                <span className="font-bold text-samurai-red">hottest</span>{" "}
                projects in{" "}
                <span className="font-bold text-samurai-red">crypto</span>.
              </h1>
            </div>
            <Image
              src="/services/samurai-service-strategy.svg"
              width={450}
              height={450}
              alt="incubation"
              className="rounded-[8px] hidden xl:block opacity-40 xl:opacity-100"
            />
          </div>
        </>
      </TopLayout>

      {/* JOIN */}
      <div
        id="lock"
        className="flex flex-col pt-10 md:pt-20  w-full bg-white/10 border-t border-samurai-red/50 border-dotted relative"
      >
        <div className="flex flex-col text-white">
          <div className="flex flex-col text-white text-2xl pb-20">
            <div className="flex flex-col lg:flex-row w-full justify-between gap-8 px-6 lg:px-8 xl:px-20">
              <p className="font-bold text-3xl md:text-5xl md:pb-2 text-center md:text-start">
                How to join <span className="text-samurai-red">Samurai</span>{" "}
                Ventures
              </p>
            </div>
            <p
              className={`text-lg text-neutral-300 pt-4 max-w-[820px] px-6 lg:px-8 xl:px-20  text-center md:text-start ${inter.className}`}
            >
              Stake <span className="text-samurai-red">500k $SAM</span> or
              provide an equivalent amount of LP on{" "}
              <span className="text-samurai-red">Aerodrome Finance</span> to
              gain access to our{" "}
              <span className="text-samurai-red">private</span> Samurai Ventures
              Telegram group.
            </p>

            <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-7 py-8 pt-12 px-6 lg:px-8 xl:px-20">
              <SSButton isLink href="/tokens" mobile>
                Lock $SAM
              </SSButton>
              <SSButton
                secondary
                isLink
                href="https://aerodrome.finance/deposit?token0=0x4200000000000000000000000000000000000006&token1=0xed1779845520339693CDBffec49a74246E7D671b&type=-1"
                target="blank"
                mobile
              >
                Provide WETH/SAM LP
              </SSButton>
            </div>
            <p
              className={`text-[16px] text-neutral-300 max-w-[820px] px-6 lg:px-8 xl:px-20`}
            >
              Contact our team on{" "}
              <Link
                href={
                  SOCIALS.find((social) => social.svg === telegram)?.href || ""
                }
                className="text-samurai-red underline hover:opacity-70"
              >
                Telegram
              </Link>{" "}
              to gain access today.
            </p>
          </div>
        </div>
      </div>

      {/* PORTFOLIO */}
      <div
        id="lock"
        className="flex flex-col pt-10 md:pt-20 pb-10 w-full bg-white/5 border-t border-samurai-red/50 border-dotted relative"
      >
        <div className="flex flex-col text-white">
          <div className="flex flex-col text-white text-2xl pb-20">
            <div className="flex flex-col lg:flex-row w-full justify-between gap-8 px-6 lg:px-8 xl:px-20">
              <p className="font-bold text-3xl md:text-5xl md:pb-2 text-center md:text-start mb-10">
                Samurai <span className="text-samurai-red">Ventures</span>{" "}
                Portfolio
              </p>
            </div>
            <div className="pt-4 px-6 lg:px-8 xl:px-20">
              <div className="flex items-center flex-wrap gap-5">
                {portfolio.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-center items-center p-4 rounded-lg transition-all bg-white/30 hover:bg-samurai-red hover:scale-105 w-[300px] h-[100px] border border-neutral-400 hover:border-none"
                  >
                    <Image
                      src={item}
                      width={200}
                      height={200}
                      alt={`portfolio item ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
