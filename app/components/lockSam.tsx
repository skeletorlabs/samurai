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
  GeneralLockInfo,
  LockInfo,
  UserInfo,
  downloadPointsFile,
  generalInfo,
  getEstimatedPoints,
  getTotalLocked,
  lock,
  userInfo,
  withdraw,
} from "@/app/contracts_integrations/samLock";
import { StateContext } from "@/app/context/StateContext";
import { Roboto } from "next/font/google";
import LCarousel from "@/app/components/lcarousel";
import { getUnixTime } from "date-fns";
import ConnectButton from "./connectbutton";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "500", "900"],
});

export default function LockSam() {
  const [loading, setLoading] = useState(false);
  const [loadingFile, setLoadingFile] = useState(false);
  const [inputLock, setInputLock] = useState("");
  const [inputWithdraw, setInputWithdraw] = useState("");
  const [period, setPeriod] = useState(0);
  const [withdrawIsOpen, setWithdrawIsOpen] = useState(false);
  const [generalLockData, setGeneralLockData] =
    useState<GeneralLockInfo | null>(null);
  const [userInfoData, setUserInfoData] = useState<UserInfo | null>(null);
  const [estimatedPoints, setEstimatedPoints] = useState(0);
  const [selectedLockIndex, setSelectedLockIndex] = useState(0);
  const [selectedLock, setSelectedLock] = useState<LockInfo | null>(null);
  const [activeLocksList, setActiveLocksList] = useState<LockInfo[] | []>([]);
  const [unlockedsList, setUnlockedsList] = useState<LockInfo[] | []>([]);
  const [canWithdraw, setCanWithdraw] = useState(false);
  const [totalLocked, setTotalLocked] = useState(0);
  const [loadingEvents, setLoadingEvents] = useState(false);

  const { signer, account } = useContext(StateContext);

  const onInputLockChange = (value: string) => {
    const re = new RegExp("^[+]?([0-9]+([.][0-9]*)?|[.][0-9]+)$");

    if (value === "" || re.test(value)) {
      setInputLock(value);
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

  const onSelectLock = useCallback(
    (e: number, type: string) => {
      const userLock =
        type === "unlock" ? unlockedsList[e] : activeLocksList[e];

      setSelectedLockIndex(userLock?.lockIndex);
      setSelectedLock(userLock);
    },
    [unlockedsList, activeLocksList, setSelectedLockIndex]
  );

  useEffect(() => {
    let allowed = false;
    if (userInfoData?.locks.length === 0) allowed = false;

    const userLock = userInfoData?.locks.find(
      (item) => item.lockIndex === selectedLockIndex
    );

    if (userLock) {
      const unlockTime = (userLock.unlockTime as number) * 1000;
      const currentTime = new Date().getTime();

      const remainingAmountToWithdraw =
        userLock.lockedAmount - userLock.withdrawnAmount;

      allowed = currentTime > unlockTime && remainingAmountToWithdraw > 0;
    }

    setCanWithdraw(allowed);
  }, [userInfoData, selectedLockIndex, setCanWithdraw]);

  const onSetMaxForLock = useCallback(() => {
    if (userInfoData) {
      onInputLockChange(userInfoData?.samBalance.toString());
    }
  }, [userInfoData, onInputLockChange]);

  const onSetMaxForWithdraw = useCallback(() => {
    if (userInfoData && userInfoData.locks.length > 0) {
      const userLock = unlockedsList?.find(
        (item) => item.lockIndex === selectedLockIndex
      );

      if (userLock) {
        setInputWithdraw(
          (userLock.lockedAmount - userLock.withdrawnAmount).toString()
        );
      }
    }
  }, [selectedLockIndex, unlockedsList, setInputWithdraw]);

  const onLock = useCallback(async () => {
    setLoading(true);
    if (signer) {
      await lock(signer, inputLock, period);
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

  useEffect(() => {
    const now = getUnixTime(new Date());
    if (userInfoData && generalLockData) {
      const unlockeds = userInfoData.locks
        .filter((item) => now >= item.unlockTime)
        .reverse();

      setUnlockedsList(unlockeds);

      const activeLocks = userInfoData.locks
        .filter((item) => now < item.unlockTime)
        .reverse();

      setActiveLocksList(activeLocks);

      if (unlockeds.length > 0) return onSelectLock(0, "unlock");
      if (activeLocks.length > 0) return onSelectLock(0, "active");
    }
  }, [userInfoData, generalLockData]);

  useEffect(() => {
    const getEstimatedPointsInfo = async () => {
      if (period > 0) {
        const response = await getEstimatedPoints(inputLock, period);
        setEstimatedPoints(response);
      }
    };

    getEstimatedPointsInfo();
  }, [inputLock, period]);

  const onGetUserInfo = useCallback(async () => {
    if (signer) {
      const response = await userInfo(signer);
      setUserInfoData(response as UserInfo);
    }
  }, [signer]);

  useEffect(() => {
    onGetUserInfo();
  }, [signer]);

  useEffect(() => {
    if (generalLockData && generalLockData?.periods.length > 0) {
      setPeriod(generalLockData?.periods[0].value);
    }
  }, [generalLockData]);

  const onDownloadPointsFile = useCallback(async () => {
    setLoadingFile(true);
    console.log("started fetching events");
    const blob = await downloadPointsFile();
    console.log("blob created");
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "points.json"; // Set a descriptive filename
    link.click();

    // Remember to revoke the object URL after download to avoid memory leaks
    URL.revokeObjectURL(url);
    setLoadingFile(false);
  }, []);

  const onReadLogs = useCallback(async () => {
    setLoadingEvents(true);
    const total = await getTotalLocked();
    if (total) setTotalLocked(total);
    setLoadingEvents(false);
  }, [setTotalLocked, setLoadingEvents]);

  const onGetGeneralInfo = useCallback(async () => {
    const response = await generalInfo();
    onInputLockChange(response?.minToLock.toString() || "0");
    setGeneralLockData(response as GeneralLockInfo);
  }, []);

  useEffect(() => {
    onGetGeneralInfo();
    onReadLogs();
  }, []);

  return (
    <div className="flex flex-col lg:flex-row items-center gap-10 mt-14 relative">
      <div className="flex flex-col justify-between w-full lg:w-[580px] lg:bg-white/5 lg:border border-samurai-red/20 rounded-lg lg:py-10 lg:px-6 lg:shadow-lg shadow-pink-800/50 relative">
        <div className="hidden absolute top-10 left-[50px] bg-lock bg-no-repeat bg-cover w-[500px] h-[500px] text-white/40">
          {lockImage}
        </div>

        <div className="flex flex-col">
          <p className="flex justify-center md:justify-start items-center relative gap-2">
            <span>Total Platform Locked</span>
            {signer &&
              account &&
              account.toLowerCase() ===
                "0x4C757cd2b603c6fc01DD8dFa7c9d7888e3C05AcD".toLowerCase() && (
                <button
                  disabled={loadingFile}
                  onClick={onDownloadPointsFile}
                  className={`flex justify-center text-sm py-2 border ${
                    loadingFile
                      ? "border-white/10 text-white/10"
                      : "border-samurai-red text-samurai-red hover:bg-samurai-red hover:text-white"
                  } rounded-full min-w-[150px] `}
                >
                  {loadingFile
                    ? "Take a seat and wait..."
                    : "Download Points File"}
                </button>
              )}
          </p>
          <div className="text-sm md:text-lg text-center md:text-start">
            {loadingEvents ? (
              <span className="text-samurai-red pl-1">loading Logs...</span>
            ) : (
              <p>
                {totalLocked.toLocaleString("en-us", {
                  maximumFractionDigits: 18,
                })}
                <span className="text-samurai-red pl-1">$SAM</span>
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center rounded-lg w-full bg-black/75 backdrop-blur-sm p-6 py-8 text-sm leading-[20px] border border-white/20 lg:mt-8 shadow-md shadow-black/60 z-20 mt-5">
          {signer ? (
            <div className="flex flex-col rounded-lg w-full gap-3">
              <div>
                <p className="text-white/40">Samurai Points</p>
                <span className="text-samurai-red text-xl">
                  {userInfoData?.totalPoints.toLocaleString("en-us") || 0}
                </span>
              </div>

              <div>
                <p className="text-white/40">My TVL</p>
                <p className="text-lg">
                  {(userInfoData?.totalLocked || 0).toLocaleString("en-us", {
                    minimumFractionDigits: 2,
                  })}{" "}
                  $SAM
                </p>
              </div>
            </div>
          ) : (
            <ConnectButton />
          )}

          {signer && userInfoData && userInfoData?.locks.length > 0 && (
            <button
              disabled={loading}
              onClick={() => {
                setWithdrawIsOpen(true);
                onGetUserInfo();
              }}
              className={`flex justify-center text-sm py-2 border ${
                loading
                  ? "border-white/10 text-white/10"
                  : "border-samurai-red text-samurai-red"
              } rounded-full min-w-[150px] hover:bg-samurai-red hover:text-white`}
            >
              MANAGE LOCKS
            </button>
          )}
        </div>

        <div className="flex flex-col bg-black/75 backdrop-blur-sm p-6 py-8 rounded-lg border border-white/20 shadow-md shadow-black/60 mt-2 z-20">
          <div className="flex flex-col text-sm">
            <span className="text-white/40">Minimum to lock</span>
            <span className="text-xl">
              {generalLockData?.minToLock.toLocaleString("en-us")} $SAM
            </span>
          </div>

          <div className="flex flex-col gap-2 text-sm mt-5">
            <span className="text-white/40">Select Period</span>
            <div className="flex gap-4 items-center flex-wrap">
              {generalLockData?.periods.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setPeriod(item.value)}
                  className={`text-sm p-1 px-3 rounded-lg border shadow-lg min-w-[90px] transition-all hover:scale-105 ${
                    item.value === period
                      ? "bg-samurai-red border-white/50"
                      : "bg-white/20 border-white/20"
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
              {estimatedPoints.toLocaleString("en-us")}{" "}
              <Tooltip
                style="dark"
                content={
                  <div className="font-medium text-[14px] flex-wrap max-w-[220px]">
                    Points distributed linearly during{" "}
                    {
                      generalLockData?.periods.find(
                        (item) => Number(item.value) === Number(period)
                      )?.title
                    }{" "}
                    locked.
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

        <div className="flex flex-col gap-5 shadow-lg mt-12 z-20">
          <div className="flex text-black relative border border-transparent">
            <input
              onChange={(e) => onInputLockChange(e.target.value)}
              value={inputLock}
              type="text"
              placeholder="Amount to lock"
              className="w-full border-transparent bg-white py-4 focus:border-transparent focus:ring-transparent placeholder-black/60 text-xl rounded-lg mx-1"
            />
            <button
              onClick={onSetMaxForLock}
              className="absolute top-[34px] right-[11px] flex items-center justify-center h-4 transition-all bg-black/70 rounded-full px-[11px] text-white hover:bg-samurai-red text-[11px] z-20"
            >
              MAX
            </button>
            <div className="flex absolute top-[10px] right-[12px] gap-2">
              <div className="flex p-1 bg-black rounded-full">
                <Image
                  src="/samurai.svg"
                  width={34}
                  height={34}
                  alt=""
                  className="rounded-full p-[5px] bg-black border border-red-600"
                />
              </div>
              <span className="text-[17px] mt-[-4px]">$SAM</span>
            </div>
            {signer && (
              <div className="absolute top-[-24px] right-2 text-sm text-end transition-all hover:opacity-75 w-max text-white">
                <span className="text-white/70">Balance:</span>{" "}
                {Number(userInfoData?.samBalance || 0).toLocaleString("en-us", {
                  maximumFractionDigits: 2,
                })}
              </div>
            )}
          </div>
          <div className="w-full">
            <SSButton
              flexSize
              click={onLock}
              disabled={
                loading ||
                !signer ||
                generalLockData === null ||
                generalLockData?.isPaused ||
                Number(inputLock) < generalLockData?.minToLock ||
                !userInfoData ||
                userInfoData?.samBalance < generalLockData?.minToLock
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
                <span>{loading ? "LOADING..." : "LOCK"}</span>
              </div>
            </SSButton>
          </div>
        </div>

        {/* WITHDRAW MODAL */}
        <Transition appear show={withdrawIsOpen} as={Fragment}>
          <Dialog
            as="div"
            className={`relative z-20 ${roboto.className}`}
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
                      My <span className="text-samurai-red">$SAM</span> Locks
                    </DialogTitle>

                    <div className="flex flex-col justify-center self-end w-full mt-4">
                      <TabGroup>
                        <TabList>
                          <Tab
                            onClick={() => onSelectLock(0, "unlock")}
                            disabled={unlockedsList.length === 0}
                            className="ui-selected:bg-samurai-red ui-selected:text-white ui-not-selected:bg-black/20 ui-not-selected:text-white/30 p-2 rounded-l-lg w-[80px] text-[12px] shadow-inner shadow-black/30"
                          >
                            Unlocked
                          </Tab>
                          <Tab
                            onClick={() => onSelectLock(0, "active")}
                            disabled={activeLocksList.length === 0}
                            className="ui-selected:bg-samurai-red ui-selected:text-white ui-not-selected:bg-black/20 ui-not-selected:text-white/30 p-2 rounded-r-lg w-[80px] text-[12px] shadow-inner shadow-black/30"
                          >
                            Active
                          </Tab>
                        </TabList>
                        <TabPanels>
                          <TabPanel>
                            {unlockedsList.length > 0 && generalLockData && (
                              <LCarousel
                                type="unlock"
                                locks={unlockedsList}
                                periods={generalLockData?.periods}
                                onChangeAction={onSelectLock}
                              />
                            )}
                          </TabPanel>
                          <TabPanel>
                            {activeLocksList.length > 0 && generalLockData && (
                              <LCarousel
                                type="active"
                                locks={activeLocksList}
                                periods={generalLockData?.periods}
                                onChangeAction={onSelectLock}
                              />
                            )}
                          </TabPanel>
                        </TabPanels>
                      </TabGroup>
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
                            className="absolute top-[34px] right-[11px] transition-all bg-black/70 rounded-full px-[11px] text-white hover:bg-samurai-red text-[11px] z-20"
                          >
                            MAX
                          </button>
                          <div className="flex absolute top-[10px] right-[12px] gap-2">
                            <div className="flex  p-1 bg-black rounded-full">
                              <Image
                                src="/samurai.svg"
                                width={34}
                                height={34}
                                alt=""
                                className="rounded-full p-[5px] bg-black border border-red-600"
                              />
                            </div>
                            <span className="text-[17px]">$SAM</span>
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
                        {selectedLock &&
                        selectedLock.lockedAmount -
                          selectedLock.withdrawnAmount ===
                          0
                          ? "You already withdrawn the amount locked"
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
  );
}
