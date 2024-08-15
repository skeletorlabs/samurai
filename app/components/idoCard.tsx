import { IDO, IDO_v2 } from "@/app/utils/interfaces";
import Image from "next/image";
import Link from "next/link";
import { formattedDate } from "@/app/utils/formattedDate";
import { NEW_IDOS } from "@/app/utils/constants";
import { getParticipationPhase } from "@/app/contracts_integrations/ido";
import { useCallback, useEffect, useState } from "react";
import {
  generalInfo,
  IDO_GENERAL_INFO,
  phaseInfo,
} from "../contracts_integrations/idoFull";

export default function IdoCard({
  ido,
  type = "dark",
}: {
  ido: IDO_v2;
  type?: string;
}) {
  const [phase, setPhase] = useState("");

  const getPhase = useCallback(async () => {
    const idoIndex = NEW_IDOS.findIndex(
      (item) => item.contract === ido.contract
    );

    const general = await generalInfo(idoIndex);
    const phase = await phaseInfo(idoIndex, general as IDO_GENERAL_INFO);

    if (phase) setPhase(phase.toUpperCase());
  }, [ido]);

  useEffect(() => {
    if (ido) getPhase();
  }, []);

  return (
    <Link
      href={ido.id}
      className={`flex flex-col rounded-lg border-[0.5px] border-neutral-700 text-start bg-samurai-pattern-2 ${
        type === "dark"
          ? "bg-black/30 hover:bg-black/20"
          : "bg-neutral-700 hover:bg-white/10"
      }  w-full md:max-w-[360px] xl:max-w-[400px] max-h-[840px] py-4 pb-5 shadow-xl transition-all hover:scale-[1.02] px-4`}
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

        <div className="flex justify-between gap-2 w-full absolute bottom-3 px-3">
          <div className="flex justify-center items-center gap-2 bg-black/90 p-2 rounded-lg w-full mt-1 text-[14px] border border-white/20">
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
              width={22}
              height={22}
              className="p-[1px] bg-white/80 rounded-full"
            />
          </div>
        )}

        <div
          className={`flex items-center gap-2 bg-black/90 px-2 py-1 rounded-lg text-[14px] border border-white/20 absolute ${
            ido?.tokenNetwork === "TBA" ? "top-4" : "top-[52px]"
          } left-4`}
        >
          <span className="text-sm">Crowdsale</span>
          <Image
            src="/chain-logos/Base_Symbol_Blue.svg"
            alt={ido.projectName}
            width={22}
            height={22}
            className="p-[1px] bg-white/80 rounded-full"
          />
        </div>
      </div>

      <div className="flex justify-between items-center px-1">
        <div className="text-samurai-red">{ido.projectName}</div>
      </div>

      <div className="text-white/70 text-[15px] px-1 line-clamp-3 text-base min-h-[80px]">
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
    </Link>
  );
}
