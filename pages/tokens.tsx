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
      {/* TOP CONTENT */}
      <div className="px-6 lg:px-8 xl:px-20">
        <div className="pt-10 lg:pt-24 relative ">
          <Image
            src="/samurai.svg"
            alt="tokens"
            width={100}
            height={100}
            className="hidden xl:block absolute top-32 right-[40px] w-[200px]"
          />

          <h1 className="text-[38px] lg:text-[58px] font-black xl:max-w-[900px] text-samurai-red">
            Samurai <span className="text-white">Two-Token</span> System
          </h1>
          <div
            className={`pt-3 !leading-[30px] text-neutral-300 lg:text-xl xl:max-w-[1000px] font-light text-justify ${inter.className}`}
          >
            The Samurai Starter ecosystem is fuelled by a{" "}
            <span className="font-bold text-white">two-token system</span> that
            is accessible, fair, and rewarding for all. The{" "}
            <span className="font-bold text-white">$CFI</span> governance token
            boosts stakers' cashback rewards rate and liquidity providers can
            earn <span className="font-bold text-white">real yield</span> from
            all business activities. The{" "}
            <span className="font-bold text-white">$SAM</span> token acts as a
            reward or cashback token that is distributed based on your
            participation throughout the Samurai Starter platform and is packed
            with tons of utility.
          </div>
        </div>
      </div>

      {/* STAKING */}
      <div className="flex flex-col pt-10 md:pt-20 pb-10 mt-20 w-full bg-white/5 border-t-[1px] border-samurai-red">
        <div className="flex flex-col px-6 lg:px-8 xl:px-20 text-white">
          <div className="flex flex-col text-white text-2xl pb-20">
            <div className="flex flex-col lg:flex-row w-full justify-between gap-8 pb-10">
              <div className="flex gap-8 items-end">
                <Image
                  src="/cyberfi-logo.svg"
                  width={100}
                  height={100}
                  alt=""
                />
                <p className="font-bold text-5xl pb-2">
                  <span className="text-samurai-red">$CFI</span> Staking
                </p>
              </div>
              <div className="flex flex-col md:flex-row gap-2 md:gap-8 text-sm h-12">
                <SSButton isLink href="">
                  Buy CFI on Arbitrum (coming soon)
                </SSButton>
                <SSButton
                  isLink
                  href="https://app.uniswap.org/#/swap?inputCurrency=0x63b4f3e3fa4e438698ce330e365e831f7ccd1ef4&outputCurrency=ETH"
                >
                  Buy CFI on Ethereum
                </SSButton>
              </div>
            </div>
            <p
              className={`text-lg pt-10 lg:pt-0 text-neutral-300 lg:pr-5 font-light text-justify ${inter.className}`}
            >
              The $CFI token is the governance token that captures the value of
              the Samurai Starter ecosystem. It is minted on the Ethereum
              blockchain with a fully-circulating supply of 2.4m $CFI. When you
              provide $CFI-ETH LP on Uniswap V2 Ethereum or Camelot DEX on
              Arbitrum, you are eligible to receive real platform yield.
              Providing LP or single-token staking $CFI also increases your $SAM
              cashback rewards rate. Check out our{" "}
              <Link href="#" className="text-white underline">
                docs
              </Link>{" "}
              to learn how to gain the most value from your $CFI.{" "}
            </p>

            <div
              className={`grid lg:grid-cols-3 gap-10 leading-normal pt-10 xl:pt-16 text-xl ${inter.className}`}
            >
              <div className="flex flex-col bg-black text-white border-[0.5px] border-samurai-red p-8 rounded-xl shadow-lg">
                <div className="flex flex-col">
                  <span className={`text-neutral-400 ${inter.className}`}>
                    My Stake
                  </span>
                  <span className="text-xl pb-1">99.99 $CFI-WETH LP</span>
                  <span className="text-samurai-red text-sm">123.99 $CFI</span>
                </div>
                <div className="flex justify-between items-center border-t-[0.5px] border-neutral-600 mt-6 pt-6">
                  <span className={`text-neutral-400 ${inter.className}`}>
                    $SAM Cashback
                  </span>
                  <span className="text-xl">1%</span>
                </div>
                <div className="flex justify-between items-center pt-3">
                  <span className={`text-neutral-400 ${inter.className}`}>
                    Earnings
                  </span>
                  <span className="text-xl">500 $SAM</span>
                </div>
              </div>
              <div className="flex flex-col text-center bg-black text-white border-[0.5px] border-samurai-red p-8 rounded-xl shadow-lg">
                <div className="flex justify-center pb-3">
                  <Image
                    src="/cyberfi-logo.svg"
                    width={60}
                    height={60}
                    alt=""
                  />
                </div>
                <span className="text-xl text-neutral-300">
                  $CFI (Ethereum)
                </span>
                <div className="flex flex-col md:flex-row justify-between items-center border-t-[0.5px] border-neutral-600 mt-6 pt-6 gap-4 lg:gap-0">
                  <Link
                    href="https://etherscan.io/address/0x63b4f3e3fa4e438698ce330e365e831f7ccd1ef4"
                    className="text-[12px] lg:text-[16px] border-b transition-all hover:border-samurai-red hover:text-samurai-red"
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
              <div className="flex flex-col text-center   text-white border-[0.5px] border-samurai-red p-8 rounded-xl shadow-lg">
                <div className="flex justify-center pb-3">
                  <Image
                    src="/cyberfi-logo.svg"
                    width={60}
                    height={60}
                    alt=""
                  />
                </div>
                <span className="text-xl text-neutral-300">
                  $CFI (Arbitrum)
                </span>
                <div className="flex flex-col md:flex-row justify-between items-center border-t-[0.5px] border-neutral-600 mt-6 pt-6 gap-4 lg:gap-0">
                  <Link
                    href="https://etherscan.io/address/0x63b4f3e3fa4e438698ce330e365e831f7ccd1ef4"
                    className="text-[12px] lg:text-[16px]  border-b transition-all hover:border-samurai-red hover:text-samurai-red"
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
      <div className="flex flex-col lg:flex-row justify-between w-full bg-white/10 border-t-[1px] border-samurai-red">
        <div className="flex flex-col text-white w-full py-10 md:py-20 px-4 lg:px-12">
          <h2 className="text-4xl lg:text-5xl font-bold">
            <span className="text-samurai-red">$SAM</span> Token
          </h2>

          <div className={`flex flex-col text-2xl ${inter.className}`}>
            <p
              className={`pt-8 text-lg text-neutral-300 font-light text-justify ${inter.className}`}
            >
              The $SAM token rewards participation across the entire Samurai
              Starter ecosystem and is designed to deliver tremendous benefits
              to the Samurai Starter community. The more you participate, the
              more you earn, the more future benefits you may enjoy! All $SAM
              rewards are vested over a period of three months, but users can
              choose to claim rewards early with a 15% penalty. $SAM is minted
              on Ethereum layer-2 Arbitrum with a maximum supply of 100m tokens.
            </p>
            <span
              className={`text-neutral-400 pt-10 md:pt-[90px] ${inter.className}`}
            >
              My $SAM earnings:
            </span>
            <span className="text-5xl pb-1 text-green-200">123.99</span>
          </div>
          <div
            className={`flex flex-col leading-normal pt-10 text-2xl ${inter.className}`}
          >
            <span className={`text-neutral-400  ${inter.className}`}>
              Pending $SAM Rewards:
            </span>
            <span className="text-5xl pb-1 text-orange-200">123.99</span>
          </div>
          <div className="pt-10 md:pt-[120px] flex flex-col md:flex-row gap-3 md:gap-5">
            <SSButton>Claim Vested $SAM Rewards</SSButton>
            <SSButton>Claim All $SAM Rewards</SSButton>
          </div>
        </div>
        <div className="flex flex-col text-white w-full bg-black/20 py-10 md:py-20 px-4 lg:px-12">
          <h2 className="text-4xl lg:text-5xl font-bold">
            <span className="text-samurai-red">$SAM</span> Ladder
          </h2>
          <p
            className={`pt-8 text-lg text-neutral-300 pb-14 font-light text-justify ${inter.className}`}
          >
            The $SAM Ladder represents your lifetime $SAM rewards in relation to
            all other wallets that have earned $SAM since its inception. The
            $SAM Ladder shows your cumulative earnings regardless of what you do
            with the rewards. You can claim, provide liquidity, or trade your
            $SAM rewards without affecting your position on the $SAM Ladder.
            Climb The Ladder for tremendous platform benefits including the
            chance for airdrops, special giveaways, exclusive deals, and much
            more!
          </p>
          <div
            className={`flex flex-col pt-8 text-xl items-center ${inter.className}`}
          >
            <div className="bg-samurai-red w-2 h-[380px] rounded-t-full relative">
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
