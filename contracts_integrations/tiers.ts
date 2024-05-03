import { SAM_NFT } from "@/utils/constants";
import { Contract, JsonRpcSigner } from "ethers";
import { NFTS_ABI } from "./abis";

export async function isSamHolder(signer: JsonRpcSigner) {
  const address = await signer.getAddress();
  const contract = new Contract(SAM_NFT, NFTS_ABI, signer);
  const balance = await contract.balanceOf(address);

  return balance > 0;
}
export async function isLockingSam(signer: JsonRpcSigner) {}
export async function isStakingLP(signer: JsonRpcSigner) {}

export async function getTierByWallet(signer: JsonRpcSigner) {
  const isHolder = await isSamHolder(signer);
  const isLocking = await isLockingSam(signer);
  const isStaking = await isStakingLP(signer);
}
