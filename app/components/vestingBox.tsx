import { Inter } from "next/font/google";
import { IDOs, VestingType } from "../utils/constants";
import { useParams } from "next/navigation";
import { useCallback, useContext, useState } from "react";
import { formattedDate3, formattedDate4 } from "../utils/formattedDate";
import { getUnixTime } from "date-fns";
import {
  claimTokens,
  generalInfo,
  userInfo,
  VESTING_GENERAL_INFO,
} from "../contracts_integrations/vesting";
import { IDO_v3 } from "../utils/interfaces";
import { StateContext } from "../context/StateContext";

const inter = Inter({
  subsets: ["latin"],
});

interface VestingBox {
  ido: IDO_v3;
  idoIndex: number;
  loading: boolean;
  setLoading: any;
}

export default function VestingBox({
  ido,
  idoIndex,
  loading,
  setLoading,
}: VestingBox) {
  const now = getUnixTime(new Date());

  const [general, setGeneral] = useState<VESTING_GENERAL_INFO | null>(null);
  const [user, setUser] = useState<any>(null);
  const { signer } = useContext(StateContext);

  const onClaim = useCallback(async () => {
    setLoading(true);
    if (signer) {
      await claimTokens(idoIndex, signer);
      await getGeneralData();
      await getUserInfos();
    }

    setLoading(false);
  }, [signer, idoIndex, setLoading]);

  const getUserInfos = useCallback(async () => {
    if (signer && general) {
      const response = await userInfo(idoIndex, signer);
      setUser(response);
    }
  }, [signer, idoIndex, general]);

  const getGeneralData = useCallback(async () => {
    setLoading(true);
    if (idoIndex !== -1) {
      const response = await generalInfo(idoIndex);
      setGeneral(response as VESTING_GENERAL_INFO);
    }

    setLoading(false);
  }, [idoIndex, setLoading]);

  return (
    <div className="flex items-start my-5 min-h-[200px]">
      {user && (
        // user?.allocation > 0 && (
        <div className="flex flex-col justify-between w-full h-full">
          <div className="flex flex-col leading-tight mb-10">
            <div className="flex items-center gap-2 text-[14px] flex-wrap">
              <p className="flex px-2 py-1 bg-white/10">
                <span className="text-white/60 mr-1">Vesting Terms:</span>
                {general && general?.tgeReleasePercent * 100}% at TGE,{" "}
                {general && general?.periods.cliff > 0
                  ? `${general?.periods.cliff} months cliff`
                  : "No Cliff"}
                , {general?.periods.vestingDuration} months{" "}
                {VestingType[general?.vestingType as number].toLowerCase()}
              </p>
              <p className="flex px-2 py-1 bg-white/10">
                <span className="text-white/60 mr-1">My Allocation:</span>$
                {user?.allocation.toLocaleString("en-us")}{" "}
                {ido?.acceptedTokenSymbol}
              </p>
              <p className="flex px-2 py-1 bg-white/10">
                <span className="text-white/60 mr-1">TGE:</span>
                {general && formattedDate3(general?.periods.vestingAt)}
              </p>
              <p className="flex px-2 py-1 bg-white/10">
                <span className="text-white/60 mr-1">Vesting:</span>
                {general && formattedDate4(general?.periods.cliffEndsAt)}
                {" - "}
                {general && formattedDate4(general?.periods.vestingEndsAt)}
                {" UTC"}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-end justify-between border-b border-samurai-red pb-3 flex-wrap">
              <span>Project Tokens - {ido?.projectTokenSymbol}</span>

              <div className="flex items-center gap-2">
                {/* {general.refund.active && ( */}
                <div className="flex items-center gap-1">
                  <button
                    // onClick={onGetRefund}
                    className="flex items-center gap-1 text-xs py-1 px-4 bg-black border border-gray-400 text-gray-400 disabled:text-white/20 disabled:border-white/20 hover:enabled:text-black hover:enabled:bg-gray-300 w-max rounded-full"
                  >
                    <span>ASK FOR REFUND</span>
                    {/* <Tooltip
                                                content={
                                                  <div className="text-sm leading-relaxed text-white/70 py-2">
                                                    <h1 className="text-yellow-300">
                                                      IMPORTANT:
                                                    </h1>
                                                    <p>
                                                      * We charge{" "}
                                                      {
                                                        general.refund
                                                          .feePercent
                                                      }
                                                      % in fees for refundings.
                                                    </p>
                                                    <p>
                                                      ** Refunds are not allowed
                                                      after TGE claims
                                                    </p>
                                                    <p>
                                                      *** Refunds are not
                                                      allowed after{" "}
                                                      {general.refund.period /
                                                        60 /
                                                        60}{" "}
                                                      hours
                                                    </p>
                                                  </div>
                                                }
                                                style="dark"
                                              >
                                                <HiOutlineInformationCircle color="yellow" />
                                              </Tooltip> */}
                  </button>
                </div>
                {/* )} */}
                <button
                  onClick={onClaim}
                  disabled={user?.claimable === 0}
                  className="text-xs py-1 px-4 bg-black border border-samurai-red text-samurai-red disabled:text-white/20 disabled:border-white/20 hover:enabled:text-white hover:enabled:bg-samurai-red w-max rounded-full"
                >
                  CLAIM
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center gap-5 bg-samurai-red/10 text-sm px-6 py-4 lg:px-2 lg:py-2 flex-wrap text-center lg:text-start">
              <div className="flex flex-col">
                <p className={`${inter.className}`}>Purchased</p>
                <p className="text-samurai-red w-max text-[18px]">
                  {user?.purchased?.toLocaleString("en-us")}
                </p>
              </div>

              <div className="flex flex-col">
                <p className={`${inter.className}`}>Claimed</p>
                <p className="text-samurai-red w-max text-[18px]">
                  {user?.claimed.toLocaleString("en-us")}
                </p>
              </div>

              <div className="flex flex-col">
                <p className={`${inter.className}`}>Vesting</p>
                <p className="text-samurai-red w-max text-[18px]">
                  {general && now > general?.periods.cliffEndsAt
                    ? (
                        user?.purchased -
                        user?.claimed -
                        user?.claimable
                      ).toLocaleString("en-us", {
                        minimumFractionDigits: 2,
                      })
                    : Number(0).toLocaleString("en-us")}
                </p>
              </div>

              <div className="flex flex-col">
                <p className={`${inter.className}`}>Claimable</p>
                <p className="text-samurai-red w-max text-[18px]">
                  {user?.claimable.toLocaleString("en-us")}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
