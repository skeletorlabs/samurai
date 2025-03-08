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
  simplifiedPhasesV2,
} from "@/app/utils/constants";
import { formattedDate, formattedDateSimple } from "@/app/utils/formattedDate";
import {
  discord,
  paste,
  pasted,
  redo,
  youtube,
  linkWallet,
} from "@/app/utils/svgs";
import SSButton from "@/app/components/ssButton";
import { StateContext } from "@/app/context/StateContext";
import {
  generalInfo,
  // getLinkedWallets,
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
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import AdminRanges from "@/app/components/adminRanges";

const inter = Inter({
  subsets: ["latin"],
});

export default function Ido() {
  const [inputValue, setInputValue] = useState("");
  const [inputLinkedWallet, setInputLinkedWallet] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [general, setGeneral] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [currentPhase, setCurrentPhase] = useState<string | null>(null);
  const [selectedToken, setSelectedToken] = useState("");
  const [tier, setTier] = useState<Tier | null>(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [imageSelected, setImageSelected] = useState("");

  const { signer, account } = useContext(StateContext);

  const { ido: idoID } = useParams();
  console.log(idoID);

  const ido = IDO_LIST.find((item) => item.id === (idoID as string));
  const idoIndex = IDO_LIST.findIndex((item) => item.id === (idoID as string));
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

  const onRegister = useCallback(async () => {
    setIsLoading(true);
    if (signer && user && !user.isWhitelisted) {
      await register(idoIndex, signer);
      await getGeneralData();
      await getUserInfos();
    }

    setIsLoading(false);
  }, [signer, idoIndex, user, inputLinkedWallet, setIsLoading]);

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
    if (signer && tier) {
      const response = await userInfo(idoIndex, signer, tier.name);
      setUser(response);
    }
  }, [signer, idoIndex, tier]);

  const getTierInfos = useCallback(async () => {
    if (signer && account) {
      const tier = await getTier(account);
      if (tier) setTier(tier);
    }
  }, [signer, account, idoIndex]);

  useEffect(() => {
    if (tier) {
      getUserInfos();
    }
  }, [tier]);

  useEffect(() => {
    getTierInfos();
  }, [signer, account]);

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

              <div className="flex items-center w-full gap-8 justify-center xl:justify-start flex-wrap">
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

                {ido?.tokenNetwork !== "TBA" && (
                  <div className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-md text-[14px] border border-white/20 w-max">
                    <span className="text-sm">Project Tokens</span>
                    <Image
                      src={ido!.networkImageSrc || ""}
                      alt={ido!.tokenNetwork || ""}
                      width={24}
                      height={24}
                      className="p-[1px] bg-white/80 rounded-full"
                    />
                  </div>
                )}

                <div className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-md text-[14px] border border-white/20 w-max">
                  <span className="text-sm">Crowdsale</span>
                  <Image
                    src="/chain-logos/BASE.svg"
                    alt={ido?.projectName || ""}
                    width={24}
                    height={24}
                    className="p-[1px] bg-white/80 rounded-full"
                  />
                </div>
              </div>

              {ido && ido.images && (
                <div className="flex flex-col w-full">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-5 pt-10 2xl:pt-14 self-center xl:self-start">
                    <div className="grid gap-5">
                      <button
                        onClick={() => onImageClick(ido.images![0])}
                        className="transition-all hover:scale-105 relative w-[160px] h-[160px] md:w-[180px] xl:h-[140px] xl:w-[140px] md:h-[180px] 2xl:w-[180px] 2xl:h-[180px]"
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
                        className="transition-all hover:scale-105 relative w-[160px] h-[160px] md:w-[180px] xl:h-[140px] xl:w-[140px] md:h-[180px] 2xl:w-[180px] 2xl:h-[180px]"
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
                        className="transition-all hover:scale-105 relative w-[160px] h-[160px] md:w-[180px] xl:h-[140px] xl:w-[140px] md:h-[180px] 2xl:w-[180px] 2xl:h-[180px]"
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
                        className="transition-all hover:scale-105 relative w-[160px] h-[160px] md:w-[180px] xl:h-[140px] xl:w-[140px] md:h-[180px] 2xl:w-[180px] 2xl:h-[180px]"
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
                <div className="flex flex-col w-full xl:w-[550px] rounded-lg bg-black/70 bg-samurai-pattern pb-6 shadow-xl lg:border border-white/20 mt-10">
                  <div className="flex justify-between items-center text-lg xl:text-xl bg-samurai-red border-b border-white/20 px-7 py-4 rounded-t-lg text-white">
                    <span>
                      {general?.isPublic && ido?.id !== "kvants"
                        ? "FCFS Round"
                        : ido?.investmentRound}
                    </span>
                    {/* TIER */}
                    {signer && account && (
                      <div className="flex items-center gap-1 text-black">
                        {tier
                          ? tier?.name === ""
                            ? "Public"
                            : tier?.name
                          : "loading..."}
                        <span>Tier</span>
                      </div>
                    )}
                  </div>
                  <div className="hidden md:flex flex-row mt-6 bg-black-900/90 rounded-lg border border-white/20 mx-4 xl:mx-6">
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
                              className="w-2 md:w-3 text-white/40 stroke-white/40"
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
                            className={`p-2 flex-1 text-md ${
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
                    <div className="flex flex-col gap-10 px-5 md:px-6">
                      {/* PARTICIPATION PHASE BLOCK */}
                      <div className="grid grid-cols-2 md:grid-cols-3 items-center flex-wrap mt-6 text-sm">
                        <div className="flex md:hidden flex-col py-2 px-2 rounded-md w-max">
                          <span className="text-neutral-600">
                            Current Phase:
                          </span>
                          <p className="text-white/70">{currentPhase}</p>
                        </div>
                        <div className="flex flex-col py-2 px-2 rounded-md w-max">
                          <span className="text-neutral-600">IDO Start:</span>
                          <p className="text-white/70">
                            {formattedDate(ido.participationStartsAt)} UTC
                          </p>
                        </div>
                        <div className="flex flex-col py-2 px-2 rounded-md w-max">
                          <span className="text-neutral-600">IDO End:</span>
                          <p className="text-white/70">
                            {formattedDate(ido.participationEndsAt)} UTC
                          </p>
                        </div>
                        <div className="flex flex-col py-2 px-2 rounded-md w-max">
                          <span className="text-neutral-600">FCFS Start:</span>
                          <p className="text-white/70">
                            {formattedDate(ido.publicParticipationStartsAt)} UTC
                          </p>
                        </div>
                        <div className="flex flex-col py-2 px-2 rounded-md w-max">
                          <span className="text-neutral-600">FCFS End:</span>
                          <p className="text-white/70">
                            {formattedDate(ido.publicParticipationEndsAt)} UTC
                          </p>
                        </div>
                        <div className="flex flex-col py-2 px-2 rounded-md w-max">
                          <span className="text-neutral-600">TGE Date:</span>
                          <p className="text-white/70">
                            {ido.tgeDate === 0
                              ? "TBA"
                              : formattedDateSimple(ido.tgeDate)}
                          </p>
                        </div>
                        <div className="flex flex-col py-2 px-2 rounded-md w-max">
                          <span className="text-neutral-600">
                            Token Symbol:
                          </span>
                          <p className="text-white/70">
                            {ido.projectTokenSymbol}
                          </p>
                        </div>
                        <div className="flex flex-col py-2 px-2 rounded-md w-max">
                          <span className="text-neutral-600">Token Price:</span>
                          <p className="text-white/70">
                            ${ido.price} {ido.acceptedTokenSymbol}
                          </p>
                        </div>

                        {signer && account && (
                          <div className="flex flex-col py-2 px-2 rounded-md w-max">
                            <span className="text-neutral-600">Min:</span>
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
                          <div className="flex flex-col py-2 px-2 rounded-md w-max">
                            <span className="text-neutral-600">Max:</span>
                            <p className="text-white/70">
                              $
                              {Number(
                                user?.walletRange?.maxPerWallet | 0
                              ).toLocaleString("en-us")}{" "}
                              {ido?.acceptedTokenSymbol}
                            </p>
                          </div>
                        )}

                        {currentPhase && currentPhase !== "Completed" && (
                          <div className="flex flex-col py-2 px-2 rounded-md w-max">
                            <span className="text-neutral-600">Raised:</span>
                            <p className="text-white/70">
                              $
                              {Number(general?.raised | 0).toLocaleString(
                                "en-us"
                              )}{" "}
                              {ido?.acceptedTokenSymbol}
                            </p>
                          </div>
                        )}

                        {signer && account && (
                          <>
                            <div className="flex flex-col py-2 px-2 rounded-md w-max">
                              <span className="text-neutral-600">
                                Registered:
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
                              <div className="flex flex-col py-2 px-2 rounded-md w-max">
                                <span className="text-neutral-600">
                                  Linked Wallet:
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
                          </>
                        )}
                      </div>

                      {signer &&
                        account &&
                        (currentPhase?.toLocaleLowerCase() === "registration" ||
                          currentPhase?.toLocaleLowerCase() ===
                            "participation") && (
                          <>
                            {/* LINK WALLET */}
                            <div className="flex flex-col gap-1 text-[14px]">
                              {general?.usingLinkedWallet &&
                                user?.linkedWallet === "" && (
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
                                          isLoading ||
                                          !general ||
                                          !user ||
                                          general?.isPaused
                                        }
                                        className={`
                                  ${
                                    isLoading ||
                                    !general ||
                                    !user ||
                                    general?.isPaused
                                      ? "opacity-40"
                                      : "opacity-100"
                                  }
                                    font-light flex justify-center items-center gap-2 transition-all hover:scale-110`}
                                      >
                                        {isLoading ? (
                                          "Loading..."
                                        ) : (
                                          <>
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
                                          </>
                                        )}
                                      </button>
                                      <button
                                        onClick={() => setInputLinkedWallet("")}
                                        disabled={
                                          isLoading ||
                                          !general ||
                                          !user ||
                                          general?.isPaused
                                        }
                                        className={`
                                  ${
                                    isLoading ||
                                    !general ||
                                    !user ||
                                    general?.isPaused
                                      ? "opacity-40"
                                      : "opacity-100"
                                  }
                                    font-light flex justify-center items-center gap-2 transition-all hover:scale-110`}
                                      >
                                        {isLoading ? (
                                          "Loading..."
                                        ) : (
                                          <>
                                            <div>{redo}</div>
                                            <span>Clear</span>
                                          </>
                                        )}
                                      </button>
                                      <button
                                        onClick={() => onPaste()}
                                        disabled={
                                          isLoading ||
                                          !general ||
                                          !user ||
                                          general?.isPaused
                                        }
                                        className={`
                                  ${
                                    isLoading ||
                                    !general ||
                                    !user ||
                                    general?.isPaused
                                      ? "opacity-40"
                                      : "opacity-100"
                                  }
                                    font-light flex justify-center items-center gap-2 transition-all hover:scale-110`}
                                      >
                                        {isLoading ? (
                                          "Loading..."
                                        ) : (
                                          <>
                                            <div>
                                              {inputLinkedWallet
                                                ? linkWallet
                                                : linkWallet}
                                            </div>
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
                                          </>
                                        )}
                                      </button>
                                    </div>
                                    <button
                                      onClick={onRegister}
                                      disabled={
                                        isLoading ||
                                        !general ||
                                        !user ||
                                        general?.isPaused ||
                                        (general?.usingLinkedWallet &&
                                          inputLinkedWallet === "")
                                      }
                                      className={`
                                ${
                                  isLoading ||
                                  !general ||
                                  !user ||
                                  general?.isPaused ||
                                  (general?.usingLinkedWallet &&
                                    inputLinkedWallet === "")
                                    ? "bg-black text-white/20"
                                    : "bg-samurai-red text-white hover:opacity-75"
                                }
                                  rounded-[8px] w-full mt-4 py-4 text-[18px] text-center transition-all `}
                                    >
                                      {isLoading ? "Loading..." : "LINK WALLET"}
                                    </button>
                                  </div>
                                )}
                            </div>

                            {/* REGISTER */}
                            {((!general?.usingLinkedWallet &&
                              !user?.isWhitelisted &&
                              !general?.isPublic) ||
                              (general?.usingLinkedWallet &&
                                user?.linkedWallet !== "" &&
                                !user?.isWhitelisted &&
                                !general?.isPublic)) && (
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
                                  isLoading ||
                                  !general ||
                                  !user ||
                                  general?.isPaused
                                    ? "bg-black text-white/20"
                                    : "bg-samurai-red text-white hover:opacity-75"
                                }
                                  rounded-[8px] w-full py-4 text-[18px] text-center transition-all`}
                              >
                                {isLoading ? "Loading..." : "REGISTER"}
                              </button>
                            )}
                          </>
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
                            <div className="p-3 border border-white/20 rounded-[8px] w-full xl:w-[230px]">
                              <p className={`text-sm ${inter.className}`}>
                                MY ALLOCATION
                              </p>
                              <p className="text-xl text-samurai-red">
                                $
                                {user.allocation.toLocaleString("en-us", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </p>
                            </div>

                            <div className="p-3 border border-white/20 rounded-[8px] w-full xl:w-[230px]">
                              <p className={`text-sm ${inter.className}`}>
                                TOKENS TO RECEIVE
                              </p>
                              <p className="text-xl text-samurai-red">
                                {(
                                  Number(user?.allocation) / Number(ido.price)
                                )?.toLocaleString("en-us", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}{" "}
                                {ido.projectTokenSymbol}
                              </p>
                            </div>
                            <div className="p-3 border border-white/20 rounded-[8px] w-full xl:w-[230px]">
                              <p className={`text-sm ${inter.className}`}>
                                {ido.tgePercentage}% TGE RELEASE
                              </p>
                              <p className="text-xl text-samurai-red">
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
                            <div className="p-3 border border-white/20 rounded-[8px] w-full xl:w-[230px]">
                              <p className={`text-sm ${inter.className}`}>
                                {100 - ido.tgePercentage}% VESTING RELEASE
                              </p>
                              <p className="text-xl text-samurai-red">
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
                      {currentPhase &&
                        currentPhase?.toLowerCase() === "completed" && (
                          <>
                            <div className="text-xl text-white/80 pt-5 border-t border-white/20 leading-normal">
                              <p className="text-samurai-red text-[16px]">
                                Token distribution:
                              </p>
                              TBA
                            </div>
                          </>
                        )}
                    </div>
                  )}
                </div>
              </div>
              {currentPhase && currentPhase !== "Completed" && (
                <IdoAllocationProgress
                  maxAllocations={general?.maxAllocations || 0}
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
                    {ido.acceptedTokenSymbol}
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
                  <p className="text-white/70">{ido.vesting}</p>
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
                  __html: ido.bigDescription as string,
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
                  TOTAL {TOKENS_TO_SYMBOL[general.acceptedToken2]}:{" "}
                  {Number(user?.acceptedTokenBalance | 0).toLocaleString(
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
