import { ethers, Signer, formatEther, parseEther } from "ethers";
import handleError from "@/app/utils/handleErrors";
import {
  IDOs,
  VestingPeriodTranslator,
  VestingPeriodType,
} from "@/app/utils/constants";
import checkApproval from "./check-approval";
import { notificateTx } from "@/app/utils/notificateTx";
import { VESTING_ABI_V3 } from "./abis";
import { vestingInfos } from "./migrator";

const BASE_RPC_URL = process.env.NEXT_PUBLIC_BASE_RPC_HTTPS as string;

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
  };
  vestingType: number;
  vestingPeriod: string;
};

async function getContract(index: number, signer?: Signer) {
  try {
    const ido = IDOs[index];
    const provider = new ethers.JsonRpcProvider(BASE_RPC_URL);

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

async function getOldContract(index: number, signer?: Signer) {
  try {
    const ido = IDOs[index];
    const provider = new ethers.JsonRpcProvider(BASE_RPC_URL);

    const contract = new ethers.Contract(
      ido.oldVestingContract!,
      ido.vestingABI,
      signer || provider
    );
    return contract;
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

export async function generalInfo(index: number) {
  try {
    const ido = IDOs[index];
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
    if (ido.vestingABI === VESTING_ABI_V3) {
      const rawPeriodType = Number(await contract?.vestingPeriodType());
      const periodType = VestingPeriodType[rawPeriodType];
      vestingPeriod = VestingPeriodTranslator[periodType];
    }
    const tgeReleasePercent = Number(
      formatEther(await contract?.tgeReleasePercent())
    );

    const periods = await contract?.periods();

    const vestingDuration = Number(periods[0]);
    const vestingAt =
      ido.id === "alpaca" ? Number(periods[1]) + 60 * 15 : Number(periods[1]);
    const cliff = Number(periods[2]);

    return {
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
      },
      vestingType,
      vestingPeriod,
    } as VESTING_GENERAL_INFO;
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

export async function userInfo(index: number, signer: Signer) {
  try {
    const contract = await getContract(index);
    const signerAddress = await signer.getAddress();

    let purchased = Number(
      formatEther(await contract?.purchases(signerAddress))
    );

    let claimedTGE = await contract?.hasClaimedTGE(signerAddress);
    let askedRefund = await contract?.askedRefund(signerAddress);

    let claimedTokens = Number(
      formatEther(await contract?.tokensClaimed(signerAddress))
    );
    const claimableTokens = Number(
      formatEther(await contract?.previewClaimableTokens(signerAddress))
    );

    let claimedPoints = Number(
      formatEther(await contract?.pointsClaimed(signerAddress))
    );
    let claimablePoints = Number(
      formatEther(await contract?.previewClaimablePoints(signerAddress))
    );

    const ido = IDOs[index];

    if (ido?.oldVestingContract) {
      claimedTGE = true; // always true when used in migration

      const oldContract = await getOldContract(index, signer);

      purchased = Number(
        formatEther(await oldContract?.purchases(signerAddress))
      );

      claimedTokens += Number(
        formatEther(await contract?.tokensClaimed(signerAddress))
      );

      claimedPoints = Number(
        formatEther(await contract?.pointsClaimed(signerAddress))
      );

      claimablePoints = Number(
        formatEther(await contract?.previewClaimablePoints(signerAddress))
      );
    }

    return {
      purchased,
      claimedTGE,
      askedRefund,
      claimedTokens,
      claimableTokens,
      claimedPoints,
      claimablePoints,
    };
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
    const ido = IDOs[index];
    const contract = ido?.oldVestingContract
      ? await getOldContract(index, signer)
      : await getContract(index, signer);
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
