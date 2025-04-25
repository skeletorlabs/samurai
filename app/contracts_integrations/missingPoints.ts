import { ethers, formatEther } from "ethers";
import { MISSING_POINTS_ABI } from "./abis";
import handleError from "@/app/utils/handleErrors";
import { notificateTx } from "@/app/utils/notificateTx";
import {
  MISSING_POINTS_V2_ADDRESS,
  MISSING_POINTS_V3_ADDRESS,
} from "../utils/constants";

const BASE_RPC_URL = process.env.NEXT_PUBLIC_BASE_RPC_HTTPS as string;

export enum MissingPointsVersion {
  v2,
  v3,
}

async function getContract(
  version: MissingPointsVersion,
  signer?: ethers.Signer
) {
  try {
    const provider = new ethers.JsonRpcProvider(BASE_RPC_URL);

    const contract = new ethers.Contract(
      version === MissingPointsVersion.v2
        ? MISSING_POINTS_V2_ADDRESS
        : MISSING_POINTS_V3_ADDRESS,
      MISSING_POINTS_ABI,
      signer || provider
    );

    return contract;
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

export type MissingPointsType = {
  claimed: boolean;
  claimable: number;
};

export async function missingPointsInfos(
  version: MissingPointsVersion,
  account: string
) {
  try {
    const contract = await getContract(version);
    const claimed = Number(formatEther(await contract?.claims(account))) > 0;
    const claimable = Number(formatEther(await contract?.calculate(account)));

    return { claimed, claimable } as MissingPointsType;
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

export async function claim(
  version: MissingPointsVersion,
  signer: ethers.Signer
) {
  try {
    const contract = await getContract(version, signer);
    const network = await signer.provider?.getNetwork();

    const tx = await contract?.claim();

    await notificateTx(tx, network);
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}
