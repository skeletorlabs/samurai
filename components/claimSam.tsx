import Link from "next/link";
import SSButton from "./ssButton";
import { Dialog, Transition } from "@headlessui/react";
import { Tooltip } from "flowbite-react";
import { Inter, Roboto } from "next/font/google";
import { Fragment, useCallback, useContext, useEffect, useState } from "react";
import { aerodrome } from "@/utils/svgs";
import { StateContext } from "@/context/StateContext";
import { useNetwork } from "wagmi";

const inter = Inter({
  subsets: ["latin"],
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "500", "900"],
});

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

export default function ClaimSam() {
  const [claimAllBoxIsOpen, setClaimAllBoxIsOpen] = useState(false);
  const [vestingSchedules, setVestingSchedules] = useState<
    VestingSchedule[] | null
  >(null);
  const [total, setTotal] = useState(0);
  const [claimable, setClaimable] = useState(0);
  const [vesting, setVesting] = useState(0);
  const { signer, account } = useContext(StateContext);
  const { chain } = useNetwork();

  useEffect(() => {
    const totalAmount =
      vestingSchedules?.reduce((acc: number, curr: VestingSchedule) => {
        return acc + Number(curr.total_amount);
      }, 0) || 0;

    setTotal(totalAmount);

    const totalClaimable =
      vestingSchedules?.reduce((acc: number, curr: VestingSchedule) => {
        return acc + Number(curr.claimable_amount);
      }, 0) || 0;

    setClaimable(totalClaimable);
    setVesting(totalAmount - totalClaimable);

    // const totalVesting =
    //   vestingSchedules?.reduce((acc: number, curr: VestingSchedule) => {
    //     return acc + Number(curr.remaining_amount);
    //   }, 0) || 0;

    // setVesting(totalVesting);
  }, [vestingSchedules, setTotal, setClaimable, setVesting]);

  const onGetSamClaimInfos = useCallback(async () => {
    if (chain && !chain?.unsupported && signer && account) {
      const url = `http://18.196.63.207/api/vestingschedules/wallet-claims?address=${account}`;
      const response = await fetch(url);
      const json = await response.json();
      const data: VestingSchedule[] = json.data;

      setVestingSchedules(data);
    }
  }, [account, chain, signer]);

  useEffect(() => {
    onGetSamClaimInfos();
  }, [account, chain, signer]);
  return (
    <>
      {/* SAM TOKEN CLAIM */}
      <div className="flex flex-col pt-10 md:pt-20 pb-2  w-full bg-white/5 border-t border-samurai-red/50 border-dotted">
        <div className="flex flex-col px-6 lg:px-8 xl:px-20 text-white">
          <div className="flex flex-col text-white text-2xl pb-20">
            <p className="font-bold text-5xl pb-2">
              <span className="text-samurai-red">$SAM</span> Token Claim
            </p>

            <p
              className={`text-lg pt-10 lg:pt-0 text-neutral-300 font-light xl:max-w-[1300px] ${inter.className}`}
            >
              Claim your $SAM airdrop… then lock{" "}
              <Link
                href="#"
                className="text-samurai-red pb-1 hover:border-b border-samurai-red"
              >
                here
              </Link>{" "}
              or LP{" "}
              <Link
                href="#"
                className="text-samurai-red pb-1 hover:border-b border-samurai-red"
              >
                here
              </Link>
              .
            </p>
            <div
              className={`grid grid-cols-2 max-w-[710px] gap-5 mt-10 ${inter.className}`}
            >
              <span>Total $SAM Airdrop</span>
              <span>
                {total.toLocaleString("en-us", { minimumFractionDigits: 2 })}
              </span>
              <div className="flex items-center gap-1">
                <span>$SAM Claimable</span>
                <Tooltip
                  style="dark"
                  content={
                    <div className="flex flex-col gap-2 w-full p-2 text-center">
                      <span className="font-bold text-lg">Detailed values</span>
                      <div className="grid grid-cols-2 w-[220px] gap-2">
                        <Fragment>
                          <div className="py-1 text-white/50 bg-white/20">
                            Type
                          </div>
                          <div className="py-1 text-white/50 bg-white/20">
                            $SAM
                          </div>
                        </Fragment>
                        {vestingSchedules?.map(
                          (item: VestingSchedule, index) => (
                            <Fragment key={index}>
                              <div className="py-1 border-white/50">
                                {item.vesting_type}
                              </div>
                              <div className="py-1">
                                {Number(item.claimable_amount).toLocaleString(
                                  "en-us",
                                  { minimumFractionDigits: 2 }
                                )}
                              </div>
                            </Fragment>
                          )
                        )}
                      </div>
                    </div>
                  }
                >
                  <div className="w-6 h-6">
                    <svg
                      data-slot="icon"
                      fill="none"
                      strokeWidth="1"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                      ></path>
                    </svg>
                  </div>
                </Tooltip>
              </div>

              <span>
                {claimable.toLocaleString("en-us", {
                  minimumFractionDigits: 2,
                })}
              </span>
              <span>$SAM in Vesting</span>
              <span>
                {vesting.toLocaleString("en-us", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="pt-10 flex flex-col md:flex-row gap-3 md:gap-5">
              <SSButton>Claim Vested $SAM</SSButton>
              <SSButton click={() => setClaimAllBoxIsOpen(true)} secondary>
                Claim All $SAM**
              </SSButton>
            </div>
            <div className="pt-10 flex flex-col text-lg gap-2">
              <Link href="" className="text-yellow-300 hover:opacity-80 w-max">
                {">"}
                <span className="pl-2">Lock $SAM to earn Samurai Points</span>
              </Link>
              <Link
                className="text-white hover:opacity-80 w-max flex items-center"
                href=""
              >
                {">"}
                <span className="pl-2">Provide SAM/WETH LP on</span>
                <div className="w-6 h-6 ml-2">{aerodrome}</div>
                <span className="text-blue-700">Aerodrome</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Transition appear show={claimAllBoxIsOpen} as={Fragment}>
        <Dialog
          as="div"
          className={`relative z-20 ${roboto.className}`}
          onClose={() => setClaimAllBoxIsOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/70 backdrop-blur-[16px]" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-2xl bg-white/10 p-6 text-left align-middle transition-all border border-white/20 text-white shadow-lg shadow-samurai-red/20">
                  <Dialog.Title
                    as="h3"
                    className="text-lg text-center font-medium leading-6 text-white ml-1"
                  >
                    Claim All <span className="text-samurai-red">$SAM</span>
                  </Dialog.Title>
                  <div className="flex flex-col justify-center items-center gap-6 pt-10 text-center">
                    <p>
                      By claiming all $SAM, you are slashing your remaining $SAM
                      allocation, reducing it by 50%
                    </p>
                    <SSButton>I understand</SSButton>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
