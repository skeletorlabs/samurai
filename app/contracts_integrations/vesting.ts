import { ethers, Signer, formatEther, parseEther } from "ethers";
import handleError from "@/app/utils/handleErrors";
import {
  CHAIN_ID_TO_RPC_URL,
  IDOs,
  VestingPeriodTranslator,
} from "@/app/utils/constants";
import checkApproval from "./check-approval";
import { notificateTx } from "@/app/utils/notificateTx";
import { VESTING_ABI_V3 } from "./abis";
import {
  addDays,
  addMonths,
  addWeeks,
  fromUnixTime,
  getUnixTime,
} from "date-fns";

const BASE_RPC_URL = process.env.NEXT_PUBLIC_BASE_RPC_HTTPS as string;
const BERA_RPC_URL = process.env.NEXT_PUBLIC_BERACHAIN_RPC_HTTPS as string;
const now = getUnixTime(new Date());

export type WalletRange = {
  name: string;
  minPerWallet: number;
  maxPerWallet: number;
};

export type VESTING_GENERAL_INFO = {
  owner: string;
  paused: boolean;
  totalPurchased: number;
  totalClaimed: number;
  totalPoints: number;
  totalPointsClaimed: number;
  tgeReleasePercent: number;
  periods: {
    vestingDuration: number;
    vestingAt: number;
    cliff: number;
    cliffEndsAt: number;
    vestingEndsAt: number;
    nextUnlock: number;
  };
  vestingType: number;
  vestingPeriod: string;
};

