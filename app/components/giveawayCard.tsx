import Image from "next/image";
import { formattedDate } from "@/app/utils/formattedDate";
import { useCallback, useEffect, useState } from "react";

import LoadingBox from "@/app/components/loadingBox";
import { GiveawayType } from "../contracts_integrations/giveways";
import {
  MinusCircleIcon,
  MinusIcon,
  PlusCircleIcon,
  PlusIcon,
} from "@heroicons/react/20/solid";
import { GIVEAWAYS_LIST } from "../utils/constants";

export default function GiveawayCard({
  giveaway,
  type = "dark",
}: {
  giveaway: GiveawayType;
  type?: string;
}) {
  const [ticketsToBuy, setTicketsToBuy] = useState(1);

  const { prizes, image, background } = GIVEAWAYS_LIST[giveaway.id];

  enum ChangeType {
    INCREASE,
    DECREASE,
  }

  const onTicketsAmountChange = useCallback(
    (type: ChangeType) => {
      if (type === ChangeType.INCREASE) setTicketsToBuy(ticketsToBuy + 1);
      if (type === ChangeType.DECREASE && ticketsToBuy > 1) {
        setTicketsToBuy(ticketsToBuy - 1);
      }
    },
    [ticketsToBuy, setTicketsToBuy]
  );

  return (
    <div
      className={`flex flex-col rounded-lg border-[0.5px] border-neutral-700 text-start ${
        type === "dark" ? "bg-black/50" : "bg-neutral-700"
      }  w-full py-4 pb-5 shadow-xl px-4`}
    >
      <div className="flex w-full mb-4 relative">
        <div className="flex w-full h-[560px] relative shadow-lg shadow-black/30">
          <Image
            src={background}
            // placeholder="blur"
            // blurDataURL={ido.idoImageSrc}
            fill
            style={{ objectFit: "cover" }}
            alt={giveaway.name}
          />
        </div>

        <div className="absolute left-0 bottom-0 flex items-center justify-between bg-black/50 backdrop-blur-sm w-full p-10 py-8 text-white text-5xl font-bold border-t border-samurai-red">
          <div className="flex items-center gap-5">
            <Image
              src={image}
              width={140}
              height={140}
              className="rounded-lg border border-samurai-red"
              alt={giveaway.name}
            />
            {giveaway.name}
          </div>

          <div className="flex items-center gap-2 w-max text-5xl">
            <span className="text-yellow-300">PRIZES:</span>
            <p className="text-white">{prizes}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-10 items-center">
        <div className="flex flex-col">
          <h4 className="text-2xl text-samurai-red py-4">GIVEAWAY DETAILS</h4>
          <div className="flex gap-4 flex-wrap w-full">
            <div className="flex items-center gap-2 bg-black/50 py-4 px-16 w-max text-2xl">
              <div className="flex flex-col">
                <span className="text-[18px] text-white/70">TICKET PRICE</span>
                <span className="text-2xl">
                  {giveaway.priceInPoints.toLocaleString("en-us")} Samurai
                  Points
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-black/50 py-4 px-16 w-max text-2xl">
              <div className="flex flex-col">
                <span className="text-[18px] text-white/70">
                  MINIMUM TO PARTICIPATE
                </span>
                <span className="text-2xl">{giveaway.minTickets} Tickets</span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-black/50 py-4 px-16 w-max text-2xl">
              <div className="flex flex-col">
                <span className="text-[18px] text-white/70">START DATE</span>
                <span className="text-2xl">
                  {formattedDate(giveaway.startAt)} UTC
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-black/50 py-4 px-16 w-max text-2xl">
              <div className="flex flex-col">
                <span className="text-[18px] text-white/70">END DATE</span>
                <span className="text-2xl">
                  {formattedDate(giveaway.endAt)} UTC
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-black/50 py-4 px-16 w-max text-2xl">
              <div className="flex flex-col">
                <span className="text-[18px] text-white/70">DRAW DATE</span>
                <span className="text-2xl">
                  {formattedDate(giveaway.drawAt)} UTC
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="h-[200px] w-[1px] bg-white/10" />
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-1">
            <button
              className="transition-all opacity-75 hover:enabled:opacity-100"
              onClick={() => onTicketsAmountChange(ChangeType.DECREASE)}
            >
              <MinusIcon width={40} />
            </button>
            <span className="text-black bg-white px-10">{ticketsToBuy}</span>
            <button
              className="transition-all opacity-75 hover:enabled:opacity-100"
              onClick={() => onTicketsAmountChange(ChangeType.INCREASE)}
            >
              <PlusIcon width={40} />
            </button>
          </div>
          <div className="flex items-center gap-1">
            <button
              className="transition-all opacity-75 hover:enabled:opacity-100"
              onClick={() => onTicketsAmountChange(ChangeType.DECREASE)}
            >
              <MinusCircleIcon width={40} />
            </button>
            <button className="text-sm lg:text-md py-2 px-4 bg-samurai-red hover:enabled:opacity-75 disabled:text-white/20 disabled:border-white/20 rounded-full min-w-[200px]">
              BUY {ticketsToBuy} TICKETS
            </button>
            <button
              className="transition-all opacity-75 hover:enabled:opacity-100"
              onClick={() => onTicketsAmountChange(ChangeType.INCREASE)}
            >
              <PlusCircleIcon width={40} />
            </button>
          </div>
        </div>
      </div>

      {/* <div className="text-center pt-10">My Samurai Points: 10,000</div> */}
    </div>
  );
}
