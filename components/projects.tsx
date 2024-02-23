import { Inter } from "next/font/google";

import LaunchpadCardNew from "@/components/launchpadCard";
import { IDO } from "@/utils/interfaces";
import { IDO_LIST } from "@/utils/constants";

const inter = Inter({
  subsets: ["latin"],
});

export default function Projects() {
  return (
    <div
      className={`flex justify-center lg:justify-start items-center flex-wrap gap-10 leading-normal pt-10 xl:pt-16 text-xl ${inter.className}`}
    >
      {IDO_LIST.map((ido: IDO, index) => (
        <LaunchpadCardNew key={index} ido={ido} />
      ))}
    </div>
  );
}
