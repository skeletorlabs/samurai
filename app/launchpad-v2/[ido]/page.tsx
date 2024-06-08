"use client";
import Link from "next/link";
import Image from "next/image";
import { Inter } from "next/font/google";
import { useState, Fragment, useContext, useEffect, useCallback } from "react";
import TopLayout from "@/app/components/topLayout";
import { useParams } from "next/navigation";
import { Carousel } from "flowbite-react";

import {
  IDO_LIST,
  TOKENS_TO_SYMBOL,
  simplifiedPhases,
  simplifiedPhasesV2,
} from "@/app/utils/constants";
import { formattedDate, formattedDateSimple } from "@/app/utils/formattedDate";
import { discord, youtube } from "@/app/utils/svgs";
import SSButton from "@/app/components/ssButton";
import { StateContext } from "@/app/context/StateContext";
import {
  generalInfo,
  getParticipationPhase,
  makePublic,
  participate,
  register,
  togglePause,
  userInfo,
  withdraw,
} from "@/app/contracts_integrations/idoV2";
import IdoAllocationProgress from "@/app/components/idoAllocationProgress";
import { Tier, getTier } from "@/app/contracts_integrations/tiers";
import { getUnixTime } from "date-fns";

const inter = Inter({
  subsets: ["latin"],
});

