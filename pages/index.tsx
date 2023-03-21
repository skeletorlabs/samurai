import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Layout from "@/components/layout";
import { SOCIALS } from "@/utils/constants";

const latestupdates = [
  {
    title: "Our Vision",
    description: "Community is at the center of everything we do",
    href: "https://medium.com/samurai-starter/samurai-starter-our-vision-d8a01842f564",
  },
  {
    title: "Changex",
    description:
      "Money matters made simple with this DeFi + non-custodial wallet platform",
    href: "https://medium.com/samurai-starter/samurai-starter-presents-changex-fa3468f30427",
  },
  {
    title: "The Samurai Scoop — Vol. 4",
    description: "The launchpad is dead, long live the accelerator pad!",
    href: "https://medium.com/samurai-starter/the-samurai-scoop-vol-4-5bc9bb0be9d3",
  },
  {
    title: "The Samurai Scoop — Vol. 5",
    description:
      "Macro musings, Smart Places, Maya Protocol launch, ve(3,3) and more",
    href: "https://medium.com/samurai-starter/the-samurai-scoop-vol-5-c2e36b944c23",
  },
];

export default function Home() {
  return (
    <Layout>
      <div className="px-20">
        <div className="pt-24 max-w-[850px]">
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

        <div className="flex flex-col my-52 w-full">
          <h2 className="text-4xl">
            Latest <span className="text-samurai-red">Updates</span>
          </h2>
          <div className="flex flex-row gap-10 flex-wrap mt-10 justify-between">
            {latestupdates.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="flex flex-col justify-center w-[300px] h-[160px] border border-neutral-700 rounded-xl p-4 bg-gradient-to-tr from-transparent via-transparent odd:to-neutral-900 even:to-samurai-red/30 transition-all hover:scale-[1.02] hover:border-samurai-red"
              >
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="mt-5 text-md font-thin">{item.description}</p>
              </Link>
            ))}
          </div>
          <Link
            href="#"
            className="flex self-end mt-5 font-thin hover:border-b"
          >
            More +
          </Link>
        </div>
      </div>
    </Layout>
  );
}
