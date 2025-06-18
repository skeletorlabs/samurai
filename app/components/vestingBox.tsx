import { Inter } from "next/font/google";
import { VestingType } from "../utils/constants";
import { useCallback, useContext, useEffect, useState } from "react";
import { formattedDate5 } from "../utils/formattedDate";
import { getUnixTime } from "date-fns";
import {
  askForRefund,
  claimPoints,
  claimTokens,
  fillIDOToken,
  generalInfo,
  isWalletEnableToFill,
  togglePause,
  userInfo,
  VESTING_GENERAL_INFO,
} from "../contracts_integrations/vesting";
import { IDO_v3 } from "../utils/interfaces";
import { StateContext } from "../context/StateContext";
import { Tooltip } from "flowbite-react";
import { HiOutlineInformationCircle } from "react-icons/hi2";
import { VESTING_ABI_V4 } from "../contracts_integrations/abis";

const inter = Inter({
  subsets: ["latin"],
});

interface VestingBox {
  ido: IDO_v3;
  idoIndex: number;
  setLoading: any;
  allocation?: number;
}

export default function VestingBox({ ido, idoIndex, setLoading }: VestingBox) {
  const now = getUnixTime(new Date());

  const [general, setGeneral] = useState<VESTING_GENERAL_INFO | null>(null);
  const [user, setUser] = useState<any>(null);
  const [walletEnabledToFill, setWalletEnabledToFill] = useState(false);
  const { signer, account, chain } = useContext(StateContext);

  const onCheckWalletEnabledToFill = useCallback(async () => {
    setLoading(true);
    if (account && signer) {
      const enabled = await isWalletEnableToFill(signer);

      setWalletEnabledToFill(enabled);
    }

    setLoading(false);
  }, [signer, account, setLoading, setWalletEnabledToFill]);

  const onGetRefund = useCallback(async () => {
    setLoading(true);
    if (signer) {
      await askForRefund(idoIndex, signer);
    }

    setLoading(false);
  }, [signer, idoIndex, setLoading]);

  const onFill = useCallback(async () => {
    setLoading(true);
    if (signer) {
      await fillIDOToken(idoIndex, signer);
    }

    setLoading(false);
  }, [signer, idoIndex, setLoading]);

  const onTogglePause = useCallback(async () => {
    setLoading(true);
    if (signer) {
      await togglePause(idoIndex, signer);
      await getGeneralData();
      await getUserInfos();
    }

    setLoading(false);
  }, [signer, idoIndex, setLoading]);

  const onClaim = useCallback(async () => {
    setLoading(true);
    if (signer) {
      await claimTokens(idoIndex, signer);
      await getGeneralData();
      await getUserInfos();
    }

    setLoading(false);
  }, [signer, idoIndex, setLoading]);

  const onClaimPoints = useCallback(async () => {
    setLoading(true);
    if (signer) {
      await claimPoints(idoIndex, signer);
      await getGeneralData();
      await getUserInfos();
    }

    setLoading(false);
  }, [signer, idoIndex, setLoading]);

  const getUserInfos = useCallback(async () => {
    setLoading(true);
    if (signer) {
      const response = await userInfo(idoIndex, signer);
      setUser(response);
    }
    setLoading(false);
  }, [signer, idoIndex, setLoading]);

  const getGeneralData = useCallback(async () => {
    setLoading(true);

    const response = await generalInfo(idoIndex);
    setGeneral(response as VESTING_GENERAL_INFO);

    setLoading(false);
  }, [idoIndex, setLoading]);

  useEffect(() => {
    if (signer && general) {
      getUserInfos();
      onCheckWalletEnabledToFill();
    }
  }, [signer, general]);

  useEffect(() => {
    getGeneralData();
  }, [idoIndex]);

  return (
    <div className="flex items-start min-h-[60px] relative text-white/70 p-2">
      {general && (
        <div className="flex flex-col justify-between w-full h-full">
          <div className="flex items-end justify-between border-b border-samurai-red pb-3 flex-wrap">
            <span>Distribution</span>
            <div className="flex justify-between flex-wrap gap-3">
              {/* {account === general.owner && (
                <button
                  onClick={onFill}
                  className="text-md py-1 px-4 bg-black border border-samurai-red text-samurai-red disabled:text-white/20 disabled:border-white/20 hover:enabled:text-white hover:enabled:bg-samurai-red w-max rounded-full"
                >
                  SEND {ido.projectTokenSymbol} TO CONTRACT
                </button>
              )} */}
              {/* {account === general.owner && (
                <button
                  onClick={onTogglePause}
                  className="text-md py-1 px-4 bg-black border border-samurai-red text-samurai-red disabled:text-white/20 disabled:border-white/20 hover:enabled:text-white hover:enabled:bg-samurai-red w-max rounded-full"
                >
                  {general.paused ? "Unpause" : "Pause"}
                </button>
              )} */}
            </div>
          </div>

          <div className="flex justify-between lg:items-center gap-y-5 bg-white/5 rounded-md text-sm px-6 py-4 lg:px-2 lg:py-2 flex-wrap mt-2">
            <div className="flex flex-col w-[200px] ">
              <p className={`${inter.className}`}>Network</p>
              <p className="text-samurai-red w-max font-bold">
                {ido.vestingChain?.name.toUpperCase()}
              </p>
            </div>
            <div className="flex flex-col w-[200px] ">
              <p className={`${inter.className}`}>TGE Date</p>
              <p className="text-samurai-red w-max font-bold">
                {formattedDate5(general?.periods.vestingAt)}
              </p>
            </div>

            <div className="flex flex-col w-[200px] ">
              <p className={`${inter.className}`}>TGE Unlock</p>
              <p className="text-samurai-red w-max font-bold">
                {general?.tgeReleasePercent * 100}%
              </p>
            </div>

            {VestingType[general.vestingType] !== VestingType[0] && (
              <>
                <div className="flex flex-col w-[200px] ">
                  <p className={`${inter.className}`}>Cliff Duration</p>
                  <p className="text-samurai-red w-max font-bold">
                    {general?.periods.cliff} month(s)
                  </p>
                </div>

                <div className="flex flex-col w-[200px] ">
                  <p className={`${inter.className}`}>Vesting Length</p>
                  <p className="text-samurai-red w-max font-bold">
                    {(
                      (general?.periods.vestingEndsAt -
                        general?.periods.cliffEndsAt) /
                      2_629_746
                    ).toFixed()}{" "}
                    month(s)
                  </p>
                </div>

                <div className="flex flex-col w-[200px] ">
                  <p className={`${inter.className}`}>Vesting Type</p>
                  {general?.vestingPeriod ? (
                    <p className="text-samurai-red w-max font-bold">
                      {VestingType[general?.vestingType]} -{" "}
                      {general?.vestingPeriod}
                    </p>
                  ) : (
                    <p className="text-samurai-red w-max font-bold">
                      {VestingType[general?.vestingType] === "Periodic"
                        ? "Periodic - Monthly"
                        : VestingType[general?.vestingType]}
                    </p>
                  )}
                </div>

                <div className="flex flex-col w-[200px] ">
                  <p className={`${inter.className}`}>Vesting Start</p>
                  <p className="text-samurai-red w-max font-bold">
                    {formattedDate5(general?.periods.cliffEndsAt)}
                  </p>
                </div>

                <div className="flex flex-col w-[200px] lg:ml-[8px] lg:flex-1">
                  <p className={`${inter.className}`}>Vesting End</p>
                  <p className="text-samurai-red w-max font-bold">
                    {formattedDate5(general?.periods.vestingEndsAt)}
                  </p>
                </div>

                {general?.periods.nextUnlock > 0 && (
                  <div className="flex flex-col w-[200px] lg:ml-[8px] lg:flex-1">
                    <p className={`${inter.className}`}>Next Unlock</p>
                    <p className="text-samurai-red w-max font-bold">
                      {/* Feb 03, 2025, 15:00 UTC */}
                      {formattedDate5(general?.periods.nextUnlock)}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {user && user?.purchased > 0 && (
            <div className="flex flex-col gap-2 mt-10">
              <div className="flex items-end justify-between border-b border-samurai-red pb-3 flex-wrap">
                <span>Project Tokens</span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={onClaim}
                    disabled={
                      now < general.periods.vestingAt ||
                      !user ||
                      user?.claimableTokens === 0 ||
                      user?.askedRefund
                    }
                    className="text-sm lg:text-md py-1 px-4 bg-black border border-samurai-red text-samurai-red disabled:text-white/20 disabled:border-white/20 hover:enabled:text-white hover:enabled:bg-samurai-red w-max rounded-full"
                  >
                    CLAIM
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      disabled={
                        !user ||
                        user?.askedRefund ||
                        user?.claimedTGE ||
                        now < general.periods.vestingAt
                      }
                      onClick={onGetRefund}
                      className="flex items-center gap-1 text-sm lg:text-md py-1 px-4 bg-black border border-gray-400 text-gray-400 disabled:text-white/20 disabled:border-white/20 hover:enabled:bg-gray-800 w-max rounded-full"
                    >
                      <span>ASK FOR REFUND</span>
                      <Tooltip
                        content={
                          <div className="text-[11px] leading-relaxed text-white/70 py-2 w-max">
                            <h1 className="text-yellow-300 text-sm">
                              IMPORTANT:
                            </h1>

                            <p>** Refunds are not allowed after claiming TGE</p>
                            <p>
                              *** Refunds are not allowed after claiming Samurai
                              Points
                            </p>
                          </div>
                        }
                        style="dark"
                      >
                        <HiOutlineInformationCircle color="red" />
                      </Tooltip>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-5 bg-white/5 rounded-md text-sm px-6 py-4 lg:px-2 lg:py-2 flex-wrap">
                <div className="flex flex-col">
                  <p className={`${inter.className}`}>Ticker</p>
                  <p className="text-samurai-red w-max font-bold">
                    {ido?.projectTokenSymbol}
                  </p>
                </div>
                <div className="flex flex-col">
                  <p className={`${inter.className}`}>My allocation</p>
                  <p className="text-samurai-red w-max font-bold">
                    {(user?.purchased * ido.price).toLocaleString("en-us")}{" "}
                    $USDC
                  </p>
                </div>
                <div className="flex flex-col">
                  <p className={`${inter.className}`}>Tokens Purchased</p>
                  <p className="text-samurai-red w-max font-bold">
                    {user?.purchased?.toLocaleString("en-us")}
                  </p>
                </div>

                <div className="flex flex-col">
                  <p className={`${inter.className}`}>Claimed Tokens</p>
                  <p className="text-samurai-red w-max font-bold">
                    {user?.claimedTokens.toLocaleString("en-us")}
                  </p>
                </div>

                <div className="flex flex-col">
                  <p className={`${inter.className}`}>Claimable Tokens</p>
                  <p className="text-samurai-red w-max font-bold">
                    {user?.claimableTokens.toLocaleString("en-us")}
                  </p>
                </div>
              </div>
            </div>
          )}

          {ido.vestingABI !== VESTING_ABI_V4 && user && user?.purchased > 0 && (
            <div className="flex items-end justify-between border-b border-samurai-red pb-3 flex-wrap mt-10">
              <span>Samurai Points</span>
              <button
                onClick={onClaimPoints}
                disabled={
                  now < general.periods.vestingAt ||
                  !user ||
                  user?.askedRefund ||
                  user?.claimablePoints === 0
                }
                className="text-sm lg:text-md py-1 px-4 bg-black border border-samurai-red text-samurai-red disabled:text-white/20 disabled:border-white/20 hover:enabled:text-white hover:enabled:bg-samurai-red w-max rounded-full"
              >
                CLAIM
              </button>
            </div>
          )}

          {ido.vestingABI !== VESTING_ABI_V4 && user && user?.purchased > 0 && (
            <div className="flex flex-col lg:flex-row lg:items-center gap-5 gap-x-14 bg-white/5 rounded-md text-sm px-6 py-4 lg:px-2 lg:py-2 flex-wrap mt-2">
              <div className="flex flex-col">
                <p className={`${inter.className}`}>Points Earned</p>
                <p className="text-samurai-red w-max font-bold">
                  {(user?.claimedPoints + user?.claimablePoints).toLocaleString(
                    "en-us"
                  )}
                </p>
              </div>
              <div className="flex flex-col">
                <p className={`${inter.className}`}>Claimed Points</p>
                <p className="text-samurai-red w-max font-bold">
                  {user?.claimedPoints.toLocaleString("en-us")}
                </p>
              </div>
              <div className="flex flex-col">
                <p className={`${inter.className}`}>Claimable Points</p>
                <p className="text-samurai-red w-max font-bold">
                  {user?.claimablePoints.toLocaleString("en-us")}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
