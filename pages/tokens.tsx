import Link from "next/link";
import Image from "next/image";
import Layout from "@/components/layout";
import { Inter } from "next/font/google";
import SSButton from "@/components/ssButton";
import TopLayout from "@/components/topLayout";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import LockSam from "@/components/lockSam";

const inter = Inter({
  subsets: ["latin"],
});

export default function Tokens() {
  return (
    <Layout>
      <TopLayout background="bg-samurai-cyborg-fem bg-cover bg-top">
        <>
          <div className="flex flex-row justify-between items-center px-6 lg:px-8 xl:px-20 py-10 lg:pt-24 bg-transparent sm:bg-black/60 2xl:bg-transparent">
            {/* TOP CONTENT */}
            <div className="relative md:mr-12 xl:max-w-[900px]">
              <h1 className="text-[48px] sm:text-[58px] lg:text-[90px] font-black leading-[58px] sm:leading-[68px] lg:leading-[98px] text-white">
                The{" "}
                <span className="font-bold text-samurai-red">
                  Samurai Starter
                </span>{" "}
                ecosystem is fueled by our native
                <span className="font-bold text-samurai-red"> $SAM</span> token.
              </h1>
              <p
                className={`leading-normal lg:leading-relaxed pt-6 lg:text-2xl xl:max-w-[900px]  ${inter.className}`}
              >
                The $SAM token rewards participation across the entire Samurai
                Starter ecosystem and is designed to deliver tremendous benefits
                to the Samurai Starter community. The more you participate, the
                more you earn, the more future benefits you may enjoy. $SAM is
                minted on Ethereum layer-2 Base with a maximum supply of 130m
                tokens.
              </p>
              <div className="text-samurai-red text-5xl lg:text-4xl mt-12">
                <SSButton>
                  <>
                    Buy $SAM on Aerodrome{" "}
                    <span className="text-[10px] md:text-lg ml-1">
                      (coming soon)
                    </span>
                  </>
                </SSButton>
              </div>
            </div>
          </div>

          {/* TOKENOMICS */}
          <div className="flex flex-col justify-center w-full mt-10 bg-black/40 h-[400px] md:h-[240px]">
            <div className="flex flex-col px-6 lg:px-8 xl:px-20 text-white">
              <div className="flex flex-col text-white text-2xl">
                <p className="font-bold text-4xl pb-2 opacity-[0.8]">
                  <span className="text-samurai-red">$SAM</span> Tokenomics
                </p>

                <div
                  className={`flex flex-row flex-wrap gap-5 text-lg pt-4 text-white lg:pr-5 font-light xl:max-w-[1100px] ${inter.className}`}
                >
                  <div className="bg-white/10 p-3">
                    <span className="text-yellow-400 font-bold">
                      Total Supply:
                    </span>{" "}
                    130,000,000 $SAM
                  </div>
                  <div className="bg-white/10 p-3">
                    <span className="text-yellow-400 font-bold">
                      Token Standard:
                    </span>{" "}
                    ERC-20
                  </div>
                  <div className="bg-white/10 p-3">
                    <span className="text-yellow-400 font-bold">
                      Blockchain:
                    </span>{" "}
                    Base
                  </div>
                  <div className="bg-white/10 p-3">
                    <span className="text-yellow-400 font-bold">
                      Token Contract:
                    </span>{" "}
                    Coming soon
                  </div>
                  <div className="bg-white/10 p-3">
                    <span className="text-yellow-400 font-bold">$SAM</span> on
                    CoinGecko
                  </div>
                  <div className="bg-white/10 p-3">
                    <span className="text-yellow-400 font-bold">$SAM</span> on
                    CoinMarketCap
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      </TopLayout>

      {/* STAKING */}
      <div className="flex flex-col pt-10 md:pt-20 pb-10  w-full bg-white/5 border-t border-samurai-red/50 border-dotted">
        <div className="flex flex-col px-6 lg:px-8 xl:px-20 text-white">
          <div className="flex flex-col text-white text-2xl pb-20">
            <div className="flex flex-col lg:flex-row w-full justify-between gap-8 pb-10">
              <div className="flex gap-8 items-end">
                <Image src="/samurai.svg" width={100} height={100} alt="" />
                <p className="font-bold text-5xl pb-2">
                  <span className="text-samurai-red">$SAM</span> Staking
                </p>
              </div>
            </div>
            <div className="flex flex-row gap-2 md:gap-8 text-sm h-12">
              <SSButton isLink href="">
                Buy $SAM
              </SSButton>
              <SSButton
                secondary
                isLink
                href="https://app.uniswap.org/#/swap?inputCurrency=0x63b4f3e3fa4e438698ce330e365e831f7ccd1ef4&outputCurrency=ETH"
              >
                Buy SAM-LP
              </SSButton>
            </div>
            <p
              className={`text-lg pt-10 lg:pt-0 text-neutral-300 lg:pr-5 font-light mt-10 ${inter.className}`}
            >
              The $CFI token is the governance token that captures the value of
              the Samurai Starter ecosystem. It is minted on the Ethereum
              blockchain with a fully-circulating supply of 2.4m $CFI. When you
              provide $CFI-ETH LP on Uniswap V2 Ethereum or Camelot DEX on
              Arbitrum, you are eligible to receive real platform yield.
              Providing LP or single-token staking $CFI also increases your $SAM
              cashback rewards rate. Check out our{" "}
              <Link href="#" className="text-white underline">
                docs
              </Link>{" "}
              to learn how to gain the most value from your $CFI.{" "}
            </p>

            <LockSam />
          </div>
        </div>
      </div>

      {/* AIRDROP */}
      <div className="flex flex-col pt-10 md:pt-20 pb-2  w-full bg-white/5 border-t border-samurai-red/50 border-dotted">
        <div className="flex flex-col px-6 lg:px-8 xl:px-20 text-white">
          <div className="flex flex-col text-white text-2xl pb-20">
            <p className="font-bold text-5xl pb-2">
              <span className="text-samurai-red">$SAM</span> Airdrop
            </p>

            <p
              className={`text-lg pt-10 lg:pt-0 text-neutral-300 font-light xl:max-w-[1300px] ${inter.className}`}
            >
              CFI holders, stakers, and LP providers can claim $SAM at 1:1 ratio
              to their CFI holdings. 50% of the airdrop can be claimed at TGE
              with the remaining 50% claimable linearly over 5 months.
            </p>
            <div className="pt-10 md:pt-[80px] flex flex-col md:flex-row gap-3 md:gap-5">
              <SSButton>Claim $SAM (coming soon)</SSButton>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
