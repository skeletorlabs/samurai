import { SAM_CLAIM_VESTING } from "@/utils/constants";
import { JsonRpcSigner, ethers } from "ethers";
import { SAM_CLAIM_VESTING_ABI } from "./abis";
import { notificateTx } from "@/utils/notificateTx";
import handleError from "@/utils/handleErrors";

export type VestingSchedule = {
  address: string;
  claimable_amount: string;
  created_at: string;
  end_time: string;
  id: number;
  initial_percentage: number;
  remaining_amount: string;
  start_time: string;
  total_amount: string;
  updated_at: string;
  vesting_type: string;
};

export type ClaimVestingParams = {
  signature: string;
  nonce: number;
  claim_infos: [number, string, boolean][];
};

const baseURL = process.env.NEXT_PUBLIC_IDEOFUZION_URL;

export async function getClaimInfos(account: string) {
  const url = `${baseURL}/api/vestingschedules/wallet-claims?address=${account}`;
  const response = await fetch(url);
  const json = await response.json();
  const data: VestingSchedule[] = json.data;

  return data;
}

async function getClaimVestingParams(claimmAll: boolean, account: string) {
  const url = `${baseURL}/api/vestingschedules/claim`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        address: account,
        isAllClaimed: claimmAll,
      }),
    });

    const json = await response.json();
    return json as ClaimVestingParams;
  } catch (error) {
    console.log(error);
  }
}

export async function claimVesting(
  claimmAll: boolean,
  account: string,
  signer: JsonRpcSigner
) {
  try {
    const claimVestingParams = await getClaimVestingParams(claimmAll, account);

    if (claimVestingParams) {
      const contract = new ethers.Contract(
        SAM_CLAIM_VESTING,
        SAM_CLAIM_VESTING_ABI,
        signer
      );
      const network = await signer.provider?.getNetwork();

      const tx = await contract?.claim(
        claimVestingParams.nonce,
        claimVestingParams.claim_infos,
        claimVestingParams.signature
      );

      await notificateTx(tx, network);
    }
  } catch (error) {
    handleError({ e: error, notificate: true });
  }
}
