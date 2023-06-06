import { ethers } from "ethers";
import { NFTS_ABI } from "./abis";

export async function mint(signer: ethers.Signer) {
  const contract = new ethers.Contract("0x2E759F0f558dB7b4077097AA7f08e1158833A8E7", NFTS_ABI, signer);
  try {
    const signerAddress = await signer.getAddress();
    const tx = await contract.mint({value: 0.1}, signerAddress)
    const txReceipt = await tx.wait(3)

    console.log(txReceipt);

  } catch (error) {
    console.log(error);
  }
}