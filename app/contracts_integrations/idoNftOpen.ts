import { ethers } from "ethers";
import { ERC20_ABI } from "./abis";
import handleError from "@/app/utils/handleErrors";
import { IDO_LIST } from "@/app/utils/constants";
import { balanceOf } from "./balanceOf";
import checkApproval from "./check-approval";
import { getUnixTime } from "date-fns";
import { notificateTx } from "@/app/utils/notificateTx";

const BASE_RPC_URL = process.env.NEXT_PUBLIC_BASE_RPC_HTTPS as string;

async function getContract(index: number, signer?: ethers.Signer) {
  try {
    const ido = IDO_LIST[index];
    const provider = new ethers.JsonRpcProvider(BASE_RPC_URL);
    const contractAddress = ido.contract;
    const contract = new ethers.Contract(
      contractAddress,
      ido.abi,
      signer || provider
    );

    return contract;
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

// OVERALL INFOS

export async function checkIsPaused(index: number) {
  try {
    const contract = await getContract(index);
    const isPaused = await contract?.paused();
    return isPaused;
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

export async function generalInfo(index: number) {
  try {
    const contract = await getContract(index);
    const owner = await contract?.owner();
    const pricePerToken = Number(
      ethers.formatUnits(await contract?.pricePerToken(), 6)
    );

    // prices per wallet ----------------------------------
    const minPerWallet = Number(await contract?.min());
    const maxPerWallet = Number(await contract?.max());

    // ----------------------------------------------------

    const acceptedToken = await contract?.acceptedToken();
    const isPaused = await contract?.paused();
    const maxAllocations = Number(await contract?.maxAllocations());

    const raised = Number(await contract?.raised());
    const raisedInTokensPermitted = raised * pricePerToken;

    return {
      owner,
      minPerWallet,
      maxPerWallet,
      pricePerToken,
      acceptedToken,
      isPaused,
      maxAllocations,
      raised,
      raisedInTokensPermitted,
    };
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

// USER INFOS

export async function userInfo(index: number, signer: ethers.Signer) {
  try {
    const signerAdress = await signer.getAddress();
    const contract = await getContract(index, signer);

    const allocation = Number(await contract?.allocations(signerAdress));

    const acceptedToken = await contract?.acceptedToken();
    const balanceToken = Number(
      ethers.formatUnits(
        await balanceOf(ERC20_ABI, acceptedToken, signerAdress, signer),
        6
      )
    );

    const contractAddress = await contract?.getAddress();
    const acceptedTokenBalance = ethers.formatUnits(
      await balanceOf(
        ERC20_ABI,
        acceptedToken,
        contractAddress as string,
        signer
      ),
      6
    );

    return {
      allocation,
      balanceToken,
      acceptedTokenBalance,
    };
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

// PARTICIPATE IN THE IDO

export async function participate(
  index: number,
  signer: ethers.Signer,
  amount: string
) {
  try {
    const signerAddress = await signer.getAddress();
    const contract = await getContract(index, signer);
    const network = await signer.provider?.getNetwork();
    const acceptedToken = await contract?.acceptedToken();

    const contractAddress = await contract?.getAddress();
    const pricePerToken = Number(
      ethers.formatUnits(await contract?.pricePerToken(), 6)
    );
    const amountInTokens = (Number(amount) * pricePerToken).toString();

    await checkApproval(
      acceptedToken,
      contractAddress!,
      signer,
      ethers.parseUnits(amountInTokens, 6)
    );

    const tx = await contract?.sendToken(
      signerAddress,
      acceptedToken,
      ethers.parseUnits(amountInTokens, 6)
    );

    await notificateTx(tx, network);
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

// ADMIN ACTIONS

export async function withdraw(index: number, signer: ethers.Signer) {
  try {
    const contract = await getContract(index, signer);
    const owner = await contract?.owner();
    const signerAddress = await signer.getAddress();
    const network = await signer.provider?.getNetwork();

    if (owner === signerAddress) {
      const tx = await contract?.withdraw();
      await notificateTx(tx, network);
    }
  } catch (e) {
    handleError({ e: e, notificate: true });
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

export async function getParticipationPhase(index: number) {
  const ido = IDO_LIST[index];

  if (ido.projectName === "KIP Protocol") return "Completed";

  const participationStartsAt = ido.participationStartsAt;
  const participationEndsAt = ido.participationEndsAt;
  const now = getUnixTime(new Date());
  const isPaused = await checkIsPaused(index);
  let phase = "Upcoming";
  if (now >= participationStartsAt && now <= participationEndsAt)
    phase = "Participation";
  if (now >= participationEndsAt) phase = "Completed";
  if (phase !== "Upcoming" && isPaused) phase = "Completed";
  const contract = await getContract(index, undefined);
  const maxAllocations = Number(await contract?.maxAllocations());
  const raised = Number(await contract?.raised());
  const minPerWallet = Number(await contract?.min());
  if (maxAllocations - raised < minPerWallet) phase = "Completed";
  return phase;
}

export type Event = {
  wallet: string;
  token: string;
  amount: number;
};
