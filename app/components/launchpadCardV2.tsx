import { IDO, IDO_v3 } from "@/app/utils/interfaces";
import Image from "next/image";
import Link from "next/link";
import { formattedDate } from "@/app/utils/formattedDate";
import { getParticipationPhase as getParticipationPhaseV3 } from "../contracts_integrations/idoV3";
import { getParticipationPhase as getParticipationPhasePrivate } from "../contracts_integrations/privateIDO";
import { useCallback, useEffect, useState } from "react";
import { IDOs } from "../utils/constants";

export default function LaunchpadCardV2({
  ido,
  type = "dark",
}: {
  ido: IDO_v3;
  type?: string;
}) {
  const [phase, setPhase] = useState("");

  const getPhase = useCallback(async () => {
    const index = IDOs.findIndex((item) => item.id === ido.id);

    const isV3 = ido.type === "v3";
    const isPrivate = ido.type === "private";
    const phase = isV3
      ? await getParticipationPhaseV3(index)
      : isPrivate
      ? await getParticipationPhasePrivate(index)
      : await getParticipationPhaseV3(index);
    setPhase(phase.toUpperCase());
  }, [ido]);

  useEffect(() => {
    if (ido) {
      getPhase();
    }
  }, [ido]);

  return (
    <Link
      href={ido.url}
      className={`flex flex-col rounded-lg border-[0.5px] border-neutral-700 text-start bg-samurai-pattern-2 ${
        type === "dark"
          ? "bg-black/30 hover:bg-black/20"
          : "bg-neutral-700 hover:bg-white/10"
      }  w-full lg:max-w-[365px] 2xl:max-w-[400px] max-h-[840px] py-4 pb-5 shadow-xl transition-all hover:scale-[1.02] px-4`}
    >
      <div className="flex w-full mb-4 relative">
        <div className="flex w-full h-[260px] relative">
          <Image
            src={ido.idoImageSrc}
            placeholder="blur"
            blurDataURL={ido.idoImageSrc}
            fill
            style={{ objectFit: "cover" }}
            alt={ido.projectName}
          />
        </div>

        <div className="flex flex-col sm:flex-row lg:flex-col 2xl:flex-row justify-between sm:gap-2 lg:gap-0 2xl:gap-2 w-full absolute bottom-3 px-3">
          <div className="flex justify-center items-center text-center gap-2 bg-black/90 p-2 rounded-lg w-full mt-1 text-xs md:text-[14px] border border-white/20">
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
              src={ido.networkImageSrc}
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
            src="/chain-logos/BASE.svg"
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
          {ido.allocation.toLocaleString("en-us")} {ido.acceptedTokenSymbol}
        </p>
      </div>

      <div className="flex items-center gap-2 bg-black/50 py-2 px-4 text-[16px] rounded-lg w-max mt-2">
        <span className="text-[14px] text-samurai-red">PRICE:</span>
        <p className="text-white/70">
          {ido.price} {ido.acceptedTokenSymbol}
        </p>
      </div>

      <div className="flex justify-between items-center px-1 mt-4">
        <div className="flex flex-col">
          <span className="text-sm text-white/70">IDO DATE</span>
          <span className="text-[16px]">{formattedDate(ido.date)} UTC</span>
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
