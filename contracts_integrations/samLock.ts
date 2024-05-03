import { ethers, formatEther } from "ethers";
import { ERC20_ABI, SAM_LOCK_ABI } from "./abis";
import handleError from "../utils/handleErrors";
import { balanceOf } from "./balanceOf";
import checkApproval from "./check-approval";
import { notificateTx } from "@/utils/notificateTx";
import { SAM_ADDRESS, SAM_LOCK_ADDRESS } from "@/utils/constants";
import { jsonRpcProvider } from "wagmi/dist/providers/jsonRpc";

const BASE_RPC_URL = process.env.NEXT_PUBLIC_BASE_RPC_HTTPS as string;
const TEST_RPC = "http://127.0.0.1:8545";

async function getContract(signer?: ethers.Signer) {
  try {
    const provider = new ethers.JsonRpcProvider(BASE_RPC_URL);
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
  minToLock: number;
  periods: { title: string; value: number }[];
};

export async function generalInfo() {
  try {
    const contract = await getContract();

    const owner = await contract?.owner();
    const isPaused = await contract?.paused();
    const minToLock = Number(ethers.formatEther(await contract?.minToLock()));

    const threeMonths = await contract?.THREE_MONTHS();
    const sixMonths = await contract?.SIX_MONTHS();
    const nineMonths = await contract?.NINE_MONTHS();
    const twelveMonths = await contract?.TWELVE_MONTHS();

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
      periods,
    } as GeneralLockInfo;
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

// USER INFOS

export type LockInfo = {
  lockIndex: number;
  lockedAmount: number;
  withdrawnAmount: number;
  lockedAt: number;
  unlockTime: number;
  lockPeriod: number;
  multiplier: number;
  points: number;
};

export type UserInfo = {
  locks: LockInfo[];
  totalLocked: number;
  totalPoints: number;
  samBalance: number;
};

export async function userInfo(signer: ethers.Signer) {
  try {
    const signerAdress = await signer.getAddress();
    const contract = await getContract(signer);
    const userLocks = await contract?.getLockInfos(signerAdress);

    let locks: LockInfo[] = [];
    for (let i = 0; i < userLocks.length; i++) {
      const userLock = userLocks[i];
      const lock: LockInfo = {
        lockIndex: Number(userLock[0]),
        lockedAmount: Number(ethers.formatEther(userLock[1])),
        withdrawnAmount: Number(ethers.formatEther(userLock[2])),
        lockedAt: Number(userLock[3]),
        unlockTime: Number(userLock[4]),
        lockPeriod: Number(userLock[5]),
        multiplier: Number(ethers.formatEther(userLock[6])),
        points: Number(
          ethers.formatEther(await contract?.pointsByLock(signerAdress, i))
        ),
      };

      locks.push(lock);
    }

    const totalLocked: Number = locks.reduce((acc, curr) => {
      return acc + curr.lockedAmount - curr.withdrawnAmount;
    }, 0);

    const totalPoints: Number = locks.reduce((acc, curr) => {
      return acc + curr.points;
    }, 0);

    const samBalance = Number(
      ethers.formatEther(
        await balanceOf(ERC20_ABI, SAM_ADDRESS, signerAdress, signer)
      )
    );

    return {
      locks,
      totalLocked,
      totalPoints,
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
  lockIndex: number
) {
  try {
    const signerAddress = await signer.getAddress();
    const contract = await getContract(signer);
    const network = await signer.provider?.getNetwork();

    const tx = await contract?.withdraw(
      signerAddress,
      ethers.parseEther(amount),
      lockIndex.toString()
    );

    await notificateTx(tx, network);
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

export type Event = {
  wallet: string;
  amount: number;
};

export async function getLockedEvents() {
  try {
    const contract = await getContract();
    const provider = new ethers.JsonRpcProvider(BASE_RPC_URL);
    const startBlock = 13253153;
    const currentBlock = await provider.getBlockNumber();
    const blocksPerFilter = 10000;

    let allEvents: Event[] = []; // Array to store all retrieved events

    for (
      let fromBlock = startBlock;
      fromBlock <= currentBlock;
      fromBlock += blocksPerFilter
    ) {
      const toBlock = Math.min(fromBlock + blocksPerFilter - 1, currentBlock); // Ensure toBlock doesn't exceed current block
      const eventFilter = contract!.filters.Locked();
      const events = await contract!.queryFilter(
        eventFilter,
        fromBlock,
        toBlock
      );

      if (events && events?.length > 0) {
        events.forEach(async (event: any) => {
          const log = event.args as [string, number, number];
          const wallet = log[0];

          const index = allEvents.findIndex((event) => event.wallet === wallet);

          if (index !== -1) {
            allEvents[index].amount += Number(formatEther(log[1]));
          } else {
            allEvents.push({
              wallet: log[0],
              amount: Number(formatEther(log[1])),
            });
          }
        });
      }
    }

    return allEvents;
  } catch (error) {
    console.error("Error fetching contract log events:", error);
    return [];
  }
}

export type EventComplete = {
  wallet: string;
  amount: number;
  points: number;
};

export async function getLockedCompleteInfos(lockedEvents: Event[]) {
  try {
    const contract = await getContract();
    const completeEvents: EventComplete[] = [];

    for (let i = 0; i < lockedEvents.length; i++) {
      const element = lockedEvents[i];

      const lockingsByWallet = await contract?.getLockInfos(element.wallet);
      let pointsPerWallet = 0;

      for (let ii = 0; ii < lockingsByWallet.length; ii++) {
        const points = Number(
          ethers.formatEther(await contract?.pointsByLock(element.wallet, ii))
        );
        pointsPerWallet += points;
      }

      completeEvents.push({
        wallet: element.wallet,
        amount: element.amount,
        points: pointsPerWallet,
      });
    }

    return completeEvents;
  } catch (error) {
    console.error("Error fetching contract log events:", error);
    return [];
  }
}

export async function getTotalLocked() {
  try {
    const lockedEvents = await getLockedEvents();

    // CALL IT TO GET SUMARIZED VALUES ------------------------------------
    // const completeEvents = await getLockedCompleteInfos(lockedEvents);
    // console.log(completeEvents);
    // --------------------------------------------------------------------

    const totalLocked = lockedEvents?.reduce(
      (acc: number, cur: Event) => acc + cur.amount,
      0
    );

    return totalLocked;
  } catch (error) {
    return 0;
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
