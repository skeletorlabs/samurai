import Link from "next/link";
import Image from "next/image";
import Layout from "@/components/layout";
import { Inter } from "next/font/google";
import { useState, Fragment, useContext, useEffect, useCallback } from "react";
import TopLayout from "@/components/topLayout";
import { useRouter } from "next/router";

import {
  IDO_LIST,
  TOKENS_TO_SYMBOL,
  simplifiedPhases,
} from "@/utils/constants";
import { formattedDate } from "@/utils/formattedDate";
import { discord, youtube } from "@/utils/svgs";
import SSButton from "@/components/ssButton";
import { StateContext } from "@/context/StateContext";
import { useNetwork } from "wagmi";
import {
  addToBlacklist,
  addToWhitelist,
  generalInfo,
  getParticipationPhase,
  makePublic,
  participate,
  togglePause,
  userInfo,
  withdraw,
} from "@/contracts_integrations/ido";

const inter = Inter({
  subsets: ["latin"],
});

export default function Ido() {
  const [inputValue, setInputValue] = useState("");
  const [whitelistAddresses, setWhitelistAddresses] = useState<string[] | []>(
    []
  ); // admin area
  const [blacklistAddress, setBlacklistAddress] = useState(""); // admin area
  const [isLoading, setIsLoading] = useState(false);
  const [general, setGeneral] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [currentPhase, setCurrentPhase] = useState<string | null>(null);
  const [selectedToken, setSelectedToken] = useState("");
  const [tokenSelectionOpen, setTokenSelectionOpen] = useState(false);

  const { signer, account } = useContext(StateContext);
  const { chain } = useNetwork();
  const { query } = useRouter();
  const { ido: idoID } = query;

  const ido = IDO_LIST.find((item) => item.id.includes(idoID as string));
  const idoIndex = IDO_LIST.findIndex((item) =>
    item.id.includes(idoID as string)
  );
  const bg = `url("${ido?.idoImageSrc}")`;

  // ============================================================================================================
  // ADMIN FUNCTIONS
  // ============================================================================================================

  const onTextAreaChange = (value: string) => {
    const addresses: string[] = value
      .toString()
      .replaceAll(" ", "")
      .replaceAll("\n", "")
      .split(",");
    setWhitelistAddresses(addresses);
  };

  const onTogglePause = useCallback(async () => {
    setIsLoading(true);
    if (
      account &&
      general &&
      account === general.owner &&
      signer &&
      chain &&
      !chain.unsupported
    ) {
      await togglePause(idoIndex, signer);
      await getGeneralData();
      await getUserInfos();
    }

    setIsLoading(false);
  }, [chain, signer, idoIndex, general, account, setIsLoading]);

  const onWithdraw = useCallback(async () => {
    setIsLoading(true);
    if (
      account &&
      general &&
      account === general.owner &&
      signer &&
      chain &&
      !chain.unsupported
    ) {
      await withdraw(idoIndex, signer);
      await getGeneralData();
      await getUserInfos();
    }

    setIsLoading(false);
  }, [chain, signer, idoIndex, general, account, setIsLoading]);

  const onMakePublic = useCallback(async () => {
    setIsLoading(true);
    if (
      account &&
      general &&
      account === general.owner &&
      signer &&
      chain &&
      !chain.unsupported
    ) {
      await makePublic(idoIndex, signer);
      await getGeneralData();
      await getUserInfos();
    }

    setIsLoading(false);
  }, [chain, signer, idoIndex, general, account, setIsLoading]);

  const onAddToWhitelist = useCallback(async () => {
    setIsLoading(true);

    if (
      signer &&
      chain &&
      !chain.unsupported &&
      whitelistAddresses.length > 0
    ) {
      await addToWhitelist(idoIndex, signer, whitelistAddresses);
      await getGeneralData();
      await getUserInfos();
    }

    setIsLoading(false);
  }, [chain, signer, whitelistAddresses, idoIndex, setIsLoading]);

  const onAddToBlacklist = useCallback(async () => {
    setIsLoading(true);

    if (signer && chain && !chain.unsupported && blacklistAddress.length > 0) {
      await addToBlacklist(idoIndex, signer, blacklistAddress);
      await getGeneralData();
      await getUserInfos();
    }

    setIsLoading(false);
  }, [chain, signer, blacklistAddress, idoIndex, setIsLoading]);

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

  const onParticipate = useCallback(async () => {
    setIsLoading(true);
    if (
      signer &&
      chain &&
      !chain.unsupported &&
      selectedToken !== "" &&
      user &&
      !user.isBlacklisted &&
      (user.isWhitelisted || general.isPublic)
    ) {
      await participate(idoIndex, signer, inputValue, selectedToken);
      await getGeneralData();
      await getUserInfos();
    }

    setIsLoading(false);
  }, [
    chain,
    signer,
    blacklistAddress,
    idoIndex,
    selectedToken,
    user,
    inputValue,
    setIsLoading,
  ]);

  // ============================================================================================================
  // FETCHING USER INFOS FROM CONTRACT
  // ============================================================================================================

  const getUserInfos = useCallback(async () => {
    if (signer && chain && !chain.unsupported) {
      const response = await userInfo(idoIndex, signer);
      setUser(response);
    }
  }, [signer, chain, idoIndex]);

  useEffect(() => {
    getUserInfos();
  }, [signer]);

  // ============================================================================================================
  // FETCHING GENERAL DATA FROM CONTRACT
  // ============================================================================================================

  const getGeneralData = useCallback(async () => {
    if (chain && !chain.unsupported && idoIndex !== -1) {
      const response = await generalInfo(idoIndex);
      setGeneral(response);
      selectedToken === "" && setSelectedToken(response?.acceptedToken1);
    }

    if (idoIndex !== -1) {
      const phase = await getParticipationPhase(idoIndex);
      setCurrentPhase(phase);
    }
  }, [chain, idoIndex, selectedToken, setCurrentPhase]);

  useEffect(() => {
    getGeneralData();
  }, [idoID]);

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

              <div className="flex flex-col text-[38px] sm:text-[58px] lg:text-[90px] font-black leading-[58px] sm:leading-[68px] lg:leading-[98px] text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] relative">
                {ido?.projectName}
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

            <div className="flex flex-col lg:pr-20">
              <div className="flex flex-col w-full xl:w-[700px] lg:rounded-[8px] bg-black/70 py-14 mt-[70px] xl:mt-[170px] shadow-xl lg:border border-white/20">
                {/* <div className="text-center text-xl xl:text-2xl text-white"> */}
                <div className="text-xl xl:text-3xl bg-samurai-red px-7 py-3 text-white">
                  <span>{ido?.projectName}</span> {" | "}
                  {ido?.investmentRound}
                </div>
                <div className="flex flex-row mt-6 lg:mt-10 bg-black-900/90 stroke-white rounded-[8px] text-white border border-white/20 mx-4 lg:mx-8">
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
                          className={`p-2 flex-1  xl:text-2xl ${
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
                          {formattedDate(ido.participationEndsAt).toUpperCase()}{" "}
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
                          TO BE ANNOUNCED
                          {/* {formattedDate(ido.tgeDate).toUpperCase()} */}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 py-2 px-2 text-[16px] rounded-md w-max min-w-[300px]">
                        <span className="text-samurai-red">TOKEN SYMBOL:</span>
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
                          {(50_000).toLocaleString("en-us", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}{" "}
                          {ido?.acceptedTokenSymbol}
                        </p>
                      </div>
                    </div>

                    {/* UPCOMING BLOCK */}
                    {currentPhase?.toLowerCase() === "upcoming" && (
                      <>
                        <div className={`relative w-full h-24`}>
                          <Image
                            src="/IDOs/havens-compass-logo.svg"
                            alt="logo"
                            fill
                          />
                        </div>
                      </>
                    )}

                    {currentPhase?.toLowerCase() === "participation" &&
                      user?.allocation === 0 && (
                        <div className="flex flex-col">
                          <div className="flex items-center justify-between">
                            <span className="self-end text-[10px] lg:text-sm mb-1 mr-1">
                              MIN{" "}
                              {Number(general?.minPerWallet).toLocaleString(
                                "en-us",
                                {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                }
                              )}
                              {" / "}
                              MAX{" "}
                              {Number(general?.maxPerWallet).toLocaleString(
                                "en-us",
                                {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                }
                              )}{" "}
                              {TOKENS_TO_SYMBOL[selectedToken]}
                            </span>
                            <button
                              onClick={() =>
                                onInputChange(
                                  selectedToken === general.acceptedToken1
                                    ? user.balanceToken1.toString()
                                    : user.balanceToken2.toString()
                                )
                              }
                              className="self-end text-[10px] lg:text-sm mb-1 hover:text-samurai-red mr-1"
                            >
                              BALANCE:{" "}
                              {Number(
                                selectedToken === general.acceptedToken1
                                  ? user.balanceToken1
                                  : user.balanceToken2
                              ).toLocaleString("en-us", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}{" "}
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
                              <button
                                onClick={() =>
                                  setTokenSelectionOpen(!tokenSelectionOpen)
                                }
                                className="text-black/80 mr-2 text-lg lg:text-2xl font-bold hover:text-samurai-red"
                              >
                                {TOKENS_TO_SYMBOL[selectedToken]}
                              </button>
                            </div>
                            <div
                              className={`${
                                tokenSelectionOpen ? "flex" : "hidden"
                              } absolute top-12 lg:top-16 right-0 flex-col gap-2 lg:gap-4 bg-white text-black/80 p-4 rounded-[8px] shadow-xl z-20`}
                            >
                              <button
                                onClick={() => {
                                  setSelectedToken(general.acceptedToken1);
                                  setTokenSelectionOpen(!tokenSelectionOpen);
                                }}
                                className="flex items-center gap-2"
                              >
                                <Image
                                  src="/usdc-icon.svg"
                                  width={32}
                                  height={32}
                                  alt="USDC"
                                  placeholder="blur"
                                  blurDataURL="/usdc-icon.svg"
                                  className="w-6 h-6 lg:w-[32px] lg:h-[32px]"
                                />
                                <span className="mr-2 text-lg lg:text-2xl font-bold hover:text-samurai-red">
                                  {TOKENS_TO_SYMBOL[general.acceptedToken1]}
                                </span>
                              </button>

                              <div className="w-full h-[1px] bg-black/20" />

                              <button
                                onClick={() => {
                                  setSelectedToken(general.acceptedToken2);
                                  setTokenSelectionOpen(!tokenSelectionOpen);
                                }}
                                className="flex items-center gap-2"
                              >
                                <Image
                                  src="/usdc-icon.svg"
                                  width={32}
                                  height={32}
                                  alt="USDC"
                                  placeholder="blur"
                                  blurDataURL="/usdc-icon.svg"
                                  className="w-6 h-6 lg:w-[32px] lg:h-[32px]"
                                />
                                <span className="mr-2 text-lg lg:text-2xl font-bold hover:text-samurai-red">
                                  {TOKENS_TO_SYMBOL[general.acceptedToken2]}
                                </span>
                              </button>
                            </div>
                          </div>

                          {/* PARTICIPATE BUTTON */}

                          <button
                            onClick={onParticipate}
                            disabled={
                              isLoading ||
                              !general ||
                              !user ||
                              general.isPaused ||
                              user.isBlacklisted ||
                              (!user.isWhitelisted && !general.isPublic) ||
                              inputValue === "" ||
                              Number(inputValue) === 0 ||
                              Number(inputValue) < general.minPerWallet ||
                              Number(inputValue) > general.maxPerWallet ||
                              Number(general?.raised >= 50_000)
                            }
                            className={`
                            ${
                              isLoading ||
                              !general ||
                              !user ||
                              general.isPaused ||
                              user.isBlacklisted ||
                              (!user.isWhitelisted && !general.isPublic) ||
                              inputValue === "" ||
                              Number(inputValue) === 0 ||
                              Number(inputValue) < general.minPerWallet ||
                              Number(inputValue) > general.maxPerWallet ||
                              Number(general?.raised >= 50_000)
                                ? "bg-black text-white/20"
                                : "bg-samurai-red text-white hover:opacity-75"
                            }
                               rounded-[8px] w-full mt-4 py-4 text-[18px] text-center transition-all `}
                          >
                            {isLoading ? "Loading..." : "PARTICIPATE"}
                          </button>
                        </div>
                      )}

                    {currentPhase?.toLowerCase() === "participation" &&
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
          </div>
        </div>
      </TopLayout>
      <div className="flex flex-col xl:flex-row  gap-10 pt-10 lg:pt-24 pb-10 xl:pb-32 border-t border-white/20 bg-white/10 ">
        {ido && (
          <>
            <div
              className={`flex w-full !leading-[28px] font-light px-6 lg:px-8 xl:px-20 lg:text-lg drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] text-gray-300 ${inter.className}`}
              dangerouslySetInnerHTML={{ __html: ido.bigDescription as string }}
            />
            <div className="flex flex-col w-full xl:w-[700px] lg:rounded-[8px] bg-black/70 py-8 lg:py-[70px] shadow-xl lg:border border-white/20 h-max lg:mr-20">
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
                    CIRCULATING SUPPLY AT TGE:
                  </span>
                  <p className="text-white/70">
                    {Number(ido.circulatingSupplyAtTGE).toLocaleString(
                      "en-us",
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }
                    )}{" "}
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
                  {Number(user?.acceptedToken1Balance).toLocaleString("en-us", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
                <p>
                  TOTAL {TOKENS_TO_SYMBOL[general.acceptedToken2]}:{" "}
                  {Number(user?.acceptedToken2Balance).toLocaleString("en-us", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
                <div className="w-max">
                  <SSButton disabled={isLoading} click={onWithdraw}>
                    {isLoading ? "Loading..." : "Withdraw Participations"}
                  </SSButton>
                </div>
              </div>

              {/* WHITELIST */}
              <div className="flex flex-col gap-5 bg-black border-t border-gray-800 py-8">
                <label>
                  Enter the addresses to be whitelisteds (max 1200 per
                  transaction)
                </label>
                <textarea
                  name=""
                  cols={30}
                  rows={10}
                  placeholder="Enter the wallets (separated by comma)"
                  className="text-black rounded-[8px] xl:w-[600px]"
                  onChange={(e) => onTextAreaChange(e.target.value)}
                ></textarea>
                <div>
                  <SSButton disabled={isLoading} click={onAddToWhitelist}>
                    {isLoading ? "Loading..." : "Add to Whitelist"}
                  </SSButton>
                </div>
              </div>

              {/* BLACKLIST */}
              <div className="flex flex-col gap-5 bg-black border-t border-gray-800 py-8">
                <label>Enter the address to be blacklisted</label>
                <input
                  type="text"
                  placeholder="Enter the wallet you want to blacklist"
                  className="text-black rounded-[8px] xl:w-[600px]"
                  onChange={(e) => setBlacklistAddress(e.target.value)}
                  value={blacklistAddress}
                />
                <div>
                  <SSButton disabled={isLoading} click={onAddToBlacklist}>
                    {isLoading ? "Loading..." : "Add to Blacklist"}
                  </SSButton>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
}
