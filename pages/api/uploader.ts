import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs/promises';
import axios from 'axios';
import FormData from 'form-data';
import * as path from 'path';





const pinataApiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY as string;
const pinataSecretApiKey = process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY as string;

interface Metadata {
  name: string;
  description: string;
}

async function uploadImageToPinata(imagePath: string): Promise<string | undefined> {
  try {
    const imageBuffer = await fs.readFile(imagePath);

    const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';

    const formData = new FormData();
    formData.append('file', imageBuffer, 'image.png');

    const response = await axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        pinata_api_key: pinataApiKey,
        pinata_secret_api_key: pinataSecretApiKey,
      },
    });

    const responseData = response.data;

    console.log('File uploaded to Pinata successfully!');
    console.log('IPFS CID:', responseData.IpfsHash);

    return responseData.IpfsHash;
  } catch (error) {
    console.error('Error uploading file to Pinata:', error);
  }
}


async function createMetadataFile(metadata: Metadata, imagePath: string): Promise<string | undefined> {
  try {
    const metadataFile = JSON.stringify(metadata);
    const metadataFilePath = `${imagePath}_metadata.json`;
    await fs.writeFile(metadataFilePath, metadataFile);

    console.log('Metadata file created:', metadataFilePath);

    return metadataFilePath;
  } catch (error) {
    console.error('Error creating metadata file:', error);
  }
}

async function uploadImageWithMetadataToPinata(imagePath: string, metadata: Metadata): Promise<void> {
  try {
    const imageBuffer = await fs.readFile(imagePath);
    const metadataFile = JSON.stringify(metadata);
    const imageFileName = `samurai/${path.basename(imagePath)}`;
    const metadataFileName = `samurai/${path.basename(imagePath, path.extname(imagePath))}_metadata.json`;

    const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';

    const imageFormData = new FormData();
    imageFormData.append('file', imageBuffer, imageFileName);

    const metadataFormData = new FormData();
    metadataFormData.append('file', metadataFile, metadataFileName);

    const imageResponse = await axios.post(url, imageFormData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        pinata_api_key: pinataApiKey,
        pinata_secret_api_key: pinataSecretApiKey,
      },
    });

    const metadataResponse = await axios.post(url, metadataFormData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        pinata_api_key: pinataApiKey,
        pinata_secret_api_key: pinataSecretApiKey,
      },
    });

    console.log('Image CID:', imageResponse.data.IpfsHash);
    console.log('Metadata CID:', metadataResponse.data.IpfsHash);

    console.log('Files uploaded to Pinata successfully!');
  } catch (error) {
    console.error('Error uploading image with metadata to Pinata:', error);
  }
}


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const imageWithMetadata: { imagePath: string; metadata: Metadata }[] = [
    {
      imagePath: 'public/nfts/1.png',
      metadata: {
        name: 'Trapjaw',
        description: 'Trapjaw is a He-man enemy',
      },
    },
    {
      imagePath: 'public/nfts/2.png',
      metadata: {
        name: 'Teela',
        description: 'Teela is a He-man ally',
      },
    },
    {
      imagePath: 'public/nfts/3.png',
      metadata: {
        name: 'Stratus',
        description: 'Stratus is a He-man enemy',
      },
    },
    {
      imagePath: 'public/nfts/4.png',
      metadata: {
        name: 'Skeletor',
        description: 'Skeletor is a He-man enemy',
      },
    },
    {
      imagePath: 'public/nfts/5.png',
      metadata: {
        name: 'Skeletor',
        description: 'Skeletor is a He-man enemy',
      },
    },
    {
      imagePath: 'public/nfts/6.png',
      metadata: {
        name: 'He-man',
        description: 'He-man is the master of the Universe',
      },
    },
    {
      imagePath: 'public/nfts/7.png',
      metadata: {
        name: 'Evil-Lyn',
        description: 'Evil Lyn is a He-man enemy',
      },
    },
    {
      imagePath: 'public/nfts/8.png',
      metadata: {
        name: 'Beastman',
        description: 'Beastman is a He-man enemy',
      },
    },
  ];

  imageWithMetadata.forEach(({ imagePath, metadata }) => {
    uploadImageWithMetadataToPinata(imagePath, metadata);
  });

  res.status(200).json({ message: 'Images uploaded with metadata' });
}






 // {
    //   imagePath: '/public/nfts/2.png',
    //   metadata: {
    //     name: 'Teela',
    //     description: 'Teela is a He-man ally',
    //   },
    // },
    // {
    //   imagePath: '/public/nfts/3.png',
    //   metadata: {
    //     name: 'Stratus',
    //     description: 'Stratus is a He-man enemy',
    //   },
    // },
    // {
    //   imagePath: '/public/nfts/4.png',
    //   metadata: {
    //     name: 'Skeletor',
    //     description: 'Skeletor is a He-man enemy',
    //   },
    // },
    // {
    //   imagePath: '/public/nfts/5.png',
    //   metadata: {
    //     name: 'Skeletor',
    //     description: 'Skeletor is a He-man enemy',
    //   },
    // },
    // {
    //   imagePath: '/public/nfts/6.png',
    //   metadata: {
    //     name: 'He-man',
    //     description: 'He-man is the master of the Universe',
    //   },
    // },
    // {
    //   imagePath: '/public/nfts/7.png',
    //   metadata: {
    //     name: 'Evil-Lyn',
    //     description: 'Evil Lyn is a He-man enemy',
    //   },
    // },
    // {
    //   imagePath: '/public/nfts/8.png',
    //   metadata: {
    //     name: 'Beastman',
    //     description: 'Beastman is a He-man enemy',
    //   },
    // },

//     const pinataApiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY as string;
// const pinataSecretApiKey = process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY as string;