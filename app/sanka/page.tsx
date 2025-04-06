"use client";
import Image from "next/image";
import { Inter } from "next/font/google";
import TopLayout from "@/app/components/topLayout";

import Giveaways from "../components/giveaways";
import Link from "next/link";

const inter = Inter({
  subsets: ["latin"],
});

export default function Sanka() {
  return (
    <>
      <TopLayout background="bg-samurai-sanka">
        <div className="flex flex-row justify-between items-center px-6 lg:px-8 xl:px-14 pt-10">
          {/* TOP CONTENT */}
          <div className="relative md:mr-12 w-full xl:max-w-[900px] text-center lg:text-start">
            <h1 className="text-[48px] sm:text-[58px] lg:text-[90px] font-black leading-[58px] sm:leading-[68px] lg:leading-[98px] text-white">
              Samurai <span className="text-samurai-red">Sanka</span>
            </h1>
            <p
              className={`leading-normal lg:leading-tight pt-6 text-[1.8rem] lg:text-[4rem] xl:max-w-[900px] tracking-tighter font-light ${inter.className}`}
            >
              Earn Samurai Points.
              <br /> Join Giveaways.
              <br /> Win Big.
            </p>
          </div>
          <Image
            src="/samurai-sanka-icon.svg"
            width={350}
            height={350}
            alt="sanka"
            className="rounded-[8px] hidden xl:block opacity-40 xl:opacity-100"
          />
        </div>
      </TopLayout>

      {/* Offerings */}
      <div
        id="participate"
        className="flex flex-col py-10 md:py-20 w-full bg-white/20 border-t-[1px] border-samurai-red/40"
      >
        <div className="flex flex-col px-2 lg:px-8 xl:px-20 text-white">
          <h2 className="text-4xl lg:text-5xl font-bold text-center lg:text-start">
            Recent <span className="text-samurai-red">Giveaways</span>
          </h2>
          <div
            className={`lg:text-lg mt-2 inline-flex justify-center lg:justify-start ${inter.className}`}
          >
            Check out our Amplifi Deep-Dive{" "}
            <Link
              href="#"
              className="text-samurai-red text-3xl ml-3 mt-[-7px] transition-all hover:scale-125"
              target="_blank"
              rel="noopener noreferrer"
            >
              →
            </Link>
          </div>
          <Giveaways ids={[2]} />
        </div>
      </div>
    </>
  );
}
