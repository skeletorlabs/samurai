"use client";
import Link from "next/link";
import Image from "next/image";
import { Inter } from "next/font/google";
import { useState, Fragment, useContext, useEffect, useCallback } from "react";
import TopLayout from "@/app/components/topLayout";
import { useParams } from "next/navigation";
import { Spinner, Tooltip } from "flowbite-react";
import { HiHome, HiWallet, HiOutlineInformationCircle } from "react-icons/hi2";
import { BiSolidCoin } from "react-icons/bi";

import {
  CHAIN_TO_CURRENCY,
  CHAIN_TO_ICON,
  NEW_IDOS,
  phases,
  TOKENS_TO_ICON,
  TOKENS_TO_SYMBOL,
  VestingType,
} from "@/app/utils/constants";
import {
  convertDateToUnixTimestamp,
  formattedDate,
  formattedDateSimple,
} from "@/app/utils/formattedDate";
import {
  discord,
  paste,
  pasted,
  redo,
  youtube,
  linkWallet as linkWalletIcon,
} from "@/app/utils/svgs";
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
  getRefund,
  claim,
  participateETH,
} from "@/app/contracts_integrations/idoFull";
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
  const [firstLoading, setFirstLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [secondaryLoading, setSecondaryLoading] = useState(false);
  const [general, setGeneral] = useState<IDO_GENERAL_INFO | null>(null);
  const [user, setUser] = useState<IDO_USER_INFO | null>(null);
  const [currentPhase, setCurrentPhase] = useState<string | null>(null);
  const [tier, setTier] = useState<Tier | null>(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [imageSelected, setImageSelected] = useState("");
  const [tab, setTab] = useState(0);

  const { signer, account, chain } = useContext(StateContext);

  const { ido: idoID } = useParams();

  const ido = NEW_IDOS.find((item) => item.id.includes(idoID as string));
  const idoIndex = NEW_IDOS.findIndex((item) =>
    item.id.includes(idoID as string)
  );
  const bg = `url("${ido?.idoImageSrc}")`;

  const now = getUnixTime(new Date());

  // ============================================================================================================
  // ADMIN FUNCTIONS
  // ============================================================================================================

  const onTogglePause = useCallback(async () => {
    setSecondaryLoading(true);
    if (account && general && account === general?.owner && signer) {
      await togglePause(idoIndex, signer);
      await getGeneralData();
      await getUserInfos();
    }

    setSecondaryLoading(false);
  }, [signer, idoIndex, general, account, setSecondaryLoading]);

  const onWithdraw = useCallback(async () => {
    setSecondaryLoading(true);
    if (account && general && account === general?.owner && signer) {
      await withdraw(idoIndex, signer);
      await getGeneralData();
      await getUserInfos();
    }

    setSecondaryLoading(false);
  }, [signer, idoIndex, general, account, setSecondaryLoading]);

  const onMakePublic = useCallback(async () => {
    setSecondaryLoading(true);
    if (account && general && account === general?.owner && signer) {
      await makePublic(idoIndex, signer);
      await getGeneralData();
      await getUserInfos();
    }

    setSecondaryLoading(false);
  }, [signer, idoIndex, general, account, setSecondaryLoading]);

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

  // Function to check if the string starts with "bc1" (Bitcoin)
  const isBitcoinAddress = (value: string) => value.startsWith("bc1");

  // Function to check for valid EVM address format (with or without 0x prefix)
  const isEVMAddress = (value: string) => {
    const re = new RegExp("^(0x)?[0-9a-fA-F]{40}$");
    return re.test(value);
  };

  // Function for Solana address validation
  const isValidSolanaAddress = (value: string) => {
    const isValidLength = (value: string) =>
      value.length >= 32 && value.length <= 44;
    const charSet = "[A-Za-z0-9+/]";

    // Check length
    if (!isValidLength(value)) {
      return false;
    }
    // Check character set using regex
    const re = new RegExp(`^${charSet}+$`);
    return re.test(value);
  };

  const onPaste = async () => {
    const value = await navigator.clipboard.readText();

    if (
      value === "" ||
      isBitcoinAddress(value) ||
      isEVMAddress(value) ||
      isValidSolanaAddress(value)
    ) {
      setInputLinkedWallet(value);
      return true;
    } else {
      setInputValue("");
      return false;
    }
  };

  const onInputChange = (value: string) => {
    const re = new RegExp("^[+]?([0-9]+([.][0-9]*)?|[.][0-9]+)$");

    if (value === "" || re.test(value)) {
      setInputValue(value);
    }

    return false;
  };

  const onLinkWallet = useCallback(async () => {
    setSecondaryLoading(true);
    if (signer) {
      await linkWallet(idoIndex, inputLinkedWallet, signer);
      await getGeneralData();
      await getUserInfos();
    }
    setSecondaryLoading(false);
  }, [signer, idoIndex, inputLinkedWallet, setSecondaryLoading]);

  const onRegister = useCallback(async () => {
    setSecondaryLoading(true);
    if (signer && user && !user.isWhitelisted) {
      await register(idoIndex, signer);
      await getGeneralData();
      await getUserInfos();
    }

    setSecondaryLoading(false);
  }, [signer, idoIndex, user, inputLinkedWallet, setSecondaryLoading]);

  const onParticipate = useCallback(async () => {
    setSecondaryLoading(true);
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

    setSecondaryLoading(false);
  }, [signer, idoIndex, general, user, inputValue, setSecondaryLoading]);

  const onGetRefund = useCallback(async () => {
    setSecondaryLoading(true);
    if (
      signer &&
      general &&
      user &&
      (user?.isWhitelisted || general?.isPublic)
    ) {
      await getRefund(idoIndex, signer);
      await getGeneralData();
      await getUserInfos();
    }

    setSecondaryLoading(false);
  }, [signer, idoIndex, general, user, inputValue, setSecondaryLoading]);

  const onClaim = useCallback(async () => {
    setSecondaryLoading(true);
    if (signer) {
      await claim(idoIndex, signer);
      await getGeneralData();
      await getUserInfos();
    }

    setSecondaryLoading(false);
  }, [signer, idoIndex, setSecondaryLoading]);

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
      const response = await userInfo(idoIndex, general, signer);
      setUser(response as IDO_USER_INFO);
    }
  }, [signer, idoIndex, general]);

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

  // useEffect(() => {
  //   if (!account) setTab(0);
  // }, [account, setTab]);

  // ============================================================================================================
  // FETCHING GENERAL DATA FROM CONTRACT
  // ============================================================================================================

  const getGeneralData = useCallback(async () => {
    if (firstLoading) {
      setLoading(true);
    }

    setSecondaryLoading(true);
    if (idoIndex !== -1) {
      const response = await generalInfo(idoIndex);
      setGeneral(response as IDO_GENERAL_INFO);

      const phase = await phaseInfo(idoIndex, response as IDO_GENERAL_INFO);
      if (phase) setCurrentPhase(phase);
    }

    if (firstLoading) setLoading(false);

    setSecondaryLoading(false);
    setFirstLoading(false);
  }, [
    idoIndex,
    firstLoading,
    setCurrentPhase,
    setLoading,
    setFirstLoading,
    setSecondaryLoading,
  ]);

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
                <div
                  className={`${
                    loading ? "" : "bg-black/70 shadow-lg shadow-white/30"
                  } flex flex-col w-full xl:w-[550px] min-h-[398px]`}
                >
                  {loading && (
                    <div className="flex items-center justify-center w-full h-[460px]">
                      <Spinner size="xl" color="failure" />
                    </div>
                  )}
                  {!loading && general && (
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

                      <div className="flex items-center text-sm bg-white/10 h-16">
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

                                  <div className="flex flex-col px-2 rounded-md w-max">
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
                                  </div>
                                </>
                              )}
                            </div>
                          )}
                          {/* PARTICIPATE TAB */}
                          {tab === 1 && user && (
                            <div className="flex my-5 text-sm min-h-[200px] w-full">
                              {signer &&
                                account &&
                                (currentPhase?.toLowerCase() ===
                                  "registration" ||
                                  currentPhase?.toLowerCase() ===
                                    "participation") && (
                                  <div className="flex flex-col w-full justify-center">
                                    {/* REGISTER */}
                                    {!user?.isWhitelisted &&
                                      !general?.isPublic &&
                                      user?.walletRange.name.toUpperCase() !==
                                        "PUBLIC" && (
                                        <div className="flex flex-col gap-4">
                                          <p className="text-center text-lg">
                                            Register before participate the IDO
                                          </p>
                                          <button
                                            onClick={onRegister}
                                            disabled={
                                              secondaryLoading ||
                                              !general ||
                                              !user ||
                                              general?.isPaused
                                            }
                                            className={`
                                        ${
                                          secondaryLoading ||
                                          !general ||
                                          !user ||
                                          general?.isPaused
                                            ? "bg-black text-white/20"
                                            : "bg-samurai-red text-white hover:opacity-75"
                                        }
                                          rounded-[8px] w-[300px] h-[50px] self-center py-4 text-[18px] text-center transition-all`}
                                          >
                                            {secondaryLoading ? (
                                              <Spinner
                                                size="md"
                                                color="gray"
                                                className="opacity-40"
                                              />
                                            ) : (
                                              "REGISTER"
                                            )}
                                          </button>
                                        </div>
                                      )}

                                    {/* LINK WALLET */}
                                    <div className="flex flex-col gap-1 text-[14px] w-full">
                                      {general?.usingLinkedWallet &&
                                        user?.linkedWallet === "" &&
                                        user?.isWhitelisted && (
                                          <div className="flex flex-col p-4 border border-white/20 rounded-lg">
                                            <p className="text-[16px] text-center">
                                              Link your
                                              <span className="text-samurai-red px-[6px]">
                                                {ido.tokenNetwork.toUpperCase()}
                                              </span>
                                              wallet address
                                            </p>

                                            <div className="flex justify-center gap-10 items-center py-3">
                                              <button
                                                onClick={() => onPaste()}
                                                disabled={
                                                  secondaryLoading ||
                                                  !general ||
                                                  !user ||
                                                  general?.isPaused
                                                }
                                                className={`
                                                  ${
                                                    secondaryLoading ||
                                                    !general ||
                                                    !user ||
                                                    general?.isPaused
                                                      ? "opacity-40"
                                                      : "opacity-100"
                                                  }
                                                  font-light flex justify-center items-center gap-2 transition-all hover:scale-110`}
                                              >
                                                <div>
                                                  {inputLinkedWallet
                                                    ? pasted
                                                    : paste}
                                                </div>
                                                <span>
                                                  {inputLinkedWallet
                                                    ? "Pasted"
                                                    : "Paste"}
                                                </span>
                                              </button>
                                              <button
                                                onClick={() =>
                                                  setInputLinkedWallet("")
                                                }
                                                disabled={
                                                  secondaryLoading ||
                                                  !general ||
                                                  !user ||
                                                  general?.isPaused
                                                }
                                                className={`
                                                  ${
                                                    secondaryLoading ||
                                                    !general ||
                                                    !user ||
                                                    general?.isPaused
                                                      ? "opacity-40"
                                                      : "opacity-100"
                                                  }
                                                    font-light flex justify-center items-center gap-2 transition-all hover:scale-110`}
                                              >
                                                <div>{redo}</div>
                                                <span>Clear</span>
                                              </button>
                                              <button
                                                onClick={() => onPaste()}
                                                disabled={
                                                  secondaryLoading ||
                                                  !general ||
                                                  !user ||
                                                  general?.isPaused
                                                }
                                                className={`
                                                  ${
                                                    secondaryLoading ||
                                                    !general ||
                                                    !user ||
                                                    general?.isPaused
                                                      ? "opacity-40"
                                                      : "opacity-100"
                                                  }
                                                    font-light flex justify-center items-center gap-2 transition-all hover:scale-110`}
                                              >
                                                <div>{linkWalletIcon}</div>
                                                <span>
                                                  {inputLinkedWallet
                                                    ? `${inputLinkedWallet.substring(
                                                        0,
                                                        5
                                                      )}...${inputLinkedWallet.substring(
                                                        inputLinkedWallet.length -
                                                          5,
                                                        inputLinkedWallet.length
                                                      )}`
                                                    : "Not set"}
                                                </span>
                                              </button>
                                            </div>

                                            <button
                                              onClick={onLinkWallet}
                                              disabled={
                                                secondaryLoading ||
                                                !general ||
                                                !user ||
                                                general?.isPaused ||
                                                (general?.usingLinkedWallet &&
                                                  inputLinkedWallet === "")
                                              }
                                              className={`
                                                ${
                                                  secondaryLoading ||
                                                  !general ||
                                                  !user ||
                                                  general?.isPaused ||
                                                  (general?.usingLinkedWallet &&
                                                    inputLinkedWallet === "")
                                                    ? "bg-black text-white/20"
                                                    : "bg-samurai-red text-white hover:opacity-75"
                                                }
                                                  rounded-[8px] w-full h-[50px] mt-4 py-4 text-[18px] text-center transition-all `}
                                            >
                                              {secondaryLoading ? (
                                                <Spinner
                                                  size="md"
                                                  color="gray"
                                                  className="opacity-40"
                                                />
                                              ) : (
                                                "LINK WALLET"
                                              )}
                                            </button>
                                          </div>
                                        )}
                                    </div>
                                  </div>
                                )}
                              {/* PARTICIPATION */}
                              {currentPhase?.toLowerCase() ===
                                "participation" &&
                                // user?.allocation <
                                //   user?.walletRange?.maxPerWallet &&
                                (user?.isWhitelisted || general?.isPublic) &&
                                ((general?.usingLinkedWallet &&
                                  user?.linkedWallet) ||
                                  !general?.usingLinkedWallet) && (
                                  <div className="flex flex-col justify-center min-w-full">
                                    <div className="flex items-center gap-3 flex-wrap mb-8">
                                      <p className="bg-samurai-red/10 w-max py-1 px-2 rounded-full text-samurai-red border border-white/10">
                                        <span className="text-white/70">
                                          Your Allocation:
                                        </span>{" "}
                                        $
                                        {user?.allocation.toLocaleString(
                                          "en-us",
                                          {
                                            minimumFractionDigits: 2,
                                          }
                                        )}{" "}
                                        {general?.usingETH
                                          ? CHAIN_TO_CURRENCY[chain]
                                          : ido?.acceptedTokenSymbol}
                                      </p>
                                      <p className="bg-white/10 w-max py-1 px-2 rounded-full text-samurai-red border border-white/10">
                                        <span className="text-white/70">
                                          Tokens Purchased:
                                        </span>{" "}
                                        $
                                        {user?.purchased.toLocaleString(
                                          "en-us",
                                          {
                                            minimumFractionDigits: 2,
                                          }
                                        )}{" "}
                                        {ido.projectTokenSymbol}
                                      </p>
                                    </div>

                                    <div className="flex items-center justify-between w-full">
                                      <span className="self-end text-[10px] lg:text-[12px] mb-1 mr-1">
                                        MIN{" "}
                                        {Number(
                                          user?.walletRange?.minPerWallet
                                        ).toLocaleString("en-us", {
                                          minimumFractionDigits: 2,
                                          // maximumFractionDigits: 2,
                                        })}
                                        {" / "}
                                        MAX{" "}
                                        {Number(
                                          user?.walletRange?.maxPerWallet
                                        ).toLocaleString("en-us", {
                                          minimumFractionDigits: 2,
                                          // maximumFractionDigits: 2,
                                        })}{" "}
                                        {
                                          TOKENS_TO_SYMBOL[
                                            general?.acceptedToken
                                          ]
                                        }
                                      </span>
                                      <button
                                        onClick={() =>
                                          onInputChange(
                                            (user?.balance || 0).toString()
                                          )
                                        }
                                        className="self-end text-[10px] lg:text-[12px] mb-1 hover:text-samurai-red mr-1"
                                      >
                                        BALANCE:{" "}
                                        {Number(
                                          user?.balance || 0
                                        ).toLocaleString("en-us")}{" "}
                                        {general?.usingETH
                                          ? CHAIN_TO_CURRENCY[chain]
                                          : TOKENS_TO_SYMBOL[
                                              general?.acceptedToken
                                            ]}
                                      </button>
                                    </div>

                                    <div className="relative w-full">
                                      <input
                                        type="text"
                                        disabled={secondaryLoading}
                                        placeholder={`${
                                          general?.usingETH
                                            ? CHAIN_TO_CURRENCY[chain]
                                            : TOKENS_TO_SYMBOL[
                                                general?.acceptedToken
                                              ]
                                        } to allocate`}
                                        className="w-full p-2 lg:p-4 placeholder-black/50 text-black"
                                        value={inputValue}
                                        onChange={(e) =>
                                          onInputChange(e.target.value)
                                        }
                                      />
                                      <div className="absolute top-[7px] lg:top-[15px] right-2 flex items-center gap-[5px]">
                                        <Image
                                          src={
                                            general?.usingETH
                                              ? CHAIN_TO_ICON[chain]
                                              : TOKENS_TO_ICON[
                                                  general?.acceptedToken
                                                ]
                                          }
                                          width={32}
                                          height={32}
                                          alt={
                                            general?.usingETH
                                              ? CHAIN_TO_CURRENCY[chain]
                                              : TOKENS_TO_SYMBOL[
                                                  general?.acceptedToken
                                                ]
                                          }
                                          className="w-6 h-6"
                                        />
                                        <div className="flex items-center text-black/80 mr-2 text-lg font-bold">
                                          <span>
                                            {general?.usingETH
                                              ? CHAIN_TO_CURRENCY[chain]
                                              : TOKENS_TO_SYMBOL[
                                                  general?.acceptedToken
                                                ]}
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* PARTICIPATE BUTTON */}

                                    <button
                                      onClick={onParticipate}
                                      disabled={
                                        secondaryLoading ||
                                        !general ||
                                        !user ||
                                        general?.isPaused ||
                                        (!user?.isWhitelisted &&
                                          !general?.isPublic) ||
                                        inputValue === "" ||
                                        Number(inputValue) === 0 ||
                                        Number(inputValue) <
                                          user?.walletRange.minPerWallet ||
                                        Number(inputValue) >
                                          user?.walletRange.maxPerWallet -
                                            user?.allocation
                                      }
                                      className={`
                                        ${
                                          secondaryLoading ||
                                          !general ||
                                          !user ||
                                          general?.isPaused ||
                                          (!user.isWhitelisted &&
                                            !general?.isPublic) ||
                                          inputValue === "" ||
                                          Number(inputValue) === 0 ||
                                          Number(inputValue) <
                                            user?.walletRange.minPerWallet ||
                                          Number(inputValue) >
                                            user?.walletRange.maxPerWallet -
                                              user?.allocation
                                            ? "bg-black text-white/20"
                                            : "bg-samurai-red text-white hover:opacity-75"
                                        }
                                          rounded-[8px] w-full mt-4 py-4 text-[18px] text-center transition-all `}
                                    >
                                      {secondaryLoading ? (
                                        <Spinner
                                          size="md"
                                          color="gray"
                                          className="opacity-40"
                                        />
                                      ) : (
                                        "PARTICIPATE"
                                      )}
                                    </button>
                                  </div>
                                )}
                              {user?.isWhitelisted &&
                                now <
                                  general?.periods.participationStartsAt && (
                                  <div className="flex min-w-full items-center justify-center text-lg">
                                    Please, wait until participation starts.
                                  </div>
                                )}

                              {user?.walletRange.name.toUpperCase() ===
                                "PUBLIC" &&
                                now < ido.fcfs && (
                                  <div className="flex min-w-full items-center justify-center text-lg">
                                    Please, wait until FCFS starts.
                                  </div>
                                )}
                            </div>
                          )}
                          {/* VESTING TAB */}
                          {tab === 2 && (
                            <div className="flex items-start my-5 min-h-[200px]">
                              {user && (
                                // user?.allocation > 0 && (
                                <div className="flex flex-col justify-between w-full h-full">
                                  <div className="flex flex-col leading-tight">
                                    <div className="flex items-center gap-4 text-[14px]">
                                      <p className="px-2 py-1 rounded-full bg-samurai-red/10 border border-samurai-red/40 w-max mb-5">
                                        {general?.amounts.tgeReleasePercent *
                                          100}
                                        % at TGE,{" "}
                                        {general?.periods.cliff > 0
                                          ? `${general?.periods.cliff} months cliff`
                                          : "No Cliff"}
                                        , {general?.periods.vestingDuration}{" "}
                                        months{" "}
                                        {VestingType[
                                          general?.vestingType as number
                                        ].toLowerCase()}
                                      </p>
                                      <p className="px-2 py-1 rounded-full bg-samurai-red/10 border border-samurai-red/40 w-max mb-5">
                                        Your Allocation: $
                                        {user?.allocation.toLocaleString(
                                          "en-us",
                                          {
                                            minimumFractionDigits: 2,
                                          }
                                        )}{" "}
                                        {ido?.acceptedTokenSymbol}
                                      </p>
                                    </div>
                                    {/* {(general.refund.active &&
                                      now < general?.periods.vestingAt) ||
                                      (now >
                                        general?.periods.vestingAt +
                                          general.refund.period && (
                                        <div className="flex items-center gap-1 mt-[5px]">
                                          <button
                                            onClick={onGetRefund}
                                            // disabled={
                                            //   now <
                                            //     general?.periods.vestingAt ||
                                            //   now >
                                            //     general?.periods.vestingAt +
                                            //       general.refund.period
                                            // }
                                            className="text-xs px-2 py-[2px] border rounded-full  border-white/20 text-white/60 hover:text-white/50 w-max"
                                          >
                                            ASK FOR REFUND
                                          </button>
                                          <Tooltip
                                            content={
                                              <div className="text-xs leading-relaxed text-white/70">
                                                <h1 className="text-yellow-300">
                                                  IMPORTANT:
                                                </h1>
                                                <p>
                                                  1 - We charge{" "}
                                                  {general.refund.feePercent}%
                                                  in fees for refundings.
                                                </p>
                                                <p>
                                                  2 - Refunds are not allowed
                                                  after TGE claims
                                                </p>
                                                <p>
                                                  3 - Refunds are not allowed
                                                  after{" "}
                                                  {general.refund.period /
                                                    60 /
                                                    60}{" "}
                                                  hours
                                                </p>
                                              </div>
                                            }
                                            style="dark"
                                          >
                                            <HiOutlineInformationCircle color="red" />
                                          </Tooltip>
                                        </div>
                                      ))} */}
                                  </div>

                                  <div className="flex flex-col gap-2">
                                    <div className="flex items-center justify-between border-b border-samurai-red pb-3">
                                      <span>
                                        Project Tokens -{" "}
                                        {ido?.projectTokenSymbol}
                                      </span>
                                      <button
                                        onClick={onClaim}
                                        disabled={user?.claimable === 0}
                                        className="text-sm py-1 px-4 bg-black border border-samurai-red text-samurai-red disabled:text-white/20 disabled:border-white/20 hover:enabled:text-white hover:enabled:bg-samurai-red w-max rounded-full"
                                      >
                                        CLAIM
                                      </button>
                                    </div>

                                    <div className="flex justify-between items-center gap-5 bg-samurai-red/10 text-sm p-2">
                                      <div className="flex flex-col">
                                        <p className={`${inter.className}`}>
                                          Purchased
                                        </p>
                                        <p className="text-samurai-red w-max text-[18px]">
                                          {user?.purchased?.toLocaleString(
                                            "en-us",
                                            {
                                              minimumFractionDigits: 2,
                                              maximumFractionDigits: 2,
                                            }
                                          )}
                                        </p>
                                      </div>

                                      <div className="flex flex-col">
                                        <p className={`${inter.className}`}>
                                          Claimed
                                        </p>
                                        <p className="text-samurai-red w-max text-[18px]">
                                          {user?.claimed.toLocaleString(
                                            "en-us",
                                            {
                                              minimumFractionDigits: 2,
                                            }
                                          )}
                                        </p>
                                      </div>

                                      <div className="flex flex-col">
                                        <p className={`${inter.className}`}>
                                          Vesting
                                        </p>
                                        <p className="text-samurai-red w-max text-[18px]">
                                          {now > general?.periods.cliffEndsAt
                                            ? (
                                                user?.purchased -
                                                user?.claimed -
                                                user?.claimable
                                              ).toLocaleString("en-us", {
                                                minimumFractionDigits: 2,
                                              })
                                            : Number(0).toLocaleString(
                                                "en-us",
                                                {
                                                  minimumFractionDigits: 2,
                                                }
                                              )}
                                        </p>
                                      </div>

                                      <div className="flex flex-col">
                                        <p className={`${inter.className}`}>
                                          Claimable
                                        </p>
                                        <p className="text-samurai-red w-max text-[18px]">
                                          {user?.claimable.toLocaleString(
                                            "en-us",
                                            {
                                              minimumFractionDigits: 2,
                                            }
                                          )}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {!loading && currentPhase?.toUpperCase() !== "UPCOMING" && (
                <IdoAllocationProgress
                  maxAllocations={general?.amounts?.maxAllocations || 0}
                  raised={general?.raised || 0}
                />
              )}
            </div>
          </div>
        </div>
      </TopLayout>
      <div className="flex flex-col xl:flex-row gap-10 pt-10 lg:pt-24 pb-10 xl:pb-32 border-t border-white/20 bg-white/10 px-3 xl:px-0">
        {ido && (
          <>
            <div className="flex flex-col w-full lg:rounded-[8px] bg-black/30 bg-samurai-pattern shadow-xl lg:border border-white/20 h-max xl:ml-10 2xl:ml-20">
              <h1 className="text-xl bg-samurai-red px-6 py-4 rounded-t-lg">
                Token Info
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-3 xl:flex xl:flex-col gap-4 mt-8 text-[15px] xl:text-xl px-6 pb-8">
                <div className="flex flex-col lg:flex-row lg:items-center gap-2 bg-black/50 py-2 px-4 lg:rounded-md w-max lg:border border-white/10 text-sm lg:text-lg">
                  <span className="text-samurai-red">Token Symbol:</span>
                  <p className="text-white/70">{ido.projectTokenSymbol}</p>
                </div>
                <div className="flex flex-col lg:flex-row lg:items-center gap-2 bg-black/50 py-2 px-4 lg:rounded-md w-max lg:border border-white/10 text-sm lg:text-lg">
                  <span className="text-samurai-red">Network:</span>
                  <p className="text-white/70">{ido.tokenNetwork}</p>
                </div>
                <div className="flex flex-col lg:flex-row lg:items-center gap-2 bg-black/50 py-2 px-4 lg:rounded-md w-max lg:border border-white/10 text-sm lg:text-lg">
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
                <div className="flex flex-col lg:flex-row lg:items-center gap-2 bg-black/50 py-2 px-4 lg:rounded-md w-max lg:border border-white/10 text-sm lg:text-lg">
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

                <div className="flex flex-col lg:flex-row lg:items-center gap-2 bg-black/50 py-2 px-4 lg:rounded-md w-max lg:border border-white/10 text-sm lg:text-lg">
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

                <div className="flex flex-col lg:flex-row lg:items-center gap-2 bg-black/50 py-2 px-4 lg:rounded-md lg:w-max lg:border border-white/10 text-sm lg:text-lg">
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
                </div>

                <div className="flex flex-col lg:flex-row lg:items-center gap-2 bg-black/50 py-2 px-4 lg:rounded-md w-max lg:border border-white/10 text-sm lg:text-lg">
                  <span className="text-samurai-red">Dex Screener:</span>
                  <p className="text-white/70">
                    TBA
                    {/* <Link href="#">{"https://somelink".toUpperCase()}</Link> */}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-10 px-6 lg:pr-10">
              <div
                className={`flex w-full xl:text-[16px] xl:leading-[1.70rem] 2xl:text-[20px] 2xl:leading-[2rem] text-gray-300 ${inter.className}`}
                dangerouslySetInnerHTML={{
                  __html: ido.projectBigDescription as string,
                }}
              />
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
                <SSButton disabled={secondaryLoading} click={onTogglePause}>
                  {secondaryLoading
                    ? "Loading..."
                    : general.isPaused
                    ? "Unpause"
                    : "Pause"}
                </SSButton>
                <SSButton
                  disabled={secondaryLoading || general.isPublic}
                  click={onMakePublic}
                >
                  {secondaryLoading ? "Loading..." : "Make Public"}
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
                  <SSButton disabled={secondaryLoading} click={onWithdraw}>
                    {secondaryLoading
                      ? "Loading..."
                      : "Withdraw Participations"}
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
