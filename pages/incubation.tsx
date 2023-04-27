import Link from "next/link";
import Image from "next/image";
import LayoutClean from "@/components/layoutClean";
import { SOCIALS } from "@/utils/constants";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
});

export default function Incubation() {
  const services = [
    {
      title: "Fundraising",
      description:
        "We leverage our ever-growing network of well-established venture capital firms and launchpads to help our partners raise the funds necessary to get their projects off the ground in a strong financial position.",
    },
    {
      title: "Strategy",
      description:
        "We apply our expertise in advising projects on step-by-step strategies for growing their business. From project ideation, through fundraising and platform launch, our partners leverage our expertise to develop global strategies.",
    },
    {
      title: "Business Development",
      description:
        "We connect you to the highest value-add partners in the web3 space. If you need developers, market makers, CEX listings, auditors and other strategic partners, we connect you to the best in the business.",
    },
    {
      title: "Marketing",
      description:
        "Spreading the word to reach new audiences is critical in the web3 space. We help deliver your marketing communications to a global audience through our in-house socials, our PR branch, and other marketing partners.",
    },
    {
      title: "Community Building",
      description:
        "Samurai Starter investors are incentivized to not only invest money, but also time into early-stage web3 projects. Our Samurai Sanka platform incentivizes active platform participation.",
    },
    {
      title: "Content Creation",
      description:
        "Need a cutting edge designs to attract attention to your project or long-form articles to keep your audience engaged? Our team of graphic design and writing professionals leverage their expertise to suit your needs.",
    },
  ];

  enum bg {
    light,
    dark,
  }

  const portfolio = [
    {
      image: "/portfolio/changex.svg",
      width: 200,
      height: 200,
      color: bg.light,
    },
    {
      image: "/portfolio/onering.svg",
      width: 400,
      height: 400,
      color: bg.dark,
    },
    {
      image: "/portfolio/acreworld.svg",
      width: 180,
      height: 200,
      color: bg.light,
    },
    { image: "/portfolio/nfty.svg", width: 300, height: 200, color: bg.dark },
    {
      image: "/portfolio/roguewest.svg",
      width: 200,
      height: 200,
      color: bg.dark,
    },
    {
      image: "/portfolio/smartplaces.svg",
      width: 300,
      height: 200,
      color: bg.light,
    },
    {
      image: "/portfolio/buktechnology.svg",
      width: 300,
      height: 200,
      color: bg.dark,
    },
    {
      image: "/portfolio/inwariumonline.svg",
      width: 200,
      height: 200,
      color: bg.dark,
    },
    {
      image: "/portfolio/rewater.svg",
      width: 300,
      height: 200,
      color: bg.dark,
    },
    {
      image: "/portfolio/alterverse.svg",
      width: 200,
      height: 200,
      color: bg.dark,
    },
    {
      image: "/portfolio/thepiece.svg",
      width: 300,
      height: 200,
      color: bg.light,
    },
  ];

  const partners = [
    { title: "Polygon", color: "bg-purple-700" },
    { title: "OKX Chain", color: "bg-black/70" },
    { title: "BNB Chain", color: "bg-yellow-600" },
    { title: "Avalanche", color: "bg-red-500" },
    { title: "Fantom", color: "bg-blue-500" },
    { title: "SupraOracles", color: "bg-red-600" },
    { title: "Syscoin", color: "bg-blue-600" },
    { title: "Cherry Network", color: "bg-red-600" },
    { title: "Boba Network", color: "bg-green-400" },
    { title: "Gate Labs", color: "bg-black" },
  ];
  return (
    <LayoutClean>
      <div className="px-6 lg:px-8 xl:px-20">
        {/* TOP CONTENT */}
        <div className="pt-10 lg:pt-24">
          <h1 className="text-[38px] lg:text-[58px] font-black leading-[48px] lg:leading-[68px]">
            Accelerating your project from ideation to token launch and beyond.
          </h1>
          <p className={`leading-normal pt-4 lg:text-xl ${inter.className}`}>
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
      </div>

      {/* TOKEN LAUNCH */}
      <div className="flex flex-col pt-10 md:pt-20 pb-10 w-full bg-white border-t border-b border-samurai-red mt-20">
        <div className="flex flex-col px-6 lg:px-8 xl:px-20 text-black">
          <h2 className="text-4xl lg:text-5xl font-bold">
            Token <span className="text-samurai-red">Launch</span>
          </h2>
          <div
            className={`mt-3 leading-normal pt-4 text-xl ${inter.className}`}
          >
            Having supported over 60 projects with their token launches, Samurai
            Launchpad is well-positioned to support your token launch. Whether
            you are raising on seed, private, or public rounds, our vibrant
            community is eager to accelerate your project.
          </div>

          <Link
            href="https://medium.com/samurai-starter"
            target="_blank"
            className={`flex justify-end items-center mt-8 text-lg text-samurai-red hover:text-samurai-red/70 font-light ${inter.className}`}
          >
            Apply to launchpad →
          </Link>
        </div>
      </div>

      {/* SERVICES */}
      <div className="flex flex-col pt-10 md:pt-20 pb-10 w-full bg-slate-200">
        <div className="flex flex-col px-6 lg:px-8 xl:px-20 text-black">
          <h2 className="text-4xl lg:text-5xl font-bold">
            <span className="text-samurai-red">Samurai</span> Services
          </h2>
          <div
            className={`grid lg:grid-cols-3 gap-10 leading-normal pt-10 xl:pt-16 text-xl ${inter.className}`}
          >
            {services.map((service, index) => (
              <div
                key={index}
                className="flex flex-col gap-2 bg-white/50 border border-samurai-red/50 p-5 rounded-xl shadow-lg"
              >
                <span className="font-bold text-2xl text-black/70">
                  {service.title}
                </span>
                <p className="text-[16px] text-neutral-800">
                  {service.description}
                </p>
              </div>
            ))}
          </div>

          <Link
            href="https://medium.com/samurai-starter"
            target="_blank"
            className={`flex justify-end items-center mt-8 text-lg text-samurai-red hover:text-samurai-red/70 font-light ${inter.className}`}
          >
            Apply to launchpad →
          </Link>
        </div>
      </div>

      {/* PORTFOLIO */}
      <div className="flex flex-col pt-10 md:pt-20 pb-10 w-full bg-slate-300 border-t border-black/20">
        <div className="flex flex-col px-6 lg:px-8 xl:px-20 text-black">
          <h2 className="text-4xl lg:text-5xl font-bold">
            <span className="text-samurai-red">P</span>ortfolio
          </h2>
          <div
            className={`flex md:justify-center items-center flex-wrap gap-10 leading-normal pt-10 xl:pt-16 text-xl ${inter.className}`}
          >
            {portfolio.map((item, index) => (
              <div
                key={index}
                className={`flex justify-center items-center rounded-full w-[200px] h-[200px] lg:w-[300px] lg:h-[300px] p-10 transition-all hover:scale-105 ${
                  item.color === bg.dark ? "bg-black" : "bg-white"
                } hover:shadow-xl`}
              >
                <Image
                  src={item.image}
                  width={item.width}
                  height={item.height}
                  alt=""
                />
              </div>
            ))}
          </div>

          <Link
            href="https://medium.com/samurai-starter"
            target="_blank"
            className={`flex justify-end items-center mt-8 text-lg text-samurai-red hover:text-samurai-red/70 font-light ${inter.className}`}
          >
            Apply to launchpad →
          </Link>
        </div>
      </div>

      {/* TEAM */}
      <div className="flex flex-col pt-10 md:pt-20 pb-10 w-full bg-black border-t border-black/20">
        <div className="flex flex-col px-6 lg:px-8 xl:px-20">
          <h2 className="text-4xl lg:text-5xl font-bold">
            <span className="text-samurai-red">T</span>eam
          </h2>
          <div
            className={`flex md:justify-center items-center flex-wrap gap-10 leading-normal pt-10 xl:pt-16 text-xl ${inter.className}`}
          ></div>

          <Link
            href="https://medium.com/samurai-starter"
            target="_blank"
            className={`flex justify-end items-center mt-8 text-lg text-samurai-red hover:text-samurai-red/70 font-light ${inter.className}`}
          >
            Apply to launchpad →
          </Link>
        </div>
      </div>

      {/* PARTNERS */}
      <div className="flex flex-col pt-10 md:pt-20 pb-10 w-full bg-slate-300 border-t border-black/20">
        <div className="flex flex-col px-6 lg:px-8 xl:px-20 text-black">
          <h2 className="text-4xl lg:text-5xl font-bold">
            Our <span className="text-samurai-red">Partners</span>
          </h2>
          <div
            className={`flex items-center flex-wrap gap-5 leading-normal pt-10 xl:pt-16 text-xl ${inter.className}`}
          >
            {partners.map((item, index) => (
              <div
                key={index}
                className={`flex justify-center items-center bg-black py-5 px-10 rounded-[8px] text-white text-2xl ${item.color}`}
              >
                {item.title}
              </div>
            ))}
          </div>

          <Link
            href="https://medium.com/samurai-starter"
            target="_blank"
            className={`flex justify-end items-center mt-8 text-lg text-samurai-red hover:text-samurai-red/70 font-light ${inter.className}`}
          >
            Apply to launchpad →
          </Link>
        </div>
      </div>

      {/* CONTACT */}
      <div className="flex flex-col pt-10 md:pt-20 pb-10 w-full bg-black border-t border-black/20">
        <div className="flex flex-col px-6 lg:px-8 xl:px-20">
          <h2 className="text-4xl lg:text-5xl font-bold">
            <span className="text-samurai-red">Contact</span> Us
          </h2>
          <div
            className={`flex items-center flex-wrap gap-10 leading-normal pt-10 xl:pt-16 text-xl ${inter.className}`}
          >
            <div className="flex flex-col p-10 gap-5  bg-slate-300 w-[600px] rounded-2xl relative">
              <svg
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                className="hidden xl:block absolute right-[-600px] top-24 w-[400px]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.839 2.51l-4.66-2.51m0 0l-1.023-.55a2.25 2.25 0 00-2.134 0l-1.022.55m0 0l-4.661 2.51m16.5 1.615a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V8.844a2.25 2.25 0 011.183-1.98l7.5-4.04a2.25 2.25 0 012.134 0l7.5 4.04a2.25 2.25 0 011.183 1.98V19.5z"
                ></path>
              </svg>
              <p className="flex flex-col text-black text-sm gap-2 font-bold">
                <span>Name:</span>
                <input
                  type="text"
                  className="bg-white p-4 text-xl outline-none"
                />
              </p>
              <p className="flex flex-col text-black text-sm gap-2 font-bold">
                <span>Email:</span>
                <input
                  type="text"
                  className="bg-white p-4 text-xl outline-none"
                />
              </p>
              <p className="flex flex-col text-black text-sm gap-2 font-bold">
                <span>Subject:</span>
                <input
                  type="text"
                  className="bg-white p-4 text-xl outline-none"
                />
              </p>
              <p className="flex flex-col text-black text-sm gap-2 font-bold">
                <span>Message:</span>
                <textarea className="bg-white p-4 text-xl h-[200px] outline-none" />
              </p>
              <div className="h-[0.5px] w-full px-5">
                <div className="w-full h-full  bg-black" />
              </div>
              <button className="bg-[#FF284C] border rounded-2xl border-[#e2d4d6] px-8 h-14 text-lg transition-all hover:bg-black/90 hover:text-white hover:border-white w-full">
                Send
              </button>
            </div>
          </div>

          <Link
            href="https://medium.com/samurai-starter"
            target="_blank"
            className={`flex justify-end items-center mt-8 text-lg text-samurai-red hover:text-samurai-red/70 font-light ${inter.className}`}
          >
            Apply to launchpad →
          </Link>
        </div>
      </div>
    </LayoutClean>
  );
}

// paul@samuraistarter.com, projects@samuraistarter.com
