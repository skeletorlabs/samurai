import { SAM_CLAIM_VESTING } from "@/app/utils/constants";
import { JsonRpcSigner, ethers } from "ethers";
import { SAM_CLAIM_VESTING_ABI } from "./abis";
import { notificateTx } from "@/app/utils/notificateTx";
import handleError from "@/app/utils/handleErrors";

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
  claim_infos: [
    number,
    string,
    boolean,
    boolean,
    number,
    string,
    number,
    number,
    number
  ][];
};

const baseURL = process.env.NEXT_PUBLIC_IDEOFUZION_URL;
const testBscURL = process.env.NEXT_PUBLIC_IDEOFUZION_TEST_URL;

function getUrl(chain: number) {
  return `${chain === 8453 ? baseURL : testBscURL}/api`;
}

export async function getClaimInfos(account: string, chain: number) {
  const apiUrl = getUrl(chain);
  const url = `${apiUrl}/vestingschedules/wallet-claims?address=${account}`;
  const response = await fetch(url);
  const json = await response.json();
  const data: VestingSchedule[] = json.data;

  return data;
}

async function getClaimVestingParams(
  claimmAll: boolean,
  account: string,
  chain: number
) {
  const apiUrl = getUrl(chain);
  const url = `${apiUrl}/vestingschedules/claim`;

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
  signer: JsonRpcSigner,
  chain: number
) {
  try {
    const claimVestingParams = await getClaimVestingParams(
      claimmAll,
      account,
      chain
    );

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
