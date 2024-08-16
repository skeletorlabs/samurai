"use client";
import Link from "next/link";
import Image from "next/image";
import { Inter } from "next/font/google";
import SSButton from "@/app/components/ssButton";
import TopLayout from "@/app/components/topLayout";
import {
  FormEvent,
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  create,
  FactoryInfos,
  generalInfo,
  IDO,
  WalletRange,
} from "../contracts_integrations/factory";
import { parseUnits } from "ethers";
import { StateContext } from "../context/StateContext";
import { GET } from "../api/verify";
import { idoRaw } from "../contracts_integrations/idoFull";
import { fromUnixTime } from "date-fns";

const inter = Inter({
  subsets: ["latin"],
});

const ranges = [
  {
    title: "Public",
    name1: "min0",
    defaultValue1: 100,
    name2: "max0",
    defaultValue2: 5000,
  },
  {
    title: "Ronin",
    name1: "min1",
    defaultValue1: 100,
    name2: "max1",
    defaultValue2: 100,
  },
  {
    title: "Gokenin",
    name1: "min2",
    defaultValue1: 100,
    name2: "max2",
    defaultValue2: 200,
  },
  {
    title: "Goshi",
    name1: "min3",
    defaultValue1: 100,
    name2: "max3",
    defaultValue2: 400,
  },
  {
    title: "Hatamoto",
    name1: "min4",
    defaultValue1: 100,
    name2: "max4",
    defaultValue2: 800,
  },
  {
    title: "Shogun",
    name1: "min5",
    defaultValue1: 100,
    name2: "max5",
    defaultValue2: 1500,
  },
];

