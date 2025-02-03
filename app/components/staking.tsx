import Image from "next/image";
import { useCallback, useEffect, useState, Fragment, useContext } from "react";
import { lockImage } from "@/app/utils/svgs";
import SSButton from "@/app/components/ssButton";
import {
  Dialog,
  Transition,
  Tab,
  DialogPanel,
  TabList,
  TabGroup,
  TabPanels,
  TabPanel,
  TransitionChild,
  DialogTitle,
} from "@headlessui/react";
import { Tooltip } from "flowbite-react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader

import {
  StakingInfo,
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
import {
  formatDistance,
  formatDistanceToNow,
  fromUnixTime,
  getUnixTime,
  set,
} from "date-fns";
import ConnectButton from "./connectbutton";
import { user } from "../contracts_integrations/idoFull";
import LoadingBox from "./loadingBox";
import {
  convertDateToUnixTimestamp,
  formattedDate,
  formattedDate3,
} from "../utils/formattedDate";
import { countdown } from "../utils/countdown";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "500", "900"],
});

export default function Staking() {
  const [loading, setLoading] = useState(false);
  const [loadingFile, setLoadingFile] = useState(false);
  const [inputStake, setInputStake] = useState("0");
  const [inputWithdraw, setInputWithdraw] = useState("");
  const [period, setPeriod] = useState(0);
  const [withdrawIsOpen, setWithdrawIsOpen] = useState(false);
  const [stakingData, setStakingData] = useState<any | null>(null);
  const [userInfoData, setUserInfoData] = useState<UserInfo | null>(null);
  const [estimatedPoints, setEstimatedPoints] = useState(0);
  const [selectedStakeIndex, setSelectedStakeIndex] = useState(0);
  const [selectedStake, setSelectedStake] = useState<StakingInfo | null>(null);
  const [activeStakeList, setActiveStakeList] = useState<StakingInfo[] | []>(
    []
  );
  const [unlockedsList, setUnlockedsList] = useState<StakingInfo[] | []>([]);
  const [canWithdraw, setCanWithdraw] = useState(false);
  const [lastClaim, setLastClaim] = useState(0);
  const [formattedCountdown, setFormattedCountdown] = useState("");

  const { signer, account } = useContext(StateContext);

  const onInputStakeChange = (value: string) => {
    const re = new RegExp("^[+]?([0-9]+([.][0-9]*)?|[.][0-9]+)$");

    if (value === "" || re.test(value)) {
      setInputStake(value);
    }

    return false;
  };

  const onInputWithdrawChange = (value: string) => {
    const re = new RegExp("^[+]?([0-9]+([.][0-9]*)?|[.][0-9]+)$");

    if (value === "" || re.test(value)) {
      setInputWithdraw(value);
    }

    return false;
  };

  const onSelectStake = useCallback(
    (e: number, type: string) => {
      const userStake =
        type === "unlock" ? unlockedsList[e] : activeStakeList[e];

      setSelectedStakeIndex(userInfoData?.stakings.indexOf(userStake) || 0);
      setSelectedStake(userStake);
    },
    [unlockedsList, activeStakeList, setSelectedStakeIndex, setSelectedStake]
  );

  useEffect(() => {
    let allowed = false;
    if (userInfoData?.stakings.length === 0) allowed = false;

    const userStake = userInfoData?.stakings[selectedStakeIndex];

    if (userStake) {
      const unlockTime = (userStake.withdrawTime as number) * 1000;
      const currentTime = new Date().getTime();

      const remainingAmountToWithdraw =
        userStake.stakedAmount - userStake.withdrawnAmount;

      allowed = currentTime > unlockTime && remainingAmountToWithdraw > 0;
    }

    setCanWithdraw(allowed);
  }, [userInfoData, selectedStakeIndex, setCanWithdraw]);

  const onSetMaxForStake = useCallback(() => {
    if (userInfoData) {
      onInputStakeChange(userInfoData?.lpBalance.toString());
    }
  }, [userInfoData, onInputStakeChange]);

  const onSetMaxForWithdraw = useCallback(() => {
    if (userInfoData && userInfoData.stakings.length > 0) {
      const userStake = userInfoData.stakings[selectedStakeIndex];

      if (userStake) {
        setInputWithdraw(
          (userStake.stakedAmount - userStake.withdrawnAmount).toString()
        );
      }
    }
  }, [selectedStakeIndex, unlockedsList, setInputWithdraw]);

  const onStake = useCallback(async () => {
    setLoading(true);
    if (signer) {
      await stake(signer, inputStake, period);
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

      setLastClaim(getUnixTime(new Date()));
    }
    setLoading(false);
  }, [signer, setLoading, setLastClaim]);

  const onClaimRewards = useCallback(async () => {
    setLoading(true);
    if (signer) {
      await claimRewards(signer);
      await onGetGeneralInfo();
      await onGetUserInfo();

      setLastClaim(getUnixTime(new Date()));
    }
    setLoading(false);
  }, [signer, setLoading, setLastClaim]);

  const checkCountdown = useCallback(async () => {
    if (stakingData?.claimDelayPeriod) {
      // const lastClaim = get it from contract
      // const end = lastClaim + stakingData?.claimDelayPeriod;
      const nextClaim = 1738355400; // UTC
      setFormattedCountdown(
        formatDistanceToNow(fromUnixTime(nextClaim), {
          includeSeconds: true,
        })
      );

      const timestamp = setInterval(async () => {
        setFormattedCountdown(
          formatDistanceToNow(fromUnixTime(nextClaim), {
            includeSeconds: true,
          })
        );

        if (nextClaim <= convertDateToUnixTimestamp(new Date())) {
          clearInterval(timestamp);

          return setFormattedCountdown("0");
        }
      }, 60000);
    }
  }, [stakingData, lastClaim, setFormattedCountdown]);

  useEffect(() => {
    if (lastClaim > 0) {
      localStorage.setItem("lastClaim", lastClaim.toString());
    }

    checkCountdown();
  }, [stakingData, lastClaim]);

  useEffect(() => {
    const getEstimatedPointsInfo = async () => {
      if (period > 0) {
        const response = await getEstimatedPoints(inputStake, period);
        setEstimatedPoints(response);
      }
    };

    getEstimatedPointsInfo();
  }, [inputStake, period]);

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
      setPeriod(response?.periods[0].value);
    }
    setLoading(false);
  }, [setLoading]);

  useEffect(() => {
    setLoading(true);
    onGetGeneralInfo();

    const lastClaim = localStorage.getItem("lastClaim");
    if (lastClaim) {
      setLastClaim(Number(lastClaim));
    }
  }, [setLoading]);

  return (
    <>
      <div className="flex flex-col lg:flex-row items-center gap-10 mt-14 relative">
        <div className="flex flex-col justify-between w-full lg:w-[580px] lg:bg-white/5 lg:border border-samurai-red rounded-lg lg:py-10 lg:px-6 lg:shadow-lg shadow-pink-800/50 relative">
          {/* <div className="hidden absolute top-10 left-[50px] bg-lock bg-no-repeat bg-cover w-[500px] h-[500px] text-white/40">
          {lockImage}
        </div> */}

          <div className="flex flex-col pl-1 text-lg text-white/70">
            Platform TVL
            <div className="text-sm md:text-xl text-center md:text-start text-white">
              {stakingData?.totalStaked.toLocaleString("en-us")}{" "}
              <span className="pl-1">vAMM-WETH/SAM</span>
            </div>
          </div>

          <div className="flex items-center rounded-lg w-full bg-black/75 backdrop-blur-sm p-6 py-8 text-sm leading-[20px] border border-white/20 shadow-md shadow-black/60  mt-5">
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
                    : "bg-white/30 text-white"
                } rounded-full hover:bg-white/40`}
              >
                MANAGE STAKES
              </button>
            )}
          </div>

          {signer && userInfoData && userInfoData?.stakings.length > 0 && (
            <div className="flex items-center py-8 text-sm leading-[20px] ">
              <div className="flex flex-col rounded-lg w-full gap-3">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col gap-1 bg-black rounded-lg p-6 w-full justify-center items-center bg-black/75 backdrop-blur-sm text-sm leading-[20px] border border-white/20">
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
                      disabled={loading || userInfoData?.availablePoints === 0}
                      onClick={onClaimPoints}
                      className={`flex w-full justify-center text-sm p-2 self-center ${
                        loading || userInfoData?.availablePoints === 0
                          ? "bg-white/10 text-white/10"
                          : "bg-samurai-red text-white"
                      } rounded-full hover:bg-opacity-75`}
                    >
                      CLAIM
                    </button>
                  </div>
                  <div className="flex flex-col gap-1 bg-black rounded-lg p-6 w-full justify-center items-center bg-black/75 backdrop-blur-sm text-sm leading-[20px] border border-white/20">
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
                      disabled={loading}
                      onClick={onClaimRewards}
                      className={`flex w-full justify-center text-sm p-2 self-center ${
                        loading
                          ? "bg-white/10 text-white/10"
                          : "bg-blue-700 text-white"
                      } rounded-full hover:bg-blue-500 hover:text-white`}
                    >
                      CLAIM
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* {lastClaim > 0 && <span>Last claim: {formattedDate(lastClaim)}</span>} */}
          {lastClaim > 0 && (
            <span className="text-xs mt-[-25px] ml-2 mb-4 text-white/50">
              *Remaining time to claim: {formattedCountdown}
            </span>
          )}

          <div className="flex flex-col bg-black/75 backdrop-blur-sm p-6 py-8 rounded-lg border border-white/20 shadow-md shadow-black/60 mt-2 ">
            <div className="flex flex-col gap-2 text-sm">
              <span className="text-white/40">Select Period</span>
              <div className="flex gap-4 items-center flex-wrap">
                {stakingData?.periods.map((item: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => setPeriod(item.value)}
                    className={`text-sm p-1 px-3 min-w-[90px] shadow-black/50 shadow-inner transition-all hover:opacity-75 ${
                      item.value === period ? "bg-samurai-red" : "bg-white/20"
                    }`}
                  >
                    {item.title}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1 text-sm mt-7">
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
            <div className="w-full">
              <SSButton
                flexSize
                click={onStake}
                disabled={
                  loading ||
                  !signer ||
                  stakingData === null ||
                  stakingData?.isPaused ||
                  Number(inputStake) === 0 ||
                  !userInfoData ||
                  userInfoData?.lpBalance === 0
                }
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
              </SSButton>
            </div>
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
                    <DialogPanel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white/10 p-6 text-left align-middle transition-all border border-white/20 text-white shadow-lg shadow-samurai-red/20">
                      <DialogTitle
                        as="h3"
                        className="text-lg font-medium leading-6 text-white ml-1"
                      >
                        My vAMM-WETH/SAM stakes
                      </DialogTitle>

                      <div className="flex flex-col justify-center self-end w-full mt-4">
                        {stakingData && userInfoData && (
                          <SCarousel
                            type="active"
                            stakes={userInfoData?.stakings}
                            periods={stakingData?.periods}
                            onChangeAction={onSelectStake}
                          />
                        )}

                        {/* <TabGroup>
                        <TabList>
                          <Tab
                            onClick={() => onSelectStake(0, "unlock")}
                            disabled={unlockedsList.length === 0}
                            className="ui-selected:bg-samurai-red ui-selected:text-white ui-not-selected:bg-black/20 ui-not-selected:text-white/30 p-2 rounded-l-lg w-[80px] text-[12px] shadow-inner shadow-black/30"
                          >
                            Staked
                          </Tab>
                          <Tab
                            onClick={() => onSelectStake(0, "active")}
                            disabled={activeStakeList.length === 0}
                            className="ui-selected:bg-samurai-red ui-selected:text-white ui-not-selected:bg-black/20 ui-not-selected:text-white/30 p-2 rounded-r-lg w-[80px] text-[12px] shadow-inner shadow-black/30"
                          >
                            Active
                          </Tab>
                        </TabList>
                        <TabPanels>
                          <TabPanel>
                            {unlockedsList.length > 0 && stakingData && (
                              <SCarousel
                                type="unlock"
                                locks={unlockedsList}
                                periods={generalLockData?.periods}
                                onChangeAction={onSelectLock}
                              />
                            )}
                          </TabPanel>
                          <TabPanel>
                            {activeLocksList.length > 0 && generalLockData && (
                              <SCarousel
                                type="active"
                                locks={activeLocksList}
                                periods={generalLockData?.periods}
                                onChangeAction={onSelectLock}
                              />
                            )}
                          </TabPanel>
                        </TabPanels>
                      </TabGroup> */}
                      </div>
                      {canWithdraw ? (
                        <div>
                          <div className="flex items-center rounded-lg gap-3 bg-white/90 shadow-md shadow-black/60 text-black font-normal relative">
                            <input
                              onChange={(e) =>
                                onInputWithdrawChange(e.target.value)
                              }
                              value={inputWithdraw}
                              type="text"
                              placeholder="Amount to withdraw"
                              className="w-full border-transparent bg-white py-4 focus:border-transparent focus:ring-transparent placeholder-black/60 text-xl rounded-lg mx-1"
                            />
                            <button
                              onClick={onSetMaxForWithdraw}
                              className="absolute top-[34px] right-[11px] transition-all bg-black/70 rounded-full px-[11px] text-white hover:bg-samurai-red text-[11px] "
                            >
                              MAX
                            </button>
                            <div className="flex absolute top-[10px] right-[12px] gap-2">
                              <span className="text-[17px]">vAMM-WETH/SAM</span>
                            </div>
                          </div>

                          <div className="mt-4">
                            <SSButton
                              flexSize
                              click={onWithdraw}
                              disabled={loading || Number(inputWithdraw) === 0}
                            >
                              {loading ? "Loading..." : "WITHDRAW"}
                            </SSButton>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center font-normal w-full h-[132px]">
                          {selectedStake &&
                          selectedStake.stakedAmount -
                            selectedStake.withdrawnAmount ===
                            0
                            ? "You already withdrawn the amount staked"
                            : "Not available to withdraw"}
                        </div>
                      )}
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

// useEffect(() => {
//   const now = getUnixTime(new Date());
//   if (userInfoData && stakingData) {
//     const unlockeds = userInfoData.stakings
//       .filter((item) => now >= item.withdrawTime)
//       .reverse();

//     setUnlockedsList(unlockeds);

//     const activeLocks = userInfoData.locks
//       .filter((item) => now < item.unlockTime)
//       .reverse();

//     setActiveLocksList(activeLocks);

//     if (unlockeds.length > 0) return onSelectLock(0, "unlock");
//     if (activeLocks.length > 0) return onSelectLock(0, "active");
//   }
// }, [userInfoData, generalLockData]);
