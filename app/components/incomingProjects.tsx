import { Inter } from "next/font/google";

import { INCOMING, SINGLE_CARD } from "@/app/utils/interfaces";
import { INCOMING_IDOs } from "@/app/utils/constants";

import IncomingCard from "./incomingCard";

const inter = Inter({
  subsets: ["latin"],
});

export default function IncomingProjects({ max }: { max?: number }) {
  return (
    <div
      className={`flex justify-center lg:justify-start items-center flex-wrap gap-3 leading-normal pt-10 text-xl ${inter.className}`}
    >
      {max
        ? INCOMING_IDOs.slice(0, max).map((ido: INCOMING, index) => (
            <IncomingCard key={index} ido={ido} />
          ))
        : INCOMING_IDOs.map((ido: INCOMING, index) => (
            <IncomingCard key={index} ido={ido} />
          ))}
    </div>
  );
}
