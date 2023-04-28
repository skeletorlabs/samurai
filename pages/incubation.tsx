import Link from "next/link";
import Image from "next/image";
import LayoutClean from "@/components/layoutClean";
import { SOCIALS } from "@/utils/constants";
import { Inter } from "next/font/google";
import { useCallback, useState } from "react";

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
    },
    {
      title: "Strategy",
      description:
        "We apply our expertise in advising projects on step-by-step strategies for growing their business. From project ideation, through fundraising and platform launch, our partners leverage our expertise to develop global strategies.",
      color: bg.light,
    },
    {
      title: "Business Development",
      description:
        "We connect you to the highest value-add partners in the web3 space. If you need developers, market makers, CEX listings, auditors and other strategic partners, we connect you to the best in the business.",
      color: bg.dark,
    },
    {
      title: "Marketing",
      description:
        "Spreading the word to reach new audiences is critical in the web3 space. We help deliver your marketing communications to a global audience through our in-house socials, our PR branch, and other marketing partners.",
      color: bg.light,
    },
    {
      title: "Community Building",
      description:
        "Samurai Starter investors are incentivized to not only invest money, but also time into early-stage web3 projects. Our Samurai Sanka platform incentivizes active platform participation.",
      color: bg.dark,
    },
    {
      title: "Content Creation",
      description:
        "Need a cutting edge designs to attract attention to your project or long-form articles to keep your audience engaged? Our team of graphic design and writing professionals leverage their expertise to suit your needs.",
      color: bg.light,
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
  ];

  const team = [
    { src: "/team/avatar0.svg", name: "Lucas" },
    { src: "/team/avatar1.svg", name: "Paul" },
    { src: "/team/avatar2.svg", name: "Chadagorn" },
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
          <svg
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            className="hidden xl:block absolute top-12 right-[-20px] w-[350px]"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <h1 className="text-[38px] lg:text-[58px] font-black leading-[48px] lg:leading-[68px] xl:max-w-[900px]">
            Accelerating your project from ideation to token launch and beyond.
          </h1>
          <p
            className={`leading-normal pt-6 lg:text-xl xl:max-w-[900px] ${inter.className}`}
          >
            Committed to advising, guiding and incubating the most novel and
            innovative platforms in the Web3 space no matter which stage of
            platform launch you have reached.
          </p>
          <div className="flex flex-col lg:flex-row items-center pt-16 gap-5 z-20">
            <Link
              href="#contact"
              className="flex justify-center items-center hover:bg-[#FF284C] border rounded-2xl hover:border-[#e2d4d6] px-8 h-14 text-lg transition-all bg-black/90 text-white border-white w-full lg:w-[190px]"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>

      {/* TOKEN LAUNCH */}
      <div className="flex items-center gap-12 px-6 lg:px-8 xl:px-20 py-10 pb-20 md:py-20 w-full bg-white border-t border-samurai-red mt-20 text-black">
        <svg
          fill="none"
          stroke="black"
          strokeWidth="1"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className="hidden xl:block w-[200px]"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
          ></path>
        </svg>
        <div className="flex flex-col relative">
          <h2 className="text-4xl lg:text-5xl font-bold">
            Token <span className="text-samurai-red">Launch</span>
          </h2>
          <div
            className={`relative mt-3 leading-normal pt-4 text-xl max-w-[1000px] ${inter.className}`}
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
      <div className="flex flex-col pt-10 md:pt-20 pb-10 w-full bg-slate-800">
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
                className={`flex flex-col gap-2 ${
                  service.color === bg.light
                    ? "bg-white text-black"
                    : "bg-black text-white"
                }  border border-black p-8 rounded-xl shadow-lg transition-all hover:scale-105`}
              >
                <span className="font-bold text-2xl">{service.title}</span>
                <p
                  className={`text-[16px] ${
                    service.color === bg.light
                      ? "text-neutral-800"
                      : "text-neutral-400"
                  }`}
                >
                  {service.description}
                </p>
              </div>
            ))}
          </div>

          {applyToLaunchpad}
        </div>
      </div>

      {/* PORTFOLIO */}
      <div className="flex flex-col py-10 md:py-20 w-full bg-slate-300 border-t">
        <div className="flex flex-col px-6 lg:px-8 xl:px-20 text-black">
          <h2 className="text-4xl lg:text-5xl font-bold">
            <span className="text-samurai-red">P</span>ortfolio
          </h2>
          <div
            className={`flex justify-center items-center flex-wrap gap-10 leading-normal pt-10 xl:pt-16 text-xl ${inter.className}`}
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
        </div>
      </div>

      {/* TEAM */}
      <div className="flex flex-col py-10 md:py-20 w-full bg-black border-t border-black/20">
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
                className="flex flex-col justify-center items-center p-5 pb-2 bg-white rounded-xl transition-all hover:scale-105"
              >
                <Image
                  src={member.src}
                  width={220}
                  height={220}
                  alt={member.name}
                  className="w-[400px] md:w-[220px]"
                />
                <span className="text-black mt-1">{member.name}</span>
              </div>
            ))}
          </div>
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
            {partnersLogos.map((item, index) => (
              <Image
                key={index}
                src={item.src}
                width={300}
                height={300}
                alt=""
                className={`flex justify-center items-center ${
                  item.color === bg.dark ? "bg-black" : "bg-white"
                } py-5 px-10 rounded-[8px] w-full md:w-[300px] min-h-[200px] transition-all hover:scale-105 shadow-xl hover:shadow-2xl`}
              />
            ))}
          </div>

          {applyToLaunchpad}
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
              className="flex flex-col p-10 gap-5 bg-white/5 border border-samurai-red w-[600px] rounded-2xl relative"
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
                  className="bg-white p-4 text-xl outline-none text-black"
                  required
                />
              </p>
              <p className="flex flex-col text-sm gap-2 font-bold">
                <span>Email:</span>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  className="bg-white p-4 text-xl outline-none text-black"
                  required
                />
              </p>
              <p className="flex flex-col text-sm gap-2 font-bold">
                <span>Subject:</span>
                <input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  type="text"
                  className="bg-white p-4 text-xl outline-none text-black"
                  required
                />
              </p>
              <p className="flex flex-col text-sm gap-2 font-bold">
                <span>Message:</span>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="bg-white p-4 text-xl h-[200px] outline-none text-black"
                  required
                />
              </p>
              <div className="h-[0.5px] w-full px-5">
                <div className="w-full h-full  bg-black" />
              </div>
              <button
                disabled={loading}
                type="submit"
                className={`border rounded-2xl  px-8 h-14 text-lg transition-all  w-full ${
                  loading
                    ? "bg-white/5 text-white/10 border-white/20"
                    : "bg-[#FF284C] border-[#e2d4d6] hover:bg-black/90 hover:text-white hover:border-white"
                }`}
              >
                {loading ? "Loading..." : "Send"}
              </button>
            </form>
          </div>

          {applyToLaunchpad}
        </div>
      </div>
    </LayoutClean>
  );
}

// paul@samuraistarter.com, projects@samuraistarter.com
