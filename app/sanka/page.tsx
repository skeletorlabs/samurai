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
import Giveaways from "../components/giveaways";

const inter = Inter({
  subsets: ["latin"],
});

export default function Sanka() {
  return (
    <>
      <TopLayout background="bg-samurai-launchpad">
        <div className="flex flex-row justify-between items-center px-6 lg:px-8 xl:px-20 pt-10 lg:pt-24">
          {/* TOP CONTENT */}
          <div className="relative md:mr-12 xl:max-w-[900px]">
            <h1 className="text-[48px] sm:text-[58px] lg:text-[90px] font-black leading-[58px] sm:leading-[68px] lg:leading-[98px] text-white">
              Samurai <span className="text-samurai-red">Sanka</span>
            </h1>
            <p
              className={`leading-normal lg:leading-tight pt-6 lg:text-[4rem] xl:max-w-[900px] tracking-tighter font-light ${inter.className}`}
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
            Recent <span className="text-samurai-red">Giveaways</span>
          </h2>
          <Giveaways />
        </div>
      </div>
    </>
  );
}
