"use client";
import Link from "next/link";
import { useCallback, useContext, useEffect, useState } from "react";
import { StateContext } from "@/app/context/StateContext";
import { Inter } from "next/font/google";
import SSButton from "@/app/components/ssButton";
import {
  general,
  getNFTData,
  isWhitelisted,
  mint,
} from "@/app/contracts_integrations/nft";

import { ethers } from "ethers";
import Image from "next/image";
import { Carousel } from "flowbite-react";

import {
  SupplyInfo,
  GeneralInfo,
  Nfts,
  WhitelistDataType,
  NFTToken,
  FormattedNFTToken,
} from "@/app/utils/interfaces";

import useSWR from "swr";
import { request } from "graphql-request";
import { SUPPLY_QUERY, GALLERY_QUERY } from "@/app/queries/nft";
import TopLayout from "@/app/components/topLayout";
import { formattedDate3 } from "../utils/formattedDate";
import { LockOpenIcon, LockClosedIcon } from "@heroicons/react/16/solid";
import {
  lockNFT,
  unlockNFT,
  generalInfo as generalLockInfos,
  userInfo,
} from "../contracts_integrations/nftLock";

import { userInfo as pointsUserInfo } from "../contracts_integrations/points";

import { currentTime } from "../utils/currentTime";
import Loading from "../components/loading";
import {
  ArrowLeftIcon,
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
  ArrowRightIcon,
  CheckCircleIcon,
} from "@heroicons/react/20/solid";

const inter = Inter({
  subsets: ["latin"],
});

const images = ["/cyborg-male.png", "/cyborg-female.png"];

const boosters = ["1.25x", "1.5x", "2x", "3x", "4x"];

