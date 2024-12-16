import { Inter } from "next/font/google";

import LaunchpadCard from "@/app/components/launchpadCard";
import { IDO, IDO_v3, SINGLE_CARD } from "@/app/utils/interfaces";
import { IDO_LIST, IDOs, IDOs_card } from "@/app/utils/constants";
import LaunchpadCardV2 from "./launchpadCardV2";
import LaunchpadSingleCard from "./launchpadSingleCard";

const inter = Inter({
  subsets: ["latin"],
});

export default function ProjectsHome({
  max,
  maxV2,
}: {
  max?: number;
  maxV2?: number;
}) {
  return (
    <div
      className={`flex justify-center lg:justify-start items-center flex-wrap gap-3 leading-normal pt-10 text-xl ${inter.className}`}
    >
      {max
        ? IDOs_card.slice(0, max).map((ido: SINGLE_CARD, index) => (
            <LaunchpadSingleCard key={index} ido={ido} />
          ))
        : IDOs_card.map((ido: SINGLE_CARD, index) => (
            <LaunchpadSingleCard key={index} ido={ido} />
          ))}
      {max
        ? IDOs.slice(0, maxV2).map((ido: IDO_v3, index) => (
            <LaunchpadCardV2 key={index} ido={ido} />
          ))
        : IDOs.map((ido: IDO_v3, index) => (
            <LaunchpadCardV2 key={index} ido={ido} />
          ))}
    </div>
  );
}
