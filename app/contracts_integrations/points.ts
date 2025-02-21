import {
  Signer,
  JsonRpcProvider,
  Contract,
  formatEther,
  parseEther,
} from "ethers";
import { ERC20_ABI, SAMURAI_POINTS_ABI } from "./abis";
import handleError from "@/app/utils/handleErrors";
import { POINTS } from "@/app/utils/constants";
import { getContract as getLockV2Contract } from "./samLockV2";
import { userInfo as pastUserInfo } from "./samLock";

import { balanceOf } from "./balanceOf";
import { notificateTx } from "../utils/notificateTx";

const BASE_RPC_URL = process.env.NEXT_PUBLIC_BASE_RPC_HTTPS as string;

async function getContract(signer?: Signer) {
  try {
    const provider = new JsonRpcProvider(BASE_RPC_URL);

    const contract = new Contract(
      POINTS,
      SAMURAI_POINTS_ABI,
      signer || provider
    );

    return contract;
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

export type UserPoints = {
  balance: number;
  boost: number;
  pointsMigrated: Number;
  pointsToMigrate: number;
};

export async function userInfo(signer: Signer, account?: string) {
  try {
    let signerAddress = await signer.getAddress();
    const address = account || signerAddress;
    const contract = await getContract(signer);

    const balance = Number(
      formatEther(await balanceOf(ERC20_ABI, POINTS, address, signer))
    );

    const boost = Number(formatEther(await contract?.boostOf(address)));

    const lockV2Contract = await getLockV2Contract(signer);

    const pointsMigrated = Number(
      formatEther(await lockV2Contract?.pointsMigrated(address))
    );

    const pastUserInfos = await pastUserInfo(signer, address);
    const pointsToMigrate = (pastUserInfos?.totalPoints || 0) - pointsMigrated;

    return { balance, boost, pointsMigrated, pointsToMigrate } as UserPoints;
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

export async function burn(signer: Signer, from: string, amount: string) {
  try {
    const network = await signer.provider?.getNetwork();
    const contract = await getContract(signer);
    const tx = await contract?.burn(from, parseEther(amount));

    await notificateTx(tx, network);
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

export async function isPointsOwner(signer: Signer) {
  try {
    const signerAddress = await signer.getAddress();
    const contract = await getContract(signer);
    const owner = await contract?.owner();

    return owner === signerAddress;
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

export async function migratePoints(signer: Signer) {
  try {
    const lockV2Contract = await getLockV2Contract(signer);
    const network = await signer.provider?.getNetwork();

    const tx = await lockV2Contract?.migrateVirtualPointsToTokens();

    await notificateTx(tx, network);
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}