async function getContract(index: number, signer?: Signer) {
  try {
    const ido = IDOs[index];
    const rpc = CHAIN_ID_TO_RPC_URL[ido.vestingChain?.chainId!];
    const provider = new ethers.JsonRpcProvider(rpc);

    const contract = new ethers.Contract(
      ido.vesting!,
      ido.vestingABI,
      signer || provider
    );
    return contract;
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

enum VestingPeriodType {
  Days = 2,
  Weeks = 3,
  Months = 4,
}

function getAllUnlocks(
  vestingStart: number,
  vestingEnd: number,
  periodType: VestingPeriodType
): number[] {
  const startDate = new Date(vestingStart * 1000);
  const endDate = new Date(vestingEnd * 1000);

  if (startDate > endDate) {
    throw new Error("Start date cannot be after end date.");
  }

  const unlockDates: number[] = [];
  let currentDate = startDate;

  while (currentDate <= endDate) {
    unlockDates.push(getUnixTime(currentDate));

    switch (periodType) {
      case VestingPeriodType.Days:
        currentDate = addDays(currentDate, 1);
        break;
      case VestingPeriodType.Weeks:
        currentDate = addWeeks(currentDate, 1);
        break;
      case VestingPeriodType.Months:
        currentDate = addMonths(currentDate, 1);
        break;
      default:
        throw new Error(`Invalid periodType: ${periodType}`);
    }
  }

  return unlockDates;
}

function getNextUnlock(
  vestingStart: number,
  vestingEnd: number,
  periodType: VestingPeriodType
): number {
  if (now >= vestingEnd) {
    return 0; // No more unlocks
  }

  const allUnlocks = getAllUnlocks(vestingStart, vestingEnd, periodType);

  const next = allUnlocks.find((timestamp: number) => timestamp >= now);

  return next ? next : 0;
}

export async function generalInfo(index: number) {
  try {
    const ido = IDOs[index];
    console.log("on vesting ido id", ido.id);
    const contract = await getContract(index);

    const owner = await contract?.owner();
    const paused = await contract?.paused();

    const totalPurchased = Number(
      formatEther(await contract?.totalPurchased())
    );

    const totalClaimed = Number(formatEther(await contract?.totalClaimed()));
    const totalPoints = Number(formatEther(await contract?.totalPoints()));
    const totalPointsClaimed = Number(
      formatEther(await contract?.totalPointsClaimed())
    );

    const cliffEndsAt = Number(await contract?.cliffEndsAt());
    const vestingEndsAt = Number(await contract?.vestingEndsAt());

    const vestingType = Number(await contract?.vestingType());
    let vestingPeriod = "";
    let rawPeriodType = 0;

    if (ido.vestingABI === VESTING_ABI_V3) {
      rawPeriodType = Number(await contract?.vestingPeriodType());
      const periodType = VestingPeriodType[rawPeriodType];
      vestingPeriod = VestingPeriodTranslator[periodType];
    }

    if (ido.id === "dyor") {
      rawPeriodType = 4;
    }
    if (ido.id === "earnm-r2") {
      rawPeriodType = 2;
    }
    const tgeReleasePercent = Number(
      formatEther(await contract?.tgeReleasePercent())
    );

    const periods = await contract?.periods();
    const vestingDuration = Number(periods[0]);

    let vestingAt =
      ido.id === "alpaca" ? Number(periods[1]) + 60 * 15 : Number(periods[1]);

    const cliff = Number(periods[2]);

    let nextUnlock = 0;

    // 2 is the vesting type for periodic vesting
    if (vestingType === 2)
      nextUnlock = getNextUnlock(cliffEndsAt, vestingEndsAt, rawPeriodType);

    const data = {
      owner,
      paused,
      totalPurchased,
      totalClaimed,
      totalPoints,
      totalPointsClaimed,
      tgeReleasePercent,
      periods: {
        vestingDuration,
        vestingAt,
        cliff,
        cliffEndsAt,
        vestingEndsAt,
        nextUnlock,
      },
      vestingType,
      vestingPeriod,
    } as VESTING_GENERAL_INFO;

    // console.log(data);

    return data;
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

export async function getWalletsToRefund(index: number) {
  try {
    const contract = await getContract(index);
    const walletsToRefund = await contract?.getWalletsToRefund();

    return walletsToRefund;
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

export async function userInfo(
  index: number,
  signer: Signer,
  account?: string
) {
  try {
    const contract = await getContract(index);
    let signerAddress = await signer.getAddress();

    const address = account || signerAddress;

    const purchased = Number(formatEther(await contract?.purchases(address)));

    const claimedTGE = await contract?.hasClaimedTGE(address);
    const askedRefund = await contract?.askedRefund(address);

    const claimedTokens = Number(
      formatEther(await contract?.tokensClaimed(address))
    );
    let claimableTokens = 0;

    try {
      claimableTokens = Number(
        formatEther(await contract?.previewClaimableTokens(address))
      );
    } catch (_) {}

    const claimedPoints = Number(
      formatEther(await contract?.pointsClaimed(address))
    );
    let claimablePoints = Number(
      formatEther(await contract?.previewClaimablePoints(address))
    );

    const data = {
      purchased,
      claimedTGE,
      askedRefund,
      claimedTokens,
      claimableTokens,
      claimedPoints,
      claimablePoints,
    };

    return data;
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

export async function askForRefund(index: number, signer: Signer) {
  try {
    const contract = await getContract(index);
    const signerAddress = await signer.getAddress();
    const network = await signer.provider?.getNetwork();
    const claimedTGE = await contract?.hasClaimedTGE(signerAddress);
    const askedRefund = await contract?.askedRefund(signerAddress);

    if (!claimedTGE && !askedRefund) {
      const tx = await contract?.askForRefund();
      await notificateTx(tx, network);
    }
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

export async function claimTokens(index: number, signer: Signer) {
  try {
    const contract = await getContract(index, signer);
    const network = await signer.provider?.getNetwork();
    const tx = await contract?.claim();
    await notificateTx(tx, network);
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

export async function claimPoints(index: number, signer: Signer) {
  try {
    const contract = await getContract(index, signer);
    const network = await signer.provider?.getNetwork();
    const tx = await contract?.claimPoints();
    await notificateTx(tx, network);
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

export async function fillIDOToken(index: number, signer: Signer) {
  try {
    const contract = await getContract(index, signer);
    const network = await signer.provider?.getNetwork();
    const token = await contract?.token();
    const contractAddress = await contract?.getAddress();
    const totalPurchased = Number(
      formatEther(await contract?.totalPurchased())
    );
    await checkApproval(
      token,
      contractAddress!,
      signer,
      parseEther(totalPurchased.toString())
    );
    const tx = await contract?.fillIDOToken(
      parseEther(totalPurchased.toString())
    );
    await notificateTx(tx, network);
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

export async function isWalletEnableToFill(signer: Signer) {
  try {
    const fillWallet = process.env.NEXT_PUBLIC_FILL_WALLET as string;
    const signerAddress = await signer.getAddress();

    if (signerAddress === fillWallet) return true;
    return false;
  } catch (error) {
    return false;
  }
}

export async function togglePause(index: number, signer: ethers.Signer) {
  const contract = await getContract(index, signer);

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
