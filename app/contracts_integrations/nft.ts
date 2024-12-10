import { ethers, Signer } from "ethers";
import { NFTS_ABI } from "./abis";
import Notificate from "@/app/components/notificate";
import handleError from "@/app/utils/handleErrors";
import {
  GeneralInfo,
  NFTMetadata,
  WhitelistDataType,
} from "@/app/utils/interfaces";
import { LINKS } from "@/app/utils/constants";

const BASE_RPC_URL = process.env.NEXT_PUBLIC_BASE_RPC_HTTPS as string;
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string;

export async function general() {
  try {
    const provider = new ethers.JsonRpcProvider(BASE_RPC_URL);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, NFTS_ABI, provider);
    const owner = await contract.owner();
    const isPaused = await contract.paused();

    const totalSupply = Number(await contract.totalSupply());
    const totalSupplyPublic = Number(await contract.totalSupplyPublic());
    const totalSupplyWhitelist = Number(await contract.totalSupplyWhitelist());
    const totalSupplyRetained = Number(await contract.totalSupplyRetained());

    const maxSupplyPublic = Number(await contract.MAX_SUPPLY_PUBLIC());
    const maxSupplyWhitelist = Number(await contract.MAX_SUPPLY_WHITELIST());
    const maxSupplyRetained = Number(await contract.MAX_SUPPLY_RETAINED());
    const maxSupplyReleased = Number(await contract.MAX_SUPPLY_RELEASED());

    const baseUri = await contract.baseURI();
    const unitPrice = Number(ethers.formatEther(await contract.UNIT_PRICE()));

    return {
      owner,
      totalSupply,
      totalSupplyPublic,
      totalSupplyWhitelist,
      totalSupplyRetained,
      maxSupplyPublic,
      maxSupplyWhitelist,
      maxSupplyReleased,
      maxSupplyRetained,
      unitPrice,
      isPaused,
      baseUri,
    } as GeneralInfo;
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

export async function togglePause(signer: ethers.Signer) {
  try {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, NFTS_ABI, signer);
    const owner = await contract.owner();
    const signerAddress = await signer.getAddress();

    if (owner === signerAddress) {
      const isPaused = await contract.paused();
      let tx: any;

      tx = isPaused ? await contract.unpause() : await contract.pause();

      const txUrl = "https://goerli.etherscan.io/tx/" + tx.hash.toString();

      Notificate({
        type: "",
        title: "Transaction Submitted",
        message: `Transaction successfully submitted.`,
        link: txUrl,
      });

      const txReceipt = await tx.wait(3);

      Notificate({
        type: "success",
        title: "Transaction Confirmed",
        message: `Transaction confirmed in block: ${txReceipt.blockNumber}.`,
        link: txUrl,
      });
    }
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

export async function isWhitelisted(signer: ethers.Signer) {
  try {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, NFTS_ABI, signer);
    const signerAddress = await signer.getAddress();

    const isWhitelisted: boolean = await contract.isWhitelisted(signerAddress);
    const hasUsedFreeMint: boolean = await contract.hasUsedFreeMint(
      signerAddress
    );
    const whitelistFinishAt = Number(await contract.whitelistRoundFinishAt());

    return {
      isWhitelisted,
      hasUsedFreeMint,
      whitelistFinishAt,
    } as WhitelistDataType;
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

export async function releaseWhitelistAssets(
  signer: ethers.Signer,
  percentage: number
) {
  try {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, NFTS_ABI, signer);
    const owner = await contract.owner();
    const signerAddress = await signer.getAddress();
    const network = await signer.provider?.getNetwork();

    if (owner === signerAddress) {
      const tx = await contract.releaseWhitelistAssets(percentage);

      const txUrl =
        LINKS[Number(network?.chainId)] + "/tx/" + tx.hash.toString();

      Notificate({
        type: "",
        title: "Transaction Submitted",
        message: `Transaction successfully submitted.`,
        link: txUrl,
      });

      const txReceipt = await tx.wait(3);

      Notificate({
        type: "success",
        title: "Transaction Confirmed",
        message: `Transaction confirmed in block: ${txReceipt.blockNumber}.`,
        link: txUrl,
      });
    }
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

export async function startWhitelistRound(signer: ethers.Signer) {
  try {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, NFTS_ABI, signer);
    const owner = await contract.owner();
    const signerAddress = await signer.getAddress();
    const network = await signer.provider?.getNetwork();

    if (owner === signerAddress) {
      const tx = await contract.setWhitelistRound();
      const txUrl =
        LINKS[Number(network?.chainId)] + "/tx/" + tx.hash.toString();

      Notificate({
        type: "",
        title: "Transaction Submitted",
        message: `Transaction successfully submitted.`,
        link: txUrl,
      });

      const txReceipt = await tx.wait(3);

      Notificate({
        type: "success",
        title: "Transaction Confirmed",
        message: `Transaction confirmed in block: ${txReceipt.blockNumber}.`,
        link: txUrl,
      });
    }
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

export async function addToWhitelist(
  signer: ethers.Signer,
  addresses: string[]
) {
  try {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, NFTS_ABI, signer);
    const owner = await contract.owner();
    const signerAddress = await signer.getAddress();
    const network = await signer.provider?.getNetwork();

    if (owner === signerAddress) {
      let tx;

      tx =
        addresses.length === 1
          ? await contract.addToWhitelist(addresses[0])
          : await contract.addBatchToWhitelist(addresses);

      const txUrl =
        LINKS[Number(network?.chainId)] + "/tx/" + tx.hash.toString();

      Notificate({
        type: "",
        title: "Transaction Submitted",
        message: `Transaction successfully submitted.`,
        link: txUrl,
      });

      const txReceipt = await tx.wait(3);

      Notificate({
        type: "success",
        title: "Transaction Confirmed",
        message: `Transaction confirmed in block: ${txReceipt.blockNumber}.`,
        link: txUrl,
      });
    }
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

export async function mint(
  numberOftokens: number,
  signer: ethers.Signer,
  free: boolean = false
) {
  try {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, NFTS_ABI, signer);
    const signerAddress = await signer.getAddress();
    const network = await signer.provider?.getNetwork();

    let tx: any;

    if (free) {
      const isWhitelisted = await contract.isWhitelisted(signerAddress);
      const hasUsedFreeMint = await contract.hasUsedFreeMint(signerAddress);

      if (isWhitelisted && !hasUsedFreeMint) {
        tx = await contract.freeMint(signerAddress);
      }
    } else {
      const unitPrice = Number(ethers.formatEther(await contract.UNIT_PRICE()));

      const amount = ethers.parseEther((unitPrice * numberOftokens).toString());
      tx = await contract.mint(signerAddress, numberOftokens, {
        value: amount,
      });
    }

    const txUrl = LINKS[Number(network?.chainId)] + "/tx/" + tx.hash.toString();

    Notificate({
      type: "",
      title: "Transaction Submitted",
      message: `Transaction successfully submitted.`,
      link: txUrl,
    });

    const txReceipt = await tx.wait(3);

    Notificate({
      type: "success",
      title: "Transaction Confirmed",
      message: `Transaction confirmed in block: ${txReceipt.blockNumber}.`,
      link: txUrl,
    });
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

export async function getNFTData(ipfsUrl: string, tokenUri: string) {
  const gateway = process.env.NEXT_PUBLIC_IPFS_GATEWAY as string;

  const metadataUrl =
    gateway +
    "/ipfs/" +
    ipfsUrl.substring(ipfsUrl.indexOf("ipfs://") + 7, ipfsUrl.length) +
    tokenUri;
  const metadataResponse = await fetch(metadataUrl);
  const metadata: NFTMetadata = await metadataResponse.json();

  const imageUrl =
    gateway +
    "/ipfs/" +
    metadata.image.substring(
      metadata.image.indexOf("ipfs://") + 7,
      metadata.image.length
    );

  return { metadata, imageUrl };
}

export async function getNftsFromUser(signer: Signer) {
  const contract = new ethers.Contract(CONTRACT_ADDRESS, NFTS_ABI, signer);
  const signerAddress = await signer.getAddress();

  const balance = Number(await contract.balanceOf(signerAddress));

  let tokensIds: Number[] = [];
  for (let index = 0; index < balance; index++) {
    const tokenId = Number(
      await contract.tokenOfOwnerByIndex(signerAddress, index)
    );
    tokensIds.push(tokenId);
  }

  return tokensIds;
}
