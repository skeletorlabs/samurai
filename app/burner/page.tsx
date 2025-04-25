"use client";
import { Inter } from "next/font/google";
import SSButton from "@/app/components/ssButton";
import TopLayout from "@/app/components/topLayout";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import ConnectButton from "../components/connectbutton";
import { useCallback, useContext, useEffect, useState } from "react";
import { StateContext } from "../context/StateContext";
import { userInfo, UserInfo } from "../contracts_integrations/samLockV2";
import {
  burn,
  isPointsOwner,
  userInfo as userInfoPoints,
  UserPoints,
} from "../contracts_integrations/points";
import {
  userInfo as userInfoLpStaking,
  UserInfo as UserInfoLPStaking,
} from "../contracts_integrations/lpStaking";

import { userInfo as userInfoVesting } from "../contracts_integrations/vesting";
import LoadingBox from "../components/loadingBox";
import { IDOs } from "../utils/constants";

const inter = Inter({
  subsets: ["latin"],
});

const walletsToBurn = [
  "0x194856b0d232821a75fd572c40f28905028b5613",
  "0x69eed0DA450Ce194DCea4317f688315973Dcba31",
];

export default function Burner() {
  const [userInfoData, setUserInfoData] = useState<UserInfo | null>(null);
  const [userInfoPointsData, setUserInfoPointsData] =
    useState<UserPoints | null>(null);
  const [userInfoDataLPStaking, setUserInfoDataLPStaking] =
    useState<UserInfoLPStaking | null>(null);
  const [userInfoDataVesting, setUserInfoDataVesting] = useState<number | null>(
    null
  );
  const [pointsToBurn, setPointsToBurn] = useState(0);
  const [loading, setLoading] = useState(false);
  const [wallet, setWallet] = useState(walletsToBurn[0]);
  const [isOwner, setIsOwner] = useState(false);
  const [isViewer, setIsViewer] = useState(false);
  const { signer, account } = useContext(StateContext);

  const onBurn = useCallback(async () => {
    setLoading(true);
    if (signer && account) {
      await burn(signer, wallet, pointsToBurn.toString());
    }
    setLoading(false);
  }, [signer, account, wallet, pointsToBurn, setLoading]);

  useEffect(() => {
    if (
      userInfoData &&
      userInfoPointsData &&
      userInfoDataLPStaking &&
      userInfoDataVesting
    ) {
      setPointsToBurn(
        Number(userInfoPointsData.balance) -
          Number(userInfoData.claimedPoints) -
          Number(userInfoPointsData.pointsMigrated) -
          Number(userInfoDataLPStaking?.claimedPoints) -
          userInfoDataVesting
      );
    }
  }, [
    userInfoData,
    userInfoPointsData,
    userInfoDataLPStaking,
    userInfoDataVesting,
    setPointsToBurn,
  ]);

  const onGetUserInfo = useCallback(async () => {
    setLoading(true);
    if (signer && account && wallet) {
      const dataPoints = await userInfoPoints(wallet);
      setUserInfoPointsData(dataPoints as UserPoints);
      const dataChirppad = await userInfo(wallet);
      setUserInfoData(dataChirppad as UserInfo);

      const dataLpStaking = await userInfoLpStaking(signer, wallet);
      setUserInfoDataLPStaking(dataLpStaking as UserInfoLPStaking);

      let vestingPoints = 0;

      for (let index = 0; index < IDOs.length; index++) {
        const element = IDOs[index];

        if (element.vesting !== undefined) {
          const dataVesting = await userInfoVesting(index, signer, wallet);
          vestingPoints += dataVesting?.claimedPoints || 0;
        }
      }

      setUserInfoDataVesting(vestingPoints);
    }
    setLoading(false);
  }, [
    account,
    signer,
    wallet,
    setLoading,
    setUserInfoPointsData,
    setUserInfoData,
    setUserInfoDataLPStaking,
    setUserInfoDataVesting,
    setIsViewer,
    setIsViewer,
  ]);

  const onCheckOwnership = useCallback(async () => {
    if (signer) {
      const response = await isPointsOwner(signer);
      setIsOwner(response?.isOwner || false);
      setIsViewer(response?.isViewer || false);
    }
  }, [signer, setIsOwner, setIsViewer]);

  useEffect(() => {
    onGetUserInfo();
    onCheckOwnership();
  }, [signer, account, wallet]);

  return (
    <TopLayout background="bg-samurai-cyborg-fem bg-cover bg-top h-screen">
      <>
        <div className="flex flex-row justify-between items-center px-6 lg:px-8 xl:px-14 pt-10 lg:pt-24 bg-transparent sm:bg-black/60 2xl:bg-transparent">
          {/* TOP CONTENT */}
          <div className="relative md:mr-12 xl:max-w-[900px]">
            <h1 className="text-[48px] sm:text-[58px] lg:text-[90px] font-black leading-[58px] sm:leading-[68px] lg:leading-[98px] text-white">
              <span className="font-bold text-samurai-red">BURN</span> Points
            </h1>
            <p
              className={`leading-normal lg:leading-relaxed pb-6 text-xl lg:text-2xl xl:max-w-[900px]  ${inter.className}`}
            >
              Edge cases where the{" "}
              <span className="font-bold text-samurai-red">Samurai Points</span>{" "}
              must be burnt.
            </p>

            {isOwner || isViewer ? (
              <div className="flex flex-col bg-black/50 max-w-[530px] p-6 border border-white/20 mt-2 relative">
                <div className="text-[27px]">
                  {pointsToBurn === 0
                    ? "Your wallet has no points to burn."
                    : "Your wallet has points to burn."}
                </div>
                <div className="mt-4 leading-[40px] font-mono">
                  <select
                    className="w-full bg-black/50 text-white border border-white/20 p-2"
                    name="wallets"
                    id="wallets"
                    onChange={(e) => setWallet(e.target.value)}
                  >
                    {walletsToBurn.map((wallet) => (
                      <option key={wallet} value={wallet}>
                        {wallet}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mt-4 leading-[40px] font-mono">
                  <p>
                    <span className="text-yellow-300">- Balance:</span>{" "}
                    {(userInfoPointsData?.balance || 0).toLocaleString("en-us")}{" "}
                    Samurai Points
                  </p>

                  <p>
                    <span className="text-green-300">- Correct amount:</span>{" "}
                    {(
                      Number(userInfoData?.claimedPoints || 0) +
                      Number(userInfoPointsData?.pointsMigrated || 0)
                    ).toLocaleString("en-us")}{" "}
                    Samurai Points
                  </p>
                  <p className="flex flex-col leading-tight">
                    <span>
                      --- ChirpPad:{" "}
                      {userInfoData?.claimedPoints.toLocaleString("en-us")}
                    </span>
                    <span>
                      --- Migrated:{" "}
                      {userInfoPointsData?.pointsMigrated.toLocaleString(
                        "en-us"
                      )}
                    </span>
                    <span>
                      --- LP Staking:{" "}
                      {userInfoDataLPStaking?.claimedPoints.toLocaleString(
                        "en-us"
                      )}
                    </span>
                    <span>
                      --- Vestings{" "}
                      {userInfoDataVesting?.toLocaleString("en-us")}
                    </span>
                  </p>

                  <p>
                    <span className="text-samurai-red">- Amount to burn:</span>{" "}
                    {pointsToBurn.toLocaleString("en-us")} Samurai Points
                  </p>
                  <div className="mt-6">
                    <SSButton
                      disabled={pointsToBurn === 0 || loading || !isOwner}
                      flexSize
                      click={onBurn}
                    >
                      BURN SAMURAI POINTS
                    </SSButton>
                  </div>
                </div>
              </div>
            ) : signer && account && !isOwner ? (
              <div className="text-4xl text-yellow-300">
                You don't have access to this content!
              </div>
            ) : (
              <ConnectButton />
            )}
          </div>
        </div>
        {loading && <LoadingBox />}
      </>
    </TopLayout>
  );
}
