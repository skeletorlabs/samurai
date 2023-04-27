import Link from "next/link";
import Layout from "@/components/layout";
import { SOCIALS } from "@/utils/constants";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
});

export default function Incubation() {
  return (
    <Layout>
      <div className="px-6 lg:px-8 xl:px-20">
        {/* TOP CONTENT */}
        <div className="pt-10 lg:pt-24 lg:max-w-[750px] lg:h-[630px]">
          <h1 className="text-[58px] lg:text-[68px] font-black leading-[62px] tracking-wide">
            Accelerating your project from ideation to token launch and beyond.
          </h1>
          <p className={`leading-normal pt-4 text-2xl ${inter.className}`}>
            Committed to advising, guiding and incubating the most novel and
            innovative platforms in the Web3 space no matter which stage of
            platform launch you have reached.
          </p>
          <div className="flex flex-col lg:flex-row items-center pt-10 gap-5 z-20">
            <button className="bg-[#FF284C] border rounded-2xl border-[#e2d4d6] px-8 h-14 text-lg transition-all hover:bg-black/90 hover:text-white hover:border-white w-full lg:w-[190px]">
              Get Started
            </button>
          </div>
        </div>

        {/* LATEST UPDATES */}
        <div className="flex flex-col pt-20 pb-10 w-full bg-neutral-900/50">
          <h2 className="text-6xl font-bold">
            Token <span className="text-samurai-red">Launch</span>
          </h2>
          <div
            className={`mt-3 leading-normal pt-4 text-2xl ${inter.className}`}
          >
            Having supported over 60 projects with their token launches, Samurai
            Launchpad is well-positioned to support your token launch. Whether
            you are raising on seed, private, or public rounds, our vibrant
            community is eager to accelerate your project.
          </div>

          <Link
            href="/launchpad"
            className="flex items-center self-end bg-white text-samurai-red border rounded-2xl border-samurai-red px-8 h-14 text-lg transition-all hover:bg-black/90 hover:text-white hover:border-white w-full lg:w-[230px]"
          >
            Apply to Launchpad
          </Link>
        </div>
      </div>
    </Layout>
  );
}
