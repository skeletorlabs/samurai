import { ethers } from "ethers";
import { NFTS_ABI } from "./abis";

const CONTRACT_ADDRESS = "0x2E759F0f558dB7b4077097AA7f08e1158833A8E7";

export async function mint(signer: ethers.Signer) {
  try {
    console.log(signer)
    const contract = new ethers.Contract(CONTRACT_ADDRESS, NFTS_ABI, signer)

    // console.log(contract)
    const signerAddress = await signer.getAddress();

    const amount = ethers.parseEther("0.1");

    console.log(signerAddress, amount)
    const tx = await contract.safeMint(signerAddress, {value: amount});
    const txReceipt = await tx.wait(3)

    console.log(txReceipt);

  } catch (error) {
    console.log(error);
  }
}