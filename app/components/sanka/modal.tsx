import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Roboto } from "next/font/google";
import { Fragment, useCallback, useState } from "react";
import SSButton from "../ssButton";
import { Tweet } from "react-tweet";
import { CheckCircleIcon } from "@heroicons/react/16/solid";
import classNames from "classnames";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "500", "900"],
});

export type SocialModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: (username: string) => void;
};

export default function SocialModal({
  open,
  setOpen,
  onSubmit,
}: SocialModalProps) {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");

  const onInputChange = (value: string) => {
    setUsername(value);
  };

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog
        as="div"
        className={`relative z-20 ${roboto.className}`}
        onClose={() => setOpen(false)}
      >
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/80 backdrop-blur-lg" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-max transform overflow-hidden rounded-2xl bg-white/10 p-6 text-left align-middle transition-all border border-white/20 text-white shadow-lg shadow-samurai-red/20">
                <div className="flex gap-10">
                  <Tweet id="1910349054095278415" />

                  <div className="flex flex-col mt-8 w-[600px] gap-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={classNames({
                          "flex items-center gap-2 border rounded-lg p-1 px-3":
                            true,
                          "text-white/20 border-white/10": false,
                          "text-green-500 border-green-500 bg-white": true,
                        })}
                      >
                        <CheckCircleIcon width={18} height={18} />
                        <span>Liked</span>
                      </div>

                      <div
                        className={classNames({
                          "flex items-center gap-2 border rounded-lg p-1 px-3":
                            true,
                          "text-white/20 border-white/10": false,
                          "text-green-500 border-green-500 bg-white": true,
                        })}
                      >
                        <CheckCircleIcon width={18} height={18} />
                        <span>Shared</span>
                      </div>
                    </div>
                    <span className="text-lg">
                      Enter your X (ex-Twitter) @username
                    </span>
                    <div className="flex items-center rounded-lg bg-white/90 shadow-md shadow-black/60 text-black relative w-full">
                      <input
                        onChange={(e) => onInputChange(e.target.value)}
                        value={username}
                        type="text"
                        placeholder="@username"
                        className="w-full border-transparent py-2 focus:border-transparent focus:ring-transparent placeholder-black/60 text-md rounded-lg"
                      />
                    </div>

                    <button
                      className="flex items-center justify-center w-full bg-samurai-red/80 hover:bg-samurai-red/90 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200"
                      onClick={() => onSubmit(username)}
                      // disabled={loading || !!username}
                    >
                      {loading ? "Loading..." : "CHECK ENGAGEMENT"}
                    </button>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
