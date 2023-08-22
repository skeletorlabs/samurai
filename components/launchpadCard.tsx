import { IDO } from "@/utils/interfaces";
import Image from "next/image";
import { fromUnixTime } from "date-fns";

export default function LaunchpadCard({
  ido,
  type = "dark",
}: {
  ido: IDO;
  type?: string;
}) {
  return (
    <div
      className={`flex flex-col rounded-lg border-[0.5px] border-neutral-700 text-start ${
        type === "dark"
          ? "bg-black/30 hover:bg-black/20"
          : "bg-neutral-700 hover:bg-white/10"
      }  w-full md:max-w-[360px] max-h-[510px] py-4 shadow-xl transition-all hover:scale-[1.02]`}
    >
      <div className="flex w-full px-4 mb-4">
        <div className="flex w-full h-[164px] relative">
          <Image
            src={ido.tokenImageSrc}
            placeholder="blur"
            blurDataURL={ido.tokenImageSrc}
            fill
            alt=""
            className="rounded-md border border-neutral-600 hover:border-samurai-red transition-all"
          />
        </div>
      </div>
      <div className="flex justify-between items-center px-4">
        <div className="text-samurai-red">{ido.title}</div>
        <div className="flex justify-between items-center gap-3 px-3 py-2 bg-black rounded-md">
          <span
            className={`text-[10px] italic ${
              ido.status === "ONGOING" ? "text-green-400" : "text-red-500"
            }`}
          >
            {ido.status}
          </span>{" "}
          <Image src={ido.chainImageSrc} alt="chain" width={16} height={16} />
        </div>
      </div>

      <div className="mt-3 text-white/70 text-[15px] overflow-scroll px-4">
        {ido.description}
      </div>

      <div className="flex items-center gap-2 bg-black/30 py-2 px-4 mt-4 text-[16px] rounded-md mx-2 w-max">
        <span className="text-[14px]">Goal:</span>
        <p className="text-white/70">{ido.goal}</p>
      </div>
      <div className="flex items-center gap-2 bg-black/50 py-2 px-4 text-[16px] rounded-md mx-2 w-max mt-1">
        <span className="text-[14px] text-samurai-red">Raised:</span>
        <p className="text-white/70">{ido.raised}</p>
      </div>

      <div className="flex justify-between items-center px-4 mt-4">
        <div className="flex flex-col">
          <span className="text-sm text-white/70">Started</span>
          <span className="text-[16px]">
            {fromUnixTime(ido.startedAt).toLocaleString()}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-sm text-white/70">Access</span>
          <span className="text-[16px] text-samurai-red">{ido.access}</span>
        </div>
      </div>
    </div>
  );
}
