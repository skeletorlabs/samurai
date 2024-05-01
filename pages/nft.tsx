import Link from "next/link";
import { useCallback, useContext, useEffect, useState } from "react";
import { StateContext } from "@/context/StateContext";
import { Inter } from "next/font/google";
import SSButton from "@/components/ssButton";
import {
  general,
  getNFTData,
  isWhitelisted,
  mint,
} from "@/contracts_integrations/nft";

import { ethers } from "ethers";
import Layout from "@/components/layout";
import Image from "next/image";
import { Carousel } from "flowbite-react";
import { getNetwork } from "@wagmi/core";

import {
  SupplyInfo,
  GeneralInfo,
  Nfts,
  WhitelistDataType,
  UniqueWallet,
} from "@/utils/interfaces";
import { getUnixTime, fromUnixTime, formatDistance } from "date-fns";

import useSWR from "swr";
import { request } from "graphql-request";
import {
  SUPPLY_QUERY,
  MY_NFTS_QUERY,
  LAST_FIVE_NFTS_QUERY,
  ALL_WALLETS,
} from "@/queries/nft";
import TopLayout from "@/components/topLayout";

const inter = Inter({
  subsets: ["latin"],
});

// const images = ["/nfts/1.jpg", "/nfts/2.jpg"];
const images = ["/cyborg-male.png", "/cyborg-female.png"];

const utilities = [
  {
    title: "",
    description:
      "Check out the amazing benefits you can expect to enjoy as a proud owner of our SamNFT:",
  },
  {
    title: "Lifetime Launchpad Access",
    description:
      "Enjoy lifetime access to all token offerings on Samurai Starter. By holding SamNFT, you enjoy guaranteed whitelisting to amazing token offerings from the most innovative and hyped projects in the Web3 space.",
  },
  {
    title: "$SAM Airdrop",
    description:
      "Our loyalty reward token, $SAM, is scheduled to launch Q1 2024 on Base. Purchase a SamNFT during the minting period to be eligible to receive a generous share of the total supply of $SAM tokens. 10% of the entire $SAM supply will be claimed by SamNFT minters!",
  },
  {
    title: "Cashback Rewards",
    description:
      "SamNFT holders who participate in token offerings on Samurai Starter are eligible to receive cashback rewards in the form of $SAM tokens. We love loyalty and want to reward it! The more you participate, the higher you climb the SAM Ladder, the more $SAM rewards you earn. The SAM Ladder shows your ranking among all $SAM earners. Climb The Ladder to earn up to 5% cashback on your token offering purchases.",
  },
  {
    title: "SamNFT Rentals",
    description:
      "Not interested in participating in an upcoming token offering? Want to earn some passive income from your SamNFT? Holders can offer their SamNFTs for rent on our in-house SamNFT rental marketplace! Set your desired price and length of time of the rental and lease your SamNFT to non-holders who may want to participate in token offerings, but do not want to risk waiting for the public round. It is a win-win for all!",
  },
  {
    title: "VIP Access to Samurai Sanka",
    description:
      "Samurai Sanka is our upcoming community interaction platform. It includes a Partner Quest Platform, Prediction Markets, Lotteries and many more entertaining applications that will allow you to utilize your $SAM rewards and become high-value participants. As a SamNFT holder, you receive special VIP perks including reward boosts for participating on Sanka.",
  },
  {
    title: "Eligibility for special giveaways",
    description:
      "When Samurai Starter brings in new projects for either our accelerator, crowdfunding platform, or other services, we always aim to acquire freebies for our community whether they be tokens, NFTs, or some other digital gifts. As a SamNFT holder, you will be immediately eligible to receive such gifts from our partners and others.",
  },
  {
    title: "DAO Governance Rights",
    description:
      "As SamNFT holders, the decision to launch a project is in your hands. The number of holders who express interest in a token offering will determine whether we launch the project and the size of the allocation we secure so that everyone who is interested can get the token allotment they desire.",
  },
];

