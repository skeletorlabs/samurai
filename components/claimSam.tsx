import Link from "next/link";
import SSButton from "./ssButton";
import { Dialog, Transition } from "@headlessui/react";
import { Inter, Roboto } from "next/font/google";
import { Fragment, useState } from "react";
import { aerodrome } from "@/utils/svgs";

const inter = Inter({
  subsets: ["latin"],
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "500", "900"],
});

export default function ClaimSam() {
  const [claimAllBoxIsOpen, setClaimAllBoxIsOpen] = useState(false);
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
              <span>50,000</span>
              <span>$SAM Claimable</span>
              <span>30,000</span>
              <span>$SAM in Vesting</span>
              <span>20,000</span>
            </div>
            <div className="pt-10 flex flex-col md:flex-row gap-3 md:gap-5">
              <SSButton>Claim Vested $SAM</SSButton>
              <SSButton click={() => setClaimAllBoxIsOpen(true)} secondary>
                Claim All $SAM**
              </SSButton>
            </div>
            <div className="pt-10 flex flex-col text-lg gap-2">
              <Link
                href=""
                className="text-yellow-300 hover:border-b border-yellow-300 w-max h-8"
              >
                {">"}
                <span className="pl-2">Lock $SAM to earn Samurai Points</span>
              </Link>
              <Link
                className="text-blue-500 hover:border-b border-blue-500 w-max flex items-center h-10"
                href=""
              >
                {">"}
                <span className="pl-2">Provide SAM/WETH LP on Aerodrome</span>
                <div className="w-6 h-6 ml-2">{aerodrome}</div>
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
                      allocation, reducing it by 30%
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
