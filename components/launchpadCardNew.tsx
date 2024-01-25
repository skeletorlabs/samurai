import { IDONEW } from "@/utils/interfaces";
import Image from "next/image";
import { fromUnixTime } from "date-fns";

export default function launchpadCardNew({
  ido,
  type = "dark",
}: {
  ido: IDONEW;
  type?: string;
}) {
  return (
    <div
      className={`flex flex-col rounded-lg border-[0.5px] border-neutral-700 text-start ${
        type === "dark"
          ? "bg-black/30 hover:bg-black/20"
          : "bg-neutral-700 hover:bg-white/10"
      }  w-full md:max-w-[360px] xl:max-w-[400px] max-h-[840px] py-4 shadow-xl transition-all hover:scale-[1.02]`}
    >
      <div className="flex w-full px-4 mb-4">
        <div className="flex w-full h-[264px] relative">
          <Image
            src={ido.idoImageSrc}
            placeholder="blur"
            blurDataURL={ido.idoImageSrc}
            fill
            alt=""
            className="rounded-md border border-neutral-600 hover:border-samurai-red transition-all"
          />
        </div>
      </div>

      <div className="flex justify-between mx-4 gap-2">
        <div className="flex justify-center items-center gap-2 bg-black/50 py-2 px-4 rounded-md w-full mt-1 text-[14px]">
          {ido.acceptedToken} ON {ido.network}
        </div>

        <div className="flex justify-center items-center gap-2 bg-black/50 py-2 px-4 rounded-md w-full mt-1 text-[14px]">
          {ido.type.toUpperCase()}
        </div>
      </div>

      <div className="flex justify-between items-center px-4 mt-4">
        <div className="text-samurai-red">{ido.projectName}</div>
      </div>

      <div className="text-white/70 text-[15px] px-4 mb-4">
        {ido.projectDescription}
      </div>

      <div className="flex items-center gap-2 bg-black/50 py-2 px-4 text-[16px] rounded-md mx-4 w-max">
        <span className="text-[14px] text-samurai-red">RAISED:</span>
        <p className="text-white/70">
          {ido.raised} {ido.acceptedToken}
        </p>
      </div>

      <div className="flex items-center gap-2 bg-black/50 py-2 px-4 text-[16px] rounded-md mx-4 w-max mt-2">
        <span className="text-[14px] text-samurai-red">PRICE:</span>
        <p className="text-white/70">
          {ido.price} {ido.acceptedToken}
        </p>
      </div>

      <div className="flex justify-between items-center px-4 mt-4">
        <div className="flex flex-col">
          <span className="text-sm text-white/70">IDO Date</span>
          <span className="text-[16px]">
            {fromUnixTime(ido.idoDate).toLocaleString()}
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center px-4 mt-4">
        <div className="flex flex-col">
          <span className="text-sm text-white/70">Registration</span>
          <span className="text-[16px]">
            {fromUnixTime(ido.registrationDate).toLocaleString()}
          </span>
        </div>
      </div>

      <button className="bg-samurai-red rounded-[8px] mx-4 mt-8 py-1 text-[18px]">
        QUICK HITTER
      </button>
    </div>
  );
}
