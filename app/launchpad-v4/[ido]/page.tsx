"use client";
import Link from "next/link";
import Image from "next/image";
import { Inter } from "next/font/google";
import { useState, useContext, useEffect, useCallback } from "react";
import TopLayout from "@/app/components/topLayout";
import { useParams } from "next/navigation";
import { Spinner, Tooltip } from "flowbite-react";
import { HiHome, HiWallet } from "react-icons/hi2";
import { BiSolidCoin } from "react-icons/bi";

import {
  CHAIN_TO_CURRENCY,
  CHAIN_TO_ICON,
  NEW_IDOS,
  IDOs,
  phases,
  TOKENS_TO_ICON,
  TOKENS_TO_SYMBOL,
  VestingType,
} from "@/app/utils/constants";
import {
  convertDateToUnixTimestamp,
  formattedDate,
  formattedDate3,
  formattedDate4,
  formattedDateSimple,
} from "@/app/utils/formattedDate";
import { discord, youtube } from "@/app/utils/svgs";
import { StateContext } from "@/app/context/StateContext";

import {
  generalInfo,
  phaseInfo,
  makePublic,
  participate,
  linkWallet,
  register,
  togglePause,
  userInfo,
  withdraw,
  IDO_GENERAL_INFO,
  IDO_USER_INFO,
  participateETH,
} from "@/app/contracts_integrations/idoFull";

import {
  generalInfo as privateGeneralInfo,
  getParticipationPhase as privatePhaseInfo,
  makePublic as privateMakePublic,
  participate as privateParticipate,
  togglePause as privatetogglePause,
  userInfo as privateuserInfo,
  withdraw as privatewithdraw,
} from "@/app/contracts_integrations/privateIDO";

import IdoAllocationProgress from "@/app/components/idoAllocationProgress";
import { Tier, getTier } from "@/app/contracts_integrations/tiers";

import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";

import AdminRanges from "@/app/components/adminRanges";
import SSButton from "@/app/components/ssButton";
import AdminIDOToken from "@/app/components/adminIDOToken";
import { getUnixTime } from "date-fns";
import VestingBox from "@/app/components/vestingBox";
import ParticipationBox from "@/app/components/participationBox";

const inter = Inter({
  subsets: ["latin"],
});

const tabs = [
  {
    title: "IDO INFO",
    icon: <HiHome />,
  },
  {
    title: "PARTICIPATE",
    icon: <BiSolidCoin />,
  },
  {
    title: "VESTING",
    icon: <HiWallet />,
  },
];

