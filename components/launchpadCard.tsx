import { IDO } from "@/utils/interfaces";
import Image from "next/image";
import { fromUnixTime } from "date-fns";

export default function LaunchpadCard({
  ido,
  type,
}: {
  ido: IDO;
  type?: string;
}) {
  return (
    <div
      className={`flex flex-col rounded-lg ${
        type === "dark"
          ? "bg-black/30 hover:bg-black/20"
          : "bg-white/5 hover:bg-white/10"
      }  w-full md:max-w-[360px] max-h-[440px] py-4 shadow-xl transition-all hover:scale-[1.02]`}
    >
      <div className="flex justify-between items-center px-4">
        {ido.tokenImage}
        <div className="flex justify-between items-center gap-3">
          <span
            className={`text-xs italic ${
              ido.status === "ONGOING" ? "text-green-400" : "text-red-500"
            }`}
          >
            {ido.status}
          </span>{" "}
          <Image src={ido.chainImageSrc} alt="chain" width={24} height={24} />
        </div>
      </div>
      <div className="mt-8 text-samurai-red  px-4">{ido.title}</div>
      <div className="mt-3 text-white/70 text-[16px] overflow-scroll px-4">
        {ido.description}
      </div>
      <div className="bg-black/50 p-4 mt-4">
        <span className="text-[16px] text-samurai-red">Raised</span>
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
          <span className="text-[16px]">{ido.access}</span>
        </div>
      </div>
    </div>
  );
}
