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
              By participating in the SamNFT minting event, you become part of
              our vibrant community and gain access to tremendous benefits.
              Here's what you can expect as a proud owner of our SamNFTs:
            </p>

            <p>
              <span className="text-samurai-red font-normal">
                Lifetime Launchpad Access:
              </span>{" "}
              Enjoy lifetime access to all token offerings on Samurai Launchpad.
              No need to buy and stake costly launchpad tokens, no more token
              staking tiers*, minimal barriers to entry. The SamNFT gives you
              equal access to token offerings from the most novel and hyped
              startups in the crypto space.
            </p>

            <p>
              <span className="text-samurai-red font-normal">
                $SAM Airdrop:{" "}
              </span>{" "}
              Our reward token, $SAM, is launching in Q4 2023 on Arbitrum.
              People who purchase SamNFT during the pre-mint period are eligible
              to receive a share of 30% of the total supply of $SAM tokens which
              is vested over one year.
            </p>

            <p>
              <span className="text-samurai-red font-normal">
                Cashback Rewards:
              </span>{" "}
              SamNFT stakers who participate in token offerings on Samurai
              Launchpad are eligible to receive cashback rewards in the form of
              $SAM tokens. Stake or LP the $CFI governance token to increase
              your cashback rewards.
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
              includes a Partner's Quest platform, Prediction Markets, Lotteries
              and more. As a SamNFT staker, you receive special VIP perks
              including reward boosts for participating on Sanka.
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
              offering will determine whether we launch the project and the size
              of the allocation we secure so that everyone who is interested can
              get the token allotment they desire.
            </p>

            <p className="text-white">
              These are just a few of the utilities provided by the SamNFT. We
              are delighted that you are going to join us on this journey and we
              will always strive to bring more and more value and benefits to
              our early SamNFT supporters.
            </p>
          </div>
        </div>

        {/* TOP SIDE CONTENT */}
        <div className="">
          <div className="flex justify-center items-center w-[500px] h-[500px] bg-white rounded-[8px] mt-10 relative">
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
