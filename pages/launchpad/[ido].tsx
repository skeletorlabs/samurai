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

import { IDO_LIST, simplifiedPhases } from "@/utils/constants";
import { formattedDate } from "@/utils/formattedDate";

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

  const phases = [
    {
      title: "Registration",
      buttonTitle: "REGISTER",
    },
    {
      title: "Participation",
      buttonTitle: "PARTICIPATE",
    },
    { title: "TGE", buttonTitle: "CLAIM TGE" },
    {
      title: "Release",
      buttonTitle: "CLAIM TOKENS",
    },
  ];

  const currentPhase = phases.find((item) => item.title === ido?.currentPhase);

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
          boxShadow: "inset 0px 0px 800px 310px rgba(0, 0, 0, .55)",
        }}
      >
        <div className=" flex flex-row justify-between items-center px-6 lg:px-8 xl:px-20 pt-10 lg:pt-24">
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
            <h1 className="text-[48px] sm:text-[58px] lg:text-[90px] font-black leading-[58px] sm:leading-[68px] lg:leading-[98px] text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
              {ido?.projectName}
            </h1>
            <p
              className={`leading-normal lg:leading-relaxed pt-6 lg:text-2xl xl:max-w-[600px] drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] pb-24 ${inter.className}`}
            >
              {ido?.projectDescription}
            </p>
            {/* <div className="flex flex-col lg:flex-row mt-12 gap-5 z-20">
              <SSButton isLink href="#participate">
                Get Started
              </SSButton>
            </div> */}
          </div>
          <div className="flex flex-col w-[700px] h-[540px] rounded-[8px] bg-black/80 p-8 shadow-xl border border-white/10">
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

              {!ido?.simplified &&
                phases.map((phase, index) => (
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
                      className={`p-2 w-full text-lg ${
                        phase.title === ido?.currentPhase
                          ? "text-white"
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
                      {formattedDate(ido.idoDate)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 bg-black/50 py-2 px-4 text-[16px] rounded-md w-max border border-white/10">
                    <span className="text-samurai-red">TGE DATE:</span>
                    <p className="text-white/70">
                      {formattedDate(ido.tgeDate)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 bg-black/50 py-2 px-4 text-[16px] rounded-md w-max border border-white/10">
                    <span className="text-samurai-red">TOKEN:</span>
                    <p className="text-white/70">{ido.projectTokenSymbol}</p>
                  </div>
                  <div className="flex items-center gap-2 bg-black/50 py-2 px-4 text-[16px] rounded-md w-max border border-white/10">
                    <span className="text-samurai-red">PRICE:</span>
                    <p className="text-white/70">
                      {ido.price} {ido.acceptedToken} on {ido.network}
                    </p>
                  </div>
                </div>

                {currentPhase?.title === "Participation" &&
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

                {currentPhase?.title === "Participation" &&
                  userIdo?.completed && (
                    <div className="flex flex-row justify-center border-t border-white/20 pt-12 gap-16 mt-4">
                      <div className="p-4 px-6 border border-white/20 rounded-[8px]">
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

                      <div className="p-4 px-6 border border-white/20 rounded-[8px]">
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
                {currentPhase?.title === "Completed" && (
                  <>
                    <div
                      className={`text-2xl text-white/80 mt-10 pt-10 border-t border-white/20 leading-normal ${inter.className}`}
                    >
                      <p className="text-samurai-red">IMPORTANT NOTE:</p>
                      The unlocked tokens in TGE phase will be airdroped by the
                      team at the date above.
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </TopLayout>
    </Layout>
  );
}
