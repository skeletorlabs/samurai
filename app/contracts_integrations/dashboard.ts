import { Contract, formatEther, JsonRpcProvider, Signer } from "ethers";
import { MulticallProvider } from "@ethers-ext/provider-multicall";

import handleError from "../utils/handleErrors";
import { IDOs, POINTS, SAM_ADDRESS } from "../utils/constants";
import {
  DashboardUserDetails,
  DashboardUserVestingDetails,
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
const BASE_RPC_URL = process.env.NEXT_PUBLIC_BASE_RPC_HTTPS as string;

const checkAvailableMonths = async () => {
  const provider = new JsonRpcProvider(BASE_RPC_URL);
  const earliestBlock = await provider?.getBlock(TOKEN_DEPLOYMENT_BLOCK);
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

const getBlockByTimestamp = async (timestamp: number) => {
  const provider = new JsonRpcProvider(BASE_RPC_URL);
  try {
    let latestBlock = await provider?.getBlock("latest");
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
      let midBlock = (await provider?.getBlock(mid)) || {
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
    const provider = new JsonRpcProvider(BASE_RPC_URL);
    const contract = new Contract(POINTS, SAMURAI_POINTS_ABI, provider);
    const balance = await contract?.balanceOf(address, {
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
    let availableMonths = await checkAvailableMonths();
    monthsBack = Math.min(monthsBack, availableMonths);

    const timestamps = getMonthlyTimestamps(monthsBack) || [];
    const balances = [];

    for (let timestamp of timestamps) {
      let blockNumber = (await getBlockByTimestamp(timestamp)) || 0;
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
  const provider = new JsonRpcProvider(BASE_RPC_URL);
  const multicallProvider = new MulticallProvider(provider);

  try {
    const signerAddress = await signer.getAddress();
    let walletToCheck;
    // walletToCheck = "0xcae8cf1e2119484d6cc3b6efaad2242adbdb1ea8";
    const address = walletToCheck || signerAddress;

    // Collect all read-only calls first
    const [tier, samBalanceRaw, pointsRaw, lockedNfts] = await Promise.all([
      getTier(address),
      balanceOf(ERC20_ABI, SAM_ADDRESS, address, multicallProvider),
      balanceOf(SAMURAI_POINTS_ABI, POINTS, address, multicallProvider),
      nftLockUserInfo(signer, address), // Requires signer
    ]);

    const tierName = tier?.name || "Public";
    const samBalance = Number(formatEther(samBalanceRaw));
    const points = Number(formatEther(pointsRaw));

    const userIdos: IDO_v3[] = [];
    const allocations: StringToNumber = {};

    // Fetch user IDO info in parallel
    const idoInfoResults = await Promise.all(
      IDOs.map((ido, index) =>
        idoV3UserInfo(index, signer, tierName, address, multicallProvider)
      )
    );

    // Filter valid IDOs
    idoInfoResults.forEach((userIdo, index) => {
      if ((userIdo?.allocation || 0) > 0) {
        const ido = IDOs[index];
        userIdos.push(ido);
        allocations[ido.id] = userIdo?.allocation || 0;
      }
    });

    return {
      account: address,
      tier: tierName,
      samBalance,
      points,
      nftBalance: lockedNfts?.locks.length || 0,
      userIdos,
      allocations,
    } as DashboardUserDetails;
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

export async function fetchVestingDetails(
  signer: Signer,
  userIdos: IDO_v3[],
  walletToCheck?: string
) {
  const phases: StringToString = {};
  const tgesUnlocked: StringToBoolean = {};
  const tgesClaimed: StringToBoolean = {};

  const signerProvider = signer.provider as JsonRpcProvider;
  const multicallProvider = new MulticallProvider(signerProvider);

  const vestingPromises = userIdos.map(async (ido) => {
    const index = IDOs.findIndex((item) => item.id === ido.id);
    if (!ido.vesting) {
      phases[ido.id] = await getParticipationPhase(index, multicallProvider);
      tgesUnlocked[ido.id] = false;
      tgesClaimed[ido.id] = false;
      return;
    }

    const [phase, vestingInfo, userVestingInfo] = await Promise.all([
      getParticipationPhase(index, multicallProvider),
      vestingGeneralInfo(index, multicallProvider),
      vestingUserInfo(index, signer, walletToCheck),
    ]);

    if (phase) phases[ido.id] = phase;
    if (vestingInfo)
      tgesUnlocked[ido.id] = vestingInfo?.periods.vestingAt < currentTime();
    if (userVestingInfo) tgesClaimed[ido.id] = userVestingInfo?.claimedTGE;
  });

  await Promise.all(vestingPromises);
  return { phases, tgesUnlocked, tgesClaimed } as DashboardUserVestingDetails;
}
