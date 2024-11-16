import {
  ethers,
  Signer,
  formatEther,
  formatUnits,
  parseEther,
  parseUnits,
} from "ethers";
import { ERC20_ABI, VESTING_ABI } from "./abis";
import handleError from "@/app/utils/handleErrors";
import { IDO_LIST } from "@/app/utils/constants";
import { balanceOf } from "./balanceOf";
import checkApproval from "./check-approval";
import { getUnixTime } from "date-fns";
import { notificateTx } from "@/app/utils/notificateTx";

const BASE_RPC_URL = process.env.NEXT_PUBLIC_BASE_RPC_HTTPS as string;
const TEST_RPC = "http://127.0.0.1:8545";

export type WalletRange = {
  name: string;
  minPerWallet: number;
  maxPerWallet: number;
};

async function getContract(index: number, signer?: Signer) {
  try {
    const ido = IDO_LIST[index];
    const provider = new ethers.JsonRpcProvider(BASE_RPC_URL);

    const contract = new ethers.Contract(
      ido.vestingContract!,
      ido.abi,
      signer || provider
    );
    return contract;
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

async function general(index: number) {
  try {
    const contract = await getContract(index);
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

    return {
      totalPurchased,
      totalClaimed,
      totalPoints,
      totalPointsClaimed,
      cliffEndsAt,
      vestingEndsAt,
    };
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

async function getWalletsToRefund(index: number) {
  try {
    const contract = await getContract(index);
    const walletsToRefund = await contract?.getWalletsToRefund();

    return walletsToRefund;
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

async function user(index: number, signer: Signer) {
  try {
    const contract = await getContract(index);
    const signerAddress = await signer.getAddress();

    const purchased = Number(
      formatEther(await contract?.purchases(signerAddress))
    );

    const claimedTGE = await contract?.hasClaimedTGE(signerAddress);
    const askedRefund = await contract?.askedRefund(signerAddress);

    const claimedTokens = Number(
      formatEther(await contract?.tokensClaimed(signerAddress))
    );
    const claimableTokens = Number(
      formatEther(await contract?.previewClaimableTokens(signerAddress))
    );
    const claimedPoints = Number(
      formatEther(await contract?.pointsClaimed(signerAddress))
    );
    const claimablePoints = Number(
      formatEther(await contract?.previewClaimablePoints(signerAddress))
    );

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

  async function askForRefund(index: number, signer: Signer) {
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

  async function claimTokens(index: number, signer: Signer) {
    try {
      const contract = await getContract(index);
      const network = await signer.provider?.getNetwork();
      const tx = await contract?.claimTokens();
      await notificateTx(tx, network);
    } catch (e) {
      handleError({ e: e, notificate: true });
    }
  }
  async function claimPoints(index: number, signer: Signer) {
    try {
      const contract = await getContract(index);
      const network = await signer.provider?.getNetwork();
      const tx = await contract?.claimPoints();
      await notificateTx(tx, network);
    } catch (e) {
      handleError({ e: e, notificate: true });
    }
  }
}
