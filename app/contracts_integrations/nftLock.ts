import { Signer, JsonRpcProvider, Contract } from "ethers";
import { NFT_LOCK_ABI } from "./abis";
import handleError from "@/app/utils/handleErrors";
import { NFT_LOCK, SAM_NFT } from "@/app/utils/constants";
import { addMonths, fromUnixTime, getUnixTime } from "date-fns";
import { notificateTx } from "@/app/utils/notificateTx";
import checkNFTApproval from "./checkNFTApproval";
import { getTokens } from "./nft";
import { NFTToken } from "../utils/interfaces";
import { MulticallProvider } from "@ethers-ext/provider-multicall";

const BASE_RPC_URL = process.env.NEXT_PUBLIC_BASE_RPC_HTTPS as string;

async function getContract(
  signer?: Signer,
  multicallProvider?: MulticallProvider
) {
  try {
    const provider = multicallProvider
      ? multicallProvider
      : new JsonRpcProvider(BASE_RPC_URL);

    const contract = new Contract(
      NFT_LOCK,
      NFT_LOCK_ABI,
      multicallProvider || signer || provider
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
    const MAX_LOCKED = Number(await contract?.MAX_LOCKED());
    const MAX_TO_BOOST = Number(await contract?.MAX_TO_BOOST());
    const MIN_MONTHS_LOCKED = Number(await contract?.MIN_MONTHS_LOCKED());
    const totalLocked = Number(await contract?.totalLocked());
    const totalWithdrawal = Number(await contract?.totalWithdrawal());
    const lockPeriodDisabled: boolean = await contract?.lockPeriodDisabled();

    return {
      owner,
      isPaused,
      MAX_LOCKED,
      MAX_TO_BOOST,
      MIN_MONTHS_LOCKED,
      totalLocked,
      totalWithdrawal,
      lockPeriodDisabled,
    };
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

// USER INFOS

export async function userInfo(
  signer: Signer,
  account?: string,
  multicallProvider?: MulticallProvider
) {
  try {
    let signerAddress = await signer.getAddress();
    const address = account || signerAddress;
    const contract = await getContract(signer, multicallProvider);

    const locksCounter = Number(await contract?.locksCounter(address));
    const minPeriod = Number(await contract?.MIN_MONTHS_LOCKED());

    const tokens = await getTokens(signer);

    let locks: NFTToken[] = [];

    for (let index = 0; index < locksCounter; index++) {
      const lockedTokenId = Number(await contract?.getTokenId(address, index));
      const lockedAt = fromUnixTime(
        Number(await contract?.locksAt(lockedTokenId))
      );
      const lockedUntil = getUnixTime(addMonths(lockedAt, minPeriod));

      locks.push({
        tokenId: lockedTokenId,
        lockedUntil: lockedUntil,
        locked: true,
        lockIndex: index,
      });
    }

    if (locks.length > 0) {
      locks = locks.concat(tokens);
    } else {
      locks = tokens;
    }

    return { locks, balance: locksCounter };
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

export async function togglePause(signer: Signer) {
  try {
    const contract = await getContract(signer);
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

export async function lockNFT(tokenId: number, signer: Signer) {
  try {
    const contract = await getContract(signer);
    const network = await signer.provider?.getNetwork();
    await checkNFTApproval(SAM_NFT, NFT_LOCK, signer, tokenId);
    const tx = await contract?.lockNFT(tokenId);
    await notificateTx(tx, network);
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

export async function unlockNFT(
  index: number,
  tokenId: number,
  signer: Signer
) {
  try {
    const contract = await getContract(signer);
    const network = await signer.provider?.getNetwork();
    const tx = await contract?.unlockNFT(index, tokenId);
    await notificateTx(tx, network);
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

export async function unlockNFTForWallet(
  index: number,
  tokenId: number,
  signer: Signer
) {
  try {
    const contract = await getContract(signer);
    const owner = await contract?.owner();
    const signerAddress = await signer.getAddress();

    if (owner === signerAddress) {
      const network = await signer.provider?.getNetwork();
      const tx = await contract?.lockNFT(index, tokenId);
      await notificateTx(tx, network);
    }
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}
