import { LockInfo } from "@/app/contracts_integrations/samLock";
import { formattedDate2, formattedDate3 } from "@/app/utils/formattedDate";
import { Carousel } from "react-responsive-carousel";

interface SCarousel {
  type: string;
  locks: LockInfo[];
  periods: { title: string; value: number }[];
  onChangeAction: (index: number, type: string) => void;
}

export default function SCarousel({
  type,
  locks,
  periods,
  onChangeAction,
}: SCarousel) {
  return (
    <Carousel
      onChange={(e) => onChangeAction(e, type)}
      className="py-5 w-full"
      showArrows={false}
      swipeable
      autoFocus
      showThumbs={false}
    >
      {locks.map((item, index) => (
        <div
          key={index}
          className="flex text-start flex-col border border-white/10 rounded-[8px] text-[16px] w-full min-w-[300px]"
        >
          <div className="flex flex-col p-4 bg-black w-full rounded-t-[8px]">
            <div className="flex flex-col">
              <p className="text-[14px] text-white/40">Current points</p>
              <p className="text-samurai-red">
                {item.points.toLocaleString("en-us")}
              </p>
            </div>
          </div>
          <div className="flex flex-col p-4 w-full shadow-md gap-3">
            <div className="flex items-center w-full">
              <div className="flex flex-col w-full">
                <p className="text-[14px] text-white/40">Locked</p>
                <p>{item.lockedAmount.toLocaleString("en-us")} $SAM</p>
              </div>

              <div className="flex flex-col text-end">
                <p className="text-[14px] text-white/40">Period</p>
                <p className="w-max">
                  {
                    periods.find(
                      (itemPeriod) =>
                        Number(itemPeriod.value) === Number(item.lockPeriod)
                    )?.title
                  }
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col">
                <p className="text-[14px] text-white/40">Locked at</p>
                <p>{formattedDate2(item.lockedAt)}</p>
              </div>

              <div className="flex flex-col text-end">
                <p className="text-[14px] text-white/40">Unlock date</p>
                <p>{formattedDate3(item.unlockTime)}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between bg-white/5 w-full p-4 rounded-b-[8px]">
            <div className="flex flex-col">
              <p className="text-[14px] text-white/40">Withdrawn</p>
              <p>{item.withdrawnAmount.toLocaleString("en-us")} $SAM</p>
            </div>

            <div className="flex flex-col text-end">
              <p className="text-[14px] text-white/40">Remaining Locked</p>
              <p>
                {(item.lockedAmount - item.withdrawnAmount).toLocaleString(
                  "en-us"
                )}{" "}
                $SAM
              </p>
            </div>
          </div>
        </div>
      ))}
    </Carousel>
  );
}
