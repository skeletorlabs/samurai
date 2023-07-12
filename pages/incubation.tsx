import Link from "next/link";
import Image from "next/image";
import LayoutClean from "@/components/layoutClean";
import Layout from "@/components/layout";
import { Inter } from "next/font/google";
import { useCallback, useState } from "react";
import { rocket, telegram, linkedin } from "@/utils/svgs";
import SSButton from "@/components/ssButton";
import TopLayout from "@/components/topLayout";

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

export default function Incubation() {
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
    <Layout>
      <TopLayout background="bg-samurai-incubator-bg">
        <div className="flex flex-row justify-between items-center px-6 lg:px-8 xl:px-20">
          {/* TOP CONTENT */}
          <div className="sm:pt-10 lg:pt-24 relative">
            <h1 className="text-[48px] sm:text-[58px] font-black leading-[58px] sm:leading-[68px] md:mr-12 xl:max-w-[1000px] text-samurai-red ">
              <span className="text-white">Accelerating</span> your project from
              ideation to token <span className="text-white">launch</span> and
              beyond.
            </h1>
            <p
              className={`leading-normal pt-6 lg:text-xl xl:max-w-[900px] ${inter.className}`}
            >
              Committed to advising, guiding and incubating the most novel and
              innovative platforms in the Web3 space no matter which stage of
              platform launch you have reached.
            </p>
            <div className="flex flex-col lg:flex-row pt-16 gap-5 z-20">
              <SSButton isLink href="#contact">
                Get Started
              </SSButton>
            </div>
          </div>
          <Image
            src="/samurai-incubator-icon.svg"
            width={350}
            height={350}
            alt="incubation"
            className="rounded-[8px] hidden xl:block opacity-40 xl:opacity-100"
            placeholder="blur"
            blurDataURL="/thumb.png"
          />
        </div>
      </TopLayout>

      {/* TOKEN LAUNCH */}
      <div className="flex items-center gap-12 px-6 lg:px-8 xl:px-20 py-24  w-full bg-white/10 text-white border-t border-samurai-red/50 border-dotted">
        <Image
          src="/samurai-launchpad-icon.svg"
          width={350}
          height={350}
          alt="launchpad"
          className="rounded-[8px] hidden xl:block opacity-40 xl:opacity-100"
          placeholder="blur"
          blurDataURL="/thumb.png"
        />
        <div className="flex flex-col relative">
          <h2 className="text-4xl lg:text-5xl font-bold">
            Token <span className="text-samurai-red">Launch</span>
          </h2>
          <div
            className={`relative mt-3 leading-normal pt-3 text-[20px]  ${inter.className}`}
          >
            Having supported over 60 projects with their token launches, Samurai
            Launchpad is well-positioned to support your token launch. Whether
            you are raising on seed, private, or public rounds, our vibrant
            community is eager to accelerate your project.{" "}
            <div className="absolute bottom-[-40px] right-8 flex justify-end">
              <Link
                href="/launchpad"
                className={`items-center text-lg text-samurai-red hover:text-samurai-red/70 font-light ${inter.className}`}
              >
                Apply to launchpad →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* SERVICES */}
      <div className="flex flex-col pt-10 md:pt-20 pb-10 w-full bg-white/20 border-t-[1px] border-yellow-300/40">
        <div className="flex flex-col px-6 lg:px-8 xl:px-20 text-white">
          <h2 className="text-4xl lg:text-5xl font-bold">
            <span className="text-samurai-red">Samurai</span> Services
          </h2>
          <div
            className={`grid lg:grid-cols-3 gap-10 leading-normal pt-10 xl:pt-16 text-xl ${inter.className}`}
          >
            {services.map((service, index) => (
              <div
                key={index}
                className={`flex flex-col gap-2 text-center ${
                  service.color === bg.light
                    ? "bg-black/40 text-white border-[1px] border-samurai-red"
                    : "bg-black text-white"
                }  border border-black p-8 rounded-xl shadow-lg transition-all hover:scale-105`}
              >
                <div className="flex justify-center pb-10">
                  <Image
                    src={service.src}
                    width={200}
                    height={200}
                    alt={service.title}
                  />
                </div>
                <span
                  className={`font-bold text-2xl border-b-[0.5px] ${
                    service.color === bg.light
                      ? "border-neutral-400"
                      : "border-white"
                  } pb-3  mb-2`}
                >
                  {service.title}
                </span>
                <p className={`text-[16px] text-neutral-400`}>
                  {service.description}
                </p>
              </div>
            ))}
          </div>

          {applyToLaunchpad}
        </div>
      </div>

      {/* PORTFOLIO */}
      <div className="flex flex-col py-10 md:py-20 w-full bg-white/10 border-t-[1px] border-samurai-red/40">
        <div className="flex flex-col px-6 lg:px-8 xl:px-20 text-white">
          <h2 className="text-4xl lg:text-5xl font-bold">
            <span className="text-samurai-red">P</span>ortfolio
          </h2>
          <div
            className={`flex justify-center lg:justify-start items-center flex-wrap gap-10 leading-normal pt-10 xl:pt-16 text-xl ${inter.className}`}
          >
            {portfolio.map((item, index) => (
              <div
                key={index}
                className={`flex justify-center items-center rounded-full w-[150px] h-[150px] lg:w-[180px] lg:h-[180px] p-7 lg:p-6 transition-all hover:scale-105 ${
                  item.color === bg.dark ? "bg-black" : "bg-white"
                } hover:shadow-xl`}
              >
                <Image
                  src={item.image}
                  placeholder="blur"
                  blurDataURL={item.image}
                  width={item.width}
                  height={item.height}
                  alt=""
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TEAM */}
      <div className="flex flex-col py-10 md:py-20 w-full bg-black border-t-[1px] border-yellow-300/40">
        <div className="flex flex-col px-6 lg:px-8 xl:px-20">
          <h2 className="text-4xl lg:text-5xl font-bold">
            <span className="text-samurai-red">T</span>eam
          </h2>
          <div
            className={`flex justify-center md:justify-start items-center flex-wrap gap-10 leading-normal py-10 xl:py-16 text-xl ${inter.className}`}
          >
            {team.map((member, index) => (
              <div
                key={index}
                className="flex flex-col items-center w-full md:w-max md:h-[350px] p-5 pb-4 bg-white rounded-xl transition-all md:hover:scale-105"
              >
                <Image
                  src={member.src}
                  placeholder="blur"
                  blurDataURL={member.src}
                  width={200}
                  height={200}
                  alt={member.name}
                  className="w-full md:w-[200px]"
                />

                <p className="text-black mt-3 text-[14px] font-bold">
                  {member.name}
                </p>
                <p className="text-black text-[14px]">aka {member.nickname}</p>
                <div className="flex w-full justify-center gap-3 items-center pt-4">
                  {member.linkedin && (
                    <Link
                      href={member.linkedin}
                      target="blank"
                      className="w-[30px] text-blue-600 hover:shadow-lg"
                    >
                      {linkedin}
                    </Link>
                  )}
                  {member.telegram && (
                    <Link
                      href={member.telegram}
                      target="blank"
                      className="w-[41px] text-blue-400 hover:drop-shadow-lg"
                    >
                      {telegram}
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PARTNERS */}
      <div className="flex flex-col pt-10 md:pt-20 pb-10 w-full bg-white/10 border-t-[1px] border-samurai-red">
        <div className="flex flex-col text-white">
          <h2 className="text-4xl lg:text-5xl font-bold px-6 lg:px-8 xl:px-20">
            Our <span className="text-samurai-red">Partners</span>
          </h2>
          <div className="flex flex-col pb-14 w-full overflow-x-scroll px-6 lg:px-8 xl:px-20">
            <div
              className={`flex items-center w-full gap-5 leading-normal pt-10 xl:pt-16 text-xl ${inter.className}`}
            >
              {partnersLogos.map((item, index) => {
                return index === partnersLogos.length - 1 ? (
                  <div key={index} className="w-10 h-10 text-transparent">
                    empty
                  </div>
                ) : (
                  <Image
                    key={index}
                    src={item.src}
                    placeholder="blur"
                    blurDataURL={item.src}
                    width={180}
                    height={180}
                    alt=""
                    className={`flex justify-center items-center ${
                      item.color === bg.dark ? "bg-black" : "bg-white"
                    } py-2 px-5 rounded-[8px] w-[180px] min-h-[120px] transition-all hover:scale-105 shadow-xl hover:shadow-2xl`}
                  />
                );
              })}
            </div>
          </div>
          <div className="px-6 lg:px-8 xl:px-20">{applyToLaunchpad}</div>
        </div>
      </div>

      {/* CONTACT */}
      <div
        id="contact"
        className="flex flex-col pt-10 md:pt-20 pb-10 w-full bg-black border-t border-black/20"
      >
        <div className="flex flex-col px-6 lg:px-8 xl:px-20">
          <h2 className="text-4xl lg:text-5xl font-bold">
            <span className="text-samurai-red">Contact</span> Us
          </h2>
          <div
            className={`flex items-center flex-wrap gap-10 leading-normal pt-10 xl:pt-16 text-xl ${inter.className}`}
          >
            <form
              onSubmit={handleSubmit}
              className="flex flex-col md:p-10 gap-5 bg-white/5 md:border border-samurai-red w-[600px] rounded-2xl relative"
            >
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
              <span
                className={`
                    text-md rounded-full w-max mb-5 
                    ${mailSent ? "text-samurai-red" : "text-white"}
                  `}
              >
                {mailSent ? "Message successfully sent!" : "Send a message"}
              </span>
              <p className="flex flex-col text-sm gap-2 font-bold">
                <span>Name:</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  className="bg-white p-4 text-xl outline-none text-black rounded-[8px]"
                  required
                />
              </p>
              <p className="flex flex-col text-sm gap-2 font-bold">
                <span>Email:</span>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  className="bg-white p-4 text-xl outline-none text-black rounded-[8px]"
                  required
                />
              </p>
              <p className="flex flex-col text-sm gap-2 font-bold">
                <span>Subject:</span>
                <input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  type="text"
                  className="bg-white p-4 text-xl outline-none text-black rounded-[8px]"
                  required
                />
              </p>
              <p className="flex flex-col text-sm gap-2 font-bold">
                <span>Message:</span>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="bg-white p-4 text-xl h-[200px] outline-none text-black rounded-[8px]"
                  required
                />
              </p>
              <div className="h-[0.5px] w-full px-5">
                <div className="w-full h-full  bg-black" />
              </div>
              <button
                disabled={loading}
                type="submit"
                className={`
                flex justify-center items-center  px-8 py-3 transition-all 
                w-auto
              border-samurai-red text-samurai-red  
                border rounded-[8px]  
                enabled:hover:bg-samurai-red enabled:hover:text-black enabled:hover:border-samurai-red
                disabled:border-white/20 disabled:text-white/10
              `}
              >
                {loading ? "Loading..." : "Send"}
              </button>
            </form>
          </div>

          {applyToLaunchpad}
        </div>
      </div>
    </Layout>
  );
}

// paul@samuraistarter.com, projects@samuraistarter.com
