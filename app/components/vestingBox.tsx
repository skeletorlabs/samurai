import { Inter } from "next/font/google";
import { VestingType } from "../utils/constants";
import { useCallback, useContext, useEffect, useState } from "react";
import { formattedDate5 } from "../utils/formattedDate";
import { getUnixTime } from "date-fns";
import {
  claimPoints,
  claimTokens,
  fillIDOToken,
  generalInfo,
  userInfo,
  VESTING_GENERAL_INFO,
} from "../contracts_integrations/vesting";
import { IDO_v3 } from "../utils/interfaces";
import { StateContext } from "../context/StateContext";
import { Tooltip } from "flowbite-react";
import { HiOutlineInformationCircle } from "react-icons/hi2";

const inter = Inter({
  subsets: ["latin"],
});

interface VestingBox {
  ido: IDO_v3;
  idoIndex: number;
  loading: boolean;
  setLoading: any;
  allocation?: number;
}

export default function VestingBox({
  ido,
  idoIndex,
  loading,
  setLoading,
  allocation,
}: VestingBox) {
  const now = getUnixTime(new Date());

  const [general, setGeneral] = useState<VESTING_GENERAL_INFO | null>(null);
  const [user, setUser] = useState<any>(null);
  const { signer, account, chain } = useContext(StateContext);

  const onFill = useCallback(async () => {
    setLoading(true);
    if (signer) {
      await fillIDOToken(idoIndex, signer);
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
    if (signer && general) {
      const response = await userInfo(idoIndex, signer);
      setUser(response);
    }
    setLoading(false);
  }, [signer, idoIndex, general, setLoading]);

  const getGeneralData = useCallback(async () => {
    setLoading(true);

    const response = await generalInfo(idoIndex);
    setGeneral(response as VESTING_GENERAL_INFO);

    setLoading(false);
  }, [idoIndex, setLoading]);

  useEffect(() => {
    if (signer && general) getUserInfos();
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
          </div>

          <div className="flex justify-between items-center gap-y-5 bg-white/5 rounded-md text-sm px-6 py-4 lg:px-2 lg:py-2 flex-wrap text-center lg:text-start mt-2">
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

            <div className="flex flex-col w-[200px] ">
              <p className={`${inter.className}`}>Cliff Duration</p>
              <p className="text-samurai-red w-max font-bold">
                {general?.periods.cliff} month(s)
              </p>
            </div>

            <div className="flex flex-col w-[200px] ">
              <p className={`${inter.className}`}>Vesting Length</p>
              <p className="text-samurai-red w-max font-bold">
                {(general?.periods.vestingEndsAt - general?.periods.vestingAt) /
                  86400}{" "}
                days
              </p>
            </div>

            <div className="flex flex-col w-[200px] ">
              <p className={`${inter.className}`}>Vesting Start</p>
              <p className="text-samurai-red w-max font-bold">
                {formattedDate5(general?.periods.vestingAt)}
              </p>
            </div>

            <div className="flex flex-col w-[200px] ">
              <p className={`${inter.className}`}>Vesting End</p>
              <p className="text-samurai-red w-max font-bold">
                {formattedDate5(general?.periods.vestingEndsAt)}
              </p>
            </div>

            <div className="flex flex-col ml-[8px] flex-1 w-[200px] ">
              <p className={`${inter.className}`}>Vesting Type</p>
              <p className="text-samurai-red w-max font-bold">
                {VestingType[general?.vestingType]}
              </p>
            </div>
          </div>

          {user && (
            <div className="flex flex-col gap-2 mt-10">
              <div className="flex items-end justify-between border-b border-samurai-red pb-3 flex-wrap">
                <span>Project Tokens</span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={onClaim}
                    disabled={user?.claimableTokens === 0}
                    className="text-md py-1 px-4 bg-black border border-samurai-red text-samurai-red disabled:text-white/20 disabled:border-white/20 hover:enabled:text-white hover:enabled:bg-samurai-red w-max rounded-full"
                  >
                    CLAIM
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      disabled={!user || user?.claimedTGE}
                      // onClick={onGetRefund}
                      className="flex items-center gap-1 text-md py-1 px-4 bg-black border border-gray-400 text-gray-400 disabled:text-white/20 disabled:border-white/20 hover:enabled:text-black hover:enabled:bg-gray-300 w-max rounded-full"
                    >
                      <span>ASK FOR REFUND</span>
                      <Tooltip
                        content={
                          <div className="text-[11px] leading-relaxed text-white/70 py-2">
                            <h1 className="text-yellow-300 text-sm">
                              IMPORTANT:
                            </h1>

                            <p>** Refunds are not allowed after TGE claims</p>
                            <p>
                              *** Refunds are not allowed after claim points
                            </p>
                          </div>
                        }
                        style="dark"
                      >
                        <HiOutlineInformationCircle color="yellow" />
                      </Tooltip>
                    </button>
                  </div>

                  {general && account === general.owner && (
                    <button
                      onClick={onFill}
                      className="text-xs py-1 px-4 bg-black border border-samurai-red text-samurai-red disabled:text-white/20 disabled:border-white/20 hover:enabled:text-white hover:enabled:bg-samurai-red w-max rounded-full"
                    >
                      FILL
                    </button>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center gap-5 bg-white/5 rounded-md text-sm px-6 py-4 lg:px-2 lg:py-2 flex-wrap text-center lg:text-start">
                <div className="flex flex-col">
                  <p className={`${inter.className}`}>Ticker</p>
                  <p className="text-samurai-red w-max font-bold">
                    {ido?.projectTokenSymbol}
                  </p>
                </div>
                <div className="flex flex-col">
                  <p className={`${inter.className}`}>My allocation</p>
                  <p className="text-samurai-red w-max font-bold">
                    {allocation?.toLocaleString("en-us")} $USDC
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

          {user && (
            <div className="flex items-end justify-between border-b border-samurai-red pb-3 flex-wrap mt-10">
              <span>Samurai Points</span>
              <button
                onClick={onClaimPoints}
                disabled={user?.claimablePoints === 0}
                className="text-md py-1 px-4 bg-black border border-samurai-red text-samurai-red disabled:text-white/20 disabled:border-white/20 hover:enabled:text-white hover:enabled:bg-samurai-red w-max rounded-full"
              >
                CLAIM
              </button>
            </div>
          )}

          {user && (
            <div className="flex items-center gap-5 gap-x-14 bg-white/5 rounded-md text-sm px-6 py-4 lg:px-2 lg:py-2 flex-wrap text-center lg:text-start mt-2">
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
