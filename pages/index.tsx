import Image from "next/image";
import Link from "next/link";
import Layout from "@/components/layout";
import { SOCIALS } from "@/utils/constants";
import { useCallback, useEffect, useState } from "react";
import fetchProjects from "./api/projects";
import Card from "@/components/card";
import { Project } from "@/utils/interfaces";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
});

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
          // project.key === "d-etf-second" ||
          project.key === "devvio" ||
          project.key === "onering"
      )
    );
  }, []);

  useEffect(() => {
    getInfos();
  }, []);
  return (
    <Layout>
      <div className="px-20">
        {/* TOP CONTENT */}
        <div className="pt-24 max-w-[750px]">
          <h1 className="text-[58px] font-black leading-[62px] tracking-wide">
            Invest and participate in the most innovative cryptocurrency
            projects.
          </h1>
          <p className={`leading-relaxed pt-4 text-[16px] ${inter.className}`}>
            SamuraiStarter is the leading early-stage crowdfunding platform that
            incentivizes community members to invest and participate in the most
            novel projects in the crypto space
          </p>
          <div className="flex flex-row items-center pt-10 gap-5">
            <button className="bg-[#FF284C] border rounded-[8px] text-white border-[#FF284C] px-8 py-2 transition-all hover:bg-[#FF4E6B] hover:font-medium w-[160px]">
              Launchpad
            </button>
            <button className="border rounded-[8px] border-red-500 px-8 py-2 transition-all text-[#FF4E6B] hover:opacity-80 w-[160px]">
              Incubation
            </button>
          </div>
          <div className="flex items-center gap-16 ml-2 mt-14 text-gray-500">
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
        <div className="flex flex-col mt-24 mb-24 w-full">
          <h2 className="text-4xl">
            Latest <span className="text-samurai-red">Updates</span>
          </h2>
          <div className="flex flex-row gap-10 flex-wrap mt-10">
            {latestupdates.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                target="_blank"
                className="rounded-xl border border-samurai-red/80 shadow-lg shadow-samurai-red/20 hover:shadow-samurai-red/40 max-w-[382px] transition-all hover:scale-[1.03]"
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
                <div className="w-full h-[106px] rounded-b-xl px-3 pt-4 text-black">
                  <h3 className="text-xl font-semibold tracking-wide text-black/80">
                    {item.title}
                  </h3>
                  <p className={`text-sm ${inter.className}`}>
                    {item.description}
                  </p>
                </div>
              </Link>
            ))}
            <Link
              href="https://medium.com/samurai-starter"
              target="_blank"
              className="flex items-center text-samurai-red text-lg font-light hover:underline"
            >
              More +
            </Link>
          </div>
        </div>

        {/* FEATURED PROJECTS */}
        <div className="flex flex-col mt-32 w-full">
          <h2 className="text-4xl">
            Featured <span className="text-samurai-red">Projects</span>
          </h2>
          <div
            className={`font-light text-sm mt-2 inline-flex ${inter.className}`}
          >
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
              className="flex items-center text-samurai-red text-lg font-light hover:underline"
            >
              More +
            </Link>
          </div>
        </div>

        {/* COMMUNITY */}
        <div className="flex flex-col mt-32 w-full">
          <h2 className="text-4xl">
            Samurai <span className="text-samurai-red">Sanka</span>
            <p className="font-light text-[26px] text-white/70">
              Community interaction platform
            </p>
          </h2>
          <div
            className={` text-[16px] mt-2 inline-flex max-w-[600px] ${inter.className}`}
          >
            Begin your Web3 journey with Samurai Sanka! Join thousands of people
            who are participating in fun, interactive games and contests and
            earn rewards for participating on our partners' platforms.
            {/* <Link
              href="https://medium.com/samurai-starter"
              target="_blank"
              className="text-samurai-red text-2xl ml-3 mt-[-7px] transition-all hover:scale-125"
            >
              →
            </Link> */}
          </div>
          <div className="flex flex-row gap-9 flex-wrap mt-10">
            <Link
              href="https://medium.com/samurai-starter"
              target="_blank"
              className="flex items-center font-thin hover:border-samurai-red gap-5 p-5 border rounded-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="46"
                height="46"
                fill="currentColor"
                className="bi bi-rocket-takeoff"
                viewBox="0 0 16 16"
              >
                <path d="M9.752 6.193c.599.6 1.73.437 2.528-.362.798-.799.96-1.932.362-2.531-.599-.6-1.73-.438-2.528.361-.798.8-.96 1.933-.362 2.532Z" />
                <path d="M15.811 3.312c-.363 1.534-1.334 3.626-3.64 6.218l-.24 2.408a2.56 2.56 0 0 1-.732 1.526L8.817 15.85a.51.51 0 0 1-.867-.434l.27-1.899c.04-.28-.013-.593-.131-.956a9.42 9.42 0 0 0-.249-.657l-.082-.202c-.815-.197-1.578-.662-2.191-1.277-.614-.615-1.079-1.379-1.275-2.195l-.203-.083a9.556 9.556 0 0 0-.655-.248c-.363-.119-.675-.172-.955-.132l-1.896.27A.51.51 0 0 1 .15 7.17l2.382-2.386c.41-.41.947-.67 1.524-.734h.006l2.4-.238C9.005 1.55 11.087.582 12.623.208c.89-.217 1.59-.232 2.08-.188.244.023.435.06.57.093.067.017.12.033.16.045.184.06.279.13.351.295l.029.073a3.475 3.475 0 0 1 .157.721c.055.485.051 1.178-.159 2.065Zm-4.828 7.475.04-.04-.107 1.081a1.536 1.536 0 0 1-.44.913l-1.298 1.3.054-.38c.072-.506-.034-.993-.172-1.418a8.548 8.548 0 0 0-.164-.45c.738-.065 1.462-.38 2.087-1.006ZM5.205 5c-.625.626-.94 1.351-1.004 2.09a8.497 8.497 0 0 0-.45-.164c-.424-.138-.91-.244-1.416-.172l-.38.054 1.3-1.3c.245-.246.566-.401.91-.44l1.08-.107-.04.039Zm9.406-3.961c-.38-.034-.967-.027-1.746.163-1.558.38-3.917 1.496-6.937 4.521-.62.62-.799 1.34-.687 2.051.107.676.483 1.362 1.048 1.928.564.565 1.25.941 1.924 1.049.71.112 1.429-.067 2.048-.688 3.079-3.083 4.192-5.444 4.556-6.987.183-.771.18-1.345.138-1.713a2.835 2.835 0 0 0-.045-.283 3.078 3.078 0 0 0-.3-.041Z" />
                <path d="M7.009 12.139a7.632 7.632 0 0 1-1.804-1.352A7.568 7.568 0 0 1 3.794 8.86c-1.102.992-1.965 5.054-1.839 5.18.125.126 3.936-.896 5.054-1.902Z" />
              </svg>

              <span className="text-2xl">Partner Quests</span>
            </Link>
            <Link
              href="https://medium.com/samurai-starter"
              target="_blank"
              className="flex items-center font-thin hover:border-samurai-red gap-5 p-5 border rounded-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="46"
                height="46"
                fill="currentColor"
                className="bi bi-x-diamond"
                viewBox="0 0 16 16"
              >
                <path d="M7.987 16a1.526 1.526 0 0 1-1.07-.448L.45 9.082a1.531 1.531 0 0 1 0-2.165L6.917.45a1.531 1.531 0 0 1 2.166 0l6.469 6.468A1.526 1.526 0 0 1 16 8.013a1.526 1.526 0 0 1-.448 1.07l-6.47 6.469A1.526 1.526 0 0 1 7.988 16zM7.639 1.17 4.766 4.044 8 7.278l3.234-3.234L8.361 1.17a.51.51 0 0 0-.722 0zM8.722 8l3.234 3.234 2.873-2.873c.2-.2.2-.523 0-.722l-2.873-2.873L8.722 8zM8 8.722l-3.234 3.234 2.873 2.873c.2.2.523.2.722 0l2.873-2.873L8 8.722zM7.278 8 4.044 4.766 1.17 7.639a.511.511 0 0 0 0 .722l2.874 2.873L7.278 8z" />
              </svg>

              <span className="text-2xl">$SAM Lottery</span>
            </Link>
            <Link
              href="https://medium.com/samurai-starter"
              target="_blank"
              className="flex items-center font-thin hover:border-samurai-red gap-5 p-5 border rounded-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="46"
                height="46"
                fill="currentColor"
                className="bi bi-sliders2-vertical"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M0 10.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 0-1H3V1.5a.5.5 0 0 0-1 0V10H.5a.5.5 0 0 0-.5.5ZM2.5 12a.5.5 0 0 0-.5.5v2a.5.5 0 0 0 1 0v-2a.5.5 0 0 0-.5-.5Zm3-6.5A.5.5 0 0 0 6 6h1.5v8.5a.5.5 0 0 0 1 0V6H10a.5.5 0 0 0 0-1H6a.5.5 0 0 0-.5.5ZM8 1a.5.5 0 0 0-.5.5v2a.5.5 0 0 0 1 0v-2A.5.5 0 0 0 8 1Zm3 9.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 0-1H14V1.5a.5.5 0 0 0-1 0V10h-1.5a.5.5 0 0 0-.5.5Zm2.5 1.5a.5.5 0 0 0-.5.5v2a.5.5 0 0 0 1 0v-2a.5.5 0 0 0-.5-.5Z"
                />
              </svg>

              <span className="text-2xl">$SAM Prediction Markets</span>
            </Link>
          </div>
        </div>

        {/* SAMURAI EDGE */}
        <div className="flex flex-col mt-32 mb-24 w-full">
          <h2 className="text-4xl">
            The <span className="text-samurai-red">SAMURAI</span> Edge
          </h2>
          <div className="flex flex-wrap mt-10 bg-edge bg-cover bg-no-repeat h-[650px] relative gap-10 pt-8 pb-32">
            {edge.map((item, index) => (
              <div
                key={index}
                className="flex items-center w-[600px] h-[140px] bg-samurai-red  backdrop-blur-[8px] rounded-xl px-5 gap-3 shadow-lg z-10"
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
                  <p
                    className={`text-[16px] leading-tight text-white/70 ${inter.className}`}
                  >
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