export default function Ido() {
  const [inputValue, setInputValue] = useState("");
  const [inputLinkedWallet, setInputLinkedWallet] = useState("");
  const [loading, setLoading] = useState(true);
  const [general, setGeneral] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [currentPhase, setCurrentPhase] = useState<string | null>(null);
  const [tier, setTier] = useState<Tier | null>(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [imageSelected, setImageSelected] = useState("");
  const [tab, setTab] = useState(0);

  const { signer, account, chain } = useContext(StateContext);

  const { ido: idoID } = useParams();

  const ido = IDOs.find((item) => item.id.includes(idoID as string));
  const idoIndex = IDOs.findIndex((item) => item.id.includes(idoID as string));
  const bg = `url("${ido?.idoImageSrc}")`;

  const now = getUnixTime(new Date());

  // ============================================================================================================
  // ADMIN FUNCTIONS
  // ============================================================================================================

  const onTogglePause = useCallback(async () => {
    setLoading(true);
    if (account && general && account === general?.owner && signer) {
      await togglePause(idoIndex, signer);
      await getGeneralData();
      await getUserInfos();
    }

    setLoading(false);
  }, [signer, idoIndex, general, account, setLoading]);

  const onWithdraw = useCallback(async () => {
    setLoading(true);
    if (account && general && account === general?.owner && signer) {
      await withdraw(idoIndex, signer);
      await getGeneralData();
      await getUserInfos();
    }

    setLoading(false);
  }, [signer, idoIndex, general, account, setLoading]);

  const onMakePublic = useCallback(async () => {
    setLoading(true);
    if (account && general && account === general?.owner && signer) {
      await makePublic(idoIndex, signer);
      await getGeneralData();
      await getUserInfos();
    }

    setLoading(false);
  }, [signer, idoIndex, general, account, setLoading]);

  // ============================================================================================================
  // END ADMIN FUNCTIONS
  // ============================================================================================================

  // ============================================================================================================
  // USER ACTIONS
  // ============================================================================================================

  const onImageClick = useCallback(
    async (image: string) => {
      setGalleryOpen(false);
      setImageSelected(image);
      setGalleryOpen(true);
    },
    [setGalleryOpen]
  );

  const onLinkWallet = useCallback(async () => {
    setLoading(true);
    if (signer) {
      await linkWallet(idoIndex, inputLinkedWallet, signer);
      await getGeneralData();
      await getUserInfos();
    }
    setLoading(false);
  }, [signer, idoIndex, inputLinkedWallet, setLoading]);

  const onRegister = useCallback(async () => {
    setLoading(true);
    if (signer && user && !user.isWhitelisted) {
      await register(idoIndex, signer);
      await getGeneralData();
      await getUserInfos();
    }

    setLoading(false);
  }, [signer, idoIndex, user, inputLinkedWallet, setLoading]);

  const onParticipate = useCallback(async () => {
    setLoading(true);
    if (
      signer &&
      user &&
      general &&
      (user?.isWhitelisted || general?.isPublic)
    ) {
      general?.usingETH
        ? await participateETH(idoIndex, signer, inputValue)
        : await participate(
            idoIndex,
            signer,
            inputValue,
            general?.acceptedToken
          );
      await getGeneralData();
      await getUserInfos();
    }

    setLoading(false);
  }, [signer, idoIndex, general, user, inputValue, setLoading]);

  // ============================================================================================================
  // OVERALL CHECKS
  // ============================================================================================================

  const tabIsDisabled = useCallback(
    (tab: number) => {
      // Disabled in case general is not loaded
      if (!general) return true;
      // const today = convertDateToUnixTimestamp(new Date());

      if (tab === 0) {
        return false;
      }

      if (!signer || !account) return true;

      const inPhase = currentPhase?.toUpperCase();

      if (tab === 1) {
        return inPhase === "REGISTRATION" || inPhase === "PARTICIPATION"
          ? false
          : true;
      }

      if (tab === 2) {
        return inPhase === "WAITING FOR TGE" ||
          inPhase === "CLIFF" ||
          inPhase === "VESTING" ||
          inPhase === "VESTED"
          ? false
          : true;
      }

      // Not disabled in case any conditions match
      return false;
    },
    [currentPhase, signer, account]
  );

  useEffect(() => {
    if (!signer || !account) return setTab(0);
    if (
      currentPhase?.toUpperCase() == "REGISTRATION" ||
      currentPhase?.toUpperCase() == "PARTICIPATION"
    )
      return setTab(1);
    if (
      currentPhase?.toUpperCase() === "WAITING FOR TGE" ||
      currentPhase?.toUpperCase() === "CLIFF" ||
      currentPhase?.toUpperCase() === "VESTING" ||
      currentPhase?.toUpperCase() === "VESTED"
    )
      return setTab(2);
  }, [signer, account, currentPhase, setTab]);

  // ============================================================================================================
  // FETCHING USER INFOS FROM CONTRACT
  // ============================================================================================================

  const getUserInfos = useCallback(async () => {
    if (signer && general) {
      let response;
      switch (ido?.type) {
        case "private":
          response = await privateuserInfo(idoIndex, signer);
          break;

        default:
          response = await userInfo(idoIndex, general, signer);
          break;
      }
      setUser(response);
    }
  }, [ido, signer, idoIndex, general]);

  const getTierInfos = useCallback(async () => {
    if (signer) {
      const tier = await getTier(signer);
      if (tier) setTier(tier);
    }
  }, [signer, idoIndex]);

  useEffect(() => {
    getUserInfos();
    getTierInfos();
  }, [signer, general]);

  // ============================================================================================================
  // FETCHING GENERAL DATA FROM CONTRACT
  // ============================================================================================================

  const getGeneralData = useCallback(async () => {
    setLoading(true);
    let response;
    if (idoIndex !== -1) {
      switch (ido?.type) {
        case "private":
          response = await privateGeneralInfo(idoIndex);
          break;

        default:
          response = await generalInfo(idoIndex);
          break;
      }
      // const response = await generalInfo(idoIndex);
      setGeneral(response);

      // const phase = await phaseInfo(idoIndex, response as IDO_GENERAL_INFO);
      // if (phase) setCurrentPhase(phase);
    }

    setLoading(false);
  }, [ido, idoIndex, setCurrentPhase, setLoading]);

  // const onFetchEvents = useCallback(async () => {
  //   await getLinkedWallets();
  // }, []);

  useEffect(() => {
    getGeneralData();
    // onFetchEvents();
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
        <div className="flex flex-col">
          <div className="flex justify-center xl:justify-start items-center gap-2 text-sm font-extralight px-6 lg:px-10 2xl:px-20 pt-4 xl:pt-24">
            <Link
              href="/launchpad"
              className="transition-all text-white/40 hover:text-white"
            >
              Projects
            </Link>
            <svg
              data-slot="icon"
              fill="none"
              strokeWidth="4"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              className="w-2 text-white/40"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m8.25 4.5 7.5 7.5-7.5 7.5"
              ></path>
            </svg>
            <span>{ido?.projectName}</span>
          </div>
          <div className="flex flex-col xl:flex-row xl:justify-between relative mt-4 xl:mt-10 text-justify xl:text-start">
            <div className="flex flex-col relative px-6 lg:px-10 2xl:px-20 w-full">
              <div className="flex max-w-[350px] self-center xl:self-start">
                {ido?.logo}
              </div>

              <p
                className={`text-[18px] md:text-[22px] 2xl:text-[28px] pt-2 pb-10 ${inter.className}`}
              >
                {ido?.projectDescription}
              </p>

              <div className="flex items-center w-full gap-5 justify-center xl:justify-start flex-wrap">
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

                <div className="flex items-center gap-3">
                  {ido && ido?.tokenNetwork !== "TBA" && (
                    <div className="flex items-center gap-2 bg-black/20 px-4 py-[5px] rounded-md text-[14px] border border-white/20 w-max">
                      <span className="text-sm">Project Tokens</span>
                      <Image
                        src={ido.networkImageSrc}
                        alt={ido.tokenNetwork}
                        width={22}
                        height={22}
                        className="p-[1px] bg-white/80 rounded-full"
                      />
                    </div>
                  )}

                  <div className="flex items-center gap-2 bg-black/20 px-4 py-[5px] rounded-md text-[14px] border border-white/20 w-max">
                    <span className="text-sm">Crowdsale</span>
                    <Image
                      src="/chain-logos/Base_Symbol_Blue.svg"
                      alt={ido?.projectName || ""}
                      width={22}
                      height={22}
                      className="p-[1px] bg-white/80 rounded-full"
                    />
                  </div>
                </div>
              </div>

              {ido && ido.images && (
                <div className="flex flex-col w-full">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-5 pt-10 2xl:pt-14 self-center xl:self-start">
                    <div className="grid gap-5">
                      <button
                        onClick={() => onImageClick(ido.images![0])}
                        className="transition-all hover:scale-105 relative w-[140px] h-[140px] md:w-[140px] xl:h-[120px] xl:w-[120px] md:h-[160px] 2xl:w-[160px] 2xl:h-[160px]"
                      >
                        <Image
                          fill
                          className="h-auto max-w-full rounded-lg border border-white/30"
                          src={ido?.images[0]}
                          alt=""
                        />
                      </button>
                    </div>
                    <div className="grid gap-10">
                      <button
                        onClick={() => onImageClick(ido?.images![1])}
                        className="transition-all hover:scale-105 relative w-[140px] h-[140px] md:w-[160px] xl:h-[120px] xl:w-[120px] md:h-[160px] 2xl:w-[160px] 2xl:h-[160px]"
                      >
                        <Image
                          fill
                          className="h-auto max-w-full rounded-lg border border-white/30"
                          src={ido?.images[1]}
                          alt=""
                        />
                      </button>
                    </div>
                    <div className="grid gap-10">
                      <button
                        onClick={() => onImageClick(ido?.images![2])}
                        className="transition-all hover:scale-105 relative w-[140px] h-[140px] md:w-[160px] xl:h-[120px] xl:w-[120px] md:h-[160px] 2xl:w-[160px] 2xl:h-[160px]"
                      >
                        <Image
                          fill
                          className="h-auto max-w-full rounded-lg border border-white/30"
                          src={ido?.images[2]}
                          alt=""
                        />
                      </button>
                    </div>
                    <div className="grid gap-10">
                      <button
                        onClick={() => onImageClick(ido?.images![3])}
                        className="transition-all hover:scale-105 relative w-[140px] h-[140px] md:w-[160px] xl:h-[120px] xl:w-[120px] md:h-[160px] 2xl:w-[160px] 2xl:h-[160px]"
                      >
                        <Image
                          fill
                          className="h-auto max-w-full rounded-lg border border-white/30"
                          src={ido?.images[3]}
                          alt=""
                        />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col xl:pr-[32px] 2xl:pr-28 gap-5 mt-10 xl:mt-0 mx-3 xl:mx-0">
              <div className="flex flex-col">
                <div className="bg-black/70 shadow-lg shadow-white/30 flex flex-col w-full xl:w-[650px] min-h-[428px] relative">
                  {general && (
                    <>
                      <div className="flex items-center justify-between m-8 mb-4 text-lg xl:text-xl rounded-t-lg relative">
                        <span>
                          {general?.isPublic ? "FCFS" : ido?.investmentRound}{" "}
                          Round
                        </span>
                        <div className="flex items-center gap-2 font-sans text-xs">
                          {signer && account && (
                            <div className="p-1 px-2 bg-white/5 border border-white/10 rounded-lg text-samurai-red">
                              {tier?.name === ""
                                ? "PUBLIC"
                                : tier?.name.toUpperCase()}
                              <span> TIER</span>
                            </div>
                          )}
                          <span className="p-1 px-2 bg-white/5 border border-white/10 rounded-lg text-yellow-300">
                            {currentPhase?.toUpperCase() !== "PAUSED" &&
                              currentPhase?.toUpperCase() !== "UPCOMING" &&
                              currentPhase?.toUpperCase() !== "VESTED" &&
                              currentPhase?.toUpperCase() !==
                                "WAITING FOR TGE" &&
                              "IN"}{" "}
                            {currentPhase?.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center text-xs lg:text-sm bg-white/10 h-12 lg:h-16">
                        {tabs.map((item, index) => (
                          <button
                            disabled={tabIsDisabled(index)}
                            key={index}
                            onClick={() => setTab(index)}
                            className={`
                          flex items-center gap-2 transition-all w-full h-full justify-center
                          ${
                            tab === index
                              ? "bg-white/20 text-white"
                              : "text-white/50"
                          } disabled:bg-black/50 hover:enabled:bg-white/20
                        `}
                          >
                            {item.icon}
                            <span>{item.title}</span>
                          </button>
                        ))}
                      </div>

                      {ido && (
                        <div className="flex flex-col gap-10 px-5 md:px-6 w-full">
                          {/* IDO INFO TAB */}
                          {tab === 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-3 items-center flex-wrap my-5 text-sm min-h-[200px]">
                              <div className="flex flex-col px-2 rounded-md w-max">
                                <span className="text-neutral-600">
                                  IDO Start
                                </span>
                                <p className="text-white/70">
                                  {general?.periods?.participationStartsAt
                                    ? formattedDate(
                                        general?.periods?.participationStartsAt
                                      ) + " UTC"
                                    : "---"}
                                </p>
                              </div>
                              <div className="flex flex-col px-2 rounded-md w-max">
                                <span className="text-neutral-600">
                                  IDO End
                                </span>
                                <p className="text-white/70">
                                  {formattedDate(ido?.fcfs)} UTC
                                </p>
                              </div>
                              <div className="flex flex-col px-2 rounded-md w-max">
                                <span className="text-neutral-600">
                                  FCFS Start
                                </span>
                                <p className="text-white/70">
                                  {formattedDate(ido?.fcfs)} UTC
                                </p>
                              </div>
                              <div className="flex flex-col px-2 rounded-md w-max">
                                <span className="text-neutral-600">
                                  FCFS End
                                </span>
                                <p className="text-white/70">
                                  {general?.periods?.participationEndsAt
                                    ? formattedDate(
                                        general?.periods?.participationEndsAt
                                      ) + " UTC"
                                    : "---"}
                                </p>
                              </div>
                              <div className="flex flex-col px-2 rounded-md w-max">
                                <span className="text-neutral-600">
                                  TGE Date
                                </span>
                                <p className="text-white/70">
                                  {general?.periods?.vestingAt
                                    ? formattedDateSimple(
                                        general?.periods?.vestingAt
                                      )
                                    : "---"}
                                </p>
                              </div>
                              <div className="flex flex-col px-2 rounded-md w-max">
                                <span className="text-neutral-600">
                                  Token Symbol
                                </span>
                                <p className="text-white/70">
                                  {ido.projectTokenSymbol}
                                </p>
                              </div>
                              <div className="flex flex-col px-2 rounded-md w-max">
                                <span className="text-neutral-600">
                                  Token Price
                                </span>
                                <p className="text-white/70">
                                  ${ido.price} {ido.acceptedTokenSymbol}
                                </p>
                              </div>

                              {signer && account && user && (
                                <div className="flex flex-col px-2 rounded-md w-max">
                                  <span className="text-neutral-600">Min</span>
                                  <p className="text-white/70">
                                    $
                                    {Number(
                                      user?.walletRange?.minPerWallet
                                    ).toLocaleString("en-us")}{" "}
                                    {ido?.acceptedTokenSymbol}
                                  </p>
                                </div>
                              )}

                              {signer && account && user && (
                                <div className="flex flex-col px-2 rounded-md w-max">
                                  <span className="text-neutral-600">Max</span>
                                  <p className="text-white/70">
                                    $
                                    {Number(
                                      user?.walletRange?.maxPerWallet
                                    ).toLocaleString("en-us")}{" "}
                                    {ido?.acceptedTokenSymbol}
                                  </p>
                                </div>
                              )}

                              {currentPhase &&
                                currentPhase.toUpperCase() !== "UPCOMING" && (
                                  <div className="flex flex-col px-2 rounded-md w-max">
                                    <span className="text-neutral-600">
                                      Raised
                                    </span>
                                    <p className="text-white/70">
                                      $
                                      {Number(general?.raised).toLocaleString(
                                        "en-us"
                                      )}{" "}
                                      {ido?.acceptedTokenSymbol}
                                    </p>
                                  </div>
                                )}

                              {signer && account && (
                                <>
                                  <div className="flex flex-col px-2 rounded-md w-max">
                                    <span className="text-neutral-600">
                                      Registered
                                    </span>
                                    <p className="text-white/70">
                                      {user?.walletRange?.name
                                        ?.toString()
                                        .toLowerCase() === "public"
                                        ? "NA"
                                        : user?.isWhitelisted
                                        ? "Yes"
                                        : "No"}
                                    </p>
                                  </div>
                                  {general?.usingLinkedWallet && (
                                    <div className="flex flex-col px-2 rounded-md w-max">
                                      <span className="text-neutral-600">
                                        Linked Wallet
                                      </span>
                                      <p className="text-white/70">
                                        {user?.linkedWallet
                                          ? `${user?.linkedWallet.substring(
                                              0,
                                              5
                                            )}...${user?.linkedWallet.substring(
                                              user?.linkedWallet.length - 5,
                                              user?.linkedWallet.length
                                            )}`
                                          : user?.walletRange?.name
                                              ?.toString()
                                              .toLowerCase() === "public"
                                          ? "NA"
                                          : "Not found"}
                                      </p>
                                    </div>
                                  )}

                                  {/* <div className="flex flex-col px-2 rounded-md w-max">
                                    <span className="text-neutral-600">
                                      Refundable
                                    </span>
                                    <p className="text-white/70">
                                      {general?.refund?.active
                                        ? `For ${
                                            general?.refund?.period / 60 / 60
                                          } hours`
                                        : "No"}
                                    </p>
                                  </div> */}
                                </>
                              )}
                            </div>
                          )}
                          {/* PARTICIPATE TAB */}
                          {tab === 1 && user && (
                            // <ParticipationBox
                            //   ido={ido}
                            //   idoIndex={idoIndex}
                            //   loading={loading}
                            //   setLoading={setLoading}
                            //   tier={tier}
                            //   general={general}
                            //   user={user}
                            //   onLinkWallet={onLinkWallet}
                            //   onRegister={onRegister}
                            //   onParticipate={onParticipate}
                            // />
                            <></>
                          )}
                          {/* VESTING TAB */}
                          {tab === 2 && ido?.vesting !== "" && (
                            <></>
                            // <VestingBox
                            //   loading={loading}
                            //   setLoading={setLoading}
                            //   ido={ido}
                            //   idoIndex={idoIndex}
                            // />
                          )}
                        </div>
                      )}
                    </>
                  )}

                  {loading && (
                    <div className="absolute top-0 left-0 flex items-center justify-center w-full xl:w-[650px] min-h-[398px] bg-black/70 backdrop-blur-sm">
                      <Spinner size="xl" color="failure" />
                    </div>
                  )}
                </div>
              </div>

              {currentPhase?.toUpperCase() !== "UPCOMING" &&
                currentPhase?.toUpperCase() !== "WAITING FOR TGE" &&
                currentPhase?.toUpperCase() !== "VESTING" &&
                currentPhase?.toUpperCase() !== "VESTED" && (
                  <IdoAllocationProgress
                    maxAllocations={general?.amounts?.maxAllocations || 0}
                    raised={general?.raised || 0}
                  />
                )}
            </div>
          </div>
        </div>
      </TopLayout>
      <div className="flex flex-col xl:flex-row gap-10 pt-10 lg:pt-24 pb-10 xl:pb-32 border-t border-white/20 bg-white/10 px-6 lg:px-10 2xl:px-20">
        {ido && (
          <>
            <div className="flex flex-col gap-10 lg:pr-10">
              <div
                className={`flex w-full xl:text-[16px] xl:leading-[1.70rem] 2xl:text-[20px] 2xl:leading-[2rem] text-gray-300 ${inter.className}`}
                dangerouslySetInnerHTML={{
                  __html: ido.projectBigDescription as string,
                }}
              />
            </div>

            <div className="flex gap-5 items-center flex-wrap mt-8 text-[15px] xl:text-xl pb-8 max-w-[700px]">
              <div className="flex flex-col lg:flex-row lg:items-center gap-2 bg-black/50 p-4 lg:rounded-md w-max lg:border border-white/10 text-sm lg:text-lg">
                <span className="text-samurai-red">Token Symbol:</span>
                <p className="text-white/70">{ido.projectTokenSymbol}</p>
              </div>
              <div className="flex flex-col lg:flex-row lg:items-center gap-2 bg-black/50 p-4 lg:rounded-md w-max lg:border border-white/10 text-sm lg:text-lg">
                <span className="text-samurai-red">Network:</span>
                <p className="text-white/70">{ido.tokenNetwork}</p>
              </div>
              <div className="flex flex-col lg:flex-row lg:items-center gap-2 bg-black/50 p-4 lg:rounded-md w-max lg:border border-white/10 text-sm lg:text-lg">
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
              <div className="flex flex-col lg:flex-row lg:items-center gap-2 bg-black/50 p-4 lg:rounded-md w-max lg:border border-white/10 text-sm lg:text-lg">
                <span className="text-samurai-red">
                  Exchange Listing Price:
                </span>
                <p className="text-white/70">
                  {Number(ido.exchangeListingPrice).toLocaleString("en-us", {
                    maximumFractionDigits: 4,
                  })}{" "}
                  {general?.usingETH
                    ? CHAIN_TO_CURRENCY[chain]
                    : general && TOKENS_TO_SYMBOL[general?.acceptedToken]}
                </p>
              </div>

              <div className="flex flex-col lg:flex-row lg:items-center gap-2 bg-black/50 p-4 lg:rounded-md w-max lg:border border-white/10 text-sm lg:text-lg">
                <span className="text-samurai-red">Market Cap at TGE:</span>
                <p className="text-white/70">
                  $
                  {Number(ido.marketCapAtTGE).toLocaleString("en-us", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  USD
                </p>
              </div>

              {/* <div className="flex flex-col lg:flex-row lg:items-center gap-2 bg-black/50 p-4 lg:rounded-md lg:w-max lg:border border-white/10 text-sm lg:text-lg">
                <span className="text-samurai-red">Vesting:</span>
                <p className="text-white/70">
                  {general
                    ? `${general?.amounts.tgeReleasePercent * 100}% at TGE, ${
                        general?.periods.cliff > 0
                          ? `${general?.periods.cliff} months cliff`
                          : "No Cliff"
                      }, ${
                        general?.periods.vestingDuration
                      } months ${VestingType[
                        general?.vestingType as number
                      ].toLowerCase()}`
                    : "---"}
                </p>
              </div> */}

              <div className="flex flex-col lg:flex-row lg:items-center gap-2 bg-black/50 p-4 lg:rounded-md w-max lg:border border-white/10 text-sm lg:text-lg">
                <span className="text-samurai-red">Dex Screener:</span>
                <p className="text-white/70">
                  TBA
                  {/* <Link href="#">{"https://somelink".toUpperCase()}</Link> */}
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      <Transition appear show={galleryOpen}>
        <Dialog
          as="div"
          className="relative focus:outline-none bg-black z-50"
          onClose={() => setGalleryOpen(false)}
        >
          <div className="fixed inset-0 bg-black/60" aria-hidden="true" />

          <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <TransitionChild
                enter="ease-out duration-300"
                enterFrom="opacity-0 transform-[scale(95%)]"
                enterTo="opacity-100 transform-[scale(100%)]"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 transform-[scale(100%)]"
                leaveTo="opacity-0 transform-[scale(95%)]"
              >
                <DialogPanel className="w-full max-w-lg md:max-w-2xl rounded-xl bg-white/5 p-2 md:p-6 backdrop-blur-2xl">
                  <Image
                    width={340}
                    height={340}
                    className="h-auto w-full max-w-full"
                    src={imageSelected}
                    alt=""
                  />
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* ============================================================================================================ */}
      {/* ADMIN AREA */}
      {/* ============================================================================================================ */}

      {general && account && general.owner === account && (
        <div className="flex flex-col xl:flex-row  gap-10 pt-24 pb-10 xl:pb-32 px-6 lg:px-8 xl:px-20 border-t border-white/20 w-full">
          {ido && (
            <div className="flex flex-col gap-10">
              <h1 className="text-2xl xl:text-3xl">ADMIN AREA</h1>
              <div className="flex items-center gap-10 flex-wrap">
                <SSButton disabled={loading} click={onTogglePause}>
                  {loading
                    ? "Loading..."
                    : general.isPaused
                    ? "Unpause"
                    : "Pause"}
                </SSButton>
                <SSButton
                  disabled={loading || general.isPublic}
                  click={onMakePublic}
                >
                  {loading ? "Loading..." : "Make Public"}
                </SSButton>
              </div>

              <div className="flex flex-col gap-2">
                <p>
                  TOTAL{" "}
                  {general?.usingETH
                    ? CHAIN_TO_CURRENCY[chain]
                    : TOKENS_TO_SYMBOL[general.acceptedToken]}
                  :{" "}
                  {Number(general?.raised || 0).toLocaleString("en-us", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
                <div className="w-max">
                  <SSButton disabled={loading} click={onWithdraw}>
                    {loading ? "Loading..." : "Withdraw Participations"}
                  </SSButton>
                </div>
              </div>

              <AdminIDOToken idoIndex={idoIndex} generalInfo={general} />

              {general && general.ranges && (
                <AdminRanges idoIndex={idoIndex} ranges={general?.ranges} />
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}
