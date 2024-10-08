import { Inter } from "next/font/google";

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
        ? IDO_LIST.slice(0, max).map((ido: IDO, index) => (
            <LaunchpadCard key={index} ido={ido} />
          ))
        : IDO_LIST.map((ido: IDO, index) => (
            <LaunchpadCard key={index} ido={ido} />
          ))}
    </div>
  );
}