export default function Nft() {
  const { account, signer } = useContext(StateContext);
  const [loading, setLoading] = useState(false);

  const [image, setImage] = useState(
    images[Math.floor(Math.random() * images.length)]
  );
  const [generalInfo, setGeneralInfo] = useState<GeneralInfo | null>(null);
  const [supply, setSupply] = useState<SupplyInfo | null>(null);
  const [userNfts, setUserNfts] = useState<FormattedNFTToken[] | []>([]);
  const [lastFiveNfts, setLastFiveNfts] = useState<Nfts | []>([]);
  const [numberOfTokens, setNumberOfTokens] = useState(1);
  const [whitelistData, setWhitelistData] = useState<WhitelistDataType | null>(
    null
  );
  const [nftLockGeneral, setNftLockGeneral] = useState<any>(null);
  const [lockedNfts, setLockedNfts] = useState<NFTToken[] | null>(null);
  const [userLocksBalance, setUserLocksBalance] = useState(0);
  const [userBoost, setUserBoost] = useState(0);

  const fetcher = (query: string, variables: any) => {
    return request(
      `https://api.studio.thegraph.com/query/38777/samnft-base/version/latest`,
      query,
      variables
    );
  };

  const { data: supplyData } = useSWR([SUPPLY_QUERY], fetcher, {
    refreshInterval: 5000,
  });

  const { data: lastFiveNftsData } = useSWR([GALLERY_QUERY], fetcher, {
    refreshInterval: 5000,
  });

  const getLockedToken = useCallback(
    (tokenId: number) => {
      return lockedNfts
        ? lockedNfts.find(
            (item) => item.tokenId === tokenId && item.locked === true
          )
        : null;
    },
    [lockedNfts]
  );

  const canUnlock = useCallback(
    (tokenId: number) => {
      const locked = getLockedToken(tokenId);
      if (!locked) return false;
      if (nftLockGeneral?.lockPeriodDisabled) return true;

      const now = currentTime();
      if (locked) return now >= locked.lockedUntil;
      return false;
    },
    [nftLockGeneral, lockedNfts]
  );

  const getWhiteListInfos = useCallback(async () => {
    setLoading(true);
    if (signer) {
      const checkWhitelist = await isWhitelisted(signer);
      setWhitelistData(checkWhitelist as WhitelistDataType);
    }
    setLoading(false);
  }, [signer, setLoading, setWhitelistData]);

  const getGeneralInfo = useCallback(async () => {
    setLoading(true);
    const response = await general();
    setGeneralInfo(response as GeneralInfo);

    setLoading(false);
  }, [setGeneralInfo, setLoading]);

  const onGetUserLockInfos = useCallback(async () => {
    setLoading(true);
    if (signer) {
      const response = await userInfo(signer);
      if (response?.locks) setLockedNfts(response.locks);
      if (response?.balance) setUserLocksBalance(response.balance);
    }
    setLoading(false);
  }, [signer, setLoading, setLockedNfts]);

  const onGetUserBoost = useCallback(async () => {
    setLoading(true);
    if (signer) {
      const response = await pointsUserInfo(signer);
      if (response?.boost) setUserBoost(response.boost);
    }
    setLoading(false);
  }, [signer, setLoading, setLockedNfts]);

  const onGetGeneralLockInfos = useCallback(async () => {
    setLoading(true);
    const response = await generalLockInfos();
    if (response) setNftLockGeneral(response);

    setLoading(false);
  }, [setLoading, setNftLockGeneral]);

  const mintNFT = useCallback(async () => {
    setLoading(true);
    if (signer) {
      await mint(numberOfTokens, signer);
    }

    await getGeneralInfo();
    setLoading(false);
  }, [signer, numberOfTokens]);

  const freeMintNFT = useCallback(async () => {
    setLoading(true);
    if (signer) {
      await mint(1, signer! as ethers.Signer, true);
      await getWhiteListInfos();
    }

    await getGeneralInfo();
    setLoading(false);
  }, [signer]);

  const onLockNFT = useCallback(
    async (tokenId: number) => {
      setLoading(true);
      if (signer) {
        await lockNFT(tokenId, signer);
        await onGetUserLockInfos();
      }
      setLoading(false);
    },
    [signer, setLoading]
  );

  const onUnlockNFT = useCallback(
    async (tokenId: number) => {
      setLoading(true);
      const index = lockedNfts?.findIndex((item) => item.tokenId === tokenId);
      if (signer && index !== -1) {
        await unlockNFT(index!, tokenId, signer);
        await onGetUserLockInfos();
      }
      setLoading(false);
    },
    [lockedNfts, signer, setLoading]
  );

  useEffect(() => {
    setUserNfts([]);
    const fetchSrcForNfts = async () => {
      if (generalInfo && lockedNfts && lockedNfts.length > 0) {
        const updatedUserNfts = await Promise.all(
          lockedNfts.map(async (nft, index) => {
            const { imageUrl, metadata } = await getNFTData(
              generalInfo.baseUri,
              `${nft.tokenId}.json`
            );

            return {
              id: index.toString(),
              tokenId: nft.tokenId.toString(),
              tokenUri: `${nft.tokenId}.json`,
              wallet: account,
              src: imageUrl,
              metadata: metadata,
              lockedUntil: nft.lockedUntil,
              locked: nft.locked,
              lockIndex: nft.lockIndex,
            };
          })
        );

        setUserNfts(updatedUserNfts);
      }
    };

    fetchSrcForNfts();
  }, [lockedNfts, generalInfo]);

  useEffect(() => {
    const fetchSrcForNfts = async () => {
      const list = { ...(lastFiveNftsData as { minteds: Nfts }) };
      setLastFiveNfts(list.minteds);

      if (
        generalInfo?.baseUri &&
        list &&
        list.minteds &&
        list.minteds.length > 0
      ) {
        const updatedLastFiveNfts = await Promise.all(
          list.minteds.map(async (nft) => {
            const { imageUrl, metadata } = await getNFTData(
              generalInfo?.baseUri,
              nft.tokenUri
            );
            return { ...nft, src: imageUrl, metadata };
          })
        );

        setLastFiveNfts(updatedLastFiveNfts);
      }
    };

    fetchSrcForNfts();
  }, [lastFiveNftsData, generalInfo]);

  useEffect(() => {
    if (supplyData) {
      const { createds } = supplyData as { createds: [SupplyInfo] };
      setSupply(createds[0]);
    }
  }, [supplyData]);

  useEffect(() => {
    if (signer) {
      getWhiteListInfos();
      onGetUserLockInfos();
      onGetUserBoost();
    }
  }, [signer]);

  useEffect(() => {
    getGeneralInfo();
    onGetGeneralLockInfos();
  }, []);

  return (
    <>
      <TopLayout background="bg-samurai-shadow">
        <div className="flex flex-col xl:flex-row justify-between xl:items-center gap-6 xl:gap-0 lg:px-8 xl:px-20 pt-10 lg:pt-24">
          {/* TOP CONTENT */}

          <div className="relative md:mr-12 xl:max-w-[900px] px-6 md:px-0">
            <h1 className="text-[38px] sm:text-[58px] lg:text-[90px] font-black leading-[48px] sm:leading-[68px] lg:leading-[98px] text-white text-center sm:text-start">
              Buy a <span className="text-samurai-red">SamNFT </span>
              for lifetime VIP access to the hottest launchpad on the market
            </h1>
            <p
              className={`leading-normal lg:leading-relaxed pt-8 md:pt-16 lg:text-2xl xl:max-w-[900px] text-center sm:text-start ${inter.className}`}
            >
              SamNFT holders are the core of the Samurai Starter community —
              pick up yours on OpenSea to gain access to tremendous benefits
              including lifetime top-tier launchpad access, cashback rewards,
              and more!
            </p>
          </div>

          <div className="flex md:min-w-[400px] md:max-w-[400px] h-[300px] sm:h-[500px] md:bg-white p-2 rounded-[8px] relative">
            <Carousel leftControl=" " rightControl=" ">
              {images.map((image, index) => (
                <Image
                  key={index}
                  src={image}
                  width={400}
                  height={500}
                  alt={image}
                  className="rounded-[8px] w-full h-auto md:w-[400px] md:h-full"
                  placeholder="blur"
                  blurDataURL="/thumb.png"
                />
              ))}
            </Carousel>
          </div>
        </div>
      </TopLayout>

      <div className="flex flex-col w-full">
        {/* CONTENT */}
        <div className="flex flex-col xl:flex-row xl:justify-between gap-12 px-6 lg:px-8 xl:px-20 py-10 pb-20 md:py-20 w-full bg-black text-white border-t border-samurai-red/50 border-dotted">
          <div className="flex flex-col relative gap-10">
            <div className="flex flex-col text-white text-2xl">
              <p className="font-bold text-5xl pb-2">
                Lock <span className="text-samurai-red">SamNFT</span>
              </p>

              <p
                className={`text-lg pt-10 lg:pt-0 text-neutral-300 font-light xl:max-w-[1300px] ${inter.className}`}
              >
                Lock SamNFT to lifetime access to all token offerings on Samurai
                Starter at the highest launchpad tier. Gain guaranteed access to
                amazing token offerings from the most innovative and hyped
                projects in the Web3 space.
              </p>
            </div>
            <div className="flex flex-col text-white text-2xl">
              <p className="font-bold text-4xl pb-2">
                <span className="text-samurai-red">Samurai</span> Points{" "}
                <span className="text-samurai-red">Boosters</span>
              </p>

              <p
                className={`text-lg pt-10 lg:pt-0 text-neutral-300 font-light xl:max-w-[1300px] ${inter.className}`}
              >
                For each SamNFT locked (up to 5), you earn boosters to increase
                your Samurai Points earned from all platform activities.
              </p>

              <div className="pt-5 flex flex-col w-full text-lg pb-1">
                <div className="flex items-center w-full gap-3">
                  <p className="w-[120px] bg-white/20 px-1 py-1">NFTs Locked</p>
                  <ArrowLongRightIcon className="w-10 text-white/50" />
                  <p className="bg-white/30 px-2 py-1">
                    Samurai Points Booster
                  </p>
                </div>
              </div>
              <div className="flex flex-col w-full text-lg gap-1">
                {boosters.map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-center w-full gap-3 ${inter.className}`}
                  >
                    <p className="w-[120px]">
                      {index + 1} SamNFT{index > 0 && "s"}
                    </p>
                    <ArrowLongRightIcon className="w-10 text-white/50" />
                    <p className="w-max bg-white/10 px-3 pt-1">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col w-full xl:min-w-[540px] xl:max-w-[540px] 2xl:max-w-[700px] gap-3">
            <Link
              target="blank"
              href="https://opensea.io/collection/samuraistarter"
              className="bg-blue-500 px-10 py-2 rounded-[8px] w-full flex justify-center items-center gap-2 mb-3 transition-all md:text-lg hover:text-xl"
            >
              <Image
                src="/opensea-logo.svg"
                width={34}
                height={34}
                alt="opensea"
              />
              <span>OpenSea SamNFT Collection</span>
            </Link>

            <div className="flex justify-between items-center gap-4 text-xl">
              <div>
                <span className="text-samurai-red">SUPPLY</span>
              </div>
              <div className="flex flex-1 border-[0.5px] border-neutral-600 border-dashed" />
              <div className="text-2xl">
                <span>{generalInfo?.totalSupply || 0}</span>
              </div>
            </div>

            {signer && (
              <div className="flex justify-between items-center gap-2 text-xl">
                <div>MY NFTS</div>
                <div className="flex flex-1 border-[0.5px] border-neutral-600 border-dashed" />
                <div>
                  <span className="text-samurai-red text-2xl">
                    {userNfts?.length || 0}
                  </span>
                </div>
              </div>
            )}

            <div className="flex flex-col w-full xl:max-w-[600px] 2xl:min-w-[700px] items-center gap-3 md:gap-14 mt-5 2xl:max-h-[830px]">
              <div
                className={`flex w-full items-center gap-4 px-4 justify-center mb-[-20px] tracking-wider text-gray-400 ${inter.className}`}
              >
                <ArrowLongLeftIcon width={32} />
                <span>Slide horizontally to check your NFTs</span>
                <ArrowLongRightIcon width={32} />
              </div>
              <div className="flex w-full xl:max-w-[600px] 2xl:min-w-[700px] items-center gap-3 md:gap-14 2xl:max-h-[830px] overflow-scroll">
                {userNfts?.map((nft, index) => (
                  <div key={index} className="flex flex-col items-center gap-2">
                    <Link
                      className="flex justify-center items-center w-[200px] h-[300px] lg:w-[240px] lg:h-[350px] bg-white rounded-[8px] relative"
                      target="blank"
                      href={`${process.env.NEXT_PUBLIC_OPENSEA_URL as string}/${
                        nft.tokenId
                      }`}
                    >
                      <Image
                        src={nft?.src ? nft?.src : "/loading.gif"}
                        fill
                        sizes="auto"
                        style={{
                          objectFit: "cover",
                        }}
                        alt={image}
                        className="scale-[0.95] rounded-[8px] transition-all hover:scale-[0.99]"
                      />
                      {nft.locked ? (
                        <div className="absolute top-3 right-2 flex justify-center items-center bg-black/70 p-1 rounded-full w-8 h-8 shadow-md">
                          <LockClosedIcon className="w-4 h-4 shadow-md text-white" />
                        </div>
                      ) : (
                        <div className="absolute top-3 right-2 flex justify-center items-center bg-black/70 p-1 rounded-full w-8 h-8 shadow-md">
                          <LockOpenIcon className="w-4 h-4 shadow-md text-white" />
                        </div>
                      )}

                      {nft.locked && (
                        <div className="absolute bottom-[6px] bg-black p-2 w-[190px] md:w-[227px] rounded-b-md text-center">
                          {nftLockGeneral?.lockPeriodDisabled ? (
                            <p className="text-xs md:text-sm">
                              Lock period currently disabled
                            </p>
                          ) : (
                            <p className="text-sm">
                              Unlockable at{" "}
                              {formattedDate3(nft?.lockedUntil || 0)}{" "}
                            </p>
                          )}
                        </div>
                      )}
                    </Link>
                    {nft.locked ? (
                      <SSButton
                        flexSize
                        mobile
                        disabled={loading || !canUnlock(Number(nft.tokenId))}
                        click={() => onUnlockNFT(Number(nft.tokenId))}
                      >
                        <>UNLOCK #{nft.tokenId}</>
                      </SSButton>
                    ) : (
                      <SSButton
                        flexSize
                        mobile
                        disabled={loading}
                        click={() => onLockNFT(Number(nft.tokenId))}
                      >
                        {loading ? <Loading /> : <>LOCK #{nft.tokenId}</>}
                      </SSButton>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full">
        {/* LOCK */}
        <div className="flex flex-col pt-10 md:pt-20 pb-2  w-full bg-white/5 border-t border-samurai-red/50 border-dotted">
          <div className="flex flex-col md:flex-row px-6 lg:px-8 xl:px-20 text-white">
            <div className="flex flex-col text-white text-2xl pb-20">
              <p className="font-bold text-5xl pb-2">
                My <span className="text-samurai-red">SamNFT</span> Locks
              </p>

              <p
                className={`text-lg pt-10 lg:pt-0 text-neutral-300 font-light xl:max-w-[1300px] ${inter.className}`}
              >
                Number of SamNFTs Locked:{" "}
                <span className="text-samurai-red">
                  {userLocksBalance} SamNFTs
                </span>
              </p>
              <div className="pt-10 flex flex-col gap-3">
                <p
                  className={`flex items-center gap-2 ${
                    userLocksBalance > 0 ? "text-white" : "text-white/10"
                  }`}
                >
                  <CheckCircleIcon
                    className={`w-10 ${
                      userLocksBalance > 0 ? "text-green-300" : "text-white/10"
                    } `}
                  />{" "}
                  Lifetime Launchpad Access
                </p>
                <div
                  className={`flex items-center gap-2 ${
                    userLocksBalance > 0 ? "text-white" : "text-white/10"
                  }`}
                >
                  <CheckCircleIcon
                    className={`w-10 ${
                      userLocksBalance > 0 ? "text-green-300" : "text-white/10"
                    } `}
                  />{" "}
                  Lifetime Points Booster Obtained
                  <p
                    className={`${
                      userLocksBalance > 0 ? "text-green-300" : "text-white/10"
                    }`}
                  >
                    <span className="transition-all hover:text-samurai-red">
                      {userLocksBalance > 0 && userBoost + "x"}
                    </span>
                  </p>
                </div>
              </div>
              <div className="pt-12 text-lg text-white/70">
                Please visit our{" "}
                <Link
                  href="#"
                  className="text-white underline font-light hover:opacity-75"
                >
                  Samurai Points
                </Link>{" "}
                page (coming soon) to see your Samurai Points balance.
              </div>
            </div>
          </div>
        </div>

        {/* LATEST NFTS MINTED */}
        <div className="flex items-center gap-12 px-6 lg:px-8 xl:px-20 py-10 pb-20 md:py-20 w-full bg-black text-white border-t-[0.5px] border-samurai-red">
          <div className="flex flex-col relative">
            <h2 className="flex items-center text-4xl lg:text-5xl font-bold gap-5 mb-10">
              Gallery
              <p className="w-max">
                <Link
                  target="blank"
                  href="https://opensea.io/collection/samuraistarter"
                  className="bg-blue-500 px-4 py-1 rounded-[8px] flex justify-center items-center gap-2 transition-all text-lg hover:text-xl w-[150px]"
                >
                  <Image
                    src="/opensea-logo.svg"
                    width={34}
                    height={34}
                    alt="opensea"
                  />
                  <span>OpenSea</span>
                </Link>
              </p>
            </h2>

            <div
              className={`flex w-full justify-center sm:justify-start items-center flex-wrap gap-6 ${
                lastFiveNfts?.length === 0 ? "mt-5" : "mt-4"
              }`}
            >
              {lastFiveNfts?.length === 0 && (
                <span>- New minted NFTs will appear here</span>
              )}
              {lastFiveNfts?.map((nft, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center transition-all hover:scale-110"
                >
                  <Link
                    target="blank"
                    href={
                      nft.metadata
                        ? `${process.env.NEXT_PUBLIC_OPENSEA_URL as string}/${
                            nft.tokenId
                          }`
                        : "#"
                    }
                    className="flex flex-col justify-center items-center w-[150px] h-[150px] md:w-[200px] md:h-[200px] lg:w-[240px] lg:h-[240px] bg-white rounded-[8px] relative"
                  >
                    <Image
                      src={nft?.src ? nft?.src : "/loading.gif"}
                      fill
                      sizes="auto"
                      style={{
                        objectFit: "cover",
                      }}
                      alt={image}
                      className="scale-[0.95] rounded-[8px]"
                    />
                  </Link>
                  <p className="text-white text-sm mt-2">
                    {nft.metadata?.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
