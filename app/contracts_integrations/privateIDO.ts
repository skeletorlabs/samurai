import {
  ethers,
  formatEther,
  formatUnits,
  parseEther,
  parseUnits,
} from "ethers";
import { ERC20_ABI } from "./abis";
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

    const owner = await contract?.owner();
    const isPublic = await contract?.isPublic();
    const acceptedToken = await contract?.acceptedToken();
    const isPaused = await contract?.paused();
    // const isPaused = false;

    const minPerWallet = Number(
      ethers.formatUnits(await contract?.minPerWallet(), 6)
    );
    const maxAllocations = Number(
      ethers.formatUnits(await contract?.maxAllocations(), 6)
    );

    const raised = Number(ethers.formatUnits(await contract?.raised(), 6));

    return {
      owner,
      isPublic,
      acceptedToken,
      isPaused,
      minPerWallet,
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
    const signerAddress = await signer.getAddress();
    const contract = await getContract(index, signer);

    const maxPermitted = Number(
      ethers.formatUnits(
        await contract?.getWalletMaxPermitted(signerAddress),
        6
      )
    );

    const allocation = Number(
      ethers.formatUnits(await contract?.allocations(signerAddress), 6)
    );

    const acceptedToken = await contract?.acceptedToken();
    const balanceToken = Number(
      ethers.formatUnits(
        await balanceOf(ERC20_ABI, acceptedToken, signerAddress, signer),
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
      maxPermitted,
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
  amount: string,
  acceptedToken: string
) {
  try {
    const contract = await getContract(index, signer);
    const network = await signer.provider?.getNetwork();

    const contractAddress = await contract?.getAddress();
    await checkApproval(
      acceptedToken,
      contractAddress!,
      signer,
      parseUnits(amount, 6)
    );

    const tx = await contract?.participate(
      acceptedToken,
      parseUnits(amount, 6)
    );

    await notificateTx(tx, network);
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
  const registrationStartsAt = ido.registrationStartsAt;
  const participationStartAt = ido.participationStartsAt;
  const publicEndsAt = ido.publicParticipationEndsAt;
  const now = getUnixTime(new Date());
  const isPaused = await checkIsPaused(index);

  let phase = "Upcoming";

  if (now >= registrationStartsAt && now <= participationStartAt && !isPaused)
    phase = "Registration";
  if (now >= participationStartAt && now <= publicEndsAt && !isPaused)
    phase = "Participation";

  const contract = await getContract(index, undefined);

  const raised = Number(ethers.formatUnits(await contract?.raised(), 6));
  const maxAllocations = Number(
    ethers.formatUnits(await contract?.maxAllocations(), 6)
  );

  const minPerWallet = Number(
    ethers.formatUnits(await contract?.minPerWallet(), 6)
  );

  if (maxAllocations - raised < minPerWallet) phase = "Completed";
  if (isPaused && raised > 0) phase = "Completed";

  return phase;
}
