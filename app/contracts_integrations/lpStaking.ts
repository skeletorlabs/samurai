import { ethers, formatEther } from "ethers";
import { ERC20_ABI, LP_STAKING_ABI, LP_STAKING_ABI_MIN } from "./abis";
import handleError from "@/app/utils/handleErrors";
import { balanceOf } from "./balanceOf";
import checkApproval from "./check-approval";
import { notificateTx } from "@/app/utils/notificateTx";
import { LP_STAKING, LP_TOKEN } from "../utils/constants";

const BASE_RPC_URL = process.env.NEXT_PUBLIC_BASE_RPC_HTTPS as string;

async function getContract(signer?: ethers.Signer) {
  try {
    const provider = new ethers.JsonRpcProvider(BASE_RPC_URL);

    const contract = new ethers.Contract(
      LP_STAKING,
      // LP_STAKING_ABI,
      LP_STAKING_ABI_MIN,
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

  const pointsPerToken = Number(formatEther(await contract?.pointsPerToken()));

  return { multiplier, pointsPerToken };
}

export async function getEstimatedPoints(amount: string, period: number) {
  const { multiplier, pointsPerToken } = await getMultiplierByPeriod(period);

  return Number(amount) * pointsPerToken * multiplier;
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

    // const periods = [
    //   { title: "3 Months", value: threeMonths },
    //   { title: "6 Months", value: sixMonths },
    //   { title: "9 Months", value: nineMonths },
    //   { title: "12 Months", value: twelveMonths },
    // ];
    const periods = [
      { title: "9 minutes", value: threeMonths },
      { title: "18 minutes", value: sixMonths },
      { title: "27 minutes", value: nineMonths },
      { title: "36 minutes", value: twelveMonths },
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
  index: number;
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
  claimedRewards: number;
  lpBalance: number;
  claimableRewards: number;
  lastClaim: number;
};

export async function userInfo(signer: ethers.Signer) {
  try {
    const signerAddress = await signer.getAddress();
    // const signerAddress = "0xf96Bc096dd1E52dcE4d595B6C4B8c5d2200db1E5";
    const contract = await getContract(signer);
    const userStakes = await contract?.stakesOf(signerAddress);

    let stakes: StakingInfo[] = [];

    for (let i = 0; i < userStakes.length; i++) {
      const userStake = userStakes[i];
      const claimablePoints = Number(
        formatEther(await contract?.previewClaimablePoints(signerAddress, i))
      );

      const stake: StakingInfo = {
        index: i,
        stakedAmount: Number(ethers.formatEther(userStake[0])),
        withdrawnAmount: Number(ethers.formatEther(userStake[1])),
        stakedAt: Number(userStake[2]),
        withdrawTime: Number(userStake[3]),
        stakePeriod: Number(userStake[4]),
        claimablePoints: claimablePoints,
        claimedPoints: Number(formatEther(userStake[5])),
        claimedRewards: Number(formatEther(userStake[6])),
      };
      stakes.push(stake);
    }

    const claimableRewards = Number(
      formatEther(await contract?.previewRewards(signerAddress))
    );

    let totalStaked: Number = stakes.reduce((acc, curr) => {
      return acc + curr.stakedAmount - curr.withdrawnAmount;
    }, 0);

    const claimedPoints: Number = stakes.reduce((acc, curr) => {
      return acc + curr.claimedPoints;
    }, 0);

    const availablePoints = stakes.reduce((acc, curr) => {
      return acc + curr.claimablePoints;
    }, 0);

    const claimedRewards = stakes.reduce((acc, curr) => {
      return acc + curr.claimedRewards;
    }, 0);

    let lpBalance = Number(
      ethers.formatEther(
        await balanceOf(ERC20_ABI, LP_TOKEN, signerAddress, signer)
      )
    );

    const lastClaim = Number(await contract?.lastClaims(signerAddress));

    return {
      stakings: stakes,
      totalStaked,
      claimedPoints,
      availablePoints,
      claimedRewards,
      lpBalance,
      claimableRewards,
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
    const contract = await getContract(signer);
    const network = await signer.provider?.getNetwork();

    await checkApproval(
      LP_TOKEN,
      LP_STAKING,
      signer,
      ethers.parseEther(amount)
    );

    const tx = await contract?.stake(ethers.parseEther(amount), stakePeriod);

    await notificateTx(tx, network);
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

export async function withdraw(
  signer: ethers.Signer,
  amount: string,
  stakeIndex: number
) {
  try {
    const contract = await getContract(signer);
    const network = await signer.provider?.getNetwork();

    const tx = await contract?.withdraw(
      ethers.parseEther(amount),
      stakeIndex.toString()
    );

    await notificateTx(tx, network);
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

export async function claimRewards(signer: ethers.Signer) {
  try {
    const contract = await getContract(signer);
    const network = await signer.provider?.getNetwork();

    const tx = await contract?.claimRewards();

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
