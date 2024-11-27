import { Inter } from "next/font/google";

import LaunchpadCard from "@/app/components/launchpadCard";
import { IDO, IDO_v3 } from "@/app/utils/interfaces";
import { IDO_LIST, IDOs } from "@/app/utils/constants";
import LaunchpadCardV2 from "./launchpadCardV2";

const inter = Inter({
  subsets: ["latin"],
});

export default function ProjectsHome({
  maxV2,
  max,
}: {
  maxV2?: number;
  max?: number;
}) {
  return (
    <div
      className={`flex justify-center lg:justify-start items-center flex-wrap gap-3 leading-normal pt-10 text-xl ${inter.className}`}
    >
      {max
        ? IDOs.slice(0, maxV2).map((ido: IDO_v3, index) => (
            <LaunchpadCardV2 key={index} ido={ido} />
          ))
        : IDOs.map((ido: IDO_v3, index) => (
            <LaunchpadCardV2 key={index} ido={ido} />
          ))}
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
