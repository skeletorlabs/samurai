import { IDO, IDO_v3, INCOMING } from "@/app/utils/interfaces";
import Image from "next/image";
import Link from "next/link";

export default function IncomingCard({
  ido,
  type = "dark",
}: {
  ido: INCOMING;
  type?: string;
}) {
  return (
    <div
      className={`flex flex-col rounded-lg border-[0.5px] border-neutral-700 text-start bg-samurai-pattern-2 ${
        type === "dark"
          ? "bg-black/30 hover:bg-black/20"
          : "bg-neutral-700 hover:bg-white/10"
      }  w-full lg:max-w-[365px] 2xl:max-w-[400px] max-h-[840px] py-4 pb-5 shadow-xl transition-all hover:scale-[1.02] px-4`}
    >
      <div className="flex w-full mb-4 relative">
        <div className="flex w-full h-[260px] relative shadow-lg shadow-black/30">
          <Image
            src={ido.image}
            fill
            style={{ objectFit: "cover" }}
            alt={ido.name}
          />
        </div>
        <div className="text-center p-2 bg-samurai-red absolute top-4 left-4 text-xs">
          Coming Soon!
        </div>
      </div>
      <div className="flex justify-between items-center px-1">
        <div className="text-samurai-red">{ido.name}</div>
      </div>

      <div className="text-white/70 text-[15px] px-1 mb-4 line-clamp-4 text-base min-h-[80px] lg:min-h-[120px] 2xl:min-h-[90px]">
        {ido.description}
      </div>
    </div>
  );
}
