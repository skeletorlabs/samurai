import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Layout from "@/components/layout";
import { SOCIALS } from "@/utils/constants";

export default function Home() {
  return (
    <Layout>
      <div className="h-[1020px] bg-art bg-no-repeat bg-[center_top_-3rem]">
        <div className="px-20 pt-24 max-w-[850px]">
          <h1 className="text-[58px] font-black leading-[62px] tracking-wide">
            Invest and participate in the most innovative cryptocurrency
            projects.
          </h1>
          <p className="leading-relaxed pt-4 font-thin text-[18px]">
            SamuraiStarter is the leading early-stage crowdfunding platform that
            incentivizes community members to invest and participate in the most
            novel projects in the crypto space
          </p>
          <div className="flex flex-row items-center pt-10 gap-5">
            <button className="bg-[#FF284C] border rounded-[8px] border-[#FF284C] px-8 py-2 font-light transition-all hover:bg-[#FF4E6B] hover:text-black hover:font-medium w-[160px]">
              Launchpad
            </button>
            <button className="border rounded-[8px] border-red-500 px-8 py-2 font-light transition-all hover:bg-[#FF4E6B] hover:text-black hover:font-medium w-[160px]">
              Incubation
            </button>
          </div>
          <div className="flex items-center gap-16 ml-2 mt-14">
            {SOCIALS.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="scale-150 transition-all hover:opacity-70"
                target="_blank"
              >
                {item.svg}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
