"use server";
import { spawn } from "child_process";

function prepareConstructorValues(raw: any) {
  const general = `"${raw.samuraiTiers}" "${raw.acceptedToken}" ${raw.usingETH} ${raw.usingLinkedWallet} ${raw.vestingType} `;
  const amounts = `"(${raw.amounts[0]},${raw.amounts[1]},${raw.amounts[2]})" `;
  const periods = `"(${raw.periods[0]},${raw.periods[1]},${raw.periods[2]},${raw.periods[3]},${raw.periods[4]},${raw.periods[5]})" `;
  const ranges = `"[${raw.ranges.map(
    (item: any) => `('${item[0]}',${item[1]},${item[2]})`
  )}]" `;
  const refund = `"(${raw.refund[0]},${raw.refund[1]},${raw.refund[2]})"`;

  return general + amounts + periods + ranges + refund;
}

export async function GET(chainid: number, address: string, raw: any) {
  const constructorArgs = `"constructor(address,address,bool,bool,uint256,(uint256,uint256,uint256),(uint256,uint256,uint256,uint256,uint256,uint256),(string,uint256,uint256)[],(bool,uint256,uint256))"`;
  const constructorValues = prepareConstructorValues(raw);

  const command = `
cd .. && cd .. && cd ETHER/FOUNDRY/SAMURAI/samurai-contracts && pwd && source .env && forge verify-contract \
  --chain-id ${chainid} \
  --watch \
  --via-ir \
  --rpc-url $BASE_RPC_URL \
  --constructor-args $(cast abi-encode ${constructorArgs} ${constructorValues}) \
  --etherscan-api-key $BASESCAN_API_KEY \
  --force \
  ${address} \
  src/IDO.sol:IDO 
`;

  return new Promise((resolve, reject) => {
    const child = spawn("bash", ["-c", command]);

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (data) => {
      stdout += data;
    });

    child.stderr.on("data", (data) => {
      stderr += data;
    });

    child.on("close", (code) => {
      if (code !== 0) {
        reject({
          error: stderr,
        });
      } else {
        console.log(stdout);
        resolve({ stdout }); // Ensure only plain object is returned
      }
    });
  });
}
