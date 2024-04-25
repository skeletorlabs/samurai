import Image from "next/image";
import Layout from "@/components/layout";
import { Inter, Roboto } from "next/font/google";
import SSButton from "@/components/ssButton";
import TopLayout from "@/components/topLayout";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import LockSam from "@/components/lockSam";
import ClaimSam from "@/components/claimSam";

const inter = Inter({
  subsets: ["latin"],
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "500", "900"],
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
                <span className="font-bold text-samurai-red">$SAM</span> TOKEN
              </h1>
              <p
                className={`leading-normal lg:leading-relaxed pb-6 text-xl lg:text-2xl xl:max-w-[900px]  ${inter.className}`}
              >
                Powering the{" "}
                <span className="font-bold text-samurai-red">
                  Samurai Starter
                </span>{" "}
                ecosystem
              </p>
              <p
                className={`leading-normal lg:leading-[40px] pb-6 text-lg lg:text-xl xl:max-w-[900px]  ${inter.className}`}
              >
                {">"} Participate in{" "}
                <span className="font-bold text-white">
                  top tier token launches.
                </span>{" "}
                <br />
                {">"} Gain access to{" "}
                <span className="font-bold text-white">VC-level deals</span>.
                <br />
                {">"} Provide liquidity for{" "}
                <span className="font-bold text-white">amazing APR</span>.
                <br />
                {">"} Participate in Samurai Sanka and{" "}
                <span className="font-bold text-white">earn</span>.
              </p>
              <div className="flex flex-col lg:flex-row lg:items-center gap-5 lg:gap-7 mt-12">
                <SSButton
                  isLink
                  target="blank"
                  href="https://aerodrome.finance/swap?from=0x4200000000000000000000000000000000000006&to=0xed1779845520339693CDBffec49a74246E7D671b"
                >
                  Buy $SAM on Aerodrome
                </SSButton>
                <SSButton
                  secondary
                  isLink
                  href="https://aerodrome.finance/deposit?token0=0x4200000000000000000000000000000000000006&token1=0xed1779845520339693CDBffec49a74246E7D671b&type=-1"
                  target="blank"
                >
                  Provide SAM/WETH LP on Aerodrome
                </SSButton>
              </div>
            </div>
          </div>
        </>
      </TopLayout>

      {/* TOKENOMICS */}
      <div className="flex flex-col py-10 md:py-20 w-full bg-white/5 border-t border-samurai-red/50 border-dotted">
        <div className="flex flex-col px-6 lg:px-8 xl:px-20 text-white">
          <div className="flex flex-col text-white text-2xl">
            <p className="font-bold text-4xl pb-2 opacity-[0.8]">
              <span className="text-samurai-red">$SAM</span> Tokenomics
            </p>

            <div
              className={`flex flex-row flex-wrap gap-5 text-lg pt-4 text-white lg:pr-5 font-light xl:max-w-[1100px] ${inter.className}`}
            >
              <div className="bg-white/10 p-3">
                <span className="text-yellow-400 font-bold">Total Supply:</span>{" "}
                130,000,000 $SAM
              </div>
              <div className="bg-white/10 p-3">
                <span className="text-yellow-400 font-bold">
                  Token Standard:
                </span>{" "}
                ERC-20
              </div>
              <div className="bg-white/10 p-3">
                <span className="text-yellow-400 font-bold">Blockchain:</span>{" "}
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

      {/* STAKING */}
      <div
        id="lock"
        className="flex flex-col pt-10 md:pt-20 pb-10  w-full bg-white/20 border-t border-samurai-red/50 border-dotted relative"
      >
        <div className="flex flex-col text-white">
          <div className="flex flex-col text-white text-2xl pb-20">
            <div className="flex flex-col lg:flex-row w-full justify-between gap-8 px-6 lg:px-8 xl:px-20">
              <p className="font-bold text-5xl pb-2">
                Lock <span className="text-samurai-red">$SAM</span>
              </p>
            </div>
            <p
              className={`text-lg text-neutral-300 pt-4 max-w-[700px] px-6 lg:px-8 xl:px-20 ${inter.className}`}
            >
              Lock $SAM for a period of 3, 6, 9, or 12 months to gain launchpad
              access, ventures entry, and to accumulate Samurai Points.
            </p>

            <div className="flex flex-col xl:flex-row px-6 lg:px-8 xl:px-20">
              <LockSam />

              <div className="flex flex-col items-center w-full lg:max-w-[580px] mt-14 sm:bg-gradient-to-b from-black/30 to-black/60 sm:rounded-[8px] sm:border border-white/10 pt-10 sm:pb-10 xl:py-0 xl:ml-12 2xl:ml-24 sm:shadow-lg">
                <p className="flex flex-col w-full items-center xl:mt-12">
                  <Image
                    src="/samurai.svg"
                    width={300}
                    height={300}
                    alt=""
                    className="mb-10 w-[200px] md:w-[300px]"
                  />
                </p>
                <p className="font-bold text-6xl pb-2 text-center">
                  <span className="text-samurai-red">Samurai</span> Points
                </p>
                <p
                  className={`text-lg text-neutral-300 pt-1 px-6 lg:px-8 xl:px-20 text-center ${inter.className}`}
                >
                  Accumulate Samurai Points by participating in token launches,
                  locking $SAM, providing SAM liquidity, or by participating in
                  Samurai Sanka.
                </p>

                <p
                  className={`text-2xl text-center text-neutral-100 pt-10 px-6 lg:px-8 xl:px-16 ${inter.className}`}
                >
                  What can{" "}
                  <span className="text-samurai-red">Samurai Points</span> be
                  used for?
                </p>
                <p
                  className={`text-4xl pt-2 font-bold ${inter.className} px-6 lg:px-8 xl:px-20`}
                >
                  REWARDS!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="absolute top-0 left-0 flex flex-col justify-center items-center bg-black/80 backdrop-blur-md w-full h-full z-30">
          <p className="font-bold text-5xl pb-2">
            Lock <span className="text-samurai-red">$SAM</span>
          </p>
          <p
            className={`text-6xl text-neutral-300 pt-4 max-w-[700px]  ${inter.className}`}
          >
            COMING SOON!
          </p>
        </div> */}
      </div>
      <ClaimSam />
    </Layout>
  );
}
