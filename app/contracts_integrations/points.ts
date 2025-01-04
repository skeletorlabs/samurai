import { Signer, JsonRpcProvider, Contract, formatEther } from "ethers";
import { SAMURAI_POINTS_ABI } from "./abis";
import handleError from "@/app/utils/handleErrors";
import { POINTS } from "@/app/utils/constants";

import { balanceOf } from "./balanceOf";

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

export async function userInfo(signer: Signer) {
  try {
    const signerAddress = await signer.getAddress();
    const contract = await getContract(signer);

    const balance = Number(
      await balanceOf(SAMURAI_POINTS_ABI, POINTS, signerAddress, signer)
    );
    const boost = Number(formatEther(await contract?.boostOf(signerAddress)));

    return { balance, boost };
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}