export default function Nft() {
  const { account, isLoading, signer, setIsLoading } = useContext(StateContext);

  const [image, setImage] = useState(
    images[Math.floor(Math.random() * images.length)]
  );
  const [generalInfo, setGeneralInfo] = useState<GeneralInfo | null>(null);
  const [supply, setSupply] = useState<SupplyInfo | null>(null);
  const [userNfts, setUserNfts] = useState<Nfts | []>([]);
  const [lastFiveNfts, setLastFiveNfts] = useState<Nfts | []>([]);
  const [numberOfTokens, setNumberOfTokens] = useState(1);
  const [whitelistData, setWhitelistData] = useState<WhitelistDataType | null>(
    null
  );

  const { chain } = getNetwork();

  const fetcher = (query: string, variables: any) => {
    return request(
      `https://api.studio.thegraph.com/query/38777/samnft-base/version/latest`,
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
      refreshInterval: 5000,
    }
  );

  const { data: myNftsData, error: myNftsDataError } = useSWR(
    [MY_NFTS_QUERY, myNftsVariables],
    fetcher,
    {
      refreshInterval: 5000,
    }
  );

  const { data: lastFiveNftsData, error: lastFiveNftsError } = useSWR(
    [LAST_FIVE_NFTS_QUERY],
    fetcher,
    {
      refreshInterval: 5000,
    }
  );

  // const { data: wallets100 } = useSWR(
  //   [ALL_WALLETS, { first: 100, skip: 0 }],
  //   fetcher
  // );

  // const { data: wallets200 } = useSWR(
  //   [ALL_WALLETS, { first: 100, skip: 100 }],
  //   fetcher
  // );

  // const { data: wallets300 } = useSWR(
  //   [ALL_WALLETS, { first: 100, skip: 200 }],
  //   fetcher
  // );

  // const { data: wallets400 } = useSWR(
  //   [ALL_WALLETS, { first: 100, skip: 300 }],
  //   fetcher
  // );

  // const { data: wallets500 } = useSWR(
  //   [ALL_WALLETS, { first: 100, skip: 400 }],
  //   fetcher
  // );

  // const { data: wallets600 } = useSWR(
  //   [ALL_WALLETS, { first: 100, skip: 500 }],
  //   fetcher
  // );

  // const { data: wallets700 } = useSWR(
  //   [ALL_WALLETS, { first: 100, skip: 600 }],
  //   fetcher
  // );

  // const { data: wallets800 } = useSWR(
  //   [ALL_WALLETS, { first: 100, skip: 700 }],
  //   fetcher
  // );

  // const { data: wallets900 } = useSWR(
  //   [ALL_WALLETS, { first: 100, skip: 800 }],
  //   fetcher
  // );

  // const { data: wallets1000 } = useSWR(
  //   [ALL_WALLETS, { first: 100, skip: 900 }],
  //   fetcher
  // );

  // const { data: wallets1100 } = useSWR(
  //   [ALL_WALLETS, { first: 100, skip: 1000 }],
  //   fetcher
  // );

  // useEffect(() => {
  //   if (
  //     wallets100 !== undefined &&
  //     wallets200 !== undefined &&
  //     wallets300 !== undefined &&
  //     wallets400 !== undefined &&
  //     wallets500 !== undefined &&
  //     wallets600 !== undefined &&
  //     wallets700 !== undefined &&
  //     wallets800 !== undefined &&
  //     wallets900 !== undefined
  //   ) {
  //     const list = [
  //       ...wallets100!.minteds,
  //       ...wallets200!.minteds,
  //       ...wallets300!.minteds,
  //       ...wallets400!.minteds,
  //       ...wallets500!.minteds,
  //       ...wallets600!.minteds,
  //       ...wallets700!.minteds,
  //       ...wallets800!.minteds,
  //       ...wallets900!.minteds,
  //       ...wallets1000!.minteds,
  //       ...wallets1100!.minteds,
  //     ];

  //     const uniqueWallets = new Set();

  //     const filteredArray = list.filter((item) => {
  //       const isUnique = uniqueWallets.has(item.wallet);
  //       uniqueWallets.add(item.wallet);
  //       return !isUnique;
  //     });

  //     console.log(filteredArray);
  //   }
  // }, [
  //   wallets100,
  //   wallets200,
  //   wallets300,
  //   wallets400,
  //   wallets500,
  //   wallets600,
  //   wallets700,
  //   wallets800,
  //   wallets900,
  //   wallets1000,
  //   wallets1100,
  // ]);

  const getWhiteListInfos = useCallback(async () => {
    setIsLoading(true);
    if (signer && chain && !chain.unsupported) {
      const checkWhitelist = await isWhitelisted(signer);
      setWhitelistData(checkWhitelist as WhitelistDataType);
    }
    setIsLoading(false);
  }, [chain, signer, setIsLoading, setWhitelistData]);

  const getGeneralInfo = useCallback(async () => {
    setIsLoading(true);
    const response = await general();
    setGeneralInfo(response as GeneralInfo);

    setIsLoading(false);
  }, [setGeneralInfo, setIsLoading]);

  const mintNFT = useCallback(async () => {
    setIsLoading(true);
    if (signer && chain && !chain.unsupported) {
      await mint(numberOfTokens, signer);
    }

    await getGeneralInfo();
    setIsLoading(false);
  }, [signer, numberOfTokens]);

  const freeMintNFT = useCallback(async () => {
    setIsLoading(true);
    if (signer && chain && !chain.unsupported) {
      await mint(1, signer! as ethers.Signer, true);
      await getWhiteListInfos();
    }

    await getGeneralInfo();
    setIsLoading(false);
  }, [chain, signer]);

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
    }
  }, [signer]);

  useEffect(() => {
    getGeneralInfo();
  }, []);

  return (
    <Layout>
      <TopLayout background="bg-samurai-shadow">
        <div className="flex flex-col xl:flex-row justify-between xl:items-center gap-6 xl:gap-0 lg:px-8 xl:px-20 pt-10 lg:pt-24">
          {/* TOP CONTENT */}

          <div className="relative md:mr-12 xl:max-w-[900px] px-6 md:px-0">
            <h1 className="text-[48px] sm:text-[58px] lg:text-[90px] font-black leading-[58px] sm:leading-[68px] lg:leading-[98px] text-white">
              Buy a <span className="text-samurai-red">SamNFT </span>
              for lifetime VIP access to the hottest launchapd on the market!
            </h1>
            <p
              className={`leading-normal lg:leading-relaxed pt-16 lg:text-2xl xl:max-w-[900px]  ${inter.className}`}
            >
              SamNFT holders are the core of the Samurai Starter community —
              pick up yours on OpenSea to gain access to tremendous benefits
              including lifetime top-tier launchpad access, cashback rewards,
              and more!
            </p>
          </div>

          <div className="flex md:min-w-[400px] md:max-w-[400px] h-[500px] md:bg-white p-2 rounded-[8px] relative">
            <Carousel leftControl=" " rightControl=" ">
              {images.map((image, index) => (
                <Image
                  key={index}
                  src={image}
                  width={400}
                  height={500}
                  alt={image}
                  className="rounded-[8px] w-full md:w-[400px] h-[500px]"
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
        <div className="flex flex-col xl:flex-row gap-12 px-6 lg:px-8 xl:px-20 py-10 pb-20 md:py-20 w-full bg-black text-white border-t border-samurai-red/50 border-dotted">
          <div className="flex flex-col relative">
            <div
              className={`flex flex-col text-lg text-neutral-300 gap-8 lg:gap-8 pb-10 ${inter.className}`}
            >
              {utilities.map((item, index) => (
                <div
                  key={index}
                  className={`rounded-[8px] opacity-90 backdrop-blur-[8px] shadow-xl ${
                    index === 0 && "text-3xl max-w-[700px]"
                  }`}
                >
                  <p className="text-samurai-red font-normal pb-2 text-xl">
                    {item.title}
                  </p>
                  {item.description}
                </div>
              ))}

              <p className="font-normal">
                These are just a few of the utilities provided by the SamNFT. We
                are delighted that you are going to join us on this journey and
                we will always strive to bring more and more value and benefits
                to our early SamNFT supporters.
              </p>
            </div>
          </div>

          <div className="flex flex-col w-full xl:min-w-[540px] xl:max-w-[540px] gap-3">
            <Link
              target="blank"
              href="https://opensea.io/collection/samuraistarter"
              className="bg-blue-500 px-10 py-2 rounded-[8px] w-full flex justify-center items-center gap-2 mb-3 transition-all text-lg hover:text-xl"
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

            <div className="flex w-full lg:max-w-[600px] items-center flex-wrap gap-14 mt-5 2xl:max-h-[830px] 2xl:overflow-scroll">
              {userNfts?.map((nft, index) => (
                <Link
                  key={index}
                  className="flex justify-center items-center w-[100px] h-[100px] md:w-[200px] md:h-[200px] lg:w-[240px] lg:h-[240px] bg-white rounded-[8px] relative"
                  target="blank"
                  href={`${process.env.NEXT_PUBLIC_OPENSEA_URL as string}/${
                    nft.tokenId
                  }`}
                  // className="transition-all hover:rotate-12"
                >
                  <Image
                    src={nft?.src ? nft?.src : "/loading.gif"}
                    fill
                    alt={image}
                    className="scale-[0.95] rounded-[8px] transition-all hover:scale-[0.99]"
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full">
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
              className={`flex w-full items-center flex-wrap gap-6 ${
                lastFiveNfts?.length === 0 ? "mt-5" : "mt-4"
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

        {/* STAKE */}
        {/* <div className="flex flex-col pt-10 md:pt-20 pb-2  w-full bg-white/5 border-t border-samurai-red/50 border-dotted">
          <div className="flex flex-col px-6 lg:px-8 xl:px-20 text-white">
            <div className="flex flex-col text-white text-2xl pb-20">
              <p className="font-bold text-5xl pb-2">
                Stake <span className="text-samurai-red">SamNFT</span>
              </p>

              <p
                className={`text-lg pt-10 lg:pt-0 text-neutral-300 font-light xl:max-w-[1300px] ${inter.className}`}
              >
                Stake your SamNFT to claim your $SAM airdrop which is vested
                with 20% released at TGE and 10% per month for eight months.
              </p>
              <div className="pt-10 md:pt-[80px] flex flex-col md:flex-row gap-3 md:gap-5">
                Coming soon...
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </Layout>
  );
}
