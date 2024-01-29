import Link from "next/link";
import Image from "next/image";
import Layout from "@/components/layout";
import { Inter } from "next/font/google";
import { useCallback, useState, Fragment } from "react";
import SSButton from "@/components/ssButton";
import TopLayout from "@/components/topLayout";
import { IDO, IDONEW } from "@/utils/interfaces";
import { useRouter } from "next/router";
import { fromUnixTime } from "date-fns";

import { IDO_LIST, SOCIALS, simplifiedPhases } from "@/utils/constants";
import { formattedDate } from "@/utils/formattedDate";
import { discord, globe, linkedin, twitter, twitterX } from "@/utils/svgs";

const inter = Inter({
  subsets: ["latin"],
});

export default function Ido() {
  const [inputValue, setInputValue] = useState("");
  const { query } = useRouter();
  const { ido: idoID } = query;

  const ido = IDO_LIST.find((item) => item.id.includes(idoID as string));
  const idoIndex = IDO_LIST.findIndex((item) =>
    item.id.includes(idoID as string)
  );
  const bg = `url("${ido?.idoImageSrc}")`;

  const currentPhase = simplifiedPhases.find(
    (item) => item.title === ido?.currentPhase
  );

  const mockedUserIdosPhases = [
    { ido: 0, phase: 1, completed: false, participation: 0 },
    { ido: 1, phase: 1, completed: true, participation: 1000 },
    { ido: 2, phase: 2, completed: false, participation: 0 },
    { ido: 3, phase: 3, completed: false, participation: 0 },
  ];

  const userIdo = mockedUserIdosPhases.find((item) => item.ido === idoIndex);

  const onInputChange = (value: string) => {
    const re = new RegExp("^[+]?([0-9]+([.][0-9]*)?|[.][0-9]+)$");

    if (value === "" || re.test(value)) {
      setInputValue(value);
    }

    return false;
  };

  return (
    <Layout>
      <TopLayout
        style={{
          backgroundImage: bg,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          boxShadow: "inset 0px 0px 800px 800px rgba(0, 0, 0, .65)",
        }}
      >
        <div className="flex flex-row justify-between px-6 lg:px-8 xl:px-20 pt-10 lg:pt-14 relative">
          <div className="relative md:mr-12 xl:max-w-[900px]">
            <Link
              href="/launchpad"
              className="transition-all text-white/40 hover:text-white"
            >
              <svg
                data-slot="icon"
                fill="none"
                strokeWidth="1.5"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                className="w-20 mb-14"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                ></path>
              </svg>
            </Link>

            <div className="flex flex-col text-[48px] sm:text-[58px] lg:text-[90px] font-black leading-[58px] sm:leading-[68px] lg:leading-[98px] text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] relative">
              {ido?.projectName}
              <div className="flex items-center gap-4 pt-2">
                <div className="flex items-center gap-2 bg-black/90 px-4 py-2 rounded-md text-[14px] border border-white/20 w-max">
                  <span className="text-sm">Project Tokens</span>
                  <Image
                    src="/chain-logos/polygon.svg"
                    alt={ido?.projectName || ""}
                    width={24}
                    height={24}
                    className="p-[1px] bg-white/80 rounded-full"
                  />
                </div>

                <div className="flex items-center gap-2 bg-black/90 px-4 py-2 rounded-md text-[14px] border border-white/20  w-max">
                  <span className="text-sm">Crowdsale</span>
                  <Image
                    src="/chain-logos/Base_Symbol_Blue.svg"
                    alt={ido?.projectName || ""}
                    width={24}
                    height={24}
                    className="p-[1px] bg-white/80 rounded-full"
                  />
                </div>
              </div>
            </div>
            <p
              className={`leading-normal lg:leading-relaxed font-light pt-6 lg:text-2xl xl:max-w-[860px] drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] pb-10 ${inter.className} text-justify`}
            >
              {ido?.projectDescription}
            </p>
            <div className="flex items-center justify-center w-full lg:justify-start gap-8">
              {ido?.socials.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className={`transition-all hover:opacity-75 text-white ${
                    item.svg === discord ? "scale-[1.7]" : "scale-[1.2]"
                  }`}
                  target="_blank"
                >
                  {item.svg}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex flex-col w-[700px]">
            <div className="flex flex-col w-[700px] h-[540px] rounded-[8px] bg-black/40 p-8 mt-[170px] shadow-xl border border-white/10">
              <div className="text-center text-2xl text-white">
                <span className="text-samurai-red">{ido?.projectName}</span>{" "}
                {" | "}
                {ido?.type}
              </div>
              <div className="flex flex-row mt-10 bg-neutral-900/90 stroke-white rounded-[8px] text-white border border-white/20">
                {ido?.simplified &&
                  simplifiedPhases.map((phase, index) => (
                    <Fragment key={index}>
                      {index !== 0 && (
                        <svg
                          data-slot="icon"
                          fill="none"
                          strokeWidth="4"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                          className="w-20"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m8.25 4.5 7.5 7.5-7.5 7.5"
                          ></path>
                        </svg>
                      )}
                      <button
                        disabled
                        className={`p-2 w-full text-2xl ${
                          phase.title === ido?.currentPhase
                            ? "text-samurai-red"
                            : "text-white/40"
                        }`}
                      >
                        {phase.title}
                      </button>
                    </Fragment>
                  ))}
              </div>

              {ido && (
                <div className="flex flex-col gap-10">
                  {/* PARTICIPATION PHASE BLOCK */}
                  <div className="flex gap-4 items-center flex-wrap mt-10">
                    <div className="flex items-center gap-2 bg-black/50 py-2 px-4 text-[16px] rounded-md w-max border border-white/10">
                      <span className="text-samurai-red">
                        PARTICIPATION DATE:
                      </span>
                      <p className="text-white/70">
                        {formattedDate(ido.idoDate).toUpperCase()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 bg-black/50 py-2 px-4 text-[16px] rounded-md w-max border border-white/10">
                      <span className="text-samurai-red">TGE DATE:</span>
                      <p className="text-white/70">
                        {formattedDate(ido.tgeDate).toUpperCase()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 bg-black/50 py-2 px-4 text-[16px] rounded-md w-max border border-white/10">
                      <span className="text-samurai-red">TOKEN SYMBOL:</span>
                      <p className="text-white/70">{ido.projectTokenSymbol}</p>
                    </div>
                    <div className="flex items-center gap-2 bg-black/50 py-2 px-4 text-[16px] rounded-md w-max border border-white/10">
                      <span className="text-samurai-red">TOKEN PRICE:</span>
                      <p className="text-white/70">${ido.price}</p>
                    </div>
                  </div>

                  {/* UPCOMING BLOCK */}
                  {currentPhase?.title.toLowerCase() === "upcoming" && (
                    <>
                      <div
                        className={`text-2xl text-white/80 mt-10 pt-10 leading-normal ${inter.className}`}
                      >
                        <p className="text-white/70samurai-red text-center">
                          SAVE THE DATE TO HOPPING IN!
                        </p>
                      </div>
                    </>
                  )}

                  {currentPhase?.title.toLowerCase() === "participation" &&
                    !userIdo?.completed && (
                      <div className="flex flex-col">
                        <button className="self-end text-sm mb-1 hover:text-samurai-red">
                          BALANCE: 10000
                        </button>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="USDC to allocate"
                            className="w-full p-4 rounded-[8px] placeholder-black/50 text-black"
                            value={inputValue}
                            onChange={(e) => onInputChange(e.target.value)}
                          />
                          <div className="absolute top-3 right-2">
                            <Image
                              src="/usdc-icon.svg"
                              width={35}
                              height={35}
                              alt="USDC"
                              placeholder="blur"
                              blurDataURL="/usdc-icon.svg"
                            />
                          </div>
                        </div>

                        <button className="bg-samurai-red rounded-[8px] w-full mt-4 py-4 text-[18px] text-center transition-all hover:opacity-75">
                          {currentPhase?.buttonTitle}
                        </button>
                      </div>
                    )}

                  {currentPhase?.title.toLowerCase() === "participation" &&
                    userIdo?.completed && (
                      <div className="flex flex-row justify-between items-center border-t border-white/20 pt-12 gap-8">
                        <div className="p-4 px-6 border border-white/20 rounded-[8px] w-full">
                          <p className={`text-xl ${inter.className}`}>
                            MY ALLOCATION
                          </p>
                          <p className="text-4xl text-samurai-red">
                            {userIdo?.participation?.toLocaleString("en-us", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}{" "}
                            {ido.acceptedToken}
                          </p>
                        </div>

                        <div className="p-4 px-6 border border-white/20 rounded-[8px] w-full">
                          <p className={`text-xl ${inter.className}`}>
                            TOKENS TO RECEIVE
                          </p>
                          <p className="text-4xl text-samurai-red">
                            {(
                              Number(userIdo?.participation) * Number(ido.price)
                            )?.toLocaleString("en-us", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}{" "}
                            {ido.projectTokenSymbol}
                          </p>
                        </div>
                      </div>
                    )}

                  {/* TGE PHASE BLOCK */}
                  {currentPhase?.title.toLowerCase() === "completed" && (
                    <>
                      <div
                        className={`text-2xl text-white/80 mt-10 pt-10 border-t border-white/20 leading-normal ${inter.className}`}
                      >
                        <p className="text-samurai-red">IMPORTANT NOTE:</p>
                        The unlocked tokens in TGE phase will be airdroped by
                        the team at the date above.
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center gap-4 mt-6">
              <div className="w-full h-[180px] relative">
                <Image
                  src="/IDOs/shibainu.png"
                  alt={ido?.projectName || ""}
                  fill
                  className="w-[200px] h-[140px] p-[1px] bg-white/10 rounded-[8px]"
                />
              </div>
              <div className="w-full h-[180px] relative">
                <Image
                  src="/IDOs/shibainu.png"
                  alt={ido?.projectName || ""}
                  fill
                  className="w-[200px] h-[140px] p-[1px] bg-white/10 rounded-[8px]"
                />
              </div>
            </div>
          </div>
        </div>
      </TopLayout>
    </Layout>
  );
}
