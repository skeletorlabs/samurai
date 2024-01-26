import { IDONEW } from "@/utils/interfaces";
import Image from "next/image";
import { fromUnixTime } from "date-fns";
import Link from "next/link";

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
          <div className="flex justify-center items-center gap-2 bg-black/90 p-2 rounded-md w-full mt-1 text-[14px] border border-white/20">
            {ido.acceptedToken} ON {ido.network}
          </div>

          <div className="flex justify-center items-center gap-2 bg-black/90 p-2 rounded-md w-full mt-1 text-[14px] border border-white/20">
            {ido.type.toUpperCase()}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center px-1">
        <div className="text-samurai-red">{ido.projectName}</div>
      </div>

      <div className="text-white/70 text-[15px] px-1 mb-4">
        {ido.projectDescription}
      </div>

      <div className="flex items-center gap-2 bg-black/50 py-2 px-4 text-[16px] rounded-md  w-max">
        <span className="text-[14px] text-samurai-red">RAISED:</span>
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
          <span className="text-[16px]">
            {fromUnixTime(ido.idoDate).toLocaleString()}
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center px-1 mt-4">
        <div className="flex flex-col">
          <span className="text-sm text-white/70">REGISTRATION</span>
          <span className="text-[16px]">
            {fromUnixTime(ido.registrationDate).toLocaleString()}
          </span>
        </div>
      </div>

      <button className="bg-samurai-red rounded-[8px] w-full mt-8 py-2 text-[18px] text-center transition-all hover:opacity-75">
        QUICK HITTER
      </button>
    </Link>
  );
}
