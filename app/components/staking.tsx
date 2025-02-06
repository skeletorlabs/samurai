import { useCallback, useEffect, useState, Fragment, useContext } from "react";
import {
  Dialog,
  Transition,
  DialogPanel,
  TransitionChild,
  DialogTitle,
} from "@headlessui/react";
import { Tooltip } from "flowbite-react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader

import {
  UserInfo,
  claimPoints,
  claimRewards,
  generalInfo,
  getEstimatedPoints,
  stake,
  userInfo,
  withdraw,
} from "@/app/contracts_integrations/lpStaking";
import { StateContext } from "@/app/context/StateContext";
import { Roboto } from "next/font/google";
import SCarousel from "@/app/components/scarousel";
import { formatDistanceToNow, fromUnixTime, getUnixTime } from "date-fns";
import ConnectButton from "./connectbutton";
import LoadingBox from "./loadingBox";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "500", "900"],
});

type Period = {
  title: string;
  value: Number;
};

export default function Staking() {
  const [loading, setLoading] = useState(false);
  const [inputStake, setInputStake] = useState("");
  const [inputWithdraw, setInputWithdraw] = useState("");
  const [period, setPeriod] = useState<Period | null>(null);
  const [withdrawIsOpen, setWithdrawIsOpen] = useState(false);
  const [stakingData, setStakingData] = useState<any | null>(null);
  const [userInfoData, setUserInfoData] = useState<UserInfo | null>(null);
  const [estimatedPoints, setEstimatedPoints] = useState(0);
  const [selectedStakeIndex, setSelectedStakeIndex] = useState(0);
  const [formattedCountdown, setFormattedCountdown] = useState("");
  const [claimPeriodAllowed, setClaimPeriodAllowed] = useState(false);

  const { signer } = useContext(StateContext);

  const handleSliderChange = (event: any) => {
    let currentValue: number = event.target.value;

    let closedPeriod: Period = stakingData?.periods.reduce(
      (prev: Period, curr: Period) => {
        // console.log(
        //   Math.abs(Number(curr.value) - currentValue) <
        //     Math.abs(Number(prev.value) - currentValue)
        //     ? curr
        //     : prev
        // );
        return Math.abs(Number(curr.value) - currentValue) <
          Math.abs(Number(prev.value) - currentValue)
          ? curr
          : prev;
      },
      { title: "", value: 0 }
    );

    setPeriod(closedPeriod); // Update state with snapped value
  };

  const onInputStakeChange = (value: string) => {
    const re = new RegExp("^[+]?([0-9]+([.][0-9]*)?|[.][0-9]+)$");

    if (value === "" || re.test(value)) {
      setInputStake(value);
    }

    return false;
  };

  const onSetMaxForStake = useCallback(() => {
    if (userInfoData) {
      onInputStakeChange(userInfoData?.lpBalance.toString());
    }
  }, [userInfoData, onInputStakeChange]);

  const onStake = useCallback(async () => {
    setLoading(true);
    if (signer && period) {
      await stake(signer, inputStake, Number(period?.value));
      await onGetGeneralInfo();
      await onGetUserInfo();
    }
    setLoading(false);
  }, [signer, inputStake, period, setLoading]);

  const onWithdraw = useCallback(async () => {
    setLoading(true);
    if (signer) {
      await withdraw(signer, inputWithdraw, selectedStakeIndex);
      await onGetGeneralInfo();
      await onGetUserInfo();
    }
    setLoading(false);
  }, [signer, inputWithdraw, selectedStakeIndex, setLoading]);

  const onClaimPoints = useCallback(async () => {
    setLoading(true);
    if (signer) {
      await claimPoints(signer);
      await onGetGeneralInfo();
      await onGetUserInfo();
    }
    setLoading(false);
  }, [signer, setLoading]);

  const onClaimRewards = useCallback(async () => {
    setLoading(true);
    if (signer) {
      await claimRewards(signer);
      await onGetGeneralInfo();
      await onGetUserInfo();
    }
    setLoading(false);
  }, [signer, setLoading]);

  const checkCountdown = useCallback(async () => {
    if (userInfoData?.lastClaim === 0) {
      setClaimPeriodAllowed(true);
      return setFormattedCountdown("0");
    }

    if (stakingData && userInfoData) {
      const nextClaim = userInfoData.lastClaim + stakingData?.claimDelayPeriod;

      if (getUnixTime(new Date()) >= nextClaim) {
        setClaimPeriodAllowed(true);
        return setFormattedCountdown("0");
      } else {
        // set it for the first time
        setFormattedCountdown(
          formatDistanceToNow(fromUnixTime(nextClaim), {
            includeSeconds: true,
          })
        );

        setClaimPeriodAllowed(false);

        // interval to check after 45 seconds
        const timestamp = setInterval(async () => {
          setFormattedCountdown(
            formatDistanceToNow(fromUnixTime(nextClaim), {
              includeSeconds: true,
            })
          );

          if (getUnixTime(new Date()) >= nextClaim) {
            clearInterval(timestamp);

            setClaimPeriodAllowed(true);
            return setFormattedCountdown("0");
          }
        }, 45000); // 45 seconds
      }
    }
  }, [stakingData, userInfoData, setFormattedCountdown, setClaimPeriodAllowed]);

  useEffect(() => {
    const getEstimatedPointsInfo = async () => {
      if (Number(period?.value) > 0) {
        const response = await getEstimatedPoints(
          inputStake,
          Number(period?.value)
        );
        setEstimatedPoints(response);
      }
    };

    getEstimatedPointsInfo();
  }, [inputStake, period]);

  useEffect(() => {
    if (stakingData && userInfoData) {
      checkCountdown();
    }
  }, [stakingData, userInfoData, claimPeriodAllowed]);

  const onGetUserInfo = useCallback(async () => {
    if (signer) {
      const response = await userInfo(signer);
      setUserInfoData(response as UserInfo);
    }
  }, [signer]);

  useEffect(() => {
    onGetUserInfo();
  }, [signer]);

  const onGetGeneralInfo = useCallback(async () => {
    const response = await generalInfo();

    setStakingData(response);
    if (response && response?.periods.length > 0) {
      setPeriod(response?.periods[0]);
    }
    setLoading(false);
  }, [setLoading]);

  useEffect(() => {
    setLoading(true);
    onGetGeneralInfo();
  }, [setLoading]);

  return (
    <>
      <div className="flex flex-col lg:flex-row items-center gap-10 mt-14 relative">
        <div className="flex flex-col justify-between w-full lg:w-[580px] lg:bg-white/5 lg:border border-white/10 rounded-lg lg:py-10 lg:px-6 lg:shadow-lg shadow-pink-800/50 relative">
          <div className="flex flex-col pl-1 text-lg text-white/70">
            Platform TVL
            <div className="text-sm md:text-xl text-center md:text-start text-white">
              {stakingData?.totalStaked.toLocaleString("en-us")}{" "}
              <span className="pl-1">vAMM-WETH/SAM</span>
            </div>
          </div>

          <div className="flex items-center rounded-lg w-full bg-black/55 backdrop-blur-sm p-6 py-8 text-sm leading-[20px] border border-white/15 shadow-md shadow-black/60 mt-5">
            {signer ? (
              <div className="flex flex-col rounded-lg w-full gap-3">
                <div>
                  <p className="text-white/40">My TVL</p>
                  <p className="text-lg">
                    {(userInfoData?.totalStaked || 0).toLocaleString("en-us", {
                      minimumFractionDigits: 2,
                    })}{" "}
                    vAMM-WETH/SAM
                  </p>
                </div>
              </div>
            ) : (
              <ConnectButton />
            )}

            {signer && userInfoData && userInfoData?.stakings.length > 0 && (
              <button
                disabled={loading}
                onClick={() => {
                  setWithdrawIsOpen(true);
                  onGetUserInfo();
                }}
                className={`flex min-w-[200px] justify-center text-sm p-2 self-center ${
                  loading
                    ? "bg-white/10 text-white/10"
                    : "bg-white/90 text-black"
                } rounded-full hover:opacity-75`}
              >
                MANAGE STAKES
              </button>
            )}
          </div>

          {signer && userInfoData && userInfoData?.stakings.length > 0 && (
            <div className="flex items-center pt-8 text-sm leading-[20px] relative">
              <div className="flex flex-col rounded-lg w-full gap-3">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col gap-1 bg-black rounded-lg p-6 w-full justify-center items-center bg-black/55 backdrop-blur-sm text-sm leading-[20px] border border-white/15 shadow-md shadow-black/60">
                    <p className="text-lg">
                      {(userInfoData?.availablePoints || 0).toLocaleString(
                        "en-us",
                        {
                          maximumFractionDigits: 5,
                        }
                      )}
                      <span className="text-samurai-red"> $SPS</span>
                    </p>

                    <button
                      disabled={
                        loading ||
                        userInfoData?.availablePoints === 0 ||
                        claimPeriodAllowed === false
                      }
                      onClick={onClaimPoints}
                      className={`flex w-full justify-center text-sm p-2 self-center ${
                        loading ||
                        userInfoData?.availablePoints === 0 ||
                        claimPeriodAllowed === false
                          ? "bg-white/5 text-white/5"
                          : "bg-samurai-red text-white"
                      } rounded-full hover:enabled:bg-opacity-75`}
                    >
                      CLAIM
                    </button>
                  </div>
                  <div className="flex flex-col gap-1 bg-black rounded-lg p-6 w-full justify-center items-center bg-black/55 backdrop-blur-sm text-sm leading-[20px] border border-white/15 shadow-md shadow-black/60">
                    <p className="text-lg">
                      {(userInfoData?.claimableRewards || 0).toLocaleString(
                        "en-us",
                        {
                          maximumFractionDigits: 5,
                        }
                      )}
                      <span className="text-blue-700"> $AERO</span>
                    </p>

                    <button
                      disabled={
                        loading ||
                        userInfoData.claimableRewards === 0 ||
                        claimPeriodAllowed === false
                      }
                      onClick={onClaimRewards}
                      className={`flex w-full justify-center text-sm p-2 self-center ${
                        loading ||
                        userInfoData.claimableRewards === 0 ||
                        claimPeriodAllowed === false
                          ? "bg-white/5 text-white/5"
                          : "bg-blue-700 text-white"
                      } rounded-full hover:enabled:bg-blue-500 hover:enabled:text-white`}
                    >
                      CLAIM
                    </button>
                  </div>
                </div>
              </div>

              <span
                className={`${
                  formattedCountdown === "0" ? "invisible" : "visible"
                } absolute top-[155px] left-2 text-xs  text-white/50`}
              >
                *Remaining time to claim: {formattedCountdown}
              </span>
            </div>
          )}

          <div className="flex flex-col gap-5 shadow-lg mt-12 ">
            <div className="flex text-black relative border border-transparent">
              <input
                onChange={(e) => onInputStakeChange(e.target.value)}
                value={inputStake}
                type="text"
                placeholder="Amount to lock"
                className="w-full border-transparent bg-white py-4 focus:border-transparent focus:ring-transparent placeholder-black/60 text-xl rounded-lg mx-1"
              />
              <button
                onClick={onSetMaxForStake}
                className="absolute top-[34px] right-[11px] flex items-center justify-center h-4 transition-all bg-black/70 rounded-full px-[11px] text-white hover:bg-samurai-red text-[11px] "
              >
                MAX
              </button>
              <div className="flex absolute top-[10px] right-[12px] gap-2">
                <span className="text-[17px] mt-[-4px]">vAMM-WETH/SAM</span>
              </div>
              {signer && (
                <div className="absolute top-[-24px] right-2 text-sm text-end transition-all hover:opacity-75 w-max text-white">
                  <span className="text-white/70">Balance:</span>{" "}
                  {userInfoData?.lpBalance.toLocaleString("en-us", {
                    maximumFractionDigits: 18,
                  })}
                </div>
              )}
            </div>
          </div>

          {stakingData?.periods && (
            <div className="flex flex-col bg-black/55 backdrop-blur-sm p-6 py-8 mt-4 rounded-lg border border-white/15 shadow-md shadow-black/60">
              <div className="flex flex-col gap-2 text-sm">
                <span className="text-white/40">
                  Slide to select stake period
                </span>

                <input
                  type="range"
                  onChange={handleSliderChange}
                  value={Number(period?.value)}
                  min={stakingData?.periods[0].value}
                  max={
                    stakingData?.periods[stakingData?.periods.length - 1].value
                  }
                  className="w-[200px]"
                />

                <span className="text-white text-sm md:text-lg">
                  {period?.value
                    ? stakingData?.periods.find(
                        (item: any) => item.value === period?.value
                      ).title
                    : "---"}
                </span>
              </div>

              <div className="flex flex-col gap-1 text-sm mt-5">
                <span className="text-white/40">Estimated Points</span>
                <div className="flex text-xl gap-2">
                  {estimatedPoints.toLocaleString("en-us", {
                    maximumFractionDigits: 18,
                  })}{" "}
                  <Tooltip
                    style="dark"
                    content={
                      <div className="font-medium text-[14px] flex-wrap max-w-[220px]">
                        Points distributed linearly during{" "}
                        {
                          stakingData?.periods.find(
                            (item: any) => Number(item.value) === Number(period)
                          )?.title
                        }{" "}
                        staked.
                      </div>
                    }
                  >
                    <div className="w-6 h-6">
                      <svg
                        data-slot="icon"
                        fill="none"
                        strokeWidth="1"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                        ></path>
                      </svg>
                    </div>
                  </Tooltip>
                </div>
              </div>
            </div>
          )}

          <div className="w-full mt-4">
            <button
              onClick={onStake}
              disabled={
                loading ||
                !signer ||
                stakingData === null ||
                stakingData?.isPaused ||
                Number(inputStake) === 0 ||
                !userInfoData ||
                userInfoData?.lpBalance === 0
              }
              className="bg-samurai-red flex justify-center items-center transition-all z-20 w-full text-lg md:text-normal px-8 py-3 
              disabled:bg-black/30 disabled:text-white/10 hover:enabled:opacity-75 rounded-full
              "
            >
              <div className="flex items-center gap-2 ml-[-5px]">
                <div className="w-5 h-5 mt-[-3px]">
                  <svg
                    data-slot="icon"
                    fill="none"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                    ></path>
                  </svg>
                </div>
                <span>{loading ? "LOADING..." : "STAKE"}</span>
              </div>
            </button>
          </div>

          {/* WITHDRAW MODAL */}
          <Transition appear show={withdrawIsOpen} as={Fragment}>
            <Dialog
              as="div"
              className={`relative  ${roboto.className}`}
              onClose={() => setWithdrawIsOpen(false)}
            >
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black" />
              </TransitionChild>

              <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                  <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <DialogPanel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white/10 p-6 text-left align-middle transition-all border border-white/15 text-white shadow-lg shadow-samurai-red/20">
                      <DialogTitle
                        as="h3"
                        className="text-lg font-medium leading-6 text-white ml-1"
                      >
                        My vAMM-WETH/SAM stakes
                      </DialogTitle>

                      <div className="flex flex-col justify-center self-end w-full mt-4">
                        {stakingData && userInfoData && (
                          <SCarousel
                            loading={loading}
                            stakes={userInfoData?.stakings}
                            periods={stakingData?.periods}
                            inputWithdraw={inputWithdraw}
                            // onChangeAction={onSelectStake}
                            setSelectedStakeIndex={setSelectedStakeIndex}
                            setInputWithdraw={setInputWithdraw}
                            onWithdraw={onWithdraw}
                          />
                        )}
                      </div>
                    </DialogPanel>
                  </TransitionChild>
                </div>
              </div>
            </Dialog>
          </Transition>
        </div>
      </div>
      {loading && <LoadingBox />}
    </>
  );
}
