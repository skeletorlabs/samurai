import { useCallback, useContext, useEffect, useState } from "react";
import { StateContext } from "@/context/StateContext";
import Layout from "@/components/layout";
import { Inter } from "next/font/google";
import SSButton from "@/components/ssButton";
import { general, mint } from "@/contracts_integrations/nft";

import { ethers } from "ethers";
import LayoutClean from "@/components/layoutClean";
import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
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

type GeneralInfo = {
  totalSupply: string;
  maxSupply: string;
};

export default function Nft() {
  const { isLoading, signer, setIsLoading } = useContext(StateContext);

  const [image, setImage] = useState(
    images[Math.floor(Math.random() * images.length)]
  );
  const [imageKey, setImageKey] = useState(0);
  const [generalInfo, setGeneralInfo] = useState<GeneralInfo | null>(null);

  const getGeneralInfo = useCallback(async () => {
    setIsLoading(true);
    const response = await general(signer!);
    setGeneralInfo(response as GeneralInfo);
    setIsLoading(false);
  }, [signer]);

  useEffect(() => {
    if (signer) getGeneralInfo();
  }, [signer]);

  useEffect(() => {
    const interval = setInterval(() => {
      setImageKey((prevKey) => prevKey + 1);
      setImage(images[Math.floor(Math.random() * images.length)]);
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <LayoutClean>
      <div className="flex w-full justify-between px-6 lg:px-8 xl:px-20 pt-20">
        {/* TOP CONTENT */}
        <div className="lg:max-w-[750px]">
          <h1 className="text-[58px] lg:text-[68px] font-black leading-[62px] tracking-wide">
            <span className="text-samurai-red">Sam</span> NFT
          </h1>
          <div
            className={`flex flex-col font-light leading-normal pt-4 text-lg text-neutral-300 pb-14 gap-4 ${inter.className}`}
          >
            <p className="font-medium">
              By participating in this minting event, you'll become part of our
              vibrant community and gain access to exciting benefits. Here's
              what you can expect as a proud owner of our unique NFTs:
            </p>

            <p>
              <span className="text-samurai-red font-normal">
                Airdrops and Rewards:
              </span>{" "}
              As a token of appreciation for your support, we'll be providing
              exclusive airdrops and rewards to all NFT holders. These airdrops
              could include additional tokens, limited editions, or even special
              experiences.
            </p>

            <p>
              <span className="text-samurai-red font-normal">
                VIP Access to Web3 Events:
              </span>{" "}
              Get ready to dive into the world of Web3! As an NFT holder, you'll
              receive VIP access to our web3 events, where you can connect with
              industry experts, learn about the latest developments in the
              blockchain space, and engage in stimulating discussions with
              like-minded individuals.
            </p>

            <p>
              <span className="text-samurai-red font-normal">
                Community Engagement:
              </span>{" "}
              Our community is the heart of our project. By minting our NFTs,
              you'll become part of a dynamic and passionate group of
              individuals who share a common interest in art, technology, and
              the decentralized future. Engage in lively conversations,
              collaborate on exciting projects, and forge lasting connections
              with fellow community members.
            </p>

            <p>
              <span className="text-samurai-red font-normal">
                Early Access and Exclusive Opportunities:
              </span>{" "}
              Stay ahead of the curve! As an NFT holder, you'll have the
              privilege of gaining early access to future project updates,
              releases, and exclusive opportunities. Be the first to explore new
              features, participate in unique collaborations, and unlock special
              benefits reserved for our esteemed community members.
            </p>

            <p className="text-white">
              Join us on this incredible journey into the world of NFTs and the
              decentralized revolution. Mint your NFTs today and embark on a
              thrilling adventure filled with rewards, exclusive access, and a
              vibrant community.
            </p>
          </div>
        </div>

        {/* TOP SIDE CONTENT */}
        <div className="">
          <div className="flex justify-center items-center w-[500px] h-[500px] bg-white rounded-[8px] relative">
            <Image
              key={imageKey}
              src={image}
              fill
              alt=""
              className="scale-[0.95] rounded-[8px]"
            />
          </div>
          <div className="flex flex-col w-full mt-4">
            {signer ? (
              <div className="flex flex-col gap-3">
                <SSButton click={() => mint(signer! as ethers.Signer)} flexSize>
                  MINT A SAMURAI NFT
                </SSButton>

                {!isLoading && (
                  <div className="text-5xl text-right">
                    <span className="text-samurai-red">
                      {generalInfo?.totalSupply}
                    </span>
                    /{generalInfo?.maxSupply}
                  </div>
                )}
              </div>
            ) : (
              <ConnectButton />
            )}
          </div>
        </div>
      </div>
    </LayoutClean>
  );
}
