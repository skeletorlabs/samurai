import { SAM_NFT } from "@/utils/constants";
import { Contract, JsonRpcSigner } from "ethers";
import { NFTS_ABI } from "./abis";

export async function checkNftHolding(signer: JsonRpcSigner) {
  const address = await signer.getAddress();
  const contract = new Contract(SAM_NFT, NFTS_ABI, signer);
  const balance = await contract.balanceOf(address);

  return balance;
}
export async function lockingSam(signer: JsonRpcSigner) {
  return 0;
}
export async function stakingLP(signer: JsonRpcSigner) {
  return 0;
}

export async function getTierByWallet(signer: JsonRpcSigner) {
  const holding = await checkNftHolding(signer);
  const locking = await lockingSam(signer);
  const staking = await stakingLP(signer);
}
