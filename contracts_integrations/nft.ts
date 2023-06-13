import { ethers } from "ethers";
import { NFTS_ABI } from "./abis";
import Notificate from '../components/notificate'
import handleError from '../utils/handleErrors'
import { GeneralInfo, NFTMetadata } from "@/utils/interfaces";

const GOERLI_RPC_URL = process.env.NEXT_PUBLIC_GOERLI_RPC_URL as string;
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string;

export async function general() {
  try {
    const provider = new ethers.JsonRpcProvider(GOERLI_RPC_URL);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, NFTS_ABI, provider)
    // const signerAddress = await signer.getAddress();
    const isPaused = await contract.paused();
    const totalSupply = await contract.totalSupply()
    const baseUri = await contract.baseURI();
    

    return { 
      totalSupply, 
      isPaused,
      baseUri
    } as GeneralInfo
  } catch (e) {
    handleError({ e: e, notificate: true })
  }
}

export async function mint(signer: ethers.Signer) {
  try {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, NFTS_ABI, signer)
    const signerAddress = await signer.getAddress();
    
    const isWhitelisted = await contract.isWhitelisted(signerAddress)
    const hasUsedFreeMint = await contract.hasUsedFreeMint(signerAddress)
    

    let tx: any
    
    if (isWhitelisted && !hasUsedFreeMint) {
      tx = await contract.freeMint(signerAddress);
    } else {
      const amount = ethers.parseEther("0.1");
      tx = await contract.mint(signerAddress, {value: amount});
    }

    const txUrl = 'https://goerli.etherscan.io/tx/' + tx.hash.toString()

    Notificate({
      type: '',
      title: 'Transaction Submitted',
      message: `Transaction successfully submitted.`,
      link: txUrl,
    })

    const txReceipt = await tx.wait(3)

    Notificate({
      type: 'success',
      title: 'Transaction Confirmed',
      message: `Transaction confirmed in block: ${txReceipt.blockNumber}.`,
      link: txUrl,
    })

  } catch (e) {
    handleError({ e: e, notificate: true })
  }
}

export async function getNFTData(ipfsUrl: string, tokenUri: string) {
  const gateway = process.env.NEXT_PUBLIC_IPFS_GATEWAY as string

  const metadataUrl = gateway + "/ipfs/" + ipfsUrl.substring(ipfsUrl.indexOf("ipfs://") + 7, ipfsUrl.length) + tokenUri
  const metadataResponse = await fetch(metadataUrl);
  const metadata: NFTMetadata = await metadataResponse.json();

  const imageUrl = gateway + "/ipfs/" + metadata.image.substring(metadata.image.indexOf("ipfs://") + 7, metadata.image.length)
  
  return { metadata, imageUrl }
}