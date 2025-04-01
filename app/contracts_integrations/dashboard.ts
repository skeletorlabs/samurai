import { Contract, formatEther, Signer } from "ethers";
import handleError from "../utils/handleErrors";
import { IDOs, POINTS, SAM_ADDRESS } from "../utils/constants";
import {
  DashboardUserDetails,
  IDO_v3,
  StringToBoolean,
  StringToNumber,
  StringToString,
} from "../utils/interfaces";
import {
  getParticipationPhase,
  userInfo as idoV3UserInfo,
} from "@/app/contracts_integrations/idoV3";
import { userInfo as nftLockUserInfo } from "./nftLock";
import {
  generalInfo as vestingGeneralInfo,
  userInfo as vestingUserInfo,
} from "./vesting";
import { getTier } from "./tiers";
import { balanceOf } from "./balanceOf";
import { ERC20_ABI, SAMURAI_POINTS_ABI } from "./abis";
import { currentTime } from "../utils/currentTime";
import { formattedDateToMonth } from "../utils/formattedDate";

const TOKEN_DEPLOYMENT_BLOCK = 22754558;

const checkAvailableMonths = async (signer: Signer) => {
  const earliestBlock = await signer.provider?.getBlock(TOKEN_DEPLOYMENT_BLOCK);
  const earliestTimestamp = earliestBlock?.timestamp || 0;

  const now = Math.floor(Date.now() / 1000); // Current timestamp
  const monthsAvailable = Math.floor(
    (now - earliestTimestamp) / (30 * 24 * 60 * 60)
  ); // Convert seconds to months

  console.log(`You can fetch up to ~${monthsAvailable} months of history.`);
  return monthsAvailable;
};

const getMonthlyTimestamps = (monthsBack: number) => {
  try {
    const timestamps = [];
    const now = new Date();
    for (let i = 0; i < monthsBack; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      timestamps.push(Math.floor(date.getTime() / 1000)); // Convert to Unix timestamp
    }
    return timestamps.reverse(); // Oldest first
  } catch (error) {
    console.log(error);
  }
};

const getBlockByTimestamp = async (signer: Signer, timestamp: number) => {
  try {
    let latestBlock = await signer?.provider?.getBlock("latest");
    let latestTimestamp = latestBlock?.timestamp || 0;
    let latestBlockNumber = latestBlock?.number || 0;

    const avgBlockTime = 2; // Base network block time in seconds

    // Use the estimation to set a better starting point
    let estimatedBlock =
      latestBlockNumber -
      Math.floor((latestTimestamp - timestamp) / avgBlockTime);

    // Now use binary search but start from estimatedBlock instead of 0
    let low = Math.max(0, estimatedBlock - 5000); // Safety margin
    let high = Math.min(latestBlockNumber, estimatedBlock + 5000); // Safety margin

    while (low < high) {
      let mid = Math.floor((low + high) / 2);
      let midBlock = (await signer?.provider?.getBlock(mid)) || {
        timestamp: 0,
      };
      if (midBlock.timestamp < timestamp) {
        low = mid + 1;
      } else {
        high = mid;
      }
    }
    return low;
  } catch (error) {
    console.log(error);
  }
};

const getBalanceAtBlock = async (
  blockNumber: number,
  signer: Signer,
  account?: string
) => {
  try {
    const address = account ? account : await signer.getAddress();
    const contract = new Contract(POINTS, SAMURAI_POINTS_ABI, signer);
    const balance = await contract.balanceOf(address, {
      blockTag: blockNumber,
    });
    return formatEther(balance);
  } catch (error) {
    console.log(error);
  }
};

export const getHistoricalBalances = async (
  monthsBack: number,
  signer: Signer,
  account?: string
) => {
  try {
    let availableMonths = await checkAvailableMonths(signer);
    monthsBack = Math.min(monthsBack, availableMonths);

    const timestamps = getMonthlyTimestamps(monthsBack) || [];
    const balances = [];

    for (let timestamp of timestamps) {
      let blockNumber = (await getBlockByTimestamp(signer, timestamp)) || 0;
      let balance = await getBalanceAtBlock(blockNumber, signer, account);
      balances.push({
        name: formattedDateToMonth(timestamp),
        points: Number(balance),
      });
    }

    return balances;
  } catch (error) {
    console.log(error);
  }
};

export async function userInfo(signer: Signer) {
  try {
    const signerAddress = await signer.getAddress();
    let walletToCheck = undefined;
    walletToCheck = "0xcae8cf1e2119484d6cc3b6efaad2242adbdb1ea8";

    const address = walletToCheck ? walletToCheck : signerAddress;
    const tier = await getTier(address);
    const tierName = tier?.name || "Public";
    const samBalance = Number(
      formatEther(await balanceOf(ERC20_ABI, SAM_ADDRESS, address, signer))
    );

    const points = Number(
      formatEther(await balanceOf(SAMURAI_POINTS_ABI, POINTS, address, signer))
    );

    const lockedNfts = await nftLockUserInfo(signer, address);

    const userIdos: IDO_v3[] = [];
    const allocations: StringToNumber = {};
    const phases: StringToString = {};
    const tgesUnlocked: StringToBoolean = {};
    const tgesClaimed: StringToBoolean = {};

    for (let index = 0; index < IDOs.length; index++) {
      const ido = IDOs[index];
      const userIdo = await idoV3UserInfo(index, signer, tierName, address);

      if (userIdo?.allocation || 0 > 0) {
        userIdos.push(ido);
        const allocation = userIdo?.allocation || 0;

        allocations[ido.id] = allocation;

        const idoPhase = await getParticipationPhase(index);
        phases[ido.id] = idoPhase;

        if (ido.vesting) {
          const vestingInfo = await vestingGeneralInfo(index);

          tgesUnlocked[ido.id] =
            (vestingInfo?.periods.vestingAt || 0) < currentTime();

          const userVestingInfo = await vestingUserInfo(
            index,
            signer,
            walletToCheck
          );

          tgesClaimed[ido.id] = userVestingInfo?.claimedTGE;
        }
      }
    }

    return {
      account: address,
      tier: tierName,
      samBalance,
      points,
      nftBalance: lockedNfts?.locks.length,
      userIdos,
      allocations,
      phases,
      tgesUnlocked,
      tgesClaimed,
    } as DashboardUserDetails;
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}
