import { ethers, formatEther, Signer } from "ethers";
import { GIVEWAYS_ABI } from "./abis";
import handleError from "@/app/utils/handleErrors";
import { notificateTx } from "@/app/utils/notificateTx";
import { GIVEAWAYS } from "../utils/constants";
import { getUnixTime } from "date-fns";

const BASE_RPC_URL = process.env.NEXT_PUBLIC_BASE_RPC_HTTPS as string;

export enum GiveawayStatus {
  UPCOMING = "UPCOMING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
  DRAWING = "DRAWING",
  DRAWN = "DRAWN",
}

export const STATUS_COLORS = [
  {
    status: "UPCOMING",
    from: "from-yellow-500",
    to: "to-yellow-300",
    text: "text-yellow-500",
  },
  {
    status: "ACTIVE",
    from: "from-green-500",
    to: "to-green-300",
    text: "text-green-500",
  },
  {
    status: "FINISHED",
    from: "from-red-500",
    to: "to-red-300",
    text: "text-red-500",
  },
  {
    status: "DRAWING",
    from: "from-green-500",
    to: "to-green-300",
    text: "text-green-500",
  },
  {
    status: "DRAWN",
    from: "from-blue-500",
    to: "to-blue-300",
    text: "text-blue-500",
  },
];

export type GiveawayType = {
  id: number;
  name: string;
  priceInPoints: number;
  tickets: number;
  minTickets: number;
  startAt: number;
  endAt: number;
  drawAt: number;
  winners: string[];
  participants: string[];
};

async function getContract(signer?: ethers.Signer) {
  try {
    const provider = new ethers.JsonRpcProvider(BASE_RPC_URL);

    const contract = new ethers.Contract(
      GIVEAWAYS,
      GIVEWAYS_ABI,
      signer || provider
    );

    return contract;
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

// OVERALL INFOS

export async function checkIsPaused() {
  try {
    const contract = await getContract();
    const isPaused = await contract?.paused();
    return isPaused;
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

export async function generalInfo() {
  try {
    const contract = await getContract();
    let ids = await contract?.getIDs();

    let giveaways: GiveawayType[] = [];

    for (let index = 1; index < ids.length; index++) {
      const giveawayRaw = await contract?.giveaways(ids[index]);
      // const participants = await contract?.participants(ids[index]);
      const winners = await contract?.winnersOf(ids[index]);

      giveaways.push({
        id: Number(giveawayRaw[0]),
        name: giveawayRaw[1],
        priceInPoints: Number(formatEther(giveawayRaw[2])),
        tickets: Number(giveawayRaw[3]),
        minTickets: Number(giveawayRaw[4]),
        startAt: Number(giveawayRaw[5]),
        endAt: Number(giveawayRaw[6]),
        drawAt: Number(giveawayRaw[7]),
        winners: winners,
        // participants: participants,
        participants: [],
      } as GiveawayType);
    }

    return {
      ids,
      giveaways,
    };
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

export type ParticipationType = {
  id: number;
  tickets: number;
};

export async function userInfo(ids: number[], signer: Signer) {
  try {
    const contract = await getContract();
    const signerAddress = await signer.getAddress();

    const participations: ParticipationType[] = [];

    for (let index = 0; index < ids.length; index++) {
      const tickets = Number(
        await contract?.participantions(ids[index], signerAddress)
      );

      participations.push({ id: ids[index], tickets: tickets });
    }

    return { participations };
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

export async function participate(
  id: number,
  tickets: number,
  signer: ethers.Signer
) {
  try {
    const contract = await getContract(signer);
    const network = await signer.provider?.getNetwork();
    const tx = await contract?.participate(id, tickets);
    await notificateTx(tx, network);
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

// ADMIN ACTIONS

export async function togglePause(signer: ethers.Signer) {
  const contract = await getContract(signer);

  try {
    const owner = await contract?.owner();
    const signerAddress = await signer.getAddress();

    if (owner === signerAddress) {
      const network = await signer.provider?.getNetwork();
      const isPaused = await contract?.paused();
      const tx = isPaused ? await contract?.unpause() : await contract?.pause();
      await notificateTx(tx, network);
    }
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

export async function create(giveaway: GiveawayType, signer: ethers.Signer) {
  try {
    const contract = await getContract(signer);
    const network = await signer.provider?.getNetwork();
    const owner = await contract?.owner();
    const signerAddress = await signer.getAddress();

    if (owner === signerAddress) {
      const tx = await contract?.create(giveaway);
      await notificateTx(tx, network);
    }
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

export async function setWinner(
  id: number,
  winners: string[],
  signer: ethers.Signer
) {
  const contract = await getContract(signer);

  try {
    const owner = await contract?.owner();
    const signerAddress = await signer.getAddress();

    if (owner === signerAddress) {
      const network = await signer.provider?.getNetwork();
      const tx = await contract?.setWinner(id, winners);
      await notificateTx(tx, network);
    }
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}
