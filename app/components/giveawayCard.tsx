import Image from "next/image";
import { formattedDate } from "@/app/utils/formattedDate";
import { useCallback, useState, useContext, useEffect } from "react";

import {
  GiveawayStatus,
  GiveawayType,
  STATUS_COLORS,
} from "../contracts_integrations/giveways";
import { MinusCircleIcon, PlusCircleIcon } from "@heroicons/react/20/solid";
import { GIVEAWAYS_LIST } from "../utils/constants";

import { Inter } from "next/font/google";
import delay from "../utils/delay";
import Loading from "./loading";
import { userInfo } from "../contracts_integrations/points";
import { StateContext } from "../context/StateContext";
import { currentTime } from "../utils/currentTime";
import ConnectButton from "./connectbutton";
const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "300", "500", "900"],
});

export default function GiveawayCard({
  giveaway,
  type = "dark",
}: {
  giveaway: GiveawayType;
  type?: string;
}) {
  const [ticketsToBuy, setTicketsToBuy] = useState(1);
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(0);
  const [giveawayStatus, setGiveawayStatus] = useState(
    GiveawayStatus.UPCOMING.toString()
  );
  const [giveawayStatusColors, setGiveawayStatusColors] = useState<any>(null);
  const { prizes, prizeValue, image, background, isDrawn } =
    GIVEAWAYS_LIST[giveaway.id];

  const { signer } = useContext(StateContext);

  enum ChangeType {
    INCREASE,
    DECREASE,
  }

  const onBuyTickets = useCallback(async () => {
    setLoading(true);
    await delay(2000);
    setLoading(false);
  }, [ticketsToBuy, setLoading]);

  const onTicketsAmountChange = useCallback(
    (type: ChangeType) => {
      if (type === ChangeType.INCREASE) setTicketsToBuy(ticketsToBuy + 1);
      if (type === ChangeType.DECREASE && ticketsToBuy > 1) {
        setTicketsToBuy(ticketsToBuy - 1);
      }
    },
    [ticketsToBuy, setTicketsToBuy]
  );

  const getStatus = () => {
    const now = currentTime();

    let status: string = GiveawayStatus.UPCOMING;
    if (now >= giveaway.startAt && now < giveaway.endAt)
      status = GiveawayStatus.ACTIVE;
    if (now >= giveaway.endAt && now < giveaway.drawAt)
      status = GiveawayStatus.FINISHED;
    if (now >= giveaway.drawAt && !isDrawn) status = GiveawayStatus.DRAWING;
    if (isDrawn) status = GiveawayStatus.DRAWN;

    console.log(status, isDrawn);

    const statusColors = STATUS_COLORS.find((item) => item.status === status);

    setGiveawayStatus(status);
    setGiveawayStatusColors(statusColors);
  };

  const getUserBalance = async () => {
    if (signer) {
      const response = await userInfo(signer);
      setBalance(response?.balance || 0);
    }
  };

  useEffect(() => {
    getUserBalance();
  }, [signer]);

  useEffect(() => {
    getStatus();
  }, [giveaway]);

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
            fill
            style={{ objectFit: "cover" }}
            alt={giveaway.name}
          />
        </div>

        <div className="absolute left-0 bottom-0 flex flex-col lg:flex-row gap-5 lg:gap-0 items-center justify-between bg-black/50 backdrop-blur-sm w-full lg:p-10 py-8 text-white text-3xl 2xl:text-5xl font-bold border-t border-samurai-red">
          <div className="flex flex-col lg:flex-row items-center gap-2 lg:gap-5 w-full">
            <Image
              src={image}
              width={140}
              height={140}
              className="rounded-lg border border-white/30"
              alt={giveaway.name}
            />
            {giveaway.name}
          </div>

          <div className="flex flex-col lg:flex-row items-center lg:justify-end lg:gap-2 w-full text-2xl lg:text-3xl 2xl:text-5xl bg-white/20 lg:bg-transparent p-2 lg:p-0">
            <span className="text-yellow-300">PRIZES:</span>
            <p className="text-white flex items-center gap-2">
              {prizes}{" "}
              <span className="text-xl">
                ~{` $${prizeValue.toLocaleString("en-us")}`} USD
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 items-center pb-5 lg:pb-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 w-full gap-2 text-center ">
          <div className="flex flex-col bg-black/50 py-4 px-6 text-sm border border-white/10">
            <span className="text-white/70">TICKET PRICE</span>
            <span className="text-lg">
              {giveaway.priceInPoints.toLocaleString("en-us")} Samurai Points
            </span>
          </div>
          <div className="flex flex-col bg-black/50 py-4 px-6 text-sm border border-white/10">
            <span className="text-white/70">MINIMUM TO PARTICIPATE</span>
            <span className="text-lg">
              {giveaway.minTickets} Ticket{giveaway.minTickets > 1 && "s"}
            </span>
          </div>
          <div className="flex flex-col bg-black/50 py-4 px-6 text-sm border border-white/10">
            <span className="text-white/70">START DATE</span>
            <span className="text-lg">
              {formattedDate(giveaway.startAt)} UTC
            </span>
          </div>
          <div className="flex flex-col bg-black/50 py-4 px-6 text-sm border border-white/10">
            <span className="text-white/70">END DATE</span>
            <span className="text-lg">{formattedDate(giveaway.endAt)} UTC</span>
          </div>
          <div className="flex flex-col bg-black/50 py-4 px-6 text-sm border border-white/10">
            <span className="text-white/70">DRAW DATE</span>
            <span className="text-lg">
              {formattedDate(giveaway.drawAt)} UTC
            </span>
          </div>
          <div className="flex flex-col bg-black/50 py-4 px-6 text-sm border border-white/10">
            <span className="text-samurai-red">MY TICKETS</span>
            <span className="text-lg">0</span>
          </div>
        </div>
        <div className="w-full h-[1px] lg:w-[1px] lg:h-[300px]  bg-white/10" />
        <div className="flex flex-col justify-center items-center w-full">
          {signer ? (
            <div className=" flex flex-col justify-center items-center gap-4">
              <p
                className={`text-4xl leading-[24px] lg:leading-[30px] text-center ${inter.className}`}
              >
                Enter the Giveway <br />
                <span className="text-sm lg:text-lg text-white/70">
                  Select amount of tickets to enter the giveaway
                </span>
              </p>

              <div className="text-center mt-2 mb-[-6px] lg:mt-6 text-sm font-mono">
                Balance:{" "}
                {balance.toLocaleString("en-us", { minimumFractionDigits: 2 })}{" "}
                Points
              </div>
              <div className="relative w-max">
                <input
                  disabled
                  type="text"
                  className="text-xl rounded-full text-black/80 font-medium text-center min-w-[380px] max-w-[340px]"
                  placeholder="amount of tickets"
                  value={`${ticketsToBuy} Tickets = ${
                    ticketsToBuy * giveaway.priceInPoints
                  } Points`}
                  onChange={(e) => setTicketsToBuy(Number(e.target.value))}
                />
                <button
                  disabled={loading || giveawayStatus !== GiveawayStatus.ACTIVE}
                  className="absolute top-1 left-2 text-black transition-all opacity-75 hover:enabled:opacity-100"
                  onClick={() => onTicketsAmountChange(ChangeType.DECREASE)}
                >
                  <MinusCircleIcon width={40} />
                </button>
                <button
                  disabled={loading || giveawayStatus !== GiveawayStatus.ACTIVE}
                  className="absolute top-1 right-2 text-black transition-all opacity-75 hover:enabled:opacity-100"
                  onClick={() => onTicketsAmountChange(ChangeType.INCREASE)}
                >
                  <PlusCircleIcon width={40} />
                </button>
              </div>
              <button
                disabled={
                  loading ||
                  giveawayStatus !== GiveawayStatus.ACTIVE ||
                  balance < ticketsToBuy * giveaway.priceInPoints
                }
                onClick={onBuyTickets}
                className="flex items-center justify-center text-sm lg:text-md h-[50px] disabled:bg-white/10 enabled:bg-samurai-red hover:enabled:opacity-75 disabled:text-white/20 disabled:border-white/20 rounded-full min-w-[380px] max-w-[380px]"
              >
                {loading ? (
                  <Loading />
                ) : giveawayStatus !== GiveawayStatus.ACTIVE ? (
                  giveawayStatus
                ) : (
                  `BUY ${ticketsToBuy} TICKET${ticketsToBuy > 1 ? "S" : ""}`
                )}
              </button>
            </div>
          ) : (
            <div className="max-w-[500px]">
              <ConnectButton />
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 absolute top-20 right-10 z-20">
        <div className="flex items-center gap-2 bg-black py-2 px-4 rounded-full border border-white/30 shadow-lg z-20">
          <span
            className={`bg-gradient-to-tr ${giveawayStatusColors?.from} ${giveawayStatusColors?.to} shadow-lg rounded-full w-4 h-4 animate-pulse`}
          />
          <span className={`${giveawayStatusColors?.text} text-sm`}>
            {giveawayStatus}
          </span>
        </div>
        <div className="flex items-center gap-2 bg-black py-2 px-4 rounded-full border border-white/30 shadow-lg z-20 text-sm">
          <span className="text-gray-300">TOTAL TICKETS PURCHASED:</span>
          <span>0</span>
        </div>
      </div>
    </div>
  );
}
