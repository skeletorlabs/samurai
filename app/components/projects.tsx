import { Inter } from "next/font/google";

import { IDO_v2 } from "@/app/utils/interfaces";
import { NEW_IDOS } from "@/app/utils/constants";
import IdoCard from "./idoCard";

const inter = Inter({
  subsets: ["latin"],
});

export default function Projects({ max }: { max?: number }) {
  return (
    <div
      className={`flex justify-center lg:justify-start items-center flex-wrap gap-3 leading-normal pt-10 text-xl ${inter.className}`}
    >
      {max
        ? NEW_IDOS.slice(0, max).map((ido: IDO_v2, index) => (
            <IdoCard key={index} ido={ido} />
          ))
        : NEW_IDOS.map((ido: IDO_v2, index) => (
            <IdoCard key={index} ido={ido} />
          ))}
    </div>
  );
}
