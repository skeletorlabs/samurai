import { IDO } from "@/app/utils/interfaces";
import Image from "next/image";
import Link from "next/link";

// import { formattedDate } from "@/app/utils/formattedDate";
// import { IDO_LIST } from "@/app/utils/constants";
// import { getParticipationPhase } from "@/app/contracts_integrations/ido";
// import { getParticipationPhase as getParticipationPhaseNft } from "@/app/contracts_integrations/idoNFT";
// import { getParticipationPhase as getParticipationPhaseNftEth } from "../contracts_integrations/idoNFTETH";
// import { getParticipationPhase as getParticipationPhaseV2 } from "../contracts_integrations/idoV2";
// import { getParticipationPhase as getParticipationPhaseNftOpen } from "../contracts_integrations/idoNftOpen";
// import { getParticipationPhase as getParticipationPhaseNode } from "../contracts_integrations/idoNFTV2";
// import { getParticipationPhase as getParicipationPhasePrivate } from "../contracts_integrations/privateIDO";
// import { useCallback, useEffect, useState } from "react";

export default function LaunchpadCard({
  ido,
  type = "dark",
}: {
  ido: IDO;
  type?: string;
}) {
  //   const [phase, setPhase] = useState("");

  //   const getPhase = useCallback(async () => {
  //     const contract = IDO_LIST.findIndex(
  //       (item) => item.contract === ido.contract
  //     );

  //     const isNft = ido.type === "NFT";
  //     const isNftEth = ido.type === "NFT-ETH";
  //     const isV2 = ido.type === "v2";
  //     const isNftOpen = ido.type === "NFT-OPEN";
  //     const isNode = ido.type === "NODE";
  //     const isPrivate = ido.type === "private";
  //     const phase = isNft
  //       ? await getParticipationPhaseNft(contract)
  //       : isNftEth
  //       ? await getParticipationPhaseNftEth(contract)
  //       : isV2
  //       ? await getParticipationPhaseV2(contract)
  //       : isNftOpen
  //       ? await getParticipationPhaseNftOpen(contract)
  //       : isNode
  //       ? await getParticipationPhaseNode(contract)
  //       : isPrivate
  //       ? await getParicipationPhasePrivate(contract)
  //       : await getParticipationPhase(contract);
  //     setPhase(phase.toUpperCase());
  //   }, [ido]);

  //   useEffect(() => {
  //     if (ido) {
  //       getPhase();
  //     }
  //   }, [ido]);

  // >>>>>>> earnm
  return (
    <Link
      href={ido.url}
      className={`flex flex-col rounded-lg border-[0.5px] border-neutral-700 text-start bg-samurai-pattern-2 ${
        type === "dark"
          ? "bg-black/30 hover:bg-black/20"
          : "bg-neutral-700 hover:bg-white/30"
      }  w-full md:max-w-[360px] xl:max-w-[400px] max-h-[840px] py-4 shadow-xl transition-all hover:scale-[1.02] px-4 relative`}
      // =======
      //           : "bg-neutral-700 hover:bg-white/10"
      //       }  w-full lg:max-w-[271px] 2xl:max-w-[400px] max-h-[840px] py-4 pb-5 shadow-xl transition-all hover:scale-[1.02] px-4`}
      // >>>>>>> earnm
    >
      <div className="flex w-full h-[180px]">
        <Image
          src={ido.idoImageSrc}
          placeholder="blur"
          blurDataURL={ido.idoImageSrc}
          fill
          style={{ objectFit: "cover" }}
          alt={ido.projectName}
          className="rounded-lg"
        />
      </div>

      <div className="flex flex-col absolute left-0 bottom-0 bg-black/70 p-3 px-5 text-[15px] rounded-b-lg">
        <div className="flex justify-between items-center">
          <div className="text-samurai-red">{ido.projectName}</div>
        </div>

        <div className="text-white/70 line-clamp-3 text-base h-[70px]">
          {ido.projectListDescription}
        </div>
      </div>

      {/* <div className="flex flex-col sm:flex-row lg:flex-col 2xl:flex-row justify-between sm:gap-2 lg:gap-0 2xl:gap-2 w-full absolute bottom-3 px-3">
          <div className="flex justify-center items-center gap-2 bg-black/90 p-2 rounded-lg w-full mt-1 text-xs md:text-[14px] border border-white/20">
            {ido.investmentRound.toUpperCase()}
          </div>
          <div
            className={`
              flex justify-center items-center gap-2 bg-black/90 p-2 rounded-lg w-full mt-1 text-[14px] border border-white/20 ${
                phase.toLowerCase() === "registration" ||
                phase.toLowerCase() === "participation"
                  ? "text-green-400"
                  : phase.toLowerCase() === "upcoming"
                  ? "text-yellow-200"
                  : "text-samurai-red"
              }
            `}
          >
            {phase || "LOADING..."}
          </div>
        </div>

        {ido?.tokenNetwork !== "TBA" && (
          <div className="flex items-center gap-2 bg-black/90 px-2 py-1 rounded-lg text-[14px] border border-white/20 absolute top-4 left-4">
            <span className="text-sm">Project Tokens</span>
            <Image
              src={ido.networkImageSrc.toLocaleLowerCase()}
              alt={ido.tokenNetwork}
              width={24}
              height={24}
              className="p-[1px] bg-white/80 rounded-full"
            />
          </div>
        )}

        <div
          className={`flex items-center gap-2 bg-black/90 px-2 py-1 rounded-lg text-[14px] border border-white/20 absolute ${
            ido?.tokenNetwork === "TBA" ? "top-4" : "top-14"
          } left-4`}
        >
          <span className="text-sm">Crowdsale</span>
          <Image
            src="/chain-logos/Base_Symbol_Blue.svg"
            alt={ido.projectName}
            width={24}
            height={24}
            className="p-[1px] bg-white/80 rounded-full"
          />
        </div>
      </div>

      <div className="flex justify-between items-center px-1">
        <div className="text-samurai-red">{ido.projectName}</div>
      </div>

      <div className="text-white/70 text-[15px] px-1 mb-4 line-clamp-3 text-base min-h-[80px] lg:min-h-[120px] 2xl:min-h-[80px]">
        {ido.projectListDescription}
      </div>

      <div className="flex items-center gap-2 bg-black/50 py-2 px-4 text-[16px] rounded-lg  w-max">
        <span className="text-[14px] text-samurai-red">ALLOCATION:</span>
        <p className="text-white/70">
          {ido?.id === "xrone" ? (
            <>TBA</>
          ) : (
            <>
              {ido.totalAllocation.toLocaleString("en-us")}{" "}
              {ido.type == "NFT" ||
              ido.type === "NFT-ETH" ||
              ido.type === "NFT-OPEN" ||
              ido.type === "NODE"
                ? ido.type === "NODE"
                  ? "NODEs"
                  : "NFTs"
                : ido.acceptedTokenSymbol}
            </>
          )}
        </p>
      </div>

      <div className="flex items-center gap-2 bg-black/50 py-2 px-4 text-[16px] rounded-lg w-max mt-2">
        <span className="text-[14px] text-samurai-red">PRICE:</span>
        <p className="text-white/70">
          {ido.price} {ido.type === "NFT-ETH" ? "ETH" : ido.acceptedTokenSymbol}{" "}
          {(ido.type === "NFT" ||
            ido.type === "NFT-ETH" ||
            ido.type === "NFT-OPEN") &&
            "per NFT"}
          {ido.type === "NODE" && "per NODE"}
        </p>
      </div>

      <div className="flex justify-between items-center px-1 mt-4">
        <div className="flex flex-col">
          <span className="text-sm text-white/70">IDO DATE</span>
          <span className="text-[16px]">
            {formattedDate(ido.participationStartsAt)} UTC
          </span>
        </div>
      </div>

      {/* <div className="flex justify-between items-center px-1 mt-4">
        <div className="flex flex-col">
          <span className="text-sm text-white/70">REGISTRATION</span>
          <span className="text-[16px]">
            {formattedDate(ido.registrationDate)}
          </span>
        </div>
      </div> */}
    </Link>
  );
}
