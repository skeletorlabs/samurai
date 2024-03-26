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

export async function generalInfo(index: number) {
  try {
    const contract = await getContract();

    const owner = await contract?.owner();
    const isPaused = await contract?.paused();

    return {
      owner,
      isPaused,
    };
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

// USER INFOS

export type LockInfo = {
  amount: number;
  lockedAt: number;
  unlockTime: number;
  lockPeriod: number;
};

export async function userInfo(signer: ethers.Signer) {
  try {
    const signerAdress = await signer.getAddress();
    const contract = await getContract(signer);
    const locksCount = await contract?.getLockInfosCount(signerAdress);
    let locks = [];

    if (locksCount > 0) {
      for (let i = 1; i <= locksCount; i++) {
        const lock: LockInfo = await contract?.getLockInfos(signerAdress, i);
        locks.push(lock);
      }
    }

    // const totalPoints = await contract?.getTotalPoints(signer);

    const samBalance = Number(
      ethers.formatEther(
        await balanceOf(ERC20_ABI, SAM_ADDRESS, signerAdress, signer)
      )
    );

    return {
      locks,
      samBalance,
    };
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

export async function lock(
  signer: ethers.Signer,
  amount: string,
  lockPeriod: string
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