export default function FactoryIdo() {
  const [factoryInfos, setFactoryInfos] = useState<FactoryInfos | null>(null);
  const [isUsingETH, setIsUsingETH] = useState(false);
  const [isUsingLinkedWallet, setIsUsingLinkedWallet] = useState(false);
  const [vestingType, setVestingType] = useState(1);
  const [acceptRefunding, setAcceptRefunding] = useState(true);
  const [data, setData] = useState<IDO | null>(null);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const { signer, account } = useContext(StateContext);

  const handleToggleUsingETH = (event: any) => {
    setIsUsingETH(event.target.value === "on");
  };

  const handleToggleUsingLinkedWallet = (event: any) => {
    setIsUsingLinkedWallet(event.target.value === "on");
  };

  const handleToggleAcceptRefunding = (event: any) => {
    setAcceptRefunding(event.target.value === "on");
  };

  async function handleVerification(address: string) {
    if (signer) {
      // load the infos from ido contract
      const raw = await idoRaw(address, signer);
      // console.log(raw);
      // call verification api via local command
      const verification = await GET(8543, address, raw);
      // set verification results
      setVerificationResult(verification);
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    // box 1
    const samuraiTiers = formData.get("samuraiTiers");
    const acceptEthereum =
      formData.get("acceptEthereum") === "on" ? true : false;
    const acceptedToken = formData.get("acceptedToken");
    const acceptLinkedWallet =
      formData.get("acceptLinkedWallet") === "on" ? true : false;

    const UNITS = acceptEthereum ? 18 : 6;

    // box 2
    const amounts = {
      tokenPrice: parseUnits(formData.get("tokenPrice")!.toString(), UNITS),
      maxAllocations: parseUnits(
        formData.get("maxAllocations")!.toString(),
        UNITS
      ),
      tgeReleasePercent: parseUnits(
        formData.get("tgeReleasePercent")!.toString(),
        UNITS
      ),
    };

    // box 3
    const periods = {
      registrationAt: Number(formData.get("registrationAt")),
      participationStartsAt: Number(formData.get("participationStartsAt")),
      participationEndsAt: Number(formData.get("participationEndsAt")),
      vestingDuration: Number(formData.get("vestingDuration")),
      vestingAt: Number(formData.get("vestingAt")),
      cliff: Number(formData.get("cliff")),
    };

    // box 4
    const refund = {
      active: acceptRefunding,
      feePercent: parseUnits(formData.get("feePercent")!.toString(), UNITS),
      period: Number(formData.get("period")),
    };

    // box 5
    const rangesFill: WalletRange[] = [];
    ranges.forEach((element, index) => {
      rangesFill.push({
        name: element.title,
        min: parseUnits(formData.get(`${element.name1}`)!.toString(), UNITS),
        max: parseUnits(formData.get(`${element.name2}`)!.toString(), UNITS),
      });
    });

    const newIdo: IDO = {
      samuraiTiers: samuraiTiers?.toString()!,
      acceptedToken: acceptedToken?.toString()!,
      usingETH: acceptEthereum,
      usingLinkedWallet: acceptLinkedWallet,
      vestingType: vestingType,
      amounts: amounts!,
      periods: periods!,
      ranges: rangesFill!,
      refund: refund!,
    };

    setData(newIdo);
  }

  useEffect(() => {
    const creation = async () => {
      if (data && signer) {
        await create(data, signer);
      }
    };

    creation();
  }, [data, signer]);

  const getFactoryInfos = useCallback(async () => {
    const infos = await generalInfo();
    if (infos) setFactoryInfos(infos);
  }, [setFactoryInfos]);

  useEffect(() => {
    getFactoryInfos();
  }, [setFactoryInfos]);

  return (
    <>
      <TopLayout background="bg-samurai-launchpad">
        <div className="flex flex-row justify-between items-center px-6 lg:px-8 xl:px-20 pt-10 lg:pt-24">
          {/* TOP CONTENT */}
          <div className="relative md:mr-12 xl:max-w-[900px]">
            <h1 className="text-[48px] sm:text-[58px] lg:text-[90px] font-black leading-[58px] sm:leading-[68px] lg:leading-[98px] text-white">
              Launchpad <span className="text-samurai-red">Factory</span>{" "}
            </h1>
            <p
              className={`leading-normal lg:leading-relaxed pt-6 lg:text-2xl xl:max-w-[900px]  ${inter.className}`}
            >
              Create a new IDO project. It's super simple, just copy & paste the
              infos required for a new IDO creation and voilá.
            </p>
            <p className="mt-4 text-samurai-red">
              # {factoryInfos?.totalIDOs.toString()} idos created
            </p>
          </div>
        </div>
      </TopLayout>

      <div className="flex flex-col py-10 md:py-20 w-full bg-white/20 border-t-[1px] border-samurai-red/40">
        <div className="flex flex-col px-6 lg:px-8 xl:px-20 text-white">
          <h2 className="text-4xl lg:text-5xl font-bold">
            Available <span className="text-samurai-red">IDO</span>s
          </h2>
          <div
            className={`flex justify-center lg:justify-start items-center flex-wrap gap-10 leading-normal text-[10px] pt-10 w-full ${inter.className}`}
          >
            {factoryInfos?.idos.map((item, index) => (
              <div key={index} className="flex flex-col gap-3">
                <Link
                  href={`https://basescan.org/address/${item.address}`}
                  target="blank"
                  className="hover:underline hover:text-samurai-red"
                >
                  {item.address}
                </Link>
                <SSButton
                  disabled={
                    !account ||
                    !signer ||
                    item.verified ||
                    account !== item.owner
                  }
                  click={() => handleVerification(item.address)}
                >
                  {item.verified ? "Verified" : "Verify Contract"}
                </SSButton>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col py-10 md:py-20 w-full bg-white/20 border-t-[1px] border-samurai-red/40">
        <div className="flex flex-col px-6 lg:px-8 xl:px-20 text-white">
          <h2 className="text-4xl lg:text-5xl font-bold">
            Let's <span className="text-samurai-red">Create</span>
          </h2>
          <div
            className={`flex justify-center lg:justify-start items-center flex-wrap gap-3 leading-normal pt-10 text-xl w-full ${inter.className}`}
          >
            <form
              onSubmit={onSubmit}
              className="flex flex-col text-white w-full"
            >
              <div className="flex gap-5 flex-wrap">
                {/* Section one */}
                <div className="flex flex-col gap-2 bg-black/20 rounded-lg p-6 w-full max-w-[520px]">
                  <h2 className="text-samurai-red">Overall Info</h2>
                  <label
                    htmlFor="samuraiTiers"
                    className="mt-4 text-white text-lg"
                  >
                    Samurai Tiers Address
                  </label>
                  <input
                    type="text"
                    className="text-black rounded-lg"
                    name="samuraiTiers"
                    defaultValue="0xdB0Ee72eD5190e9ef7eEC288a92f73c5cf3B3c74"
                    required
                  />

                  <label
                    htmlFor="acceptEthereum"
                    className="mt-4 text-white text-lg"
                  >
                    Accept Ethereum?
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      name="acceptEthereum"
                      type="radio"
                      value="on"
                      checked={isUsingETH}
                      onChange={handleToggleUsingETH}
                    />
                    <label>YES</label>
                    <input
                      name="acceptEthereum"
                      type="radio"
                      value="off"
                      checked={!isUsingETH}
                      onChange={handleToggleUsingETH}
                    />
                    <label>NO</label>
                  </div>

                  <label
                    htmlFor="acceptedToken"
                    className="mt-4 text-white text-lg"
                  >
                    Accepted Token Address
                  </label>
                  <input
                    disabled={isUsingETH}
                    type="text"
                    className="text-black rounded-lg"
                    name="acceptedToken"
                    defaultValue="0x2a064000D0252d16c57FAFD1586bE7ce5deD8320"
                    required
                  />

                  <label
                    htmlFor="acceptLinkedWallet"
                    className="mt-4 text-white text-lg"
                  >
                    Use Linked Wallet?
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      name="acceptLinkedWallet"
                      type="radio"
                      value="on"
                      checked={isUsingLinkedWallet}
                      onChange={handleToggleUsingLinkedWallet}
                    />
                    <label>YES</label>
                    <input
                      name="acceptLinkedWallet"
                      type="radio"
                      value="off"
                      checked={!isUsingLinkedWallet}
                      onChange={handleToggleUsingLinkedWallet}
                    />
                    <label>NO</label>
                  </div>

                  <label
                    htmlFor="vestingType"
                    className="mt-4 text-white text-lg"
                  >
                    Vesting Type
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      name="vestingType"
                      type="radio"
                      value={0}
                      checked={vestingType === 0}
                      onChange={() => setVestingType(0)}
                    />
                    <label>Cliff-Vesting</label>
                    <input
                      name="vestingType"
                      type="radio"
                      value={1}
                      checked={vestingType === 1}
                      onChange={() => setVestingType(1)}
                    />
                    <label>Linear</label>
                    <input
                      name="vestingType"
                      type="radio"
                      value={1}
                      checked={vestingType === 2}
                      onChange={() => setVestingType(2)}
                    />
                    <label>Periodic (monthly)</label>
                  </div>
                </div>

                {/* Section two - amounts */}
                {/* tokenPrice: number;
                maxAllocations: number;
                tgeReleasePercent: number; */}
                <div className="flex flex-col gap-2 bg-black/10 rounded-lg p-6 w-full max-w-[520px]">
                  <h2 className="text-samurai-red">Amounts</h2>
                  <label
                    htmlFor="tokenPrice"
                    className="mt-4 text-white text-lg"
                  >
                    Token Price
                  </label>
                  <input
                    type="text"
                    className="text-black rounded-lg"
                    name="tokenPrice"
                    defaultValue={0.008}
                    required
                  />

                  <label
                    htmlFor="maxAllocations"
                    className="mt-4 text-white text-lg"
                  >
                    Max Allocations
                  </label>
                  <input
                    type="text"
                    className="text-black rounded-lg"
                    name="maxAllocations"
                    defaultValue={100_000}
                    required
                  />

                  <label
                    htmlFor="tgeReleasePercent"
                    className="mt-4 text-white text-lg"
                  >
                    TGE Release Percentage %
                  </label>
                  <input
                    type="text"
                    className="text-black rounded-lg"
                    name="tgeReleasePercent"
                    defaultValue={0.15}
                    required
                  />
                </div>

                {/* registrationAt: number;
                participationStartsAt: number;
                participationEndsAt: number;
                vestingDuration: number;
                vestingAt: number;
                cliff: number; */}
                <div className="flex flex-col gap-2 bg-black/20 rounded-lg p-6 w-full max-w-[520px]">
                  <h2 className="text-samurai-red">Periods</h2>
                  <label
                    htmlFor="registrationAt"
                    className="mt-4 text-white text-lg"
                  >
                    Registration Starts At{" "}
                    <span className="text-sm text-samurai-red">
                      ({fromUnixTime(1723824000).toUTCString()})
                    </span>
                  </label>
                  <input
                    type="text"
                    className="text-black rounded-lg"
                    name="registrationAt"
                    defaultValue="1723824000"
                    required
                  />
                  <label
                    htmlFor="participationStartsAt"
                    className="mt-4 text-white text-lg"
                  >
                    Participations Starts At{" "}
                    <span className="text-sm text-samurai-red">
                      ({fromUnixTime(1723831200).toUTCString()})
                    </span>
                  </label>
                  <input
                    type="text"
                    className="text-black rounded-lg"
                    name="participationStartsAt"
                    defaultValue="1723831200"
                    required
                  />
                  <label
                    htmlFor="participationEndsAt"
                    className="mt-4 text-white text-lg"
                  >
                    Participations Ends At{" "}
                    <span className="text-sm text-samurai-red">
                      ({fromUnixTime(1723896000).toUTCString()})
                    </span>
                  </label>
                  <input
                    type="text"
                    className="text-black rounded-lg"
                    name="participationEndsAt"
                    defaultValue="1723896000"
                    required
                  />
                  <label
                    htmlFor="vestingDuration"
                    className="mt-4 text-white text-lg"
                  >
                    Vesting duration (in months)
                  </label>
                  <input
                    type="text"
                    className="text-black rounded-lg"
                    name="vestingDuration"
                    defaultValue="1"
                    required
                  />
                  <label
                    htmlFor="vestingAt"
                    className="mt-4 text-white text-lg"
                  >
                    TGE at (vestingsStartsAt){" "}
                    <span className="text-sm text-samurai-red">
                      ({fromUnixTime(1723910400).toUTCString()})
                    </span>
                  </label>
                  <input
                    type="text"
                    className="text-black rounded-lg"
                    name="vestingAt"
                    defaultValue="1723910400"
                    required
                  />
                  <label htmlFor="cliff" className="mt-4 text-white text-lg">
                    Cliff (duration in months)
                  </label>
                  <input
                    type="text"
                    className="text-black rounded-lg"
                    name="cliff"
                    defaultValue="0"
                    required
                  />
                </div>

                {/* active: boolean;
                feePercent: number;
                period: number;*/}

                <div className="flex flex-col gap-2 bg-black/10 rounded-lg p-6 w-full max-w-[520px]">
                  <h2 className="text-samurai-red">Refunding</h2>
                  <label
                    htmlFor="acceptEthereum"
                    className="mt-4 text-white text-lg"
                  >
                    Accept Refunding?
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      name="active"
                      type="radio"
                      value="on"
                      checked={acceptRefunding}
                      onChange={handleToggleAcceptRefunding}
                    />
                    <label>YES</label>
                    <input
                      name="active"
                      type="radio"
                      value="off"
                      checked={!acceptRefunding}
                      onChange={handleToggleAcceptRefunding}
                    />
                    <label>NO</label>
                  </div>

                  <label
                    htmlFor="feePercent"
                    className="mt-4 text-white text-lg"
                  >
                    Fee percentage to charge %
                  </label>
                  <input
                    type="text"
                    className="text-black rounded-lg"
                    name="feePercent"
                    defaultValue={0.01}
                    required
                  />

                  <label htmlFor="period" className="mt-4 text-white text-lg">
                    Refunding period (in hours)
                  </label>
                  <input
                    type="text"
                    className="text-black rounded-lg"
                    name="period"
                    defaultValue={86400}
                    required
                  />
                </div>

                {/* Ranges (name, min, max) */}
                <div className="flex flex-col gap-2 bg-black/20 rounded-lg p-6 w-full max-w-[520px]">
                  <h2 className="text-samurai-red">Ranges</h2>

                  {ranges.map((item, index) => (
                    <Fragment key={index}>
                      <div className="flex flex-col bg-samurai-red mt-5 px-2 w-max">
                        <label htmlFor={item.name1} className="text-white">
                          {item.title}
                        </label>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <div className="flex flex-col">
                          <label htmlFor={item.name1} className="text-white">
                            Min
                          </label>
                          <input
                            type="text"
                            className="text-black rounded-lg"
                            name={item.name1}
                            defaultValue={item.defaultValue1}
                            required
                          />
                        </div>

                        <div className="flex flex-col">
                          <label htmlFor={item.name2} className="text-white">
                            Max
                          </label>
                          <input
                            type="text"
                            className="text-black rounded-lg"
                            name={item.name2}
                            defaultValue={item.defaultValue2}
                            required
                          />
                        </div>
                      </div>
                    </Fragment>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3 mt-5">
                <button
                  type="submit"
                  disabled={!signer}
                  className={`
                  w-max
                  bg-black/70
                  flex justify-center items-center transition-all z-20 
                  enabled:hover:bg-samurai-red enabled:hover:text-white enabled:hover:border-samurai-red border-samurai-red text-samurai-red
                  text-lg md:text-normal px-8 py-3
                  border rounded-lg
                  disabled:border-white/20 disabled:text-white/10
                `}
                >
                  Create new IDO
                </button>
              </div>

              {verificationResult && (
                <div className="flex flex-col w-full bg-black text-white/80 border font-mono p-4 mt-2">
                  <pre>{verificationResult.stdout}</pre>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
