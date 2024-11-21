import { Inter } from "next/font/google";

import { IDO_v3 } from "@/app/utils/interfaces";
import { IDOs, NEW_IDOS } from "@/app/utils/constants";
import IdoCard from "./idoCard";

import LaunchpadCard from "@/app/components/launchpadCard";
import { IDO } from "@/app/utils/interfaces";
import { IDO_LIST } from "@/app/utils/constants";

const inter = Inter({
  subsets: ["latin"],
});

export default function Projects({ max }: { max?: number }) {
  return (
    <div
      className={`flex justify-center lg:justify-start items-center flex-wrap gap-3 leading-normal pt-10 text-xl ${inter.className}`}
    >
      {max
        ? IDOs.slice(0, max).map((ido: IDO_v3, index) => (
            <IdoCard key={index} ido={ido} />
          ))
        : IDOs.map((ido: IDO_v3, index) => (
            <IdoCard key={index} ido={ido} />

            // ? IDO_LIST.slice(0, max).map((ido: IDO, index) => (
            //     <LaunchpadCard key={index} ido={ido} />
            //   ))
            // : IDO_LIST.map((ido: IDO, index) => (
            //     <LaunchpadCard key={index} ido={ido} />
          ))}
    </div>
  );
}
