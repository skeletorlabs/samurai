import { SINGLE_CARD } from "@/app/utils/interfaces";
import Image from "next/image";
import Link from "next/link";
import { formattedDate } from "@/app/utils/formattedDate";
import { useCallback, useEffect, useState } from "react";
import LoadingBox from "@/app/components/loadingBox";
import { getUnixTime } from "date-fns";

export default function LaunchpadSingleCard({
  ido,
  type = "dark",
}: {
  ido: SINGLE_CARD;
  type?: string;
}) {
  const [phase, setPhase] = useState("");
  const now = getUnixTime(new Date());

  const getPhase = useCallback(async () => {
    const _phase =
      now >= ido.date + 86400 * 7
        ? "completed"
        : now >= ido.date
        ? "participation"
        : "upcoming";
    setPhase(_phase.toUpperCase());
  }, [ido]);

  useEffect(() => {
    if (ido) {
      getPhase();
    }
  }, [ido]);

  return (
    <Link
      href={now >= ido.date ? ido.url : ""}
      className={`flex flex-col rounded-lg border-[0.5px] border-neutral-700 text-start bg-samurai-pattern-2 ${
        type === "dark"
          ? "bg-black/30 hover:bg-black/20"
          : "bg-neutral-700 hover:bg-white/10"
      }  w-full lg:max-w-[365px] 2xl:max-w-[400px] max-h-[840px] py-4 pb-5 shadow-xl transition-all hover:scale-[1.02] px-4`}
    >
      <div className="flex w-full mb-4 relative">
        <div className="flex w-full h-[260px] relative shadow-lg shadow-black/30">
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
          <div className="flex justify-center items-center text-center gap-2 bg-black/90 p-2 rounded-full w-full mt-1 text-xs md:text-[13px] border border-white/20 text-nowrap h-9">
            {ido.investmentRound.toUpperCase()}
          </div>
          <div
            className={`
              flex justify-center items-center gap-2 bg-black/90 p-2 rounded-full w-full mt-1 text-[13px] border border-white/20 h-9 ${
                phase.toLowerCase() === "registration" ||
                phase.toLowerCase() === "participation"
                  ? "text-green-400"
                  : phase.toLowerCase() === "vesting"
                  ? "text-blue-300"
                  : phase.toLowerCase() === "upcoming"
                  ? "text-yellow-200"
                  : "text-samurai-red"
              }
            `}
          >
            {phase || <LoadingBox css="flex justify-center items-center" />}
          </div>
        </div>

        {ido?.tokenNetwork !== "TBA" && (
          <div className="flex items-center gap-2 bg-black/90 px-2 py-1 rounded-full border border-white/20 absolute top-4 left-4">
            <span className="text-[12px]">Project Tokens</span>
            <Image
              src={ido.networkImageSrc}
              alt={ido.tokenNetwork}
              width={18}
              height={18}
              className="p-[1px] bg-white/80 rounded-full"
            />
          </div>
        )}

        <div
          className={`flex items-center gap-2 bg-black/90 px-2 py-1 rounded-full border border-white/20 absolute ${
            ido?.tokenNetwork === "TBA" ? "top-4" : "top-12"
          } left-4`}
        >
          <span className="text-[12px]">Crowdsale</span>
          <Image
            src={`/chain-logos/${ido.crowdsaleNetwork}.svg`}
            alt={ido.projectName}
            width={18}
            height={18}
            className="p-[1px] bg-white/80 rounded-full"
          />
        </div>
      </div>

      <div className="flex justify-between items-center px-1">
        <div className="text-samurai-red">{ido.projectName}</div>
      </div>

      <div
        className={`text-white/70 text-[15px] px-1 ${
          ido.prices ? "mb-0" : "mb-4"
        } line-clamp-3 text-base min-h-[80px] lg:min-h-[120px] 2xl:min-h-[80px]`}
      >
        {ido.projectListDescription}
      </div>

      <div className="flex items-center gap-2 bg-black/50 py-2 px-4 text-[16px]  w-max">
        <span className="text-[14px] text-samurai-red">ALLOCATION:</span>
        <p className="text-white/70">
          {ido.allocation.toLocaleString("en-us")} {ido.allocationToken}
        </p>
      </div>

      {!ido?.prices && (
        <div className="flex items-center gap-2 bg-black/50 py-2 px-4 text-[16px] w-max mt-2">
          <span className="text-[14px] text-samurai-red">PRICE:</span>
          <p className="text-white/70">
            {ido.price} {ido.acceptedTokenSymbol}
          </p>
        </div>
      )}

      {ido?.prices && (
        <div className="flex  gap-1 bg-black/50 py-2 px-4 text-[16px] mt-2 w-[260px] flex-wrap">
          <span className="text-[14px] text-samurai-red">PRICES:</span>

          {ido.prices.map((item, index) => (
            <p
              key={index}
              className="text-white/70 rounded-full bg-black px-2 min-w-[110px] text-center text-[13px]"
            >
              {item}
            </p>
          ))}
        </div>
      )}

      <div
        className={`flex justify-between items-center px-1 ${
          ido.prices ? "mt-3" : "mt-4"
        }`}
      >
        <div className="flex flex-col">
          <span className="text-sm text-white/70">IDO DATE</span>
          <span className="text-[16px]">{formattedDate(ido.date)} UTC</span>
        </div>
      </div>
    </Link>
  );
}
