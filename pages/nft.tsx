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
      <div className="flex flex-col xl:flex-row w-full justify-between px-6 lg:px-8 xl:px-20 pt-20 pb-10">
        {/* TOP CONTENT */}
        <div className="w-full xl:max-w-[770px] lg:mr-10">
          <h1 className="text-[58px] lg:text-[68px] font-black leading-[62px] tracking-wide">
            <span className="text-samurai-red">Sam</span>NFT
          </h1>
          <div
            className={`flex flex-col font-light leading-normal pt-4 text-lg text-neutral-300 pb-14 gap-4 ${inter.className}`}
          >
            <p className="font-light text-2xl pt-10 text-justify">
              By participating in the SamNFT minting event, you become part of
              our vibrant community and gain access to tremendous benefits.
            </p>
            <p className="pt-5">
              Here's what you can expect as a proud owner of our SamNFTs:
            </p>

            <p className="text-justify">
              <span className="text-samurai-red font-normal">
                Lifetime Launchpad Access:
              </span>{" "}
              Enjoy lifetime access to all token offerings on Samurai Launchpad.
              No need to buy and stake costly launchpad tokens, no more token
              staking tiers*, minimal barriers to entry. The SamNFT gives you
              equal access to token offerings from the most novel and hyped
              startups in the crypto space.
            </p>
            <p className="text-justify">
              <span className="text-samurai-red font-normal">
                $SAM Airdrop:{" "}
              </span>{" "}
              Our reward token, $SAM, is launching in Q4 2023 on Arbitrum.
              People who purchase SamNFT during the pre-mint period are eligible
              to receive a share of 30% of the total supply of $SAM tokens which
              is vested over one year.
            </p>
            <p className="text-justify">
              <span className="text-samurai-red font-normal">
                Cashback Rewards:
              </span>{" "}
              SamNFT stakers who participate in token offerings on Samurai
              Launchpad are eligible to receive cashback rewards in the form of
              $SAM tokens. Stake or LP the $CFI governance token to increase
              your cashback rewards.
            </p>
            <p className="text-justify">
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
            <p className="text-justify">
              <span className="text-samurai-red font-normal">
                VIP Access to Samurai Sanka:
              </span>{" "}
              Samurai Sanka is our upcoming user interaction platform. It
              includes a Partner's Quest platform, Prediction Markets, Lotteries
              and more. As a SamNFT staker, you receive special VIP perks
              including reward boosts for participating on Sanka.
            </p>
            <p className="text-justify">
              <span className="text-samurai-red font-normal">
                Eligibility for special giveaways:
              </span>{" "}
              When Samurai Starter is bringing in new projects for either our
              accelerator, launchpad or other services, we always strive to
              bring in some freebies for our community whether they be tokens,
              NFTs, or some other digital gifts.
            </p>
            <p className="text-justify">
              <span className="text-samurai-red font-normal">
                DAO Governance Rights:
              </span>{" "}
              As SamNFT holders, the decision to launch a project is in your
              hands. The number of holders who express interest in a token
              offering will determine whether we launch the project and the size
              of the allocation we secure so that everyone who is interested can
              get the token allotment they desire.
            </p>
            <p className="mt-5 text-justify">
              These are just a few of the utilities provided by the SamNFT. We
              are delighted that you are going to join us on this journey and we
              will always strive to bring more and more value and benefits to
              our early SamNFT supporters.
            </p>
          </div>
        </div>

        {/* SIDE CONTENT */}
        <div className="">
          <div className="flex justify-center items-center w-full h-[500px] lg:w-[500px] lg:h-[500px] bg-white rounded-[8px] relative">
            <Image
              key={imageKey}
              src={image}
              fill
              alt=""
              className="scale-[0.9] lg:scale-[0.95] rounded-[8px]"
            />
          </div>
          <div className="flex flex-col w-full mt-4">
            {signer ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <SSButton
                    click={() => mint(signer! as ethers.Signer)}
                    flexSize
                  >
                    MINT A SAMURAI NFT
                  </SSButton>
                  <SSButton click={() => {}} flexSize>
                    RENT A SAMURAI NFT
                  </SSButton>
                </div>

                {!isLoading && (
                  // <div className="flex flex-col p-4 border rounded-[8px] border-samurai-red text-xl">
                  <div className="flex flex-col text-xl gap-3 mt-4">
                    <div className="flex justify-between items-center gap-4">
                      <div>
                        <span className="text-samurai-red">MINTED</span>
                        /SUPPLY
                      </div>
                      <div className="flex flex-1 border-[0.5px] border-neutral-600 border-dashed" />
                      <div className="text-2xl">
                        <span className="text-samurai-red">
                          {generalInfo?.totalSupply}
                        </span>
                        /{generalInfo?.maxSupply}
                      </div>
                    </div>

                    <div className="flex justify-between items-center gap-2">
                      <div>MY NFTS</div>
                      <div className="flex flex-1 border-[0.5px] border-neutral-600 border-dashed" />
                      <div>
                        <span className="text-samurai-red text-2xl">
                          {generalInfo?.totalSupply}
                        </span>
                      </div>
                    </div>

                    <div className="flex w-full lg:max-w-[500px] items-center flex-wrap gap-4 mt-5">
                      {images.slice(4, 7).map((image, index) => (
                        <div
                          key={index}
                          className="flex justify-center items-center w-[200px] h-[200px] lg:w-[240px] lg:h-[240px] bg-white rounded-[8px] relative"
                        >
                          <Image
                            src={image}
                            fill
                            alt={image}
                            className="scale-[0.95] rounded-[8px]"
                          />
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
                        </div>
                      ))}
                    </div>
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
