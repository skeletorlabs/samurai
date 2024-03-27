import { ethers } from "ethers";
import { ERC20_ABI, SAM_LOCK_ABI } from "./abis";
import handleError from "../utils/handleErrors";
import { balanceOf } from "./balanceOf";
import checkApproval from "./check-approval";
import { notificateTx } from "@/utils/notificateTx";
import { SAM_ADDRESS, SAM_LOCK_ADDRESS } from "@/utils/constants";

const BASE_RPC_URL = process.env.NEXT_PUBLIC_BASE_RPC_HTTPS as string;
const TEST_RPC = "http://127.0.0.1:8545";

async function getContract(signer?: ethers.Signer) {
  try {
    const provider = new ethers.JsonRpcProvider(TEST_RPC);
    const contractAddress = SAM_LOCK_ADDRESS;
    const contract = new ethers.Contract(
      contractAddress,
      SAM_LOCK_ABI,
      signer || provider
    );

    return contract;
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

// OVERALL INFOS

export async function checkIsPaused() {
  try {
    const contract = await getContract();
    const isPaused = await contract?.paused();
    return isPaused;
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

export type GeneralLockInfo = {
  owner: string;
  isPaused: boolean;
  tierRanges: number[];
  periods: { title: string; value: number }[];
};

export async function generalInfo() {
  try {
    const contract = await getContract();

    const owner = await contract?.owner();
    const isPaused = await contract?.paused();

    const threeMonths = await contract?.THREE_MONTHS();
    const sixMonths = await contract?.SIX_MONTHS();
    const nineMonths = await contract?.NINE_MONTHS();
    const twelveMonths = await contract?.TWELVE_MONTHS();

    const range1 = Number(ethers.formatEther(await contract?.tierRanges(0)));
    const range2 = Number(ethers.formatEther(await contract?.tierRanges(1)));
    const range3 = Number(ethers.formatEther(await contract?.tierRanges(2)));
    const range4 = Number(ethers.formatEther(await contract?.tierRanges(3)));

    const tierRanges = [range1, range2, range3, range4];

    const periods = [
      { title: "3 Months", value: threeMonths },
      { title: "6 Months", value: sixMonths },
      { title: "9 Months", value: nineMonths },
      { title: "12 Months", value: twelveMonths },
    ];

    console.log(periods);

    return {
      owner,
      isPaused,
      tierRanges,
      periods,
    } as GeneralLockInfo;
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

export async function getEstimatedPoints(amount: string, period: number) {
  const contract = await getContract();

  const tier = await contract?.determineTier(ethers.parseEther(amount));
  const estimatedPoints = Number(
    ethers.formatEther(await contract?.basePoints(tier, period))
  );

  return estimatedPoints;
}

// USER INFOS

export type LockInfo = {
  amount: number;
  lockedAt: number;
  unlockTime: number;
  lockPeriod: number;
};

export type UserInfo = {
  locks: LockInfo[];
  totalLocked: number;
  // totalPoints: number;
  samBalance: number;
};

export async function userInfo(signer: ethers.Signer) {
  try {
    const signerAdress = await signer.getAddress();
    const contract = await getContract(signer);
    const locksCount = await contract?.getLockInfosCount(signerAdress);
    let locks: LockInfo[] = [];

    if (locksCount > 0) {
      for (let i = 1; i <= locksCount; i++) {
        const lock: LockInfo = await contract?.getLockInfos(signerAdress, i);
        locks.push(lock);
      }
    }

    const totalLocked: Number = locks.reduce((acc, curr) => {
      return acc + curr.amount;
    }, 0);

    // const totalPoints: Number = await contract?.getTotalPoints(signer);

    const samBalance = Number(
      ethers.formatEther(
        await balanceOf(ERC20_ABI, SAM_ADDRESS, signerAdress, signer)
      )
    );

    return {
      locks,
      totalLocked,
      // totalPoints,
      samBalance,
    } as UserInfo;
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

export async function lock(
  signer: ethers.Signer,
  amount: string,
  lockPeriod: number
) {
  try {
    const signerAddress = await signer.getAddress();
    const contract = await getContract(signer);
    const network = await signer.provider?.getNetwork();

    await checkApproval(
      SAM_ADDRESS,
      SAM_LOCK_ADDRESS,
      signer,
      ethers.parseEther(amount)
    );

    const tx = await contract?.lock(
      signerAddress,
      ethers.parseEther(amount),
      lockPeriod
    );

    await notificateTx(tx, network);
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

export async function withdraw(
  signer: ethers.Signer,
  amount: string,
  lockIndex: string
) {
  try {
    const signerAddress = await signer.getAddress();
    const contract = await getContract(signer);
    const network = await signer.provider?.getNetwork();

    await checkApproval(
      SAM_ADDRESS,
      SAM_LOCK_ADDRESS,
      signer,
      ethers.parseEther(amount)
    );

    const tx = await contract?.withdraw(
      signerAddress,
      ethers.parseEther(amount),
      lockIndex
    );

    await notificateTx(tx, network);
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

// ADMIN ACTIONS

export async function togglePause(index: number, signer: ethers.Signer) {
  const contract = await getContract(signer);

  try {
    const owner = await contract?.owner();
    const signerAddress = await signer.getAddress();

    if (owner === signerAddress) {
      const network = await signer.provider?.getNetwork();
      const isPaused = await contract?.paused();
      const tx = isPaused ? await contract?.unpause() : await contract?.pause();
      await notificateTx(tx, network);
    }
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

export async function updatedTierRanges(
  first: string,
  second: string,
  third: string,
  fourth: string,
  signer: ethers.Signer
) {
  const contract = await getContract(signer);

  try {
    const owner = await contract?.owner();
    const signerAddress = await signer.getAddress();

    if (owner === signerAddress) {
      const network = await signer.provider?.getNetwork();
      const tx = await contract?.updateTierRanges(first, second, third, fourth);
      await notificateTx(tx, network);
    }
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}
