import Image from "next/image";
import { IDO } from "@/utils/interfaces";
import { ReactElement, useState } from "react";
import { fromUnixTime } from "date-fns";
import Link from "next/link";
import { discord, globe, telegram, twitter } from "@/utils/svgs";
import { Inter, Inter_Tight } from "next/font/google";
import SSButton from "./ssButton";

const inter = Inter({
  subsets: ["latin"],
});

const interTight = Inter_Tight({
  subsets: ["latin"],
});

interface IDOModal {
  children: ReactElement;
  ido: IDO;
}

const socials = [
  { icon: globe, href: "#" },
  { icon: twitter, href: "#" },
  { icon: telegram, href: "#" },
  { icon: discord, href: "#" },
];

export default function IDOModal({ children, ido }: IDOModal) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>{children}</button>
      <div
        className={`
          transition-all 
          ${open ? "fixed" : "hidden"}
          top-0 left-0 w-full h-full bg-neutral-900/95 z-50
          flex justify-center items-center
        `}
      >
        <div className="flex w-full max-w-[1300px] h-full p-4 lg:p-20">
          <div
            className="
              relative
              flex p-8 w-full h-full 
              bg-[#0d0d0d]/70
              
              
              border-[16px] border-neutral-700 rounded-xl 
              shadow-2xl shadow-neutral-500/5
            "
          >
            {/* CONTENT */}
            <div className={`flex flex-col w-full  overflow-scroll`}>
              <div className="flex items-center">
                <div className="flex flex-col md:flex-row md:items-center xl:px-4 gap-8">
                  <div className="flex items-center gap-4">
                    <Image
                      src="/maya-clean.svg"
                      placeholder="blur"
                      blurDataURL="/projects/maya-clean.svg"
                      width={0}
                      height={0}
                      className="p-3 bg-black rounded-full w-[70px] max-w-[70px] h-[70px] max-h-[70px] md:w-[100px] md:max-w-[100px] md:h-[100px] md:max-h-[100px] border border-white/60"
                      alt=""
                    />
                    {/* SOCIALS MOBILE */}
                    <div className="flex md:hidden flex-row items-center scale-75 gap-4 px-6 py-2 ml-[-18px] bg-gray-600/50 w-max rounded-full">
                      {socials.map((social) => (
                        <Link
                          href={social.href}
                          className="transition-all hover:scale-110 text-white hover:text-neutral-500"
                        >
                          {social.icon}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="text-5xl md:text-7xl md:w-max">
                    {ido.title}
                  </div>

                  {/* SOCIALS DESKTOP */}
                  <div className="hidden md:flex flex-row items-center scale-75 gap-4 px-6 py-2 ml-[-18px] bg-gray-600/50 w-max rounded-full">
                    {socials.map((social) => (
                      <Link
                        href={social.href}
                        className="transition-all hover:scale-110 text-white hover:text-neutral-500"
                      >
                        {social.icon}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              {/* LABELS */}
              <div
                className={`flex gap-2 flex-wrap text-[18px] mt-8 xl:mx-4 ${inter.className}`}
              >
                <div className="flex items-center gap-2 bg-black/30 py-2 px-4 rounded-md w-max">
                  <span>Starts:</span>
                  <p className="text-white/70">
                    {fromUnixTime(ido.startedAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-black/30 py-2 px-4 rounded-md w-max">
                  <span>Ends:</span>
                  <p className="text-white/70">
                    {fromUnixTime(ido.startedAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-black/30 py-2 px-4 rounded-md w-max">
                  <span>Min/Max Allocation:</span>
                  <p className="text-white/70">$100/$5000 USDC</p>
                </div>
                <div className="flex items-center gap-2 bg-black/30 py-2 px-4 rounded-md w-max">
                  <span className="text-samurai-red">Currency Accepted:</span>
                  <p className="text-white/70">USDC</p>
                </div>

                <div className="flex items-center gap-2 bg-black/30 py-2 px-4 rounded-md w-max">
                  <span>Blockchain:</span>
                  <p className="text-white/70">Base</p>
                </div>

                <div className="flex items-center gap-2 bg-black/30 py-2 px-4 rounded-md w-max">
                  <span>Access:</span>
                  <p className="text-white/70">Public</p>
                </div>
                <div className="flex items-center gap-2 bg-black/30 py-2 px-4 rounded-md w-max">
                  <span>Status:</span>
                  <p className="text-white/70">
                    <span
                      className={`${
                        ido.status === "ONGOING"
                          ? "text-green-400"
                          : "text-red-500"
                      }`}
                    >
                      {ido.status}
                    </span>
                  </p>
                </div>
              </div>
              {/* DESCRIPTION */}
              <div
                className={`mt-8 text-zinc-500 text-lg xl:px-4 ${interTight.className}`}
              >
                {ido.description}
              </div>
              {/* BUTTONS */}
              <div className="flex flex-col md:flex-row items-center gap-20 xl:px-4 mt-8">
                <SSButton flexSize>Whitelist for IDO</SSButton>
                <SSButton flexSize isLink href="/nft" secondary>
                  Mint SamNFT
                </SSButton>
              </div>

              {/* INFORMATIONS */}
              <div className="flex flex-col xl:flex-row justify-between gap-20 xl:px-4 mt-14 border-t border-neutral-600 pt-12">
                <div className="flex flex-col w-full">
                  <p className="text-yellow-300 text-4xl px-4 py-2 mb-3 bg-black/70">
                    Pool <span className="text-white">Information</span>
                  </p>

                  <div
                    className={`flex flex-col p-2 rounded-md w-full text-lg gap-4 ${interTight.className}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span>IDO Date</span>
                      <div className="flex flex-1 border-[0.5px] border-neutral-600 border-dashed" />
                      <span className="text-samurai-red">09/09/2024</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span>Total Raise</span>
                      <div className="flex flex-1 border-[0.5px] border-neutral-600 border-dashed" />
                      <span className="text-samurai-red">100,000 USDC</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span>Min Allocation</span>
                      <div className="flex flex-1 border-[0.5px] border-neutral-600 border-dashed" />
                      <span className="text-samurai-red">500 USDC</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span>Max Allocation</span>
                      <div className="flex flex-1 border-[0.5px] border-neutral-600 border-dashed" />
                      <span className="text-samurai-red">5,000 USDC</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span>Access Type</span>
                      <div className="flex flex-1 border-[0.5px] border-neutral-600 border-dashed" />
                      <span className="text-samurai-red">SamNFT Holder</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col w-full">
                  <p className="text-yellow-300 text-4xl px-4 py-2 mb-3 bg-black/70">
                    Token <span className="text-white">Information</span>
                  </p>
                  <div
                    className={`flex flex-col p-2 rounded-md w-full text-lg gap-4 ${interTight.className}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span>Token Symbol</span>
                      <div className="flex flex-1 border-[0.5px] border-neutral-600 border-dashed" />
                      <span className="text-samurai-red">XYZ</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span>Blockchain</span>
                      <div className="flex flex-1 border-[0.5px] border-neutral-600 border-dashed" />
                      <span className="text-samurai-red">Base</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span>Total Supply</span>
                      <div className="flex flex-1 border-[0.5px] border-neutral-600 border-dashed" />
                      <span className="text-samurai-red">
                        1,000,000,000 XYZ
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span>Initial Supply</span>
                      <div className="flex flex-1 border-[0.5px] border-neutral-600 border-dashed" />
                      <span className="text-samurai-red">30,000,000 XYZ</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span>Initial Market cap</span>
                      <div className="flex flex-1 border-[0.5px] border-neutral-600 border-dashed" />
                      <span className="text-samurai-red">$300,000</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span>TGE</span>
                      <div className="flex flex-1 border-[0.5px] border-neutral-600 border-dashed" />
                      <span className="text-samurai-red">09/26/2024</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span>Unlock at TGE</span>
                      <div className="flex flex-1 border-[0.5px] border-neutral-600 border-dashed" />
                      <span className="text-samurai-red">5%</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span>Vesting</span>
                      <div className="flex flex-1 border-[0.5px] border-neutral-600 border-dashed" />
                      <span className="text-samurai-red">
                        Linear vesting over 6 months
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {/* ABOUT THE PROJECT */}
              <div className="flex flex-col xl:px-4 mt-20 pt-14 border-t border-neutral-600">
                <h2 className="text-4xl lg:text-4xl font-bold">
                  About <span className="text-samurai-red">{ido.title}</span>
                </h2>
                <p className="text-lg text-zinc-500 mt-6">
                  The Initial Dex Offering (IDO) for the new cryptocurrency,
                  Xcoin, has been met with overwhelming demand. The IDO sold out
                  in just minutes, raising over $100 million in funding. Xcoin
                  is a new blockchain-based platform that aims to revolutionize
                  the way people invest in cryptocurrency. The platform offers a
                  number of features that make it more user-friendly and
                  accessible than traditional exchanges, such as a built-in
                  wallet and fiat currency trading. The success of the Xcoin IDO
                  is a sign of the growing interest in cryptocurrency
                  investment. The market for cryptocurrency is still relatively
                  small, but it is growing rapidly. In 2022, the global
                  cryptocurrency market was worth over $3 trillion. This growth
                  is being driven by a number of factors, including the
                  increasing adoption of blockchain technology and the growing
                  popularity of decentralized finance (DeFi) applications. The
                  success of the Xcoin IDO is also a sign of the growing
                  popularity of Initial Dex Offerings (IDOs). IDOs are a new way
                  for cryptocurrency projects to raise money from the public.
                  They offer a number of advantages over traditional Initial
                  Coin Offerings (ICOs), such as lower fees and faster
                  fundraising. The success of the Xcoin IDO is a positive sign
                  for the future of cryptocurrency investment. It shows that
                  there is a growing demand for new and innovative
                  cryptocurrency projects. It also shows that IDOs are a viable
                  way for these projects to raise money. However, it is
                  important to note that cryptocurrency investment is a risky
                  proposition. The prices of cryptocurrencies can be volatile,
                  and there is always the risk of losing money. Investors should
                  do their research before investing in any cryptocurrency
                  project. If you are interested in investing in Xcoin, you can
                  still buy it on the open market. The token is currently
                  trading at $10 per token. The future of Xcoin is uncertain,
                  but the success of the IDO is a positive sign. The project has
                  a strong team and a clear vision. If the team can execute on
                  their plan, Xcoin could be a major player in the
                  cryptocurrency space.
                </p>

                <div className="flex items-center justify-between gap-10 flex-wrap mt-10">
                  <Image
                    src="/projects/maya-protocol.svg"
                    placeholder="blur"
                    blurDataURL="/projects/maya-protocol.svg"
                    width={400}
                    height={200}
                    className="w-full"
                    alt=""
                  />
                  <Image
                    src="/projects/maya-protocol.svg"
                    placeholder="blur"
                    blurDataURL="/projects/maya-protocol.svg"
                    width={480}
                    height={200}
                    className="w-full"
                    alt=""
                  />
                  <Image
                    src="/projects/maya-protocol.svg"
                    placeholder="blur"
                    blurDataURL="/projects/maya-protocol.svg"
                    width={480}
                    height={200}
                    className="w-full"
                    alt=""
                  />
                  <Image
                    src="/projects/maya-protocol.svg"
                    placeholder="blur"
                    blurDataURL="/projects/maya-protocol.svg"
                    width={480}
                    height={200}
                    className="w-full"
                    alt=""
                  />
                </div>
              </div>
            </div>
            {/* END OF CONTENT */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-8 right-8 w-10 h-10 text-neutral-500"
            >
              <svg
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  clipRule="evenodd"
                  fillRule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
