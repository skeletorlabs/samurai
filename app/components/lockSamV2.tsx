import { useCallback, useEffect, useState, Fragment, useContext } from "react";
import {
  Dialog,
  Transition,
  DialogPanel,
  TransitionChild,
  DialogTitle,
} from "@headlessui/react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader

import {
  UserInfo,
  claimPoints,
  generalInfo,
  getEstimatedPoints,
  lock,
  userInfo,
  withdraw,
} from "@/app/contracts_integrations/samLockV2";
import { StateContext } from "@/app/context/StateContext";
import { Roboto } from "next/font/google";
import { formatDistanceToNow, fromUnixTime, getUnixTime } from "date-fns";
import ConnectButton from "./connectbutton";
import LoadingBox from "./loadingBox";
import LCarouselV2 from "./lcarouselV2";
import {
  claim,
  missingPointsInfos,
  MissingPointsType,
  MissingPointsVersion,
} from "../contracts_integrations/missingPoints";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "500", "900"],
});

type Period = {
  title: string;
  value: Number;
};

export default function LockSamV2() {
  const [loading, setLoading] = useState(false);
  const [inputLock, setInputLock] = useState("");
  const [inputWithdraw, setInputWithdraw] = useState("");
  const [period, setPeriod] = useState<Period | null>(null);
  const [withdrawIsOpen, setWithdrawIsOpen] = useState(false);
  const [lockData, setLockData] = useState<any | null>(null);
  const [userInfoData, setUserInfoData] = useState<UserInfo | null>(null);
  const [userMissingPointsData, setUserMissingPointsData] =
    useState<MissingPointsType | null>(null);
  const [estimatedPoints, setEstimatedPoints] = useState(0);
  const [selectedLockIndex, setSelectedLockIndex] = useState(0);
  const [formattedCountdown, setFormattedCountdown] = useState("");
  const [claimPeriodAllowed, setClaimPeriodAllowed] = useState(false);

  const { signer, account } = useContext(StateContext);

  const handleSliderChange = (event: any) => {
    let currentValue: number = event.target.value;

    let closedPeriod: Period = lockData?.periods.reduce(
      (prev: Period, curr: Period) => {
        return Math.abs(Number(curr.value) - currentValue) <
          Math.abs(Number(prev.value) - currentValue)
          ? curr
          : prev;
      },
      { title: "", value: 0 }
    );

    setPeriod(closedPeriod); // Update state with snapped value
  };

  const onInputLockChange = (value: string) => {
    const re = new RegExp("^[+]?([0-9]+([.][0-9]*)?|[.][0-9]+)$");

    if (value === "" || re.test(value)) {
      setInputLock(value);
    }

    return false;
  };

  const onSetMaxForLock = useCallback(() => {
    if (userInfoData) {
      onInputLockChange(userInfoData?.balance.toString());
    }
  }, [userInfoData, onInputLockChange]);

  const onLock = useCallback(async () => {
    setLoading(true);
    if (signer && period) {
      await lock(signer, inputLock, Number(period?.value));
      await onGetGeneralInfo();
      await onGetUserInfo();
    }
    setLoading(false);
  }, [signer, inputLock, period, setLoading]);

  const onWithdraw = useCallback(async () => {
    setLoading(true);
    if (signer) {
      await withdraw(signer, inputWithdraw, selectedLockIndex);
      await onGetGeneralInfo();
      await onGetUserInfo();
    }
    setLoading(false);
  }, [signer, inputWithdraw, selectedLockIndex, setLoading]);

  const onClaimPoints = useCallback(async () => {
    setLoading(true);
    if (signer) {
      await claimPoints(signer);
      await onGetGeneralInfo();
      await onGetUserInfo();
    }
    setLoading(false);
  }, [signer, setLoading]);

  const onClaimBoostedPoints = useCallback(async () => {
    setLoading(true);
    if (signer) {
      await claim(MissingPointsVersion.v2, signer);
      await onGetGeneralInfo();
      await onGetUserInfo();
      await onGetUserMissingPoints();
    }
    setLoading(false);
  }, [signer, setLoading]);

  const checkCountdown = useCallback(async () => {
    if (userInfoData?.lastClaim === 0) {
      setClaimPeriodAllowed(true);
      return setFormattedCountdown("0");
    }

    if (lockData && userInfoData) {
      const nextClaim = userInfoData.lastClaim + lockData?.claimDelayPeriod;

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
  }, [lockData, userInfoData, setFormattedCountdown, setClaimPeriodAllowed]);

  useEffect(() => {
    const getEstimatedPointsInfo = async () => {
      if (Number(period?.value) > 0) {
        const response = await getEstimatedPoints(
          inputLock,
          Number(period?.value)
        );
        setEstimatedPoints(response);
      }
    };

    getEstimatedPointsInfo();
  }, [inputLock, period]);

  useEffect(() => {
    if (lockData && userInfoData) {
      checkCountdown();
    }
  }, [lockData, userInfoData, claimPeriodAllowed]);

  const onGetUserMissingPoints = useCallback(async () => {
    if (account) {
      const response = await missingPointsInfos(
        MissingPointsVersion.v2,
        account
      );

      setUserMissingPointsData(response as MissingPointsType);
    }
  }, [account]);

  const onGetUserInfo = useCallback(async () => {
    if (account) {
      const response = await userInfo(account);
      // const response = await userInfo("0x194856b0d232821a75fd572c40f28905028b5613");
      setUserInfoData(response as UserInfo);
    }
  }, [account]);

  useEffect(() => {
    onGetUserInfo();
    onGetUserMissingPoints();
  }, [account]);

  const onGetGeneralInfo = useCallback(async () => {
    const response = await generalInfo();

    setLockData(response);
    if (response && response?.periods.length > 0) {
      setPeriod(response?.periods[0]);
    }
    setLoading(false);
  }, [setLoading, setLockData]);

  useEffect(() => {
    setLoading(true);
    onGetGeneralInfo();
  }, [setLoading]);

  return (
    <>
      <div className="flex flex-col lg:flex-row items-center gap-10 mt-2 relative">
        <div className="flex flex-col justify-between w-full xl:min-h-[750px] lg:w-[580px] xl:w-[450px] 2xl:w-[580px] lg:bg-white/5 lg:border border-white/10 rounded-lg lg:py-10 lg:px-6 lg:shadow-lg shadow-pink-800/50 relative">
          <p className="text-sm md:text-xl text-white/70 text-center md:text-start">
            TVL{" "}
            <span className="text-white">
              {Number(
                lockData?.totalLocked - lockData?.totalWithdrawn || 0
              ).toLocaleString("en-us")}{" "}
              $SAM
            </span>
          </p>

          <div className="flex flex-col md:flex-row items-center rounded-lg w-full bg-black/55 backdrop-blur-sm p-6 py-8 text-sm leading-[20px] border border-white/15 shadow-md shadow-black/60 mt-5">
            {signer ? (
              <div className="flex flex-col rounded-lg w-full gap-3">
                <div className="text-center md:text-start leading-none md:leading-normal">
                  <p className="text-white/40">My TVL</p>
                  <p className="text-lg">
                    {(userInfoData?.totalLocked || 0).toLocaleString("en-us", {
                      maximumFractionDigits: 2,
                    })}{" "}
                    $SAM
                  </p>
                </div>
                <div className="text-center md:text-start leading-none md:leading-normal">
                  <p className="text-white/40">Points to Claim</p>
                  <p className="text-lg">
                    {(userInfoData?.availablePoints || 0).toLocaleString(
                      "en-us",
                      {
                        maximumFractionDigits: 2,
                      }
                    )}{" "}
                    Points
                  </p>
                </div>
                <div className="text-center md:text-start leading-none md:leading-normal">
                  <p className="text-white/40">Boosted Points to Claim</p>
                  <p className="text-lg">
                    {(userMissingPointsData?.claimable || 0).toLocaleString(
                      "en-us",
                      {
                        maximumFractionDigits: 2,
                      }
                    )}{" "}
                    Boosted Points
                  </p>
                </div>
              </div>
            ) : (
              <ConnectButton />
            )}

            {signer &&
              account &&
              userInfoData &&
              userInfoData?.locks.length > 0 && (
                <div className="flex flex-col gap-8">
                  <button
                    disabled={loading}
                    onClick={() => {
                      setWithdrawIsOpen(true);
                      onGetUserInfo();
                    }}
                    className={`flex min-w-[200px] justify-center text-sm p-2 self-center mt-2 md:mt-0 ${
                      loading
                        ? "bg-white/10 text-white/10"
                        : "bg-white/90 text-black"
                    } rounded-full hover:opacity-75`}
                  >
                    MANAGE LOCKS
                  </button>
                  <button
                    disabled={
                      loading ||
                      !signer ||
                      !account ||
                      !userInfoData ||
                      userInfoData?.locks?.length === 0 ||
                      userInfoData?.availablePoints === 0 ||
                      claimPeriodAllowed === false
                    }
                    onClick={onClaimPoints}
                    className={`flex w-full justify-center text-sm p-2 self-center mt-1 md:mt-0 ${
                      loading ||
                      !signer ||
                      !account ||
                      !userInfoData ||
                      userInfoData?.locks.length === 0 ||
                      userInfoData?.availablePoints === 0 ||
                      claimPeriodAllowed === false
                        ? "bg-white/5 text-white/5"
                        : "bg-samurai-red text-white"
                    } rounded-full hover:enabled:bg-opacity-75`}
                  >
                    CLAIM POINTS
                  </button>
                  <button
                    disabled={
                      loading ||
                      !signer ||
                      !userMissingPointsData ||
                      userMissingPointsData?.claimed
                    }
                    onClick={onClaimBoostedPoints}
                    className={`flex w-full justify-center text-sm p-2 self-center mt-1 md:mt-0 ${
                      loading ||
                      !signer ||
                      !userMissingPointsData ||
                      userMissingPointsData?.claimed
                        ? "bg-white/5 text-white/5"
                        : "bg-samurai-red text-white"
                    } rounded-full hover:enabled:bg-opacity-75`}
                  >
                    CLAIM BOOSTED POINTS
                  </button>
                </div>
              )}
          </div>

          <div className="flex items-center pt-4 sm:pt-8 text-sm leading-[20px] relative">
            {signer && (
              <span
                className={`${
                  formattedCountdown === "0" ? "invisible" : "visible"
                } absolute top-[10px] left-2 text-xs  text-white/50`}
              >
                *Remaining time to claim: {formattedCountdown}
              </span>
            )}
          </div>

          <div
            className={`flex flex-col gap-5 shadow-lg ${
              lockData?.isPaused && "opacity-5"
            }`}
          >
            <div className="flex text-black relative border border-transparent">
              <input
                onChange={(e) => onInputLockChange(e.target.value)}
                value={inputLock}
                type="text"
                placeholder="Amount to lock"
                className="w-full border-transparent bg-white py-4 focus:border-transparent focus:ring-transparent placeholder-black/60 text-md md:text-xl rounded-lg mx-1"
              />
              <button
                onClick={onSetMaxForLock}
                className="absolute top-[30px] md:top-[34px] right-[18px] flex items-center justify-center h-4 transition-all bg-black/70 rounded-full px-[11px] text-white hover:bg-samurai-red text-[11px]"
              >
                MAX
              </button>
              <div className="flex absolute top-[14px] md:top-[13px] right-[18px] gap-2">
                <span className="text-sm md:text-[17px] mt-[-4px]">$SAM</span>
              </div>
              {signer && (
                <>
                  <div className="absolute top-[-24px] left-2 text-sm text-end transition-all hover:opacity-75 w-max text-white">
                    <span className="text-white/70">Min. to lock:</span>{" "}
                    {lockData?.minToLock.toLocaleString("en-us", {
                      maximumFractionDigits: 5,
                    })}{" "}
                    $SAM
                  </div>
                  <div className="absolute top-[-24px] right-2 text-sm text-end transition-all hover:opacity-75 w-max text-white">
                    <span className="text-white/70">Balance:</span>{" "}
                    {userInfoData?.balance.toLocaleString("en-us", {
                      maximumFractionDigits: 5,
                    })}{" "}
                    $SAM
                  </div>
                </>
              )}
            </div>
          </div>

          {lockData?.periods && (
            <div
              className={`flex flex-col bg-black/55 backdrop-blur-sm p-6 py-8 mt-4 rounded-lg border border-white/15 shadow-md shadow-black/60 ${
                lockData?.isPaused && "opacity-5"
              }`}
            >
              <div className="flex flex-col gap-2 text-sm">
                <span className="text-white/40">
                  Slide to select lock period
                </span>

                <input
                  type="range"
                  onChange={handleSliderChange}
                  value={Number(period?.value)}
                  min={lockData?.periods[0].value}
                  max={lockData?.periods[lockData?.periods.length - 1].value}
                  className="w-[200px]"
                />

                <span className="text-white text-sm md:text-lg">
                  {period?.value
                    ? lockData?.periods.find(
                        (item: any) => item.value === period?.value
                      ).title
                    : "---"}
                </span>
              </div>

              <div className="flex flex-col text-sm mt-5">
                <span className="text-white/40">Estimated Points</span>
                <div className="flex text-xl gap-2 items-center">
                  {inputLock !== "" && estimatedPoints > 0
                    ? estimatedPoints.toLocaleString("en-us", {
                        maximumFractionDigits: 18,
                      })
                    : "---"}
                </div>
              </div>
            </div>
          )}

          <div className={`w-full mt-4 ${lockData?.isPaused && "opacity-5"}`}>
            <button
              onClick={onLock}
              disabled={
                loading ||
                !signer ||
                lockData === null ||
                lockData?.isPaused ||
                Number(inputLock) === 0 ||
                Number(inputLock) < lockData.minToLock ||
                !userInfoData ||
                userInfoData?.balance === 0
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
                <span>{loading ? "LOADING..." : "LOCK"}</span>
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
                        My $SAM locks
                      </DialogTitle>

                      <div className="flex flex-col justify-center self-end w-full mt-4">
                        {lockData && userInfoData && (
                          <LCarouselV2
                            loading={loading}
                            locks={userInfoData?.locks}
                            periods={lockData?.periods}
                            inputWithdraw={inputWithdraw}
                            setSelectedLockIndex={setSelectedLockIndex}
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
