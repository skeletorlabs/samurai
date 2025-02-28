import { Inter } from "next/font/google";

import { useCallback, useContext, useEffect, useState } from "react";
import { StateContext } from "../context/StateContext";
import { generalInfo, GiveawayType } from "../contracts_integrations/giveways";
import GiveawayCard from "./giveawayCard";

const inter = Inter({
  subsets: ["latin"],
});

export default function Giveaways({ max }: { max?: number }) {
  const [giveaways, setGiveaways] = useState<GiveawayType[] | []>([]);

  const { signer } = useContext(StateContext);

  const getGiveaways = useCallback(async () => {
    if (signer) {
      const response = await generalInfo();
      if (response) setGiveaways(response.giveaways as GiveawayType[]);
    }
  }, [signer, setGiveaways]);

  useEffect(() => {
    getGiveaways();
  }, [signer]);

  return (
    <div
      className={`flex justify-center lg:justify-start items-center flex-wrap gap-5 leading-normal pt-10 text-xl ${inter.className}`}
    >
      {max
        ? giveaways
            .slice(0, max)
            .map((giveaway: GiveawayType, index) => (
              <GiveawayCard key={index} giveaway={giveaway} />
            ))
        : giveaways.map((giveaway: GiveawayType, index) => (
            <GiveawayCard key={index} giveaway={giveaway} />
          ))}
    </div>
  );
}