export default function Ido() {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [general, setGeneral] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [currentPhase, setCurrentPhase] = useState<string | null>(null);
  const [selectedToken, setSelectedToken] = useState("");
  const [tier, setTier] = useState<Tier | null>(null);

  const { signer, account } = useContext(StateContext);

  const { ido: idoID } = useParams();

  const ido = IDO_LIST.find((item) => item.id.includes(idoID as string));
  const idoIndex = IDO_LIST.findIndex((item) =>
    item.id.includes(idoID as string)
  );
  const bg = `url("${ido?.idoImageSrc}")`;

  // ============================================================================================================
  // ADMIN FUNCTIONS
  // ============================================================================================================

  const onTogglePause = useCallback(async () => {
    setIsLoading(true);
    if (account && general && account === general.owner && signer) {
      await togglePause(idoIndex, signer);
      await getGeneralData();
      await getUserInfos();
    }

    setIsLoading(false);
  }, [signer, idoIndex, general, account, setIsLoading]);

  const onWithdraw = useCallback(async () => {
    setIsLoading(true);
    if (account && general && account === general.owner && signer) {
      await withdraw(idoIndex, signer);
      await getGeneralData();
      await getUserInfos();
    }

    setIsLoading(false);
  }, [signer, idoIndex, general, account, setIsLoading]);

  const onMakePublic = useCallback(async () => {
    setIsLoading(true);
    if (account && general && account === general.owner && signer) {
      await makePublic(idoIndex, signer);
      await getGeneralData();
      await getUserInfos();
    }

    setIsLoading(false);
  }, [signer, idoIndex, general, account, setIsLoading]);

  // ============================================================================================================
  // END ADMIN FUNCTIONS
  // ============================================================================================================

  // ============================================================================================================
  // USER ACTIONS
  // ============================================================================================================

  const onInputChange = (value: string) => {
    const re = new RegExp("^[+]?([0-9]+([.][0-9]*)?|[.][0-9]+)$");

    if (value === "" || re.test(value)) {
      setInputValue(value);
    }

    return false;
  };

  const onRegister = useCallback(async () => {
    setIsLoading(true);
    if (signer && user && !user.isWhitelisted) {
      await register(idoIndex, signer);
      await getGeneralData();
      await getUserInfos();
    }

    setIsLoading(false);
  }, [signer, idoIndex, user, setIsLoading]);

  const onParticipate = useCallback(async () => {
    setIsLoading(true);
    if (
      signer &&
      selectedToken !== "" &&
      user &&
      (user.isWhitelisted || general.isPublic)
    ) {
      await participate(idoIndex, signer, inputValue, selectedToken);
      await getGeneralData();
      await getUserInfos();
    }

    setIsLoading(false);
  }, [signer, idoIndex, selectedToken, user, inputValue, setIsLoading]);

  // ============================================================================================================
  // FETCHING USER INFOS FROM CONTRACT
  // ============================================================================================================

  const getUserInfos = useCallback(async () => {
    if (signer) {
      const response = await userInfo(idoIndex, signer);
      setUser(response);
    }
  }, [signer, idoIndex]);

  const getTierInfos = useCallback(async () => {
    if (signer) {
      const tier = await getTier(signer);
      if (tier) setTier(tier);
    }
  }, [signer, idoIndex]);

  useEffect(() => {
    getUserInfos();
    getTierInfos();
  }, [signer]);

  // ============================================================================================================
  // FETCHING GENERAL DATA FROM CONTRACT
  // ============================================================================================================

  const getGeneralData = useCallback(async () => {
    if (idoIndex !== -1) {
      const response = await generalInfo(idoIndex);
      setGeneral(response);
      selectedToken === "" && setSelectedToken(response?.acceptedToken);
    }

    if (idoIndex !== -1) {
      const phase = await getParticipationPhase(idoIndex);
      setCurrentPhase(phase);
    }
  }, [idoIndex, selectedToken, setCurrentPhase]);

  useEffect(() => {
    getGeneralData();
  }, [idoID]);

  return (
    <>
      <TopLayout
        style={{
          backgroundImage: bg,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          boxShadow: "inset 0px 0px 800px 800px rgba(0, 0, 0, .65)",
        }}
      >
        <div className="flex flex-col pt-10 lg:pt-14">
          <div className="flex flex-col xl:flex-row items-center justify-between relative">
            <div className="relative md:mr-12 xl:max-w-[900px] px-6 lg:px-8 xl:px-20">
              <Link
                href="/launchpad"
                className="transition-all text-white/40 hover:text-white hidden xl:block"
              >
                <svg
                  data-slot="icon"
                  fill="none"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  className="xl:w-20 mb-14"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                  ></path>
                </svg>
              </Link>

              <div className="flex flex-col text-[38px] sm:text-[58px] lg:text-[70px] font-black leading-[58px] sm:leading-[68px] lg:leading-[98px] text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] relative">
                <div className="flex items-center gap-5">
                  {ido?.logo} {ido?.projectName}
                </div>
                <div className="flex items-center gap-4 pt-5">
                  {ido?.tokenNetwork !== "TO BE ANNOUNCED" && (
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
                  )}

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
                className={`leading-normal lg:leading-relaxed font-light pt-6 lg:text-[28px] xl:max-w-[860px] drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] pb-10 ${inter.className}`}
              >
                {ido?.projectDescription}
              </p>

              <div className="flex items-center w-full gap-8">
                {ido?.socials.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className={`transition-all hover:opacity-75 text-white ${
                      item.svg === discord
                        ? "scale-[1.7]"
                        : item.svg === youtube
                        ? "scale-[1.9] mx-2"
                        : "scale-[1.2]"
                    }`}
                    target="_blank"
                  >
                    {item.svg}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex flex-col lg:pr-20 gap-10">
              <div className="flex flex-col">
                <div className="flex flex-col w-full xl:w-[700px] lg:rounded-[8px] bg-black/70 py-14 mt-[70px] xl:mt-[170px] shadow-xl lg:border border-white/20">
                  <div className="text-xl xl:text-3xl bg-samurai-red px-7 py-3 text-white">
                    <span>{ido?.projectName}</span> {" | "}
                    {general?.isPublic ? "Pulic Round" : ido?.investmentRound}
                  </div>
                  <div className="flex flex-row mt-6 lg:mt-10 bg-black-900/90 stroke-white rounded-[8px] text-white border border-white/20 mx-4 lg:mx-8">
                    {ido?.simplified &&
                      simplifiedPhasesV2.map((phase, index) => (
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
                              className="w-2 md:w-6 "
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
                            className={`p-2 flex-1 text-[14px] md:text-normal  xl:text-xl ${
                              phase.title === currentPhase
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
                    <div className="flex flex-col gap-10 px-8">
                      {/* PARTICIPATION PHASE BLOCK */}
                      <div className="flex justify-start lg:grid lg:grid-cols-2 gap-1 items-center flex-wrap mt-6">
                        <div className="flex items-center gap-2 py-2 px-2 text-[16px] rounded-md w-max min-w-[300px]">
                          <span className="text-samurai-red">IDO START:</span>
                          <p className="text-white/70">
                            {formattedDate(
                              ido.participationStartsAt
                            ).toUpperCase()}{" "}
                            UTC
                          </p>
                        </div>
                        <div className="flex items-center gap-2 py-2 px-2 text-[16px] rounded-md w-max min-w-[300px]">
                          <span className="text-samurai-red">IDO END:</span>
                          <p className="text-white/70">
                            {formattedDate(
                              ido.participationEndsAt
                            ).toUpperCase()}{" "}
                            UTC
                          </p>
                        </div>
                        <div className="flex items-center gap-2 py-2 px-2 text-[16px] rounded-md w-max min-w-[300px]">
                          <span className="text-samurai-red">FCFS START:</span>
                          <p className="text-white/70">
                            {formattedDate(
                              ido.publicParticipationStartsAt
                            ).toUpperCase()}{" "}
                            UTC
                          </p>
                        </div>
                        <div className="flex items-center gap-2 py-2 px-2 text-[16px] rounded-md w-max min-w-[300px]">
                          <span className="text-samurai-red">FCFS END:</span>
                          <p className="text-white/70">
                            {formattedDate(
                              ido.publicParticipationEndsAt
                            ).toUpperCase()}{" "}
                            UTC
                          </p>
                        </div>
                        <div className="flex items-center gap-2 py-2 px-2 text-[16px] rounded-md w-max min-w-[300px]">
                          <span className="text-samurai-red">TGE DATE:</span>
                          <p className="text-white/70">
                            {ido.tgeDate === 0
                              ? "TO BE ANNOUNCED"
                              : formattedDateSimple(ido.tgeDate).toUpperCase()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 py-2 px-2 text-[16px] rounded-md w-max min-w-[300px]">
                          <span className="text-samurai-red">
                            TOKEN SYMBOL:
                          </span>
                          <p className="text-white/70">
                            {ido.projectTokenSymbol}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 py-2 px-2 text-[16px] rounded-md w-max min-w-[300px]">
                          <span className="text-samurai-red">TOKEN PRICE:</span>
                          <p className="text-white/70">
                            ${ido.price} {ido.acceptedTokenSymbol}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 py-2 px-2 text-[16px] rounded-md w-max min-w-[300px]">
                          <span className="text-samurai-red">RAISED:</span>
                          <p className="text-white/70">
                            $
                            {Number(general?.raised | 0).toLocaleString(
                              "en-us"
                            )}{" "}
                            {ido?.acceptedTokenSymbol}
                          </p>
                        </div>

                        {signer && account && (
                          <div className="flex items-center gap-2 py-2 px-2 text-[16px] rounded-md w-max min-w-[300px]">
                            <span className="text-samurai-red">MIN:</span>
                            <p className="text-white/70">
                              $
                              {Number(
                                user?.walletRange?.minPerWallet | 0
                              ).toLocaleString("en-us")}{" "}
                              {ido?.acceptedTokenSymbol}
                            </p>
                          </div>
                        )}

                        {signer && account && (
                          <div className="flex items-center gap-2 py-2 px-2 text-[16px] rounded-md w-max min-w-[300px]">
                            <span className="text-samurai-red">MAX:</span>
                            <p className="text-white/70">
                              $
                              {Number(
                                user?.walletRange?.maxPerWallet | 0
                              ).toLocaleString("en-us")}{" "}
                              {ido?.acceptedTokenSymbol}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* REGISTER BUTTON */}

                      {(currentPhase?.toLocaleLowerCase() === "registration" ||
                        currentPhase?.toLocaleLowerCase() ===
                          "participation") &&
                        getUnixTime(new Date()) >= ido.registrationStartsAt &&
                        user?.walletRange.name.toLowerCase() !== "public" &&
                        !user?.isWhitelisted && (
                          <button
                            onClick={onRegister}
                            disabled={
                              isLoading ||
                              !general ||
                              !user ||
                              general?.isPaused
                            }
                            className={`
                      ${
                        isLoading || !general || !user || general?.isPaused
                          ? "bg-black text-white/20"
                          : "bg-samurai-red text-white hover:opacity-75"
                      }
                         rounded-[8px] w-full mt-4 py-4 text-[18px] text-center transition-all `}
                          >
                            {isLoading ? "Loading..." : "REGISTER"}
                          </button>
                        )}

                      {/* PARTICIPATION */}

                      {currentPhase?.toLowerCase() === "participation" &&
                        user?.allocation < user?.walletRange?.maxPerWallet &&
                        (user?.isWhitelisted || general?.isPublic) && (
                          <div className="flex flex-col">
                            <div className="flex items-center justify-between">
                              <span className="self-end text-[10px] lg:text-sm mb-1 mr-1">
                                MIN{" "}
                                {Number(
                                  user?.walletRange?.minPerWallet
                                ).toLocaleString("en-us", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                                {" / "}
                                MAX{" "}
                                {Number(
                                  user?.walletRange?.maxPerWallet
                                ).toLocaleString("en-us", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}{" "}
                                {TOKENS_TO_SYMBOL[selectedToken]}
                              </span>
                              <button
                                onClick={() =>
                                  onInputChange(user.balanceToken.toString())
                                }
                                className="self-end text-[10px] lg:text-sm mb-1 hover:text-samurai-red mr-1"
                              >
                                BALANCE:{" "}
                                {Number(user.balanceToken).toLocaleString(
                                  "en-us"
                                )}{" "}
                                {TOKENS_TO_SYMBOL[selectedToken]}
                              </button>
                            </div>

                            <div className="relative">
                              <input
                                type="text"
                                placeholder={`${TOKENS_TO_SYMBOL[selectedToken]} to allocate`}
                                className="w-full p-2 lg:p-4 rounded-[8px] placeholder-black/50 text-black"
                                value={inputValue}
                                onChange={(e) => onInputChange(e.target.value)}
                              />
                              <div className="absolute top-[7px] lg:top-3 right-2 flex items-center gap-2">
                                <Image
                                  src="/usdc-icon.svg"
                                  width={32}
                                  height={32}
                                  alt="USDC"
                                  placeholder="blur"
                                  blurDataURL="/usdc-icon.svg"
                                  className="w-6 h-6 lg:w-[32px] lg:h-[32px]"
                                />
                                <div className="flex items-center text-black/80 mr-2 text-lg lg:text-2xl font-bold">
                                  <span>{TOKENS_TO_SYMBOL[selectedToken]}</span>
                                </div>
                              </div>
                            </div>

                            {/* PARTICIPATE BUTTON */}

                            <button
                              onClick={onParticipate}
                              disabled={
                                isLoading ||
                                !general ||
                                !user ||
                                general?.isPaused ||
                                (!user?.isWhitelisted && !general?.isPublic) ||
                                inputValue === "" ||
                                Number(inputValue) === 0 ||
                                Number(inputValue) < general?.minPerWallet ||
                                Number(inputValue) > general?.maxPerWallet ||
                                Number(general?.raised >= 150_000)
                              }
                              className={`
                            ${
                              isLoading ||
                              !general ||
                              !user ||
                              general?.isPaused ||
                              (!user.isWhitelisted && !general?.isPublic) ||
                              inputValue === "" ||
                              Number(inputValue) === 0 ||
                              Number(inputValue) < general?.minPerWallet ||
                              Number(inputValue) > general?.maxPerWallet ||
                              Number(general?.raised >= 150_000)
                                ? "bg-black text-white/20"
                                : "bg-samurai-red text-white hover:opacity-75"
                            }
                               rounded-[8px] w-full mt-4 py-4 text-[18px] text-center transition-all `}
                            >
                              {isLoading ? "Loading..." : "PARTICIPATE"}
                            </button>
                          </div>
                        )}

                      {(currentPhase?.toLowerCase() === "participation" ||
                        currentPhase?.toLowerCase() === "completed") &&
                        user?.allocation > 0 && (
                          <div className="flex flex-row justify-between items-center flex-wrap gap-4">
                            <div className="p-4 px-6 border border-white/20 rounded-[8px] w-[300px]">
                              <p className={`text-lg ${inter.className}`}>
                                MY ALLOCATION
                              </p>
                              <p className="text-2xl text-samurai-red">
                                $
                                {user.allocation.toLocaleString("en-us", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </p>
                            </div>

                            <div className="p-4 px-6 border border-white/20 rounded-[8px] w-[300px]">
                              <p className={`text-lg ${inter.className}`}>
                                TOKENS TO RECEIVE
                              </p>
                              <p className="text-2xl text-samurai-red">
                                {(
                                  Number(user?.allocation) / Number(ido.price)
                                )?.toLocaleString("en-us", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}{" "}
                                {ido.projectTokenSymbol}
                              </p>
                            </div>
                            <div className="p-4 px-6 border border-white/20 rounded-[8px] w-[300px]">
                              <p className={`text-lg ${inter.className}`}>
                                {ido.tgePercentage}% TGE RELEASE
                              </p>
                              <p className="text-2xl text-samurai-red">
                                {(
                                  ((Number(user?.allocation) /
                                    Number(ido.price)) *
                                    ido.tgePercentage) /
                                  100
                                ).toLocaleString("en-us", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}{" "}
                                {ido.projectTokenSymbol}
                              </p>
                            </div>
                            <div className="p-4 px-6 border border-white/20 rounded-[8px] w-[300px]">
                              <p className={`text-lg ${inter.className}`}>
                                {100 - ido.tgePercentage}% VESTING RELEASE
                              </p>
                              <p className="text-2xl text-samurai-red">
                                {(
                                  ((Number(user?.allocation) /
                                    Number(ido.price)) *
                                    (100 - ido.tgePercentage)) /
                                  100
                                ).toLocaleString("en-us", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}{" "}
                                {ido.projectTokenSymbol}
                              </p>
                            </div>
                          </div>
                        )}

                      {/* TIER */}
                      {signer && account && (
                        <>
                          <div
                            className={`text-2xl text-white/80 pt-10 border-t border-white/20 leading-normal ${inter.className}`}
                          >
                            <p className="text-samurai-red text-[16px]">
                              YOUR TIER:
                            </p>
                            {tier
                              ? tier?.name === ""
                                ? "PUBLIC"
                                : tier?.name.toUpperCase()
                              : "loading..."}
                          </div>
                        </>
                      )}

                      {/* TGE PHASE BLOCK */}
                      {currentPhase?.toLowerCase() === "completed" && (
                        <>
                          <div
                            className={`text-2xl text-white/80 pt-10 border-t border-white/20 leading-normal ${inter.className}`}
                          >
                            <p className="text-samurai-red text-[16px]">
                              TOKEN DISTRIBUTION:
                            </p>
                            TO BE ANNOUNCED
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <IdoAllocationProgress
                maxAllocations={general?.maxAllocations || 0}
                raised={general?.raised || 0}
              />
            </div>
          </div>
        </div>
      </TopLayout>
      <div className="flex flex-col xl:flex-row  gap-10 pt-10 lg:pt-24 pb-10 xl:pb-32 border-t border-white/20 bg-white/10 ">
        {ido && (
          <>
            <div className="flex flex-col gap-10 px-6 lg:px-8 xl:px-20">
              <div
                className={`flex w-full !leading-[28px] font-light lg:text-lg drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] text-gray-300 ${inter.className}`}
                dangerouslySetInnerHTML={{
                  __html: ido.bigDescription as string,
                }}
              />
              <div className="w-[350px] min-w-[350px] h-[350px] min-h-[350px] lg:w-[800px] lg:min-w-[800px] lg:h-[800px] lg:min-h-[800px]">
                <Carousel leftControl=" " rightControl=" ">
                  {ido?.images?.map((image, index) => (
                    <Image
                      key={index}
                      src={image}
                      width={500}
                      height={500}
                      className="h-full"
                      alt="..."
                    />
                  ))}
                </Carousel>
              </div>
            </div>

            <div className="flex flex-col w-full xl:w-[700px] lg:rounded-[8px] bg-black/70 py-8 lg:py-[50px] shadow-xl lg:border border-white/20 h-max lg:mr-20">
              <h1 className="text-2xl xl:text-3xl bg-samurai-red px-6 py-3">
                TOKEN INFO
              </h1>
              <div className="flex flex-col gap-4 xl:gap-8 mt-8 lg:mt-16 text-[15px] xl:text-xl px-6">
                <div className="flex flex-col lg:flex-row lg:items-center gap-2 bg-black/50 py-2 lg:px-4 lg:rounded-md w-max lg:border border-white/10 text-sm lg:text-xl">
                  <span className="text-samurai-red">TOKEN SYMBOL:</span>
                  <p className="text-white/70">{ido.projectTokenSymbol}</p>
                </div>
                <div className="flex flex-col lg:flex-row lg:items-center gap-2 bg-black/50 py-2 lg:px-4 lg:rounded-md w-max lg:border border-white/10 text-sm lg:text-xl">
                  <span className="text-samurai-red">NETWORK:</span>
                  <p className="text-white/70">{ido.tokenNetwork}</p>
                </div>
                <div className="flex flex-col lg:flex-row lg:items-center gap-2 bg-black/50 py-2 lg:px-4 lg:rounded-md w-max lg:border border-white/10 text-sm lg:text-xl">
                  <span className="text-samurai-red">FDV:</span>
                  <p className="text-white/70">
                    $
                    {Number(ido.fdv).toLocaleString("en-us", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    USD
                  </p>
                </div>
                <div className="flex flex-col lg:flex-row lg:items-center gap-2 bg-black/50 py-2 lg:px-4 lg:rounded-md w-max lg:border border-white/10 text-sm lg:text-xl">
                  <span className="text-samurai-red">
                    EXCHANGE LISTING PRICE:
                  </span>
                  <p className="text-white/70">
                    {Number(ido.exchangeListingPrice).toLocaleString("en-us", {
                      maximumFractionDigits: 4,
                    })}{" "}
                    {ido.projectTokenSymbol}
                  </p>
                </div>

                <div className="flex flex-col lg:flex-row lg:items-center gap-2 bg-black/50 py-2 lg:px-4 lg:rounded-md w-max lg:border border-white/10 text-sm lg:text-xl">
                  <span className="text-samurai-red">MARKET CAP AT TGE:</span>
                  <p className="text-white/70">
                    $
                    {Number(ido.marketCapAtTGE).toLocaleString("en-us", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    USD
                  </p>
                </div>

                <div className="flex flex-col lg:flex-row lg:items-center gap-2 bg-black/50 py-2 lg:px-4 lg:rounded-md lg:w-max lg:border border-white/10 text-sm lg:text-xl">
                  <span className="text-samurai-red">VESTING:</span>
                  <p className="text-white/70">{ido.vesting.toUpperCase()}</p>
                </div>

                <div className="flex flex-col lg:flex-row lg:items-center gap-2 bg-black/50 py-2 lg:px-4 lg:rounded-md w-max lg:border border-white/10 text-sm lg:text-xl">
                  <span className="text-samurai-red">DEX SCREENER:</span>
                  <p className="text-white/70">
                    TO BE ANNOUNCED
                    {/* <Link href="#">{"https://somelink".toUpperCase()}</Link> */}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ============================================================================================================ */}
      {/* ADMIN AREA */}
      {/* ============================================================================================================ */}

      {general && account && general.owner === account && (
        <div className="flex flex-col xl:flex-row  gap-10 pt-24 pb-10 xl:pb-32 px-6 lg:px-8 xl:px-20 border-t border-white/20 w-full">
          {ido && (
            <div className="flex flex-col gap-10">
              <h1 className="text-2xl xl:text-3xl">ADMIN AREA</h1>
              <div className="flex items-center gap-10 flex-wrap">
                <SSButton disabled={isLoading} click={onTogglePause}>
                  {isLoading
                    ? "Loading..."
                    : general.isPaused
                    ? "Unpause"
                    : "Pause"}
                </SSButton>
                <SSButton
                  disabled={isLoading || general.isPublic}
                  click={onMakePublic}
                >
                  {isLoading ? "Loading..." : "Make Public"}
                </SSButton>
              </div>

              <div className="flex flex-col gap-2">
                <p>
                  TOTAL {TOKENS_TO_SYMBOL[general.acceptedToken1]}:{" "}
                  {Number(user?.acceptedToken1Balance | 0).toLocaleString(
                    "en-us",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}
                </p>
                <p>
                  TOTAL {TOKENS_TO_SYMBOL[general.acceptedToken2]}:{" "}
                  {Number(user?.acceptedToken2Balance | 0).toLocaleString(
                    "en-us",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}
                </p>
                <div className="w-max">
                  <SSButton disabled={isLoading} click={onWithdraw}>
                    {isLoading ? "Loading..." : "Withdraw Participations"}
                  </SSButton>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
