import { ethers, formatEther } from "ethers";
import { ERC20_ABI, LP_STAKING_ABI } from "./abis";
import handleError from "@/app/utils/handleErrors";
import { balanceOf } from "./balanceOf";
import checkApproval from "./check-approval";
import { notificateTx } from "@/app/utils/notificateTx";
import { LP_TOKEN } from "../utils/constants";

const BASE_RPC_URL = process.env.NEXT_PUBLIC_BASE_RPC_HTTPS as string;

async function getContract(signer?: ethers.Signer) {
  try {
    const provider = new ethers.JsonRpcProvider(BASE_RPC_URL);
    const contractAddress = "0x....";
    const contract = new ethers.Contract(
      contractAddress,
      LP_STAKING_ABI,
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

export async function generalInfo() {
  try {
    const contract = await getContract();

    const owner = await contract?.owner();
    const isPaused = await contract?.paused();

    const maxStakesPerWallet = Number(await contract?.MAX_STAKES_PER_WALLET());
    const maxAmountToStake = Number(
      ethers.formatEther(await contract?.MAX_AMOUNT_TO_STAKE())
    );
    const claimDelayPeriod = Number(await contract?.CLAIM_DELAY_PERIOD());
    const threeMonths = await contract?.THREE_MONTHS();
    const sixMonths = await contract?.SIX_MONTHS();
    const nineMonths = await contract?.NINE_MONTHS();
    const twelveMonths = await contract?.TWELVE_MONTHS();

    const totalStaked = Number(
      ethers.formatEther(await contract?.totalStaked())
    );
    const totalWithdrawn = Number(
      ethers.formatEther(await contract?.totalWithdrawn())
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
      maxStakesPerWallet,
      maxAmountToStake,
      claimDelayPeriod,
      periods,
      totalStaked,
      totalWithdrawn,
    };
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

// USER INFOS

export type StakingInfo = {
  stakedAmount: number;
  withdrawnAmount: number;
  stakedAt: number;
  withdrawTime: number;
  stakePeriod: number;
  claimedPoints: number;
  claimablePoints: number;
  claimedRewards: number;
};

export type UserInfo = {
  stakings: StakingInfo[];
  totalStaked: number;
  claimedPoints: number;
  availablePoints: number;
  lpBalance: number;
  lastClaim: number;
};

export async function userInfo(signer: ethers.Signer) {
  try {
    const signerAdress = await signer.getAddress();
    const contract = await getContract(signer);
    const userLocks = await contract?.getLockInfos(signerAdress);

    let stakes: StakingInfo[] = [];
    for (let i = 0; i < userLocks.length; i++) {
      const userLock = userLocks[i];
      const claimablePoints = Number(
        formatEther(await contract?.previewClaimablePoints(signerAdress, i))
      );
      const stake: StakingInfo = {
        stakedAmount: Number(ethers.formatEther(userLock[1])),
        withdrawnAmount: Number(ethers.formatEther(userLock[2])),
        stakedAt: Number(userLock[3]),
        withdrawTime: Number(userLock[4]),
        stakePeriod: Number(userLock[5]),
        claimablePoints: claimablePoints,
        claimedPoints: Number(formatEther(userLock[6])),
        claimedRewards: Number(formatEther(userLock[7])),
      };

      stakes.push(stake);
    }

    const totalStaked: Number = stakes.reduce((acc, curr) => {
      return acc + curr.stakedAmount - curr.withdrawnAmount;
    }, 0);

    const claimedPoints: Number = stakes.reduce((acc, curr) => {
      return acc + curr.claimedPoints;
    }, 0);

    const availablePoints = stakes.reduce((acc, curr) => {
      return acc + curr.claimablePoints;
    }, 0);

    const lpBalance = Number(
      ethers.formatEther(
        await balanceOf(ERC20_ABI, "0x...", signerAdress, signer)
      )
    );

    const lastClaim = Number(await contract?.lastClaims(signerAdress));

    return {
      stakings: stakes,
      totalStaked,
      claimedPoints,
      availablePoints,
      lpBalance,
      lastClaim,
    } as UserInfo;
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

export async function stake(
  signer: ethers.Signer,
  amount: string,
  stakePeriod: number
) {
  try {
    const signerAddress = await signer.getAddress();
    const contract = await getContract(signer);
    const network = await signer.provider?.getNetwork();

    await checkApproval(LP_TOKEN, "0x...", signer, ethers.parseEther(amount));

    const tx = await contract?.stake(
      signerAddress,
      ethers.parseEther(amount),
      stakePeriod
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

export async function claimRewards(signer: ethers.Signer) {
  try {
    const signerAddress = await signer.getAddress();
    const contract = await getContract(signer);
    const network = await signer.provider?.getNetwork();

    const tx = await contract?.claimRewards(signerAddress);

    await notificateTx(tx, network);
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

export async function claimPoints(signer: ethers.Signer) {
  try {
    const signerAddress = await signer.getAddress();
    const contract = await getContract(signer);
    const network = await signer.provider?.getNetwork();

    const tx = await contract?.claimPoints(signerAddress);

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
