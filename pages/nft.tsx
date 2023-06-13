import Link from "next/link";
import { useCallback, useContext, useEffect, useState } from "react";
import { StateContext } from "@/context/StateContext";
import { Inter } from "next/font/google";
import SSButton from "@/components/ssButton";
import { general, getNFTData, mint } from "@/contracts_integrations/nft";

import { ethers } from "ethers";
import LayoutClean from "@/components/layoutClean";
import Image from "next/image";
import { Accordion, Carousel } from "flowbite-react";

import { SupplyInfo, GeneralInfo, Nfts } from "@/utils/interfaces";

import useSWR from "swr";
import { request } from "graphql-request";
import {
  SUPPLY_QUERY,
  MY_NFTS_QUERY,
  LAST_FIVE_NFTS_QUERY,
} from "@/queries/nft";

const inter = Inter({
  subsets: ["latin"],
});

const images = [
  "/nfts/1.png",
  "/nfts/2.png",
  "/nfts/3.png",
  "/nfts/4.png",
  "/nfts/5.png",
  "/nfts/6.png",
  "/nfts/7.png",
  "/nfts/8.png",
];

const baseUri = process.env.NEXT_PUBLIC_BASE_URI as string;

export default function Nft() {
  const { account, isLoading, signer, setIsLoading } = useContext(StateContext);

  const [image, setImage] = useState(
    images[Math.floor(Math.random() * images.length)]
  );
  const [generalInfo, setGeneralInfo] = useState<GeneralInfo | null>(null);
  const [supply, setSupply] = useState<SupplyInfo | null>(null);
  const [userNfts, setUserNfts] = useState<Nfts | []>([]);
  const [lastFiveNfts, setLastFiveNfts] = useState<Nfts | []>([]);

  const fetcher = (query: string, variables: any) => {
    return request(
      `https://api.thegraph.com/subgraphs/name/lucasfernandes/samnft`,
      query,
      variables
    );
  };

  const myNftsVariables = {
    wallet: account,
  };

  const { data: supplyData, error: supplyError } = useSWR(
    [SUPPLY_QUERY],
    fetcher,
    {
      refreshInterval: 120000,
    }
  );

  const { data: myNftsData, error: myNftsDataError } = useSWR(
    [MY_NFTS_QUERY, myNftsVariables],
    fetcher,
    {
      refreshInterval: 120000,
    }
  );

  const { data: lastFiveNftsData, error: lastFiveNftsError } = useSWR(
    [LAST_FIVE_NFTS_QUERY],
    fetcher,
    {
      refreshInterval: 120000,
    }
  );

  const getGeneralInfo = useCallback(async () => {
    setIsLoading(true);
    const response = await general();
    setGeneralInfo(response as GeneralInfo);
    setIsLoading(false);
  }, [setGeneralInfo, setIsLoading]);

  const mintNFT = useCallback(async () => {
    setIsLoading(true);
    await mint(signer! as ethers.Signer);
    await getGeneralInfo();
    setIsLoading(false);
  }, [signer]);

  useEffect(() => {
    setUserNfts([]);
    const fetchSrcForNfts = async () => {
      const list = { ...(myNftsData as { minteds: Nfts }) };
      setUserNfts(list.minteds);

      if (generalInfo && list && list.minteds && list.minteds.length > 0) {
        const updatedUserNfts = await Promise.all(
          list.minteds.map(async (nft) => {
            const { imageUrl, metadata } = await getNFTData(
              generalInfo.baseUri,
              nft.tokenUri
            );
            return { ...nft, src: imageUrl, metadata };
          })
        );

        setUserNfts(updatedUserNfts);
      }
    };

    fetchSrcForNfts();
  }, [myNftsData, generalInfo]);

  useEffect(() => {
    const fetchSrcForNfts = async () => {
      const list = { ...(lastFiveNftsData as { minteds: Nfts }) };
      setLastFiveNfts(list.minteds);

      if (list && list.minteds && list.minteds.length > 0) {
        const updatedLastFiveNfts = await Promise.all(
          list.minteds.map(async (nft) => {
            const { imageUrl, metadata } = await getNFTData(
              baseUri,
              nft.tokenUri
            );
            return { ...nft, src: imageUrl, metadata };
          })
        );

        setLastFiveNfts(updatedLastFiveNfts);
      }
    };

    fetchSrcForNfts();
  }, [lastFiveNftsData]);

  useEffect(() => {
    if (supplyData) {
      const { createds } = supplyData as { createds: [SupplyInfo] };
      setSupply(createds[0]);
    }
  }, [supplyData]);

  useEffect(() => {
    getGeneralInfo();
  }, []);

  return (
    <LayoutClean>
      <div className="flex flex-col">
        <div className="flex flex-col xl:flex-row w-full justify-between px-6 lg:px-8 xl:px-20 pt-10 lg:pt-24">
          {/* TOP CONTENT */}
          <div className="w-full xl:max-w-[770px] lg:mr-10">
            <h1 className="text-[58px] lg:text-[68px] font-black leading-[62px] tracking-wide pt-10 lg:pt-0">
              <span className="text-samurai-red">Sam</span>NFT
            </h1>
            <div
              className={`flex flex-col font-light leading-normal lg:pt-4 text-lg text-neutral-300 pb-14 gap-4 ${inter.className}`}
            >
              <p className="pt-10 font-normal">
                By participating in the SamNFT minting event, you become part of
                our vibrant community and gain access to tremendous benefits.
              </p>
              <p className="font-normal">
                Here's what you can expect as a proud owner of our SamNFTs:
              </p>

              <p>
                <span className="text-samurai-red font-normal">
                  Lifetime Launchpad Access:
                </span>{" "}
                Enjoy lifetime access to all token offerings on Samurai
                Launchpad. No need to buy and stake costly launchpad tokens, no
                more token staking tiers*, minimal barriers to entry. The SamNFT
                gives you equal access to token offerings from the most novel
                and hyped startups in the crypto space.
              </p>
              <p>
                <span className="text-samurai-red font-normal">
                  $SAM Airdrop:{" "}
                </span>{" "}
                Our reward token, $SAM, is launching in Q4 2023 on Arbitrum.
                People who purchase SamNFT during the pre-mint period are
                eligible to receive a share of 30% of the total supply of $SAM
                tokens which is vested over one year.
              </p>
              <p>
                <span className="text-samurai-red font-normal">
                  Cashback Rewards:
                </span>{" "}
                SamNFT stakers who participate in token offerings on Samurai
                Launchpad are eligible to receive cashback rewards in the form
                of $SAM tokens. Stake or LP the $CFI governance token to
                increase your cashback rewards.
              </p>
              <p>
                <span className="text-samurai-red font-normal">
                  SamNFT Rentals:
                </span>{" "}
                Not interested in participating in an upcoming token offering?
                Want to earn some passive income from your SamNFTs? Holders can
                offer their SamNFTs for rent on our in-house SamNFT rental
                marketplace! Set your desired price and length of time of the
                rental and lease your SamNFT to non-holders who may want to
                participate in token offerings.
              </p>
              <p>
                <span className="text-samurai-red font-normal">
                  VIP Access to Samurai Sanka:
                </span>{" "}
                Samurai Sanka is our upcoming user interaction platform. It
                includes a Partner's Quest platform, Prediction Markets,
                Lotteries and more. As a SamNFT staker, you receive special VIP
                perks including reward boosts for participating on Sanka.
              </p>
              <p>
                <span className="text-samurai-red font-normal">
                  Eligibility for special giveaways:
                </span>{" "}
                When Samurai Starter is bringing in new projects for either our
                accelerator, launchpad or other services, we always strive to
                bring in some freebies for our community whether they be tokens,
                NFTs, or some other digital gifts.
              </p>
              <p>
                <span className="text-samurai-red font-normal">
                  DAO Governance Rights:
                </span>{" "}
                As SamNFT holders, the decision to launch a project is in your
                hands. The number of holders who express interest in a token
                offering will determine whether we launch the project and the
                size of the allocation we secure so that everyone who is
                interested can get the token allotment they desire.
              </p>
              <p className="font-normal">
                These are just a few of the utilities provided by the SamNFT. We
                are delighted that you are going to join us on this journey and
                we will always strive to bring more and more value and benefits
                to our early SamNFT supporters.
              </p>
            </div>
          </div>

          {/* SIDE CONTENT */}
          <div className="mt-28">
            <div className="flex justify-center items-center w-full h-[300px] lg:w-[500px] lg:h-[500px] bg-white p-2 rounded-[8px] relative">
              <Carousel leftControl=" " rightControl=" ">
                {images.map((image, index) => (
                  <Image
                    key={index}
                    src={image}
                    width={500}
                    height={300}
                    alt={image}
                    className="rounded-[8px]"
                    placeholder="blur"
                    blurDataURL="/thumb.png"
                  />
                ))}
              </Carousel>
            </div>
            <div className="flex flex-col w-full mt-4">
              <div className="flex flex-col gap-3">
                <div className="flex flex-col lg:flex-row items-center gap-3">
                  <SSButton disabled={!signer} click={() => mintNFT()} flexSize>
                    MINT A SAMURAI NFT
                  </SSButton>
                  <SSButton disabled={!signer} click={() => {}} flexSize>
                    RENT A SAMURAI NFT
                  </SSButton>
                </div>

                <div className="flex flex-col text-xl gap-3 mt-4">
                  <div className="flex justify-between items-center gap-4">
                    <div>
                      <span className="text-samurai-red">MINTED</span>
                      /SUPPLY
                    </div>
                    <div className="flex flex-1 border-[0.5px] border-neutral-600 border-dashed" />
                    <div className="text-2xl">
                      <span className="text-samurai-red">
                        {generalInfo?.totalSupply.toString() || 0}
                      </span>
                      /
                      {Number(supply?.maxSupply) +
                        Number(supply?.maxWhitelistedSupply) || 0}
                    </div>
                  </div>

                  {signer && (
                    <div className="flex justify-between items-center gap-2">
                      <div>MY NFTS</div>
                      <div className="flex flex-1 border-[0.5px] border-neutral-600 border-dashed" />
                      <div>
                        <span className="text-samurai-red text-2xl">
                          {userNfts?.length || 0}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex w-full lg:max-w-[500px] items-center flex-wrap gap-4 mt-5">
                    {userNfts?.map((nft, index) => (
                      <div
                        key={index}
                        className="flex justify-center items-center w-[100px] h-[100px] md:w-[200px] md:h-[200px] lg:w-[240px] lg:h-[240px] bg-white rounded-[8px] relative"
                      >
                        <Image
                          src={nft?.src ? nft?.src : "/loading.gif"}
                          fill
                          alt={image}
                          className="scale-[0.95] rounded-[8px]"
                        />

                        {/* CHECK ON OPENSEA */}
                        {signer && nft.metadata && (
                          <Link
                            target="blank"
                            href={`${
                              process.env.NEXT_PUBLIC_OPENSEA_URL as string
                            }/${nft.tokenId}`}
                            className="
                              absolute bottom-12 left-0 
                              border border-l-0 border-black rounded-tr-[8px] rounded-br-[8px] 
                              px-3 
                              text-[12px] font-bold text-white
                              bg-blue-500  shadow-lg
                              transition-all hover:pl-6 hover:font-black  
                            "
                          >
                            VIEW
                          </Link>
                        )}

                        {/* RENT */}
                        {signer && nft.src && (
                          <button
                            className="
                              absolute bottom-4 left-0 
                              border border-l-0 border-black rounded-tr-[8px] rounded-br-[8px] 
                              px-3 
                              text-[12px] font-bold text-black
                              bg-yellow-300  shadow-lg
                              transition-all hover:pl-6 hover:font-black  
                            "
                          >
                            RENT
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* LATEST NFTS MINTED */}
        <div className="flex items-center gap-12 px-6 lg:px-8 xl:px-20 py-10 pb-20 md:py-20 w-full bg-white/10 text-white border-t-[0.5px] border-samurai-red mt-20 ">
          <div className="flex flex-col relative">
            <h2 className="text-4xl lg:text-5xl font-bold">
              Lastest <span className="text-samurai-red">Mints</span>
              <p className="text-yellow-200 text-[16px] hover:underline w-max pt-2">
                <Link
                  href="https://testnets.opensea.io/collection/test-sam-nft"
                  target="blank"
                >
                  View entire collection ➜
                </Link>
              </p>
            </h2>

            <div
              className={`flex w-full items-center flex-wrap gap-6 ${
                lastFiveNfts?.length === 0 ? "mt-5" : "mt-10"
              }`}
            >
              {lastFiveNfts?.length === 0 && (
                <span>- New minted NFTs will appear here</span>
              )}
              {lastFiveNfts?.map((nft, index) => (
                <div key={index} className="transition-all hover:scale-110">
                  <Link
                    target="blank"
                    href={
                      nft.metadata
                        ? `${process.env.NEXT_PUBLIC_OPENSEA_URL as string}/${
                            nft.tokenId
                          }`
                        : "#"
                    }
                    className="flex flex-col justify-center items-center w-[100px] h-[100px] md:w-[200px] md:h-[200px] lg:w-[240px] lg:h-[240px] bg-white rounded-[8px] relative"
                  >
                    <Image
                      src={nft?.src ? nft?.src : "/loading.gif"}
                      fill
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
    </LayoutClean>
  );
}
