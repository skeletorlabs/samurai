import {
  BigNumberish,
  ethers,
  formatEther,
  formatUnits,
  parseEther,
  parseUnits,
} from "ethers";
import { FACTORY_ABI, IDO_ABI } from "./abis";
import handleError from "@/app/utils/handleErrors";
import { notificateTx } from "@/app/utils/notificateTx";
import { SAM_FACTORY } from "../utils/constants";

const BASE_RPC_URL = process.env.NEXT_PUBLIC_BASE_RPC_HTTPS as string;
const TEST_RPC = "http://127.0.0.1:8545";

async function getContract(signer?: ethers.Signer) {
  try {
    const provider = new ethers.JsonRpcProvider(BASE_RPC_URL);

    const contract = new ethers.Contract(
      SAM_FACTORY,
      FACTORY_ABI,
      signer || provider
    );

    return contract;
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

export type FactoryInfos = {
  totalIDOs: number;
  isPaused: boolean;
  idos: { address: string; verified: boolean; owner: string }[];
};

export async function generalInfo() {
  try {
    const contract = await getContract();
    const totalIDOs = Number(await contract?.totalIDOs());
    const isPaused = await contract?.paused();
    const apiKey = process.env.NEXT_PUBLIC_BASESCAN_API_KEY;
    const idos = [];

    for (let index = 0; index < totalIDOs; index++) {
      const address = await contract?.idos(index);

      const response = await fetch(
        `https://api.basescan.org/api?module=contract&action=getsourcecode&address=${address}&apikey=${apiKey}`
      );
      const data = await response.json();
      const verified =
        data.status === "1" &&
        data.result.length > 0 &&
        data.result[0].SourceCode.length > 0
          ? true
          : false;

      const provider = new ethers.JsonRpcProvider(BASE_RPC_URL);
      const idoContract = new ethers.Contract(address, IDO_ABI, provider);
      const owner = await idoContract?.owner();

      idos.push({
        address: address,
        verified: verified,
        owner: owner,
      });
    }

    console.log(idos);

    return {
      totalIDOs: totalIDOs,
      isPaused: isPaused,
      idos,
    } as FactoryInfos;
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}

export type WalletRange = {
  name: string;
  min: BigNumberish;
  max: BigNumberish;
};

export type Periods = {
  registrationAt: number;
  participationStartsAt: number;
  participationEndsAt: number;
  vestingDuration: number;
  vestingAt: number;
  cliff: number;
};

export type Amounts = {
  tokenPrice: BigNumberish;
  maxAllocations: BigNumberish;
  tgeReleasePercent: BigNumberish;
};

export type Refund = {
  active: boolean;
  feePercent: BigNumberish;
  period: number;
};

export type IDO = {
  samuraiTiers: string;
  acceptedToken: string;
  usingETH: boolean;
  usingLinkedWallet: boolean;
  vestingType: number;
  amounts: Amounts;
  periods: Periods;
  ranges: WalletRange[];
  refund: Refund;
};

export async function create(initialConfig: IDO, signer: ethers.Signer) {
  try {
    const contract = await getContract(signer);
    const owner = await contract?.owner();
    const signerAddress = await signer.getAddress();
    const isPaused = await contract?.paused();

    if (signerAddress === owner && !isPaused) {
      const tx = await contract?.createIDO(initialConfig);
      const network = await signer.provider?.getNetwork();
      await notificateTx(tx, network);
    }
  } catch (e) {
    handleError({ e: e, notificate: true });
  }
}
