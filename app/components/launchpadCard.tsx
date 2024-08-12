import { IDO } from "@/app/utils/interfaces";
import Image from "next/image";
import Link from "next/link";

export default function LaunchpadCard({
  ido,
  type = "dark",
}: {
  ido: IDO;
  type?: string;
}) {
  return (
    <Link
      href={ido.id}
      className={`flex flex-col rounded-lg border-[0.5px] border-neutral-700 text-start bg-samurai-pattern-2 ${
        type === "dark"
          ? "bg-black/30 hover:bg-black/20"
          : "bg-neutral-700 hover:bg-white/30"
      }  w-full md:max-w-[360px] xl:max-w-[400px] max-h-[840px] py-4 shadow-xl transition-all hover:scale-[1.02] px-4 relative`}
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
    </Link>
  );
}
