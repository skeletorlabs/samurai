import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Layout from "@/components/layout";
import { SOCIALS } from "@/utils/constants";
import { useCallback, useEffect, useState } from "react";
import fetchProjects from "./api/projects";
import Card from "@/components/card";
import { Project } from "@/utils/interfaces";

const latestupdates = [
  {
    title: "The Samurai Scoop — Vol. 5",
    description:
      "Macro musings, Smart Places, Maya Protocol launch, ve(3,3) and more",
    href: "https://medium.com/samurai-starter/the-samurai-scoop-vol-5-c2e36b944c23",
    image: "/scoop.png",
  },
  {
    title: "Introducing Changex",
    description:
      "Money matters made simple with this DeFi + non-custodial wallet platform",
    href: "https://medium.com/samurai-starter/samurai-starter-presents-changex-fa3468f30427",
    image: "/changex.png",
  },
  {
    title: "Our Vision",
    description: "Community is at the center of everything we do",
    href: "https://medium.com/samurai-starter/samurai-starter-our-vision-d8a01842f564",
    image: "/vision.png",
  },
];

const edge = [
  {
    title: "High Quality Projects",
    description:
      "Our projects are vetted with the highest standard due diligence processes that are backed by some of the leading verification services in the crypto industry.",
    image: "/quality.png",
  },
  {
    title: "Equal investment opportunities for all",
    description:
      "No more investment tiers! Every SamNFT holder has the opportunity to participate in crowdfunding rounds with max allocation regardless of whale status.",
    image: "/investment.png",
  },
  {
    title: "Cashback rewards",
    description:
      "SamuraiStarter is the first launchpad to offer cashback rewards for participating in token offerings through our $SAM token.",
    image: "/rewards.png",
  },
  {
    title: "DeFi yield farming mechanisms",
    description:
      "Use earned $SAM tokens to provide $SAM-$ETH  liquidity on https://www.ramses.exchange for outstanding ve(3,3) powered yield farming opportunities.",
    image: "/farm.png",
  },
  {
    title: "Samurai Sanka community interaction platform",
    description:
      "Participate in entertaining games and contests through SamuraiStarter and interact with our partner’s platforms to earn partner native tokens and even more $SAM rewards.",
    image: "/people.png",
  },
];

export default function Home() {
  const [featured, setFeatured] = useState<Project[] | []>([]);
  const getInfos = useCallback(async () => {
    const projects = await fetchProjects();
    setFeatured(
      projects.filter(
        (project) =>
          project.key === "maya" ||
          project.key === "d-etf-second" ||
          project.key === "devvio" ||
          project.key === "onering"
      )
    );
  }, []);

  console.log(featured);

  useEffect(() => {
    getInfos();
  }, []);
  return (
    <Layout>
      <div className="px-20">
        {/* TOP CONTENT */}
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

        {/* LATEST UPDATES */}
        <div className="flex flex-col mt-52 mb-24 w-full">
          <h2 className="text-4xl">
            Latest <span className="text-samurai-red">Updates</span>
          </h2>
          <div className="flex flex-row gap-10 flex-wrap mt-10">
            {latestupdates.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                target="_blank"
                className="rounded-xl border border-neutral-700  hover:border-samurai-red hover:shadow-xl hover:shadow-white/10 max-w-[382px] transition-all hover:scale-[1.03]"
              >
                <div className="w-[380px] h-[130px] relative">
                  <Image
                    src={item.image}
                    fill
                    sizes="(max-width: 768px) 100vw,
                    (max-width: 1200px) 50vw,
                    33vw"
                    className="rounded-t-xl"
                    alt=""
                  />
                </div>
                <div className="w-full h-[116px] bg-neutral-900 rounded-b-xl px-3 pt-4 text-white">
                  <h3 className="text-xl font-semibold text-red-400">
                    {item.title}
                  </h3>
                  <p className="text-md font-thin mt-2">{item.description}</p>
                </div>
              </Link>
            ))}
            <Link
              href="https://medium.com/samurai-starter"
              target="_blank"
              className="flex items-center text-lg font-thin hover:underline"
            >
              More +
            </Link>
          </div>
        </div>

        {/* FEATURED PROJECTS */}
        <div className="flex flex-col mt-52 mb-52 w-full">
          <h2 className="text-4xl">
            Featured <span className="text-samurai-red">Projects</span>
          </h2>
          <div className="font-thin text-sm mt-2 inline-flex">
            Learn how to participate{" "}
            <Link
              href="https://medium.com/samurai-starter"
              target="_blank"
              className="text-samurai-red text-2xl ml-3 mt-[-7px] transition-all hover:scale-125"
            >
              →
            </Link>
          </div>
          <div className="flex flex-row gap-9 flex-wrap mt-10">
            {featured.map((item, index) => (
              <Card key={index} project={item} />
            ))}
            <Link
              href="https://medium.com/samurai-starter"
              target="_blank"
              className="flex items-center text-lg font-thin hover:underline"
            >
              More +
            </Link>
          </div>
        </div>

        {/* SAMURAI EDGE */}
        <div className="flex flex-col mt-52 mb-24 w-full">
          <h2 className="text-4xl">
            The <span className="text-samurai-red">SAMURAI</span> Edge
          </h2>
          <div className="flex flex-wrap mt-10 bg-edge w-full h-[650px] relative gap-10 pl-10 pt-8 pb-32">
            {edge.map((item, index) => (
              <div
                key={index}
                className="flex items-center w-[600px] h-[140px] bg-black bg-opacity-10 backdrop-blur-[8px] rounded-xl px-5 gap-3 shadow-lg z-10"
              >
                <div className="relative min-w-[68px] min-h-[68px] max-w-[68px] max-h-[68px] w-full opacity-80">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="68px"
                    className="drop-shadow-xl"
                  />
                </div>

                <div className="flex flex-col">
                  <span className="font-bold text-xl">{item.title}</span>
                  <p className="font-light text-[16px] leading-tight">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
