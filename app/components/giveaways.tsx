import { Inter } from "next/font/google";

import { useCallback, useContext, useEffect, useState } from "react";
import { generalInfo, GiveawayType } from "../contracts_integrations/giveways";
import GiveawayCard from "./giveawayCard";
import LoadingBox from "./loadingBox";

const inter = Inter({
  subsets: ["latin"],
});

export default function Giveaways({
  ids,
  max,
}: {
  ids?: number[];
  max?: number;
}) {
  const [giveaways, setGiveaways] = useState<GiveawayType[] | []>([]);
  const [loading, setLoading] = useState(true);
  const [shouldReload, setShouldReload] = useState(false);

  const getGiveaways = useCallback(async () => {
    setLoading(true);
    const response = await generalInfo();
    if (response) setGiveaways(response.giveaways as GiveawayType[]);
    setLoading(false);
  }, [setGiveaways, setLoading]);

  useEffect(() => {
    if (shouldReload) getGiveaways();
    setShouldReload(false);
  }, [shouldReload]);

  useEffect(() => {
    getGiveaways();
  }, []);

  return loading ? (
    <div className="w-full min-h-[800px] mb-8 relative">
      <LoadingBox css="absolute top-10 left-0 bg-black/80 backdrop-blur-lg !w-[100%] h-[100%] rounded-lg border border-black flex justify-center items-center" />
    </div>
  ) : (
    <div
      className={`flex justify-center lg:justify-start items-center flex-wrap gap-5 leading-normal pt-10 text-xl relative ${inter.className}`}
    >
      {ids
        ? giveaways
            .filter((giveaway: GiveawayType) => ids.includes(giveaway.id))
            .map((giveaway: GiveawayType, index) => (
              <GiveawayCard
                key={index}
                giveaway={giveaway}
                setReload={setShouldReload}
              />
            ))
        : max
        ? giveaways
            .slice(0, max)
            .map((giveaway: GiveawayType, index) => (
              <GiveawayCard
                key={index}
                giveaway={giveaway}
                setReload={setShouldReload}
              />
            ))
        : giveaways.map((giveaway: GiveawayType, index) => (
            <GiveawayCard
              key={index}
              giveaway={giveaway}
              setReload={setShouldReload}
            />
          ))}

      {giveaways.length === 0 && (
        <div className="w-full flex items-center text-center">
          <p>No giveaways available</p>
        </div>
      )}
    </div>
  );
}
