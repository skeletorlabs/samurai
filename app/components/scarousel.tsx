import { formattedDate2, formattedDate3 } from "@/app/utils/formattedDate";
import { Carousel } from "react-responsive-carousel";
import { StakingInfo } from "../contracts_integrations/lpStaking";
import { useCallback, useEffect } from "react";

interface SCarousel {
  loading: boolean;
  stakes: StakingInfo[];
  periods: { title: string; value: number }[];
  inputWithdraw: string;
  // onChangeAction: (index: number) => void;
  setSelectedStakeIndex: (index: number) => void;
  setInputWithdraw: (value: string) => void;
  onWithdraw: (stakeIndex: number, amount: string) => void;
}

export default function SCarousel({
  loading,
  stakes,
  periods,
  inputWithdraw,
  // onChangeAction,
  setSelectedStakeIndex,
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
    (stakeIndex: number) => {
      const userStake = stakes.find((item) => item.index === stakeIndex);

      if (userStake) {
        setInputWithdraw(
          (userStake.stakedAmount - userStake.withdrawnAmount).toString()
        );
      }
    },
    [setInputWithdraw]
  );

  const canWithdraw = useCallback((stakeIndex: number) => {
    let allowed = false;

    const userStake = stakes.find((item) => item.index === stakeIndex);

    if (userStake) {
      const unlockTime = (userStake.withdrawTime as number) * 1000;
      const currentTime = new Date().getTime();
      const remainingAmountToWithdraw =
        userStake.stakedAmount - userStake.withdrawnAmount;
      allowed = currentTime > unlockTime && remainingAmountToWithdraw > 0;
    }

    console.log("can withdraw - ", allowed);

    return allowed;
  }, []);

  // Callback to set stake index based in an index
  const setStakeIndex = useCallback(
    (index: number) => {
      const reversedStakes = [...stakes].reverse();
      setSelectedStakeIndex(reversedStakes[index].index);
    },
    [setSelectedStakeIndex]
  );

  // Call set stake index when component is loaded
  useEffect(() => {
    setStakeIndex(0);
    setInputWithdraw("");
  }, [stakes]);

  return (
    <Carousel
      onChange={(e) => {
        setInputWithdraw("");
        setStakeIndex(e);
      }}
      className="w-full"
      showArrows={false}
      swipeable
      autoFocus
      showThumbs={false}
    >
      {[...stakes].reverse().map((item) => (
        <div
          key={item.index}
          className="flex text-start flex-col rounded-[8px] text-[16px] w-full min-w-[300px]"
        >
          <div className="flex flex-col py-6 px-4 bg-black text-white/40 w-full rounded-t-[8px]">
            Stake Card - {item.index + 1}
          </div>
          <div className="flex flex-col p-4 w-full shadow-md gap-3">
            <div className="flex items-center w-full">
              <div className="flex flex-col w-full">
                <p className="text-[14px] text-white/40">Staked</p>
                <p>{item.stakedAmount.toLocaleString("en-us")} vAMM-WETH/SAM</p>
              </div>

              <div className="flex flex-col text-end">
                <p className="text-[14px] text-white/40">Period</p>
                <p className="w-max">
                  {
                    periods.find(
                      (itemPeriod) =>
                        Number(itemPeriod.value) === Number(item.stakePeriod)
                    )?.title
                  }
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col">
                <p className="text-[14px] text-white/40">Staked at</p>
                <p>{formattedDate2(item.stakedAt)}</p>
              </div>

              <div className="flex flex-col text-end">
                <p className="text-[14px] text-white/40">Staked Until</p>
                <p>{formattedDate3(item.withdrawTime)}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between bg-white/5 w-full p-4">
            <div className="flex flex-col text-green-200">
              <p className="text-[14px] text-green-400">Withdrawn</p>
              <p>
                {item.withdrawnAmount.toLocaleString("en-us")} vAMM-WETH/SAM
              </p>
            </div>

            <div className="flex flex-col text-end text-orange-100">
              <p className="text-[14px] text-orange-400">Remaining Staked</p>
              <p>
                {(item.stakedAmount - item.withdrawnAmount).toLocaleString(
                  "en-us"
                )}{" "}
                vAMM-WETH/SAM
              </p>
            </div>
          </div>

          <div className="pt-2">
            <div className="flex items-center gap-3 bg-white/90 text-black font-normal relative">
              <input
                disabled={loading || !canWithdraw(item.index)}
                onChange={(e) => onInputWithdrawChange(e.target.value)}
                value={inputWithdraw}
                type="text"
                placeholder="Amount to withdraw"
                className="w-full border-transparent bg-white py-4 focus:border-transparent focus:ring-transparent placeholder-black/60 text-xl disabled:bg-[#262626] disabled:text-white/10"
              />
              <button
                disabled={loading || !canWithdraw(item.index)}
                onClick={() => onSetMaxForWithdraw(item.index)}
                className="absolute top-[34px] right-[11px] transition-all bg-black/70 rounded-full px-[11px] text-white hover:enabled:bg-samurai-red text-[11px] disabled:opacity-10"
              >
                MAX
              </button>
              <div className="flex absolute top-[10px] right-[12px] gap-2">
                <span className="text-[17px]">vAMM-WETH/SAM</span>
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
