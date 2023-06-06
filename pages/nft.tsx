import { useContext, useEffect, useState } from "react";
import { StateContext } from "@/context/StateContext";
import Layout from "@/components/layout";
import { Inter } from "next/font/google";
import SSButton from "@/components/ssButton";
import { mint } from "@/contracts_integrations/nft";

import { ethers } from "ethers";
import LayoutClean from "@/components/layoutClean";
import Image from "next/image";
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

export default function Nft() {
  const { signer } = useContext(StateContext);

  const [image, setImage] = useState(
    images[Math.floor(Math.random() * images.length)]
  );
  const [imageKey, setImageKey] = useState(0);

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
      <div className="flex w-full justify-between items-center px-6 lg:px-8 xl:px-20">
        {/* TOP CONTENT */}
        <div className="pt-10 lg:pt-24 lg:max-w-[750px] lg:h-[630px]">
          <h1 className="text-[58px] lg:text-[68px] font-black leading-[62px] tracking-wide">
            Sam NFT
          </h1>
          <p className={`leading-normal pt-4 text-2xl ${inter.className}`}>
            Get your SAM NFT to receive airdrops.
          </p>
          {signer && (
            <div className="flex flex-col lg:flex-row items-center pt-10 gap-5 z-20">
              <SSButton click={() => mint(signer! as ethers.Signer)}>
                Mint
              </SSButton>
            </div>
          )}
        </div>

        {/* TOP SIDE CONTENT */}
        <div className="">
          <div className="flex justify-center items-center w-[500px] h-[500px] bg-white rounded-[8px] relative">
            <Image
              key={imageKey}
              src={image}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              alt=""
              className="scale-[0.95] rounded-[8px]"
            />
          </div>
        </div>
      </div>
    </LayoutClean>
  );
}
