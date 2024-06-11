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
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";

const inter = Inter({
  subsets: ["latin"],
});

const images = [
  {
    src: "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image.jpg",
    alt: "Description of image 1 (optional)",
  },
  {
    src: "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-1.jpg",
    alt: "Description of image 2 (optional)",
  },
  {
    src: "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-2.jpg",
    alt: "Description of image 3 (optional)",
  },
  {
    src: "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-3.jpg",
    alt: "Description of image 4 (optional)",
  },
  {
    src: "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-4.jpg",
    alt: "Description of image 5 (optional)",
  },
  {
    src: "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-5.jpg",
    alt: "Description of image 6 (optional)",
  },
  {
    src: "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-6.jpg",
    alt: "Description of image 7 (optional)",
  },
  {
    src: "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-7.jpg",
    alt: "Description of image 8 (optional)",
  },
  {
    src: "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-8.jpg",
    alt: "Description of image 9 (optional)",
  },
  {
    src: "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-9.jpg",
    alt: "Description of image 10 (optional)",
  },
  {
    src: "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-10.jpg",
    alt: "Description of image 11 (optional)",
  },
  {
    src: "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-11.jpg",
    alt: "Description of image 12 (optional)",
  },
];

export default function Ido() {
  const [inputValue, setInputValue] = useState("");
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

  const onImageClick = useCallback(
    async (image: string) => {
      setGalleryOpen(false);
      setImageSelected(image);
      setGalleryOpen(true);
    },
    [setGalleryOpen]
  );

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
        <div className="flex flex-col">
          <div className="flex justify-center xl:justify-start items-center gap-2 text-sm font-extralight px-6 xl:px-20 pt-4 xl:pt-24">
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
            <div className="relative px-6 lg:px-8 xl:px-20">
              <div className="flex flex-col text-[38px] md:text-[58px] lg:text-[70px] font-black leading-[58px] sm:leading-[68px] lg:leading-[98px] text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] relative">
                <div className="flex ml-[-30px] lg:ml-0 items-center sm:gap-3 xl:text-5xl justify-center xl:justify-start">
                  <div className="scale-[0.5] sm:scale-[0.7]">{ido?.logo}</div>
                  <span>{ido?.projectName}</span>
                </div>
              </div>
              <p
                className={`xl:pt-6 text-[18px] md:text-[22px] xl:text-[28px] pb-7 ${inter.className}`}
              >
                {ido?.projectDescription}
              </p>

              <div className="flex items-center w-full gap-8 justify-center xl:justify-start">
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
                <div className="flex items-center gap-4">
                  {ido?.tokenNetwork !== "To be announced" && (
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

                  <div className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-md text-[14px] border border-white/20  w-max">
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
            </div>

            <div className="flex flex-col xl:pr-28 gap-5 mt-10 xl:mt-0 mx-3 xl:mx-0">
              <div className="flex flex-col">
                <div className="flex flex-col w-full xl:w-[550px] rounded-lg bg-black/70 bg-samurai-pattern pb-6 shadow-xl lg:border border-white/20 mt-10">
                  <div className="flex justify-between items-center text-lg xl:text-xl bg-samurai-red border-b border-white/20 px-7 py-4 rounded-t-lg text-white">
                    <span>
                      {general?.isPublic ? "Pulic Round" : ido?.investmentRound}
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
                            {formattedDate(
                              ido.publicParticipationEndsAt
                            ).toUpperCase()}{" "}
                            UTC
                          </p>
                        </div>
                        <div className="flex flex-col py-2 px-2 rounded-md w-max">
                          <span className="text-neutral-600">TGE Date:</span>
                          <p className="text-white/70">
                            {ido.tgeDate === 0
                              ? "TO BE ANNOUNCED"
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
                      {currentPhase?.toLowerCase() === "completed" && (
                        <>
                          <div className="text-xl text-white/80 pt-5 border-t border-white/20 leading-normal">
                            <p className="text-samurai-red text-[16px]">
                              Token distribution:
                            </p>
                            To be announced
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
      <div className="flex flex-col xl:flex-row  gap-10 pt-10 lg:pt-24 pb-10 xl:pb-32 border-t border-white/20 bg-white/10 px-3 xl:px-0">
        {ido && (
          <>
            <div className="flex flex-col w-full xl:w-[700px] lg:rounded-[8px] bg-black/30 bg-samurai-pattern shadow-xl lg:border border-white/20 h-max xl:ml-20">
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
                    {ido.projectTokenSymbol}
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
                    To be announced
                    {/* <Link href="#">{"https://somelink".toUpperCase()}</Link> */}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-10 px-6 lg:px-8 xl:pr-20">
              <div
                className={`flex w-full xl:text-[1.34rem] text-gray-300 ${inter.className}`}
                dangerouslySetInnerHTML={{
                  __html: ido.bigDescription as string,
                }}
              />
            </div>
          </>
        )}
      </div>

      {ido && ido.images && (
        <div className="flex flex-col w-full bg-white/5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 px-6 lg:px-8 xl:px-20 py-20 self-start">
            <div className="grid gap-10">
              <button
                onClick={() => onImageClick(ido.images![0])}
                className="transition-all hover:scale-105 relative w-[160px] h-[160px] xl:w-[240px] xl:w-[240px] 2xl:-[340px]"
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
                className="transition-all hover:scale-105 relative w-[160px] h-[180px] xl:w-[240px] xl:w-[240px] 2xl:-[300px]"
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
                className="transition-all hover:scale-105 relative w-[160px] h-[190px] xl:w-[240px] xl:w-[240px] 2xl:-[390px]"
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
                className="transition-all hover:scale-105 relative w-[160px] h-[140px] xl:w-[240px] xl:w-[240px] 2xl:-[340px]"
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

          <Transition appear show={galleryOpen}>
            <Dialog
              as="div"
              className="relative z-10 focus:outline-none bg-black"
              onClose={() => setGalleryOpen(false)}
            >
              <div className="fixed inset-0 bg-black/60" aria-hidden="true" />

              <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
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
        </div>
      )}

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
