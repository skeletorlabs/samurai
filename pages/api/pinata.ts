import type { NextApiRequest, NextApiResponse } from "next";
import Pinata, { PinataPinResponse } from "@pinata/sdk";
import fs from "fs";
const rfs = require("recursive-fs");

const pinata = new Pinata({
  pinataApiKey: process.env.NEXT_PUBLIC_PINATA_API_KEY,
  pinataJWTKey: process.env.NEXT_PUBLIC_PINATA_JWT,
  pinataSecretApiKey: process.env.NEXT_PUBLIC_PINATA_API_SECRET,
});

export async function generateDefaultImages() {
  const basePath = __dirname.substring(0, __dirname.indexOf("/.next"));
  // const options = [
  //   "/public/unrevealed-male.png",
  //   "/public/unrevealed-female.png",
  // ];
  const imagePath = "/public/unrevealed.png";

  for (let index = 0; index < 10000; index++) {
    const template = fs.readFileSync(basePath + "/public/unrevealed.png");
    // const template = fs.readFileSync(basePath + imagePath);

    const path =
      basePath + "/public/nfts-default-images/" + (index + 1) + ".png";

    fs.writeFileSync(path, template);
  }
}

export async function generateMetadataFiles(imagesFolderHash: string) {
  for (let index = 0; index < 10000; index++) {
    const metadata = {
      name: "Drop it like it's L2VE",
      description:
        "The only L2VE you need in your life. 100% degen approved Meme farming. Show your L2VE to the world with the first NFT series that makes your friends regret they have a rl",
      image: `ipfs://${imagesFolderHash}/${index + 1}.png`,
      edition: 1,
      date: Math.floor(Date.now() / 1000),
      attributes: [
        {
          trait_type: "Unrevealed",
          value: "L2VE",
        },
      ],
      compiler: "HashLips Art Engine",
    };

    const data = JSON.stringify(metadata);
    const path =
      __dirname.substring(0, __dirname.indexOf("/.next")) +
      "/public/nfts-metadata/" +
      (index + 1) +
      ".json";

    fs.writeFileSync(path, data);
  }
}

// Pin an entire folder and it's content on pinata cloud
async function pinFolder(
  _subpath: string,
  _name: string
): Promise<PinataPinResponse> {
  const path = __dirname.substring(0, __dirname.indexOf("/.next")) + _subpath;
  let { dirs } = await rfs.read(path);
  const sourcePath = dirs[0];
  let filehash: PinataPinResponse = { IpfsHash: "", PinSize: 0, Timestamp: "" };

  try {
    filehash = await pinata.pinFromFS(sourcePath, {
      pinataMetadata: {
        name: _name,
      },
      pinataOptions: {
        cidVersion: 0,
      },
    });
    return filehash;
  } catch (error) {
    console.log(error);
    return filehash;
  }
}

async function handleMintPhase() {
  console.log("========= HANDLE MINT PHASE =========");
  // 1. Generate default images
  // await generateDefaultImages();

  await generateMetadataFiles("QmUBD1UkADVukUAoBpvoRZwCk6QLvkp4iK9iSfyyE2AksU");
  // // 2. Pin nfts-default-images folder and store CID hash
  // const nftsDefaultImageHash = await pinFolder(
  //   "/public/nfts-default-images",
  //   "nfts-default-images"
  // );
  // // 3. Generate initial metadata files based on default images folder CID hash
  // await generateMetadataFiles(nftsDefaultImageHash.IpfsHash);
  // // 4. Pin nfts-metada folder
  // await pinFolder("/public/nfts-metadata", "nfts-metadata");
}

async function handleRevealPhase() {
  console.log("========= HANDLE REVEAL PHASE =========");

  // 1. Pin nfts-images folder and store CID hash
  const revealedNftsImageHash = await pinFolder(
    "/public/nfts-images",
    "nfts-images"
  );
  // 2. Re-generate metadata files
  await generateMetadataFiles(revealedNftsImageHash.IpfsHash);
  // 3. Pin nfts-metada folder again
  const revealedNftsMetadataHash = await pinFolder(
    "/public/revealed-nfts-metadata",
    "revealed-nfts-metadata"
  );

  console.log("========= REVEAL PHASE DONE =========");
  return { revealedNftsImageHash, revealedNftsMetadataHash };
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  let result = null;

  await handleMintPhase();

  // const { rows: metadataRows } = await pinata.pinList({
  //   metadata: {
  //     name: "nfts-metadata",
  //     keyvalues: {},
  //   },
  //   status: "pinned",
  // });

  // if (metadataRows.length === 0) {
  //   const { nftsDefaultImageHash, nftsMetadataHash } = await handleMintPhase();
  //   result = {
  //     imagesCID: nftsDefaultImageHash.IpfsHash,
  //     metadataCID: nftsMetadataHash.IpfsHash,
  //   };
  // } else {
  //   await handleRevealPhase();
  // }

  // res.status(200).json(result);
};
