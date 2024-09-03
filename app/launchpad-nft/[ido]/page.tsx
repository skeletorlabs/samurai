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
} from "@/app/utils/constants";
import { formattedDate, formattedDateSimple } from "@/app/utils/formattedDate";
import { discord, youtube } from "@/app/utils/svgs";
import SSButton from "@/app/components/ssButton";
import { StateContext } from "@/app/context/StateContext";
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
} from "@/app/contracts_integrations/idoNFT";
import IdoAllocationProgress from "@/app/components/idoAllocationProgress";

const inter = Inter({
  subsets: ["latin"],
});

export default function Ido() {
  const [amountOfNfts, setAmountOfNfts] = useState("");
  // admin area
  const [whitelistAddresses, setWhitelistAddresses] = useState<string[] | []>(
    []
  );
  const [blacklistAddress, setBlacklistAddress] = useState(""); // admin area
  const [whitelistSelected, setWhitelistSelected] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [general, setGeneral] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [currentPhase, setCurrentPhase] = useState<string | null>(null);
  const [selectedToken, setSelectedToken] = useState("");
  const [tokenSelectionOpen, setTokenSelectionOpen] = useState(false);

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

  const onAddToWhitelist = useCallback(async () => {
    setIsLoading(true);

    if (signer && whitelistAddresses.length > 0) {
      let list: string[] = [];
      whitelistAddresses.forEach((address) => {
        if (!list.find((item) => item === address)) {
          list.push(address);
        }
      });

      await addToWhitelist(idoIndex, signer, list, whitelistSelected);
      await getGeneralData();
      await getUserInfos();
    }

    setIsLoading(false);
  }, [signer, whitelistAddresses, whitelistSelected, idoIndex, setIsLoading]);

  const onAddToBlacklist = useCallback(async () => {
    setIsLoading(true);

    if (signer && blacklistAddress.length > 0) {
      await addToBlacklist(idoIndex, signer, blacklistAddress);
      await getGeneralData();
      await getUserInfos();
    }

    setIsLoading(false);
  }, [signer, blacklistAddress, idoIndex, setIsLoading]);

  // ============================================================================================================
  // END ADMIN FUNCTIONS
  // ============================================================================================================

  // ============================================================================================================
  // USER ACTIONS
  // ============================================================================================================

  const canParticipate = useCallback(() => {
    if (signer && general && user) {
      if (user.whitelistedInA && user.allocation < general.maxAPerWallet)
        return true;

      if (user.whitelistedInB && user.allocation < general.maxBPerWallet)
        return true;

      if (general.isPublic && user.allocation < general.maxPublicPerWallet)
        return true;
    }

    return false;
  }, [general, user, signer]);

  const onParticipate = useCallback(async () => {
    setIsLoading(true);
    if (
      signer &&
      selectedToken !== "" &&
      user &&
      !user.isBlacklisted &&
      (user.whitelistedInA || user.whitelistedInB || general.isPublic)
    ) {
      await participate(idoIndex, signer, amountOfNfts, selectedToken);
      await getGeneralData();
      await getUserInfos();
    }

    setIsLoading(false);
  }, [
    signer,
    blacklistAddress,
    idoIndex,
    selectedToken,
    user,
    amountOfNfts,
    setIsLoading,
  ]);

  // ============================================================================================================
  // FETCHING USER INFOS FROM CONTRACT
  // ============================================================================================================

  const getUserInfos = useCallback(async () => {
    if (signer) {
      const response = await userInfo(idoIndex, signer);
      setUser(response);
    }
  }, [signer, idoIndex]);

  useEffect(() => {
    getUserInfos();
  }, [signer]);

  // ============================================================================================================
  // FETCHING GENERAL DATA FROM CONTRACT
  // ============================================================================================================

  const getOptionsToBuy = useCallback(() => {
    const optionsToBuy = [];

    if (general && user) {
      const max = general?.isPublic
        ? general?.maxPublicPerWallet
        : user?.whitelistedInA
        ? general?.maxAPerWallet
        : user?.whitelistedInB
        ? general?.maxBPerWallet
        : 0;
      for (let index = 0; index < max - user?.allocation; index++) {
        optionsToBuy.push(index + 1);
      }
    }

    return optionsToBuy;
  }, [general, user]);

  const getGeneralData = useCallback(async () => {
    if (idoIndex !== -1) {
      const response = await generalInfo(idoIndex);
      setGeneral(response);
      selectedToken === "" && setSelectedToken(response?.acceptedToken1);
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
                <div className="flex items-center gap-5">{ido?.logo}</div>
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
                    <div className="flex flex-col gap-8 px-8">
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
                        {ido.publicParticipationStartsAt > 0 && (
                          <>
                            <div className="flex items-center gap-2 py-2 px-2 text-[16px] rounded-md w-max min-w-[300px]">
                              <span className="text-samurai-red">
                                FCFS START:
                              </span>
                              <p className="text-white/70">
                                {formattedDate(
                                  ido.publicParticipationStartsAt
                                ).toUpperCase()}{" "}
                                UTC
                              </p>
                            </div>
                            <div className="flex items-center gap-2 py-2 px-2 text-[16px] rounded-md w-max min-w-[300px]">
                              <span className="text-samurai-red">
                                FCFS END:
                              </span>
                              <p className="text-white/70">
                                {formattedDate(
                                  ido.publicParticipationEndsAt
                                ).toUpperCase()}{" "}
                                UTC
                              </p>
                            </div>
                          </>
                        )}
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
                            $
                            {Number(general?.pricePerToken | 0).toLocaleString(
                              "en-us",
                              {
                                maximumFractionDigits: 2,
                              }
                            )}{" "}
                            {ido.acceptedTokenSymbol}
                          </p>
                        </div>

                        {ido.projectName !== "KIP Protocol" && (
                          <div className="flex items-center gap-2 py-2 px-2 text-[16px] rounded-md w-max min-w-[300px]">
                            <span className="text-samurai-red">RAISED:</span>
                            <p className="text-white/70">
                              {Number(general?.raised | 0)}{" "}
                              {ido?.projectTokenSymbol}
                              {" ($"}
                              {Number(
                                general?.raisedInTokensPermitted | 0
                              ).toLocaleString("en-us", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}{" "}
                              {ido?.acceptedTokenSymbol}
                              {")"}
                            </p>
                          </div>
                        )}

                        {
                          signer &&
                            general &&
                            user &&
                            ido?.projectName !== "KIP Protocol" &&
                            (general?.isPublic ||
                              user?.whitelistedInA ||
                              user?.whitelistedInB) && (
                              <div className="flex items-center gap-2 py-2 px-2 text-[16px] rounded-md w-max min-w-[300px]">
                                <span className="text-samurai-red">MIN:</span>
                                <p className="text-white/70">
                                  {general?.isPublic
                                    ? general?.minPublic
                                    : user?.whitelistedInA
                                    ? general?.minAPerWallet
                                    : user?.whitelistedInB
                                    ? general?.minBPerWallet
                                    : 0 | 0}{" "}
                                  {ido.projectTokenSymbol}(s)
                                </p>
                              </div>
                            )
                          //  : (
                          //   <div className="flex items-center gap-2 py-2 px-2 text-[16px] rounded-md w-max min-w-[300px]">
                          //     {signer
                          //       ? "*WALLET NOT WHITELISTED, PLEASE WAIT FOR FCFS ROUND."
                          //       : ""}
                          //   </div>
                          // )
                        }

                        {signer &&
                        general &&
                        user &&
                        ido?.projectName !== "KIP Protocol" &&
                        (general?.isPublic ||
                          user?.whitelistedInA ||
                          user?.whitelistedInB) ? (
                          <div className="flex items-center gap-2 py-2 px-2 text-[16px] rounded-md w-max min-w-[300px]">
                            <span className="text-samurai-red">MAX:</span>
                            <p className="text-white/70">
                              {general?.isPublic
                                ? general?.maxPublic
                                : user?.whitelistedInA
                                ? general?.maxAPerWallet
                                : user?.whitelistedInB
                                ? general?.maxBPerWallet
                                : 0 | 0}{" "}
                              {ido.projectTokenSymbol}(s)
                            </p>
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>

                      {currentPhase?.toLowerCase() === "participation" &&
                        canParticipate() && (
                          <div className="flex flex-col w-full">
                            <div className="hidden lg:flex items-center justify-between text-[10px] lg:text-sm mb-1">
                              <span>Select an amount to buy</span>
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
                            </div>

                            <div className="relative">
                              <div className="flex lg:hidden flex-col gap-5">
                                {/* TOKEN SELECT */}
                                <div className="text-[12px] mb-[-10px]">
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
                                </div>
                                <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-lg w-[120px]">
                                  <Image
                                    src="/usdc-icon.svg"
                                    width={28}
                                    height={28}
                                    alt="USDC"
                                    placeholder="blur"
                                    blurDataURL="/usdc-icon.svg"
                                    className="w-6 h-6 lg:w-[28px] lg:h-[28px]"
                                  />
                                  <button
                                    onClick={() =>
                                      setTokenSelectionOpen(!tokenSelectionOpen)
                                    }
                                    className="flex items-center text-black/80 mr-2 text-lg lg:text-xl font-bold hover:text-samurai-red"
                                  >
                                    <span>
                                      {TOKENS_TO_SYMBOL[selectedToken]}
                                    </span>
                                    <div className="w-6 h-6 text-black ml-1">
                                      {tokenSelectionOpen ? (
                                        <svg
                                          data-slot="icon"
                                          fill="none"
                                          strokeWidth="1.5"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                          xmlns="http://www.w3.org/2000/svg"
                                          aria-hidden="true"
                                        >
                                          <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            d="m4.5 15.75 7.5-7.5 7.5 7.5"
                                          ></path>
                                        </svg>
                                      ) : (
                                        <svg
                                          data-slot="icon"
                                          fill="none"
                                          strokeWidth="1.5"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                          xmlns="http://www.w3.org/2000/svg"
                                          aria-hidden="true"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="m19.5 8.25-7.5 7.5-7.5-7.5"
                                          ></path>
                                        </svg>
                                      )}
                                    </div>
                                  </button>
                                </div>

                                <span>Select an amount to buy</span>
                                <div className="flex items-center gap-3">
                                  {getOptionsToBuy().map((item, index) => (
                                    <button
                                      key={index}
                                      onClick={() =>
                                        setAmountOfNfts(item.toString())
                                      }
                                      className={`flex items-center px-3 text-white rounded-full text-sm h-6 ${
                                        amountOfNfts === item.toString()
                                          ? "bg-samurai-red"
                                          : "bg-gray-400"
                                      }`}
                                    >
                                      {item} NODE{index > 0 && "S"}
                                    </button>
                                  ))}
                                </div>
                              </div>
                              <div className="hidden lg:flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  {getOptionsToBuy().map((item, index) => (
                                    <button
                                      key={index}
                                      onClick={() =>
                                        setAmountOfNfts(item.toString())
                                      }
                                      className={`flex items-center px-3 text-white rounded-full text-sm h-6 ${
                                        amountOfNfts === item.toString()
                                          ? "bg-samurai-red"
                                          : "bg-gray-400"
                                      }`}
                                    >
                                      {item} NODE{index > 0 && "S"}
                                    </button>
                                  ))}
                                </div>

                                {/* TOKEN SELECT */}
                                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg w-[150px]">
                                  <Image
                                    src="/usdc-icon.svg"
                                    width={28}
                                    height={28}
                                    alt="USDC"
                                    placeholder="blur"
                                    blurDataURL="/usdc-icon.svg"
                                    className="w-6 h-6 lg:w-[28px] lg:h-[28px]"
                                  />
                                  <button
                                    onClick={() =>
                                      setTokenSelectionOpen(!tokenSelectionOpen)
                                    }
                                    className="flex items-center text-black/80 mr-2 text-lg lg:text-xl font-bold hover:text-samurai-red"
                                  >
                                    <span>
                                      {TOKENS_TO_SYMBOL[selectedToken]}
                                    </span>
                                    <div className="w-6 h-6 text-black ml-1">
                                      {tokenSelectionOpen ? (
                                        <svg
                                          data-slot="icon"
                                          fill="none"
                                          strokeWidth="1.5"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                          xmlns="http://www.w3.org/2000/svg"
                                          aria-hidden="true"
                                        >
                                          <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            d="m4.5 15.75 7.5-7.5 7.5 7.5"
                                          ></path>
                                        </svg>
                                      ) : (
                                        <svg
                                          data-slot="icon"
                                          fill="none"
                                          strokeWidth="1.5"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                          xmlns="http://www.w3.org/2000/svg"
                                          aria-hidden="true"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="m19.5 8.25-7.5 7.5-7.5-7.5"
                                          ></path>
                                        </svg>
                                      )}
                                    </div>
                                  </button>
                                </div>
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
                                general?.isPaused ||
                                user?.isBlacklisted ||
                                (!user?.whitelistedInA &&
                                  !user?.whitelistedInB &&
                                  !general?.isPublic) ||
                                amountOfNfts === "" ||
                                Number(amountOfNfts) * general?.pricePerToken >
                                  Number(
                                    selectedToken === general.acceptedToken1
                                      ? user.balanceToken1
                                      : user.balanceToken2
                                  ) ||
                                Number(
                                  general?.raised >= general?.maxAllocations
                                )
                              }
                              className={`
                            ${
                              isLoading ||
                              !general ||
                              !user ||
                              general?.isPaused ||
                              user?.isBlacklisted ||
                              (!user.whitelistedInA &&
                                !user.whitelistedInB &&
                                !general?.isPublic) ||
                              amountOfNfts === "" ||
                              Number(amountOfNfts) * general?.pricePerToken >
                                Number(
                                  selectedToken === general.acceptedToken1
                                    ? user.balanceToken1
                                    : user.balanceToken2
                                ) ||
                              Number(general?.raised >= general?.maxAllocations)
                                ? "bg-black text-white/20"
                                : "bg-samurai-red text-white hover:opacity-75"
                            }
                               rounded-[8px] w-full mt-4 py-4 text-[18px] text-center transition-all `}
                            >
                              {isLoading ? "Loading..." : "PARTICIPATE"}
                            </button>
                          </div>
                        )}

                      <div className="p-4 px-6 border border-white/20 rounded-[8px] w-full bg-white/10">
                        <p className={`text-md ${inter.className}`}>VESTING</p>
                        <p className="text-xl text-samurai-red">
                          {ido?.vesting}
                        </p>
                      </div>

                      {(currentPhase?.toLowerCase() === "participation" ||
                        currentPhase?.toLowerCase() === "completed") &&
                        user?.allocation > 0 && (
                          <div className="flex flex-row justify-between items-center flex-wrap gap-4">
                            <div className="p-4 px-6 border border-white/20 rounded-[8px] w-[300px] bg-white/10">
                              <p className={`text-lg ${inter.className}`}>
                                MY ALLOCATION
                              </p>
                              <p className="text-2xl text-samurai-red">
                                $
                                {(
                                  user?.allocation * general?.pricePerToken
                                ).toLocaleString("en-us", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </p>
                            </div>

                            <div className="p-4 px-6 border border-white/20 rounded-[8px] w-[300px] bg-white/10">
                              <p className={`text-lg ${inter.className}`}>
                                TOKENS TO RECEIVE
                              </p>
                              <p className="text-2xl text-samurai-red">
                                {user?.allocation} {ido?.projectTokenSymbol}
                                {user?.allocation > 1 && "S"}
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
              {currentPhase &&
                currentPhase?.toLowerCase() !== "completed" &&
                ido?.projectName !== "KIP Protocol" && (
                  <IdoAllocationProgress
                    maxAllocations={general?.maxAllocations || 0}
                    raised={general?.raised || 0}
                    useLocale={false}
                    extraInfos={ido?.projectTokenSymbol + "S"}
                  />
                )}
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
              <div className="h-56 sm:h-64 xl:h-80 2xl:h-[350px]">
                <Carousel leftControl=" " rightControl=" ">
                  {ido?.images?.map((image, index) => (
                    <Image
                      key={index}
                      src={image}
                      width={500}
                      height={350}
                      className="h-full"
                      alt="..."
                    />
                  ))}
                </Carousel>
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
                <div className="flex items-center gap-3">
                  <SSButton disabled={isLoading} click={onAddToWhitelist}>
                    {isLoading ? "Loading..." : "Add to Whitelist"}
                  </SSButton>

                  <button
                    onClick={() => setWhitelistSelected(0)}
                    className={`${
                      whitelistSelected === 0 ? "bg-samurai-red" : "bg-gray-400"
                    } px-3 py-2`}
                  >
                    0
                  </button>
                  <button
                    onClick={() => setWhitelistSelected(1)}
                    className={`${
                      whitelistSelected === 1 ? "bg-samurai-red" : "bg-gray-400"
                    } px-3 py-2`}
                  >
                    1
                  </button>
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
    </>
  );
}
