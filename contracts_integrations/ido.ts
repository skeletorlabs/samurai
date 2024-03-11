import { ethers } from "ethers";
import { ERC20_ABI } from "./abis";
import handleError from "../utils/handleErrors";
import { IDO_LIST } from "@/utils/constants";
import { balanceOf } from "./balanceOf";
import checkApproval from "./check-approval";
import { getUnixTime } from "date-fns";
import { notificateTx } from "@/utils/notificateTx";

const BASE_RPC_URL = process.env.NEXT_PUBLIC_BASE_RPC_HTTPS as string;
const TEST_RPC = "http://127.0.0.1:8545";

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
    const ido = IDO_LIST[index];
    const provider = new ethers.JsonRpcProvider(BASE_RPC_URL);

    const owner = await contract?.owner();
    const minPerWallet = Number(ethers.formatUnits(await contract?.min(), 6));
    const maxPerWallet = Number(ethers.formatUnits(await contract?.max(), 6));
    const isPublic = await contract?.isPublic();
    const acceptedToken1 = await contract?.acceptedTokens(0);
    const acceptedToken2 = await contract?.acceptedTokens(1);
    const isPaused = await contract?.paused();
    const maxAllocations =
      ido.id === "launchpad/havens-compass"
        ? Number(50_000)
        : Number(ethers.formatUnits(await contract?.maxAllocations(), 6));

    const raised =
      ido.id === "launchpad/havens-compass"
        ? ido.totalAllocation
        : Number(ethers.formatUnits(await contract?.raised(), 6));

    return {
      owner,
      minPerWallet,
      maxPerWallet,
      isPublic,
      acceptedToken1,
      acceptedToken2,
      isPaused,
      maxAllocations,
      raised,
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
    const allocation = Number(
      ethers.formatUnits(await contract?.allocations(signerAdress), 6)
    );
    const isWhitelisted = await contract?.whitelist(signerAdress);
    const isBlacklisted = await contract?.blacklist(signerAdress);
    const acceptedToken1 = await contract?.acceptedTokens(0);
    const acceptedToken2 = await contract?.acceptedTokens(1);
    const balanceToken1 = Number(
      ethers.formatUnits(
        await balanceOf(ERC20_ABI, acceptedToken1, signerAdress, signer),
        6
      )
    );

    const balanceToken2 = Number(
      ethers.formatUnits(
        await balanceOf(ERC20_ABI, acceptedToken2, signerAdress, signer),
        6
      )
    );

    const contractAddress = await contract?.getAddress();
    const acceptedToken1Balance = ethers.formatUnits(
      await balanceOf(
        ERC20_ABI,
        acceptedToken1,
        contractAddress as string,
        signer
      ),
      6
    );

    const acceptedToken2Balance = ethers.formatUnits(
      await balanceOf(
        ERC20_ABI,
        acceptedToken2,
        contractAddress as string,
        signer
      ),
      6
    );

    return {
      allocation,
      isWhitelisted,
      isBlacklisted,
      balanceToken1,
      balanceToken2,
      acceptedToken1Balance,
      acceptedToken2Balance,
    };
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

// PARTICIPATE IN THE IDO

export async function participate(
  index: number,
  signer: ethers.Signer,
  amount: string,
  acceptedToken: string
) {
  try {
    const signerAddress = await signer.getAddress();
    const contract = await getContract(index, signer);
    const network = await signer.provider?.getNetwork();

    const contractAddress = await contract?.getAddress();
    await checkApproval(
      acceptedToken,
      contractAddress!,
      signer,
      ethers.parseUnits(amount, 6)
    );

    const tx = await contract?.sendToken(
      signerAddress,
      acceptedToken,
      ethers.parseUnits(amount, 6)
    );

    await notificateTx(tx, network);
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

// ADMIN ACTIONS

export async function addToWhitelist(
  index: number,
  signer: ethers.Signer,
  addresses: string[]
) {
  try {
    const contract = await getContract(index, signer);
    const owner = await contract?.owner();
    const signerAddress = await signer.getAddress();
    const network = await signer.provider?.getNetwork();

    if (owner === signerAddress) {
      const tx = await contract?.addBatchToWhitelist(addresses);
      await notificateTx(tx, network);
    }
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

export async function addToBlacklist(
  index: number,
  signer: ethers.Signer,
  address: string
) {
  try {
    const contract = await getContract(index, signer);
    const owner = await contract?.owner();
    const signerAddress = await signer.getAddress();
    const network = await signer.provider?.getNetwork();

    if (owner === signerAddress) {
      const tx = await contract?.addToWhitelist(address);
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
  const publicEndsAt = ido.publicParticipationEndsAt;
  const now = getUnixTime(new Date());
  const isPaused = await checkIsPaused(index);

  let phase = "Upcoming";

  if (now >= participationStartAt && now <= publicEndsAt)
    phase = "Participation";
  if (now >= publicEndsAt) phase = "Completed";
  if (phase !== "Upcoming" && isPaused) phase = "Completed";

  const provider = new ethers.JsonRpcProvider(BASE_RPC_URL);

  const contract = await getContract(index, undefined);

  const maxAllocations =
    ido.id === "launchpad/havens-compass"
      ? Number(50_000)
      : Number(ethers.formatUnits(await contract?.maxAllocations(), 6));

  const raised =
    ido.id === "launchpad/havens-compass"
      ? ido.totalAllocation
      : Number(ethers.formatUnits(await contract?.raised(), 6));

  const minPerWallet = Number(ethers.formatUnits(await contract?.min(), 6));

  if (maxAllocations - raised < minPerWallet) phase = "Completed";

  return phase;
}
