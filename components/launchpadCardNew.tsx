import { IDONEW } from "@/utils/interfaces";
import Image from "next/image";
import { fromUnixTime, format } from "date-fns";
import Link from "next/link";
import { formattedDate } from "@/utils/formattedDate";

export default function launchpadCardNew({
  ido,
  type = "dark",
}: {
  ido: IDONEW;
  type?: string;
}) {
  return (
    <Link
      href={ido.id}
      className={`flex flex-col rounded-lg border-[0.5px] border-neutral-700 text-start ${
        type === "dark"
          ? "bg-black/30 hover:bg-black/20"
          : "bg-neutral-700 hover:bg-white/10"
      }  w-full md:max-w-[360px] xl:max-w-[400px] max-h-[840px] py-4 pb-5 shadow-xl transition-all hover:scale-[1.02] px-4`}
    >
      <div className="flex w-full mb-4 relative">
        <div className="flex w-full h-[264px] relative">
          <Image
            src={ido.idoImageSrc}
            placeholder="blur"
            blurDataURL={ido.idoImageSrc}
            fill
            alt={ido.projectName}
          />
        </div>

        <div className="flex justify-between gap-2 w-full absolute bottom-3 px-3">
          {/* <div className="flex justify-center items-center gap-2 bg-black/90 p-2 rounded-md w-full mt-1 text-[14px] border border-white/20"> */}
          {/* {ido.acceptedToken} ON {ido.network} */}

          {/* </div> */}

          <div className="flex justify-center items-center gap-2 bg-black/90 p-2 rounded-md w-full mt-1 text-[14px] border border-white/20">
            {ido.type.toUpperCase()}
          </div>
          <div className="flex justify-center items-center gap-2 bg-black/90 p-2 rounded-md w-full mt-1 text-[14px] border border-white/20 text-samurai-red">
            {ido.currentPhase.toUpperCase()}
          </div>
        </div>

        <div className="flex items-center gap-2 bg-black/90 px-2 py-1 rounded-md text-[14px] border border-white/20 absolute top-4 left-4">
          <span className="text-sm">Project Tokens</span>
          <Image
            src="/chain-logos/polygon.svg"
            alt={ido.projectName}
            width={24}
            height={24}
            className="p-[1px] bg-white/80 rounded-full"
          />
        </div>

        <div className="flex items-center gap-2 bg-black/90 px-2 py-1 rounded-md text-[14px] border border-white/20 absolute top-14 left-4">
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

      <div className="text-white/70 text-[15px] px-1 mb-4 line-clamp-2 text-base">
        {ido.projectDescription}
      </div>

      <div className="flex items-center gap-2 bg-black/50 py-2 px-4 text-[16px] rounded-md  w-max">
        <span className="text-[14px] text-samurai-red">Allocation:</span>
        <p className="text-white/70">
          {ido.raised} {ido.acceptedToken}
        </p>
      </div>

      <div className="flex items-center gap-2 bg-black/50 py-2 px-4 text-[16px] rounded-md w-max mt-2">
        <span className="text-[14px] text-samurai-red">PRICE:</span>
        <p className="text-white/70">
          {ido.price} {ido.acceptedToken}
        </p>
      </div>

      <div className="flex justify-between items-center px-1 mt-4">
        <div className="flex flex-col">
          <span className="text-sm text-white/70">IDO DATE</span>
          <span className="text-[16px]">{formattedDate(ido.idoDate)}</span>
        </div>
      </div>

      <div className="flex justify-between items-center px-1 mt-4">
        <div className="flex flex-col">
          <span className="text-sm text-white/70">REGISTRATION</span>
          <span className="text-[16px]">
            {formattedDate(ido.registrationDate)}
          </span>
        </div>
      </div>
    </Link>
  );
}
