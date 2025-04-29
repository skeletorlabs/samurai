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
  userInfo as userInfoLockV2,
  UserInfo as UserInfoLockV2,
} from "../contracts_integrations/samLockV3";
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
import { WALLETS_TO_BURN_POINTS } from "../utils/constants/burner";
import {
  ParticipationType,
  pointsSpentInGiveaways,
} from "../contracts_integrations/giveways";
import { set } from "date-fns";

const inter = Inter({
  subsets: ["latin"],
});

export default function Burner() {
  const [userInfoData, setUserInfoData] = useState<UserInfo | null>(null);
  const [userInfoDataLockV2, setUserInfoDataLockV2] =
    useState<UserInfoLockV2 | null>(null);
  const [userInfoPointsData, setUserInfoPointsData] =
    useState<UserPoints | null>(null);
  const [userInfoDataLPStaking, setUserInfoDataLPStaking] =
    useState<UserInfoLPStaking | null>(null);
  const [userInfoDataVesting, setUserInfoDataVesting] = useState<number | null>(
    null
  );
  const [userInfoDataGiveaways, setUserInfoDataGiveaways] = useState<
    ParticipationType[] | null
  >(null);
  const [pointsToBurn, setPointsToBurn] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [correctAmount, setCorrectAmount] = useState(0);
  const [possibleAmount, setPossibleAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [wallet, setWallet] = useState(WALLETS_TO_BURN_POINTS[0]);
  const [isOwner, setIsOwner] = useState(false);
  const [isViewer, setIsViewer] = useState(false);
  const { signer, account } = useContext(StateContext);

  const onBurn = useCallback(async () => {
    setLoading(true);
    if (signer && account) {
      await burn(signer, wallet, possibleAmount.toString());
      await onGetUserInfo();
      await onCheckOwnership();
    }
    setLoading(false);
  }, [signer, account, wallet, possibleAmount, setLoading]);

  useEffect(() => {
    if (
      userInfoData &&
      userInfoDataLockV2 &&
      userInfoPointsData &&
      userInfoDataLPStaking &&
      userInfoDataVesting &&
      totalSpent
    ) {
      setCorrectAmount(
        Number(userInfoData.claimedPoints) +
          Number(userInfoDataLockV2.claimedPoints) +
          Number(userInfoPointsData.pointsMigrated) +
          Number(userInfoDataLPStaking?.claimedPoints) +
          userInfoDataVesting
      );
      setPointsToBurn(
        Number(userInfoPointsData.balance) -
          Number(userInfoData.claimedPoints) -
          Number(userInfoDataLockV2.claimedPoints) -
          Number(userInfoPointsData.pointsMigrated) -
          Number(userInfoDataLPStaking?.claimedPoints) -
          userInfoDataVesting +
          totalSpent
      );
    }
  }, [
    userInfoData,
    userInfoDataLockV2,
    userInfoPointsData,
    userInfoDataLPStaking,
    userInfoDataVesting,
    totalSpent,
    setPointsToBurn,
  ]);

  useEffect(() => {
    const balance = userInfoPointsData?.balance || 0;
    let possible = 0;

    if (balance >= pointsToBurn) {
      possible = pointsToBurn;
    } else {
      possible = Math.max(balance, correctAmount - totalSpent);
    }

    setPossibleAmount(possible);
  }, [correctAmount, totalSpent, userInfoPointsData, pointsToBurn]);

  const onGetUserInfo = useCallback(async () => {
    setLoading(true);
    if (signer && account && wallet) {
      const dataPoints = await userInfoPoints(wallet);
      setUserInfoPointsData(dataPoints as UserPoints);
      const dataChirppad = await userInfo(wallet, true);
      setUserInfoData(dataChirppad as UserInfo);

      const dataLockV2 = await userInfoLockV2(wallet);
      setUserInfoDataLockV2(dataLockV2 as UserInfoLockV2);

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

      const dataGiveaways = await pointsSpentInGiveaways([2, 3], wallet);
      setUserInfoDataGiveaways(dataGiveaways?.participations || null);
    }
    setLoading(false);
  }, [
    account,
    signer,
    wallet,
    setLoading,
    setUserInfoPointsData,
    setUserInfoData,
    setUserInfoDataLockV2,
    setUserInfoDataGiveaways,
    setUserInfoDataLPStaking,
    setUserInfoDataVesting,
    setUserInfoDataGiveaways,
    setIsViewer,
  ]);

  useEffect(() => {
    const spent = userInfoDataGiveaways?.reduce(
      (acc, curr) => acc + (curr?.pointsSpent || 0),
      0
    );
    setTotalSpent(spent || 0);
  }, [userInfoDataGiveaways, setTotalSpent]);

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
              <div className="flex flex-col bg-black/50 max-w-[730px] p-6 border border-white/20 mt-2 relative">
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
                    {WALLETS_TO_BURN_POINTS.map((wallet) => (
                      <option key={wallet} value={wallet}>
                        {wallet}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mt-4 leading-[40px] font-mono">
                  <div className="flex flex-col leading-tight">
                    <div>
                      <span className="text-green-300 text-xl">+</span> ChirpPad
                      Lock:{" "}
                      {userInfoData?.claimedPoints.toLocaleString("en-us")}{" "}
                      points
                    </div>
                    <div>
                      <span className="text-green-300 text-xl">+</span>{" "}
                      Migrated:{" "}
                      {userInfoPointsData?.pointsMigrated.toLocaleString(
                        "en-us"
                      )}{" "}
                      points
                    </div>
                    <div>
                      <span className="text-green-300 text-xl">+</span> Lock v2:{" "}
                      {userInfoDataLockV2?.claimedPoints.toLocaleString(
                        "en-us"
                      )}{" "}
                      points
                    </div>
                    <div>
                      <span className="text-green-300 text-xl">+</span> LP
                      Staking:{" "}
                      {userInfoDataLPStaking?.claimedPoints.toLocaleString(
                        "en-us"
                      )}{" "}
                      points
                    </div>
                    <div>
                      <span className="text-green-300 text-xl">+</span>{" "}
                      Vestings: {userInfoDataVesting?.toLocaleString("en-us")}{" "}
                      points
                    </div>
                    <div>
                      <span className="text-red-500 text-xl">-</span> Spent in
                      giveaways: {Number(totalSpent).toLocaleString("en-us")}{" "}
                      points
                    </div>
                    {/* <div>
                      6. Spent in giveaways:{" "}
                      {Number(totalSpent).toLocaleString("en-us")} points
                    </div> */}
                  </div>

                  <div className="flex flex-col leading-[25px] mt-2">
                    <p>
                      <span className="text-green-300">Expected balance:</span>{" "}
                      {correctAmount.toLocaleString("en-us")} points
                    </p>
                    <p>
                      <span className="">Expected - Spent:</span>{" "}
                      {(correctAmount - totalSpent).toLocaleString("en-us")}{" "}
                      points
                    </p>
                    <p>
                      <span className="text-yellow-300">Current balance:</span>{" "}
                      {(userInfoPointsData?.balance || 0).toLocaleString(
                        "en-us"
                      )}{" "}
                      points
                    </p>

                    <p>
                      <span className="text-samurai-red">
                        Correct Amount to burn:
                      </span>{" "}
                      {pointsToBurn.toLocaleString("en-us")} points
                    </p>
                    <p>
                      <span className="text-samurai-red">
                        Possible Amount to burn:
                      </span>{" "}
                      {/* max(0, Expected Balance - Total Spent in giveaways) */}
                      {possibleAmount.toLocaleString("en-us")} points
                    </p>
                  </div>
                  <div className="mt-6">
                    <SSButton
                      disabled={possibleAmount === 0 || loading || !isOwner}
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
