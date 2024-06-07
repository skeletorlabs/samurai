import { Contract, JsonRpcSigner, formatEther } from "ethers";
import { SAM_TIERS } from "../utils/constants";
import { SAM_TIERS_ABI } from "./abis";
import handleError from "../utils/handleErrors";

export type Tier = {
  name: string;
  numOfSamNfts: number;
  minLocking: number;
  maxLocking: number;
  minLPStaking: number;
  maxLPStaking: number;
};

export async function getTier(signer: JsonRpcSigner) {
  const contract = new Contract(SAM_TIERS, SAM_TIERS_ABI, signer);

  try {
    const address = await signer.getAddress();
    const response = await contract.getTier(address);

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
