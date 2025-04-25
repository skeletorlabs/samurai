import {
  Signer,
  JsonRpcProvider,
  Contract,
  formatEther,
  parseEther,
} from "ethers";
import { ERC20_ABI, SAMURAI_POINTS_ABI } from "./abis";
import handleError from "@/app/utils/handleErrors";
import {
  CHAIN_ID_TO_RPC_URL,
  POINTS,
  POINTS_BERA,
} from "@/app/utils/constants";
import { getContract as getLockV2Contract } from "./samLockV2";
import { userInfo as pastUserInfo } from "./samLock";

import { balanceOf } from "./balanceOf";
import { notificateTx } from "../utils/notificateTx";
import { berachain } from "../utils/chains";

const BASE_RPC_URL = process.env.NEXT_PUBLIC_BASE_RPC_HTTPS as string;
const BERA_RPC_URL = process.env.NEXT_PUBLIC_BERACHAIN_RPC_HTTPS as string;

async function getContract(signer?: Signer, chainId?: number) {
  try {
    const rpc = chainId ? CHAIN_ID_TO_RPC_URL[chainId] : BASE_RPC_URL;
    const provider = new JsonRpcProvider(rpc);

    const contractAddress =
      chainId === berachain.chainId ? POINTS_BERA : POINTS;

    const contract = new Contract(
      contractAddress,
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

export async function userInfo(account: string) {
  try {
    const address = account;
    const contract = await getContract();

    const provider = new JsonRpcProvider(BASE_RPC_URL);
    const balance = Number(
      formatEther(await balanceOf(ERC20_ABI, POINTS, address, provider))
    );

    const boost = Number(formatEther(await contract?.boostOf(address))) + 1;
    const lockV2Contract = await getLockV2Contract();

    const pointsMigrated = Number(
      formatEther(await lockV2Contract?.pointsMigrated(address))
    );

    const pastUserInfos = await pastUserInfo(address);
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

export async function isPointsOwner(signer: Signer, chainId?: number) {
  try {
    let signerAddress = await signer.getAddress();
    const contract = await getContract(undefined, chainId);
    const owner = await contract?.owner();
    const isViewer =
      signerAddress === "0xcae8cf1e2119484d6cc3b6efaad2242adbdb1ea8";

    const isOwner = owner === signerAddress;

    return { isOwner, isViewer };
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

export async function grantRole(role: number, address: string, signer: Signer) {
  try {
    const network = await signer.provider?.getNetwork();
    const contract = await getContract(signer);
    const tx = await contract?.grantRole(role, address);

    await notificateTx(tx, network);
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

export async function revokeRole(
  role: number,
  address: string,
  signer: Signer
) {
  try {
    const network = await signer.provider?.getNetwork();
    const contract = await getContract(signer);
    const tx = await contract?.revokeRole(role, address);

    await notificateTx(tx, network);
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}
