import { formattedDate2, formattedDate3 } from "@/app/utils/formattedDate";
import { Carousel } from "react-responsive-carousel";
import { LockInfo } from "../contracts_integrations/samLockV2";
import { useCallback, useEffect } from "react";

interface SCarousel {
  loading: boolean;
  locks: LockInfo[];
  periods: { title: string; value: number }[];
  inputWithdraw: string;
  setSelectedLockIndex: (index: number) => void;
  setInputWithdraw: (value: string) => void;
  onWithdraw: (lockIndex: number, amount: string) => void;
}

export default function LCarouselV2({
  loading,
  locks,
  periods,
  inputWithdraw,
  setSelectedLockIndex,
  setInputWithdraw,
  onWithdraw,
}: SCarousel) {
  const onInputWithdrawChange = (value: string) => {
    const re = new RegExp("^[+]?([0-9]+([.][0-9]*)?|[.][0-9]+)$");

    if (value === "" || re.test(value)) {
      setInputWithdraw(value);
    }

    return false;
  };

  const onSetMaxForWithdraw = useCallback(
    (lockIndex: number) => {
      const userLock = locks.find((item) => item.index === lockIndex);

      if (userLock) {
        setInputWithdraw(
          (userLock.lockedAmount - userLock.withdrawnAmount).toString()
        );
      }
    },
    [setInputWithdraw]
  );

  const canWithdraw = useCallback((lockIndex: number) => {
    let allowed = false;

    const userLock = locks.find((item) => item.index === lockIndex);

    if (userLock) {
      const unlockTime = (userLock.withdrawTime as number) * 1000;
      const currentTime = new Date().getTime();
      const remainingAmountToWithdraw =
        userLock.lockedAmount - userLock.withdrawnAmount;
      allowed = currentTime > unlockTime && remainingAmountToWithdraw > 0;
    }

    return allowed;
  }, []);

  // Callback to set lock index based in an index
  const setLockIndex = useCallback(
    (index: number) => {
      const reversedLocks = [...locks].reverse();
      setSelectedLockIndex(reversedLocks[index].index);
    },
    [setSelectedLockIndex]
  );

  // Call set lock index when component is loaded
  useEffect(() => {
    setLockIndex(0);
    setInputWithdraw("");
  }, [locks]);

  return (
    <Carousel
      onChange={(e) => {
        setInputWithdraw("");
        setLockIndex(e);
      }}
      className="w-full"
      showArrows={false}
      swipeable
      autoFocus
      showThumbs={false}
    >
      {[...locks].reverse().map((item) => (
        <div
          key={item.index}
          className="flex text-start flex-col rounded-[8px] text-sm md:text-[16px] w-full min-w-[300px]"
        >
          <div className="flex flex-col p-4 bg-black w-full rounded-t-[8px]">
            <div className="flex flex-col">
              <p className="text-[14px] text-white/40">Current points</p>
              <p className="text-samurai-red">
                {item.claimedPoints.toLocaleString("en-us")}
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
                <p className="text-[14px] text-white/40">Locked Until</p>
                <p>{formattedDate3(item.withdrawTime)}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between bg-white/5 w-full p-4">
            <div className="flex flex-col text-green-200">
              <p className="text-[14px] text-green-400">Withdrawn</p>
              <p className="flex flex-col md:flex-row md:items-center gap-1">
                <span>{item.withdrawnAmount.toLocaleString("en-us")}</span>{" "}
                <span className="text-xs md:text-[16px]">$SAM</span>
              </p>
            </div>

            <div className="flex flex-col text-end text-orange-100">
              <p className="text-[14px] text-orange-400">Remaining Locked</p>
              <p className="flex flex-col md:flex-row md:items-center justify-end gap-1">
                <span>
                  {(item.lockedAmount - item.withdrawnAmount).toLocaleString(
                    "en-us"
                  )}
                </span>{" "}
                <span className="text-xs md:text-[16px]">$SAM</span>
              </p>
            </div>
          </div>

          <div className="pt-2">
            <div className="flex items-center gap-3 text-black font-normal relative">
              <input
                disabled={loading || !canWithdraw(item.index)}
                onChange={(e) => onInputWithdrawChange(e.target.value)}
                value={inputWithdraw}
                type="text"
                placeholder="Amount to withdraw"
                className="w-full border-transparent enabled:bg-white py-4 focus:border-transparent focus:ring-transparent placeholder-black/60 text-sm md:text-xl disabled:bg-[#262626] disabled:text-white/10"
              />
              <button
                disabled={loading || !canWithdraw(item.index)}
                onClick={() => onSetMaxForWithdraw(item.index)}
                className="absolute top-[30px] md:top-[34px] right-[11px] flex items-center justify-center h-4 transition-all bg-black/70 rounded-full px-[11px] text-white hover:enabled:bg-samurai-red text-[11px] disabled:opacity-10"
              >
                MAX
              </button>
              <div className="flex absolute top-[10px] right-[12px] gap-2">
                <span className="text-sm md:text-[17px]">$SAM</span>
              </div>
            </div>

            <div className="mt-4 w-full">
              <button
                className="
                    bg-samurai-red flex justify-center items-center transition-all z-20 w-full text-lg md:text-normal py-3 
                  disabled:bg-black/30 disabled:text-white/10 hover:enabled:opacity-75 rounded-full
                  "
                onClick={() => onWithdraw(item.index, inputWithdraw)}
                disabled={
                  loading ||
                  Number(inputWithdraw) === 0 ||
                  !canWithdraw(item.index)
                }
              >
                {loading ? "Loading..." : "WITHDRAW"}
              </button>
            </div>
          </div>
        </div>
      ))}
    </Carousel>
  );
}
