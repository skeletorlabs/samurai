import { ethers, formatEther } from "ethers";
import { ERC20_ABI, SAM_LOCK_V2_ABI } from "./abis";
import handleError from "@/app/utils/handleErrors";
import { balanceOf } from "./balanceOf";
import checkApproval from "./check-approval";
import { notificateTx } from "@/app/utils/notificateTx";
import { POINTS, SAM_ADDRESS, SAM_LOCK_V2_ADDRESS } from "../utils/constants";

import { userInfo as pastUserInfo } from "./samLock";

const BASE_RPC_URL = process.env.NEXT_PUBLIC_BASE_RPC_HTTPS as string;

async function getContract(signer?: ethers.Signer) {
  try {
    const provider = new ethers.JsonRpcProvider(BASE_RPC_URL);

    const contract = new ethers.Contract(
      SAM_LOCK_V2_ADDRESS,
      SAM_LOCK_V2_ABI,
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
export async function getMultiplierByPeriod(period: number) {
  const contract = await getContract();

  const multiplier = Number(
    ethers.formatEther(await contract?.multipliers(period))
  );

  return multiplier;
}

export async function getEstimatedPoints(amount: string, period: number) {
  const multiplier = await getMultiplierByPeriod(period);

  return Number(amount) * multiplier;
}

export async function generalInfo() {
  try {
    const contract = await getContract();
    const owner = await contract?.owner();
    const isPaused = await contract?.paused();
    const minToLock = Number(formatEther(await contract?.minToLock()));
    const claimDelayPeriod = Number(await contract?.CLAIM_DELAY_PERIOD());

    const threeMonths = await contract?.THREE_MONTHS();
    const sixMonths = await contract?.SIX_MONTHS();
    const nineMonths = await contract?.NINE_MONTHS();
    const twelveMonths = await contract?.TWELVE_MONTHS();

    const totalLocked = Number(
      ethers.formatEther(await contract?.totalLocked())
    );
    const totalWithdrawn = Number(
      ethers.formatEther(await contract?.totalWithdrawn())
    );

    const totalClaimed = Number(
      ethers.formatEther(await contract?.totalClaimed())
    );

    const periods = [
      { title: "3 Months", value: threeMonths },
      { title: "6 Months", value: sixMonths },
      { title: "9 Months", value: nineMonths },
      { title: "12 Months", value: twelveMonths },
    ];

    return {
      owner,
      isPaused,
      minToLock,
      claimDelayPeriod,
      periods,
      totalLocked,
      totalWithdrawn,
      totalClaimed,
    };
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

// USER INFOS

export type LockInfo = {
  index: number;
  lockedAmount: number;
  withdrawnAmount: number;
  lockedAt: number;
  withdrawTime: number;
  lockPeriod: number;
  claimedPoints: number;
  claimablePoints: number;
};

export type UserInfo = {
  locks: LockInfo[];
  totalLocked: number;
  claimedPoints: number;
  availablePoints: number;
  balance: number;
  pointsBalance: number;
  lastClaim: number;
  pointsToMigrate: number;
};

export async function userInfo(signer: ethers.Signer) {
  try {
    let signerAddress = await signer.getAddress();

    const contract = await getContract(signer);
    const userLocks = await contract?.locksOf(signerAddress);
    const pointsMigrated = Number(
      formatEther(await contract?.pointsMigrated(signerAddress))
    );

    const pastUserInfos = await pastUserInfo(signer);
    const pointsToMigrate = (pastUserInfos?.totalPoints || 0) - pointsMigrated;

    let locks: LockInfo[] = [];

    for (let i = 0; i < userLocks.length; i++) {
      const userLock = userLocks[i];
      let claimablePoints = Number(
        formatEther(await contract?.previewClaimablePoints(signerAddress, i))
      );

      if (
        signerAddress === "0x194856b0d232821a75fd572c40f28905028b5613" ||
        signerAddress === "0x69eed0DA450Ce194DCea4317f688315973Dcba31"
      ) {
        claimablePoints = 0;
      }

      const lock: LockInfo = {
        index: i,
        lockedAmount: Number(ethers.formatEther(userLock[0])),
        withdrawnAmount: Number(ethers.formatEther(userLock[1])),
        lockedAt: Number(userLock[2]),
        withdrawTime: Number(userLock[3]),
        lockPeriod: Number(userLock[4]),
        claimablePoints: claimablePoints,
        claimedPoints: Number(formatEther(userLock[5])),
      };
      locks.push(lock);

      if (
        signerAddress === "0x194856b0d232821a75fd572c40f28905028b5613" ||
        signerAddress === "0x69eed0DA450Ce194DCea4317f688315973Dcba31"
      ) {
        locks[i].claimedPoints = locks[i].lockedAmount;
      }
    }

    let totalLocked: Number = locks.reduce((acc, curr) => {
      return acc + curr.lockedAmount - curr.withdrawnAmount;
    }, 0);

    const claimedPoints: Number = locks.reduce((acc, curr) => {
      return acc + curr.claimedPoints;
    }, 0);

    const availablePoints = locks.reduce((acc, curr) => {
      return acc + curr.claimablePoints;
    }, 0);

    let balance = Number(
      ethers.formatEther(
        await balanceOf(ERC20_ABI, SAM_ADDRESS, signerAddress, signer)
      )
    );

    let pointsBalance = Number(
      ethers.formatEther(
        await balanceOf(ERC20_ABI, POINTS, signerAddress, signer)
      )
    );

    const lastClaim = Number(await contract?.lastClaims(signerAddress));

    return {
      locks: locks,
      totalLocked,
      claimedPoints,
      availablePoints,
      balance,
      pointsBalance,
      lastClaim,
      pointsToMigrate,
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
    const contract = await getContract(signer);
    const network = await signer.provider?.getNetwork();

    await checkApproval(
      SAM_ADDRESS,
      SAM_LOCK_V2_ADDRESS,
      signer,
      ethers.parseEther(amount)
    );

    const tx = await contract?.lock(ethers.parseEther(amount), lockPeriod);

    await notificateTx(tx, network);
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

export async function withdraw(
  signer: ethers.Signer,
  amount: string,
  lockIndex: number
) {
  try {
    const contract = await getContract(signer);
    const network = await signer.provider?.getNetwork();

    const tx = await contract?.withdraw(
      ethers.parseEther(amount),
      lockIndex.toString()
    );

    await notificateTx(tx, network);
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

export async function claimPoints(signer: ethers.Signer) {
  try {
    const contract = await getContract(signer);
    const network = await signer.provider?.getNetwork();

    const tx = await contract?.claimPoints();

    await notificateTx(tx, network);
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

export async function migratePoints(signer: ethers.Signer) {
  try {
    const contract = await getContract(signer);
    const network = await signer.provider?.getNetwork();

    const tx = await contract?.migrateVirtualPointsToTokens();

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
