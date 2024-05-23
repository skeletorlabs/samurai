import { ethers, formatEther, parseEther } from "ethers";
import handleError from "@/app/utils/handleErrors";
import { IDO_LIST } from "@/app/utils/constants";
import { getUnixTime } from "date-fns";
import { notificateTx } from "@/app/utils/notificateTx";

const BASE_RPC_URL = process.env.NEXT_PUBLIC_BASE_RPC_HTTPS as string;
// const TEST_RPC = "http://127.0.0.1:8545";

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
      ethers.formatEther(await contract?.pricePerToken())
    );

    console.log("pricePerToken", pricePerToken);
    console.log("pricePerToken locale", pricePerToken.toLocaleString("en-us"));

    // prices per wallet ----------------------------------
    const minAPerWallet = Number(await contract?.minA());
    const maxAPerWallet = Number(await contract?.maxA());
    const minBPerWallet = Number(await contract?.minB());
    const maxBPerWallet = Number(await contract?.maxB());
    const minPublicPerWallet = Number(await contract?.minPublic());
    const maxPublicPerWallet = Number(await contract?.maxPublic());
    // ----------------------------------------------------

    const isPublic = await contract?.isPublic();
    const isPaused = await contract?.paused();
    const maxAllocations = Number(await contract?.maxAllocations());

    const raised = Number(await contract?.raised());
    const raisedInETH = Number(
      ethers.formatEther(await contract?.raisedInETH())
    );

    const provider = new ethers.JsonRpcProvider(BASE_RPC_URL);
    const ido = IDO_LIST[index];
    const contractBalance = Number(
      formatEther(await provider.getBalance(ido.contract))
    );

    return {
      owner,
      minAPerWallet,
      maxAPerWallet,
      minBPerWallet,
      maxBPerWallet,
      minPublicPerWallet,
      maxPublicPerWallet,
      pricePerToken,
      isPublic,
      isPaused,
      maxAllocations,
      raised,
      raisedInETH,
      contractBalance,
    };
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

// USER INFOS

export async function userInfo(index: number, signer: ethers.Signer) {
  try {
    const signerAdress = await signer.getAddress();
    const provider = signer.provider;
    let balance = 0;

    if (provider) {
      const nonformattedBalance = await provider.getBalance(signerAdress);

      balance = Number(formatEther(nonformattedBalance));
    }

    const contract = await getContract(index, signer);
    const allocation = Number(await contract?.allocations(signerAdress));
    const whitelistedInA = await contract?.whitelistA(signerAdress);
    const whitelistedInB = await contract?.whitelistB(signerAdress);

    return {
      balance,
      allocation,
      whitelistedInA,
      whitelistedInB,
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

    const pricePerToken = Number(
      ethers.formatEther(await contract?.pricePerToken())
    );
    const amountInETH = (Number(amount) * pricePerToken).toString();

    const tx = await contract?.participate(signerAddress, Number(amount), {
      value: parseEther(amountInETH),
    });

    await notificateTx(tx, network);
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

// ADMIN ACTIONS

export async function addToWhitelist(
  index: number,
  signer: ethers.Signer,
  addresses: string[],
  whitelistIndex: number
) {
  try {
    const contract = await getContract(index, signer);
    const owner = await contract?.owner();
    const signerAddress = await signer.getAddress();
    const network = await signer.provider?.getNetwork();

    if (owner === signerAddress) {
      const tx = await contract?.addBatchToWhitelist(addresses, whitelistIndex);
      await notificateTx(tx, network);
    }
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

export async function makePublic(index: number, signer: ethers.Signer) {
  try {
    const contract = await getContract(index, signer);
    const owner = await contract?.owner();
    const signerAddress = await signer.getAddress();
    const network = await signer.provider?.getNetwork();

    if (owner === signerAddress) {
      const tx = await contract?.makePublic();
      await notificateTx(tx, network);
    }
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

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
  const participationStartAt = ido.participationStartsAt;
  const participationEndsAt = ido.participationEndsAt;
  const publicEndsAt = ido.publicParticipationEndsAt;
  const now = getUnixTime(new Date());
  const isPaused = await checkIsPaused(index);
  let phase = "Upcoming";

  if (
    now >= participationStartAt &&
    (now <= publicEndsAt || publicEndsAt === 0)
  )
    phase = "Participation";

  if (now >= publicEndsAt && publicEndsAt !== 0) phase = "Completed";
  if (now >= participationEndsAt && publicEndsAt === 0) phase = "Completed";
  if (phase !== "Upcoming" && isPaused) phase = "Completed";
  const contract = await getContract(index, undefined);
  const maxAllocations = Number(await contract?.maxAllocations());
  const raised = Number(await contract?.raised());
  const minPerWallet = Number(await contract?.minA());
  if (maxAllocations - raised < minPerWallet) phase = "Completed";
  return phase;
}

export type Event = {
  wallet: string;
  token: string;
  amount: number;
};
