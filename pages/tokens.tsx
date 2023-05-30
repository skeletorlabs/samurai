import Link from "next/link";
import Image from "next/image";
import LayoutClean from "@/components/layoutClean";
import { Inter } from "next/font/google";
import { useCallback, useState } from "react";
import { rocket, telegram, linkedin } from "@/utils/svgs";
import SSButton from "@/components/ssButton";

const inter = Inter({
  subsets: ["latin"],
});

enum bg {
  light,
  dark,
}

const applyToLaunchpad = (
  <div className="flex justify-end mt-8">
    <Link
      href="/launchpad"
      className={`items-center text-lg text-samurai-red hover:text-samurai-red/70 font-light ${inter.className}`}
    >
      Apply to launchpad →
    </Link>
  </div>
);

export default function Tokens() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [mailSent, setMailSent] = useState(false);

  const services = [
    {
      title: "Fundraising",
      description:
        "We leverage our ever-growing network of well-established venture capital firms and launchpads to help our partners raise the funds necessary to get their projects off the ground in a strong financial position.",
      color: bg.dark,
      src: "/services/samurai-service-funding.svg",
    },
    {
      title: "Strategy",
      description:
        "We apply our expertise in advising projects on step-by-step strategies for growing their business. From project ideation, through fundraising and platform launch, our partners leverage our expertise to develop global strategies.",
      color: bg.light,
      src: "/services/samurai-service-strategy.svg",
    },
    {
      title: "Business Development",
      description:
        "We connect you to the highest value-add partners in the web3 space. If you need developers, market makers, CEX listings, auditors and other strategic partners, we connect you to the best in the business.",
      color: bg.dark,
      src: "/services/samurai-service-business.svg",
    },
    {
      title: "Marketing",
      description:
        "Spreading the word to reach new audiences is critical in the web3 space. We help deliver your marketing communications to a global audience through our in-house socials, our PR branch, and other marketing partners.",
      color: bg.light,
      src: "/services/samurai-service-marketing.svg",
    },
    {
      title: "Community Building",
      description:
        "Samurai Starter investors are incentivized to not only invest money, but also time into early-stage web3 projects. Our Samurai Sanka platform incentivizes active platform participation.",
      color: bg.dark,
      src: "/services/samurai-service-community.svg",
    },
    {
      title: "Content Creation",
      description:
        "Need a cutting edge designs to attract attention to your project or long-form articles to keep your audience engaged? Our team of graphic design and writing professionals leverage their expertise to suit your needs.",
      color: bg.light,
      src: "/services/samurai-service-content.svg",
    },
  ];

  const portfolio = [
    {
      image: "/portfolio/changex.svg",
      width: 200,
      height: 200,
      color: bg.light,
    },
    {
      image: "/portfolio/onering.svg",
      width: 200,
      height: 200,
      color: bg.dark,
    },
    {
      image: "/portfolio/acreworld.svg",
      width: 100,
      height: 100,
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
      color: bg.light,
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
    {
      image: "/portfolio/metacourt.svg",
      width: 200,
      height: 200,
      color: bg.light,
    },
    {
      image: "/portfolio/almazeus.svg",
      width: 200,
      height: 200,
      color: bg.light,
    },
  ];

  const team = [
    {
      src: "/team/avatar1.svg",
      name: "Paul Osmond - CEO",
      nickname: "HamNcheese",
      linkedin: "https://www.linkedin.com/in/paul-osmond-53381b179/",
      telegram: "https://t.me/runningtrips",
    },
    {
      src: "/team/avatar0.svg",
      name: "Lucas Silviera - CTO",
      nickname: "Skeletor",
      linkedin: "",
      telegram: "https://t.me/skeletor_keldor",
    },
    {
      src: "/team/avatar2.svg",
      name: "Chadagorn - RA",
      nickname: "The Chad",
      linkedin: "",
      telegram: "",
    },
  ];

  const partnersLogos = [
    { src: "/partners/polygon.svg", color: bg.light },
    { src: "/partners/okx.svg", color: bg.dark },
    { src: "/partners/bsc.svg", color: bg.light },
    { src: "/partners/avalanche.svg", color: bg.dark },
    { src: "/partners/fantom.svg", color: bg.light },
    { src: "/partners/supra.svg", color: bg.light },
    { src: "/partners/syscoin.svg", color: bg.light },
    { src: "/partners/cherry.svg", color: bg.light },
    { src: "/partners/boba.svg", color: bg.dark },
    { src: "/partners/gatelabs.svg", color: bg.light },
    { src: "/partners/dedaub.svg", color: bg.light },
    { src: "/partners/kucoin.svg", color: bg.dark },
    { src: "/partners/mempool.svg", color: bg.light },
    { src: "/partners/slance.svg", color: bg.light },
    { src: "/partners/throne.svg", color: bg.dark },
    { src: "", color: bg.dark },
  ];

  const handleSubmit = useCallback(
    async (e: any) => {
      e.preventDefault();
      setLoading(true);

      const data = {
        name,
        email,
        subject,
        message,
      };

      const result = await fetch("/api/mail", {
        method: "post",
        body: JSON.stringify(data),
      });

      setLoading(false);
      if (result.ok) {
        setMailSent(true);
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");

        const interval = setInterval(() => {
          setMailSent(false);
          clearInterval(interval);
        }, 4000);
      }
    },
    [name, email, subject, message]
  );

  return (
    <LayoutClean>
      <div className="px-6 lg:px-8 xl:px-20">
        {/* TOP CONTENT */}
        <div className="pt-10 lg:pt-24 relative">
          <Image
            src="/samurai.svg"
            alt="tokens"
            width={100}
            height={100}
            className="hidden xl:block absolute top-32 right-[40px] w-[200px]"
          />

          <h1 className="text-[38px] lg:text-[58px] font-black leading-[48px] lg:leading-[68px] xl:max-w-[900px] text-samurai-red ">
            <span className="text-white">Lorem</span> Ipsum
          </h1>
          <p
            className={`leading-normal pt-6 lg:text-xl xl:max-w-[900px] ${inter.className}`}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque
            venenatis nec elit non dictum. Quisque non lorem consectetur, varius
            erat vitae, vehicula nulla. Donec quis tellus dolor.Pellentesque
            habitant morbi tristique senectus et netus et malesuada fames ac
            turpis egestas.
          </p>
          <div className="flex flex-col lg:flex-row items-center pt-16 gap-5 z-20">
            <SSButton isLink href="#contact">
              Get Started
            </SSButton>
          </div>
        </div>
      </div>

      {/* STAKING */}
      <div className="flex flex-col pt-10 md:pt-20 pb-10 mt-20 w-full bg-white/5 border-t-[1px] border-samurai-red">
        <div className="flex flex-col px-6 lg:px-8 xl:px-20 text-white">
          <div className="flex flex-col text-white text-2xl pb-20">
            <div className="flex items-end gap-8 pb-10">
              <Image src="/samurai.svg" width={90} height={90} alt="" />
              <p className="font-bold text-5xl pb-2">
                My <span className="text-samurai-red">$CFI</span> Token
              </p>
            </div>

            <div
              className={`grid grid-flow-col leading-normal mt-10 py-10 text-2xl border-[0.5px] border-samurai-red rounded-xl`}
            >
              <div></div>
              <div className="flex flex-col">
                <span className={`text-neutral-400 ${inter.className}`}>
                  My Stake
                </span>
                <span className="text-4xl pb-1">123.99 $CFI</span>
                <span className="text-samurai-red text-xl">
                  99.99 $CFI-WETH LP
                </span>
              </div>

              <div className="flex flex-col text-center">
                <span className={`text-neutral-400 ${inter.className}`}>
                  $SAM Cashback
                </span>
                <span className="text-4xl">1%</span>
              </div>

              <div className="flex flex-col text-right">
                <span className={`text-neutral-400 ${inter.className}`}>
                  My Earnings
                </span>
                <span className="text-4xl">500 $SAM</span>
              </div>

              <div></div>
            </div>

            <div
              className={`grid lg:grid-cols-2 gap-10 leading-normal pt-10 xl:pt-16 text-xl ${inter.className}`}
            >
              <div className="flex flex-col text-center bg-black h-[300px] text-white border-[0.5px] border-samurai-red p-8 rounded-xl shadow-lg">
                <div className="flex justify-center pb-3">
                  <Image
                    src="/chain-logos/ethereum.svg"
                    width={90}
                    height={90}
                    alt=""
                    className="border-2 border-samurai-red rounded-full"
                  />
                </div>
                <span className={`font-bold text-2xl ${inter.className}`}>
                  $CFI (Ethereum)
                </span>
                <div className="flex justify-between items-center border-t-[0.5px] border-neutral-600 mt-6 pt-6">
                  <Link
                    href="https://etherscan.io/address/0x63b4f3e3fa4e438698ce330e365e831f7ccd1ef4"
                    className="text-[16px] border-b transition-all hover:border-samurai-red hover:text-samurai-red"
                  >
                    Token and LP contract
                  </Link>
                  <div className="w-32">
                    <SSButton
                      isLink
                      href="https://samuraistarter.com/projects/cfi-stake"
                    >
                      Stake
                    </SSButton>
                  </div>
                </div>
              </div>
              <div className="flex flex-col text-center  h-[300px] text-white border-[0.5px] border-samurai-red p-8 rounded-xl shadow-lg">
                <div className="flex justify-center pb-3">
                  <Image
                    src="/chain-logos/arbitrum.svg"
                    width={90}
                    height={90}
                    alt=""
                    className="border-2 border-samurai-red rounded-full"
                  />
                </div>
                <span className={`font-bold text-2xl ${inter.className}`}>
                  $CFI (Arbitrum)
                </span>
                <div className="flex justify-between items-center border-t-[0.5px] border-neutral-600 mt-6 pt-6">
                  <Link
                    href="https://etherscan.io/address/0x63b4f3e3fa4e438698ce330e365e831f7ccd1ef4"
                    className="text-[16px] border-b transition-all hover:border-samurai-red hover:text-samurai-red"
                  >
                    Token and LP contract
                  </Link>
                  <div className="w-32">
                    <SSButton
                      isLink
                      href="https://samuraistarter.com/projects/cfi-stake"
                    >
                      Stake
                    </SSButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SAM */}
      <div className="flex justify-between w-full bg-white/10 border-t-[1px] border-samurai-red">
        <div className="flex flex-col items-center text-center text-white w-full py-10 md:py-20">
          <h2 className="text-4xl lg:text-5xl font-bold">
            <span className="text-samurai-red">$SAM</span> Token
          </h2>
          <div
            className={`flex flex-col leading-normal pt-10 xl:pt-16 text-2xl ${inter.className}`}
          >
            <span className={`text-neutral-400 ${inter.className}`}>
              My $SAM earnings:
            </span>
            <span className="text-5xl pb-1 text-green-200">123.99</span>
          </div>
          <div
            className={`flex flex-col leading-normal pt-10 text-2xl ${inter.className}`}
          >
            <span className={`text-neutral-400 ${inter.className}`}>
              Pending $SAM Rewards:
            </span>
            <span className="text-5xl pb-1 text-orange-200">123.99</span>
          </div>
          <div className="pt-20">
            <SSButton>Claim $SAM Rewards</SSButton>
          </div>
        </div>
        <div className="flex flex-col items-center text-center text-white w-full bg-black/20 py-10 md:py-20">
          <h2 className="text-4xl lg:text-5xl font-bold">
            <span className="text-samurai-red">$SAM</span> Ladder
          </h2>
          <div
            className={`flex flex-col pt-10 xl:pt-16 text-xl ${inter.className}`}
          >
            <div className="bg-samurai-red w-2 h-[380px] rounded-t-full relative ml-[5px]">
              {/* BARS */}
              <div className="w-5 h-1 bg-black border border-samurai-red absolute left-[-6px] top-[50px]" />
              <div className="w-5 h-1 bg-black border border-samurai-red absolute left-[-6px] top-[140px]" />
              <div className="w-5 h-1 bg-black border border-samurai-red absolute left-[-6px] top-[230px]" />
              <div className="w-5 h-1 bg-black border border-samurai-red absolute left-[-6px] top-[320px]" />

              {/* USER */}
              <div className="w-5 h-1 bg-white  absolute left-[-6px] top-[110px]" />
              <div className="w-24 h-5 absolute left-[-110px] top-[102px] text-sm underline">
                My position
              </div>

              {/* LABELS */}
              <div className="w-24 h-5 absolute left-[30px] top-[10px] text-sm">
                Top 5%
              </div>
              <div className="w-24 h-5 absolute left-[30px] top-[87px] text-sm">
                Top 10%
              </div>
              <div className="w-24 h-5 absolute left-[30px] top-[175px] text-sm">
                Top 25%
              </div>
              <div className="w-24 h-5 absolute left-[30px] top-[260px] text-sm">
                Top 50%
              </div>
              <div className="w-24 h-5 absolute left-[30px] top-[340px] text-sm">
                Bottom 50%
              </div>
            </div>
            <div className="bg-samurai-red w-5 h-1"></div>
          </div>
        </div>
      </div>
    </LayoutClean>
  );
}

// paul@samuraistarter.com, projects@samuraistarter.com
