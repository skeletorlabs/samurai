import { Contract, JsonRpcProvider, JsonRpcSigner, formatEther } from "ethers";
import { CHAIN_ID_TO_RPC_URL, SAM_TIERS } from "../utils/constants";
import { SAM_TIERS_ABI } from "./abis";
import handleError from "../utils/handleErrors";
import { base } from "../utils/chains";

export type Tier = {
  name: string;
  numOfSamNfts: number;
  minLocking: number;
  maxLocking: number;
  minLPStaking: number;
  maxLPStaking: number;
};

export async function getTier(account: string) {
  const rpc = CHAIN_ID_TO_RPC_URL[base.chainId];
  const provider = new JsonRpcProvider(rpc);
  const contract = new Contract(SAM_TIERS, SAM_TIERS_ABI, provider);

  try {
    const response = await contract?.getTier(account);

    const tier: Tier = {
      name: response[0],
      numOfSamNfts: Number(response[1]),
      minLocking: Number(formatEther(response[2])),
      maxLocking: Number(formatEther(response[3])),
      minLPStaking: Number(formatEther(response[4])),
      maxLPStaking: Number(formatEther(response[5])),
    };

    return tier;
  } catch (e) {
    handleError({ e, notificate: false });
  }
}
