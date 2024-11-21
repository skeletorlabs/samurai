import Image from "next/image";
import { useCallback, useContext, useState } from "react";
import { StateContext } from "../context/StateContext";
import { IDO_v3 } from "../utils/interfaces";
import { Spinner } from "flowbite-react";
import {
  CHAIN_TO_CURRENCY,
  CHAIN_TO_ICON,
  TOKENS_TO_ICON,
  TOKENS_TO_SYMBOL,
} from "../utils/constants";
import { getUnixTime } from "date-fns";

import { Tier } from "../contracts_integrations/tiers";
import {
  discord,
  paste,
  pasted,
  redo,
  youtube,
  linkWallet as linkWalletIcon,
} from "@/app/utils/svgs";

interface ParticipationBox {
  ido: IDO_v3;
  idoIndex: number;
  loading: boolean;
  setLoading: any;
  tier: Tier | null;
  general: any;
  user: any;
  onLinkWallet: any;
  onRegister: any;
  onParticipate: any;
}

export default function ParticipationBox({
  ido,
  idoIndex,
  loading,
  setLoading,
  tier,
  general,
  user,
  onLinkWallet,
  onRegister,
  onParticipate,
}: ParticipationBox) {
  const now = getUnixTime(new Date());
  const currentPhase = "Upcoming";

  const [inputValue, setInputValue] = useState("");
  const [inputLinkedWallet, setInputLinkedWallet] = useState("");
  const { signer, account, chain } = useContext(StateContext);

  // Function to check if the string starts with "bc1" (Bitcoin)
  const isBitcoinAddress = (value: string) => value.startsWith("bc1");

  // Function to check for valid EVM address format (with or without 0x prefix)
  const isEVMAddress = (value: string) => {
    const re = new RegExp("^(0x)?[0-9a-fA-F]{40}$");
    return re.test(value);
  };

  // Function for Solana address validation
  const isValidSolanaAddress = (value: string) => {
    const isValidLength = (value: string) =>
      value.length >= 32 && value.length <= 44;
    const charSet = "[A-Za-z0-9+/]";

    // Check length
    if (!isValidLength(value)) {
      return false;
    }
    // Check character set using regex
    const re = new RegExp(`^${charSet}+$`);
    return re.test(value);
  };

  const onPaste = async () => {
    const value = await navigator.clipboard.readText();

    if (
      value === "" ||
      isBitcoinAddress(value) ||
      isEVMAddress(value) ||
      isValidSolanaAddress(value)
    ) {
      setInputLinkedWallet(value);
      return true;
    } else {
      setInputValue("");
      return false;
    }
  };

  const onInputChange = (value: string) => {
    const re = new RegExp("^[+]?([0-9]+([.][0-9]*)?|[.][0-9]+)$");

    if (value === "" || re.test(value)) {
      setInputValue(value);
    }

    return false;
  };

  return (
    <div className="flex my-5 text-sm min-h-[200px] w-full">
      {signer &&
        account &&
        (currentPhase?.toLowerCase() === "registration" ||
          currentPhase?.toLowerCase() === "participation") && (
          <div className="flex flex-col w-full justify-center">
            {/* REGISTER */}

            {ido.register && (
              <>
                {!user?.isWhitelisted &&
                  !general?.isPublic &&
                  user?.walletRange.name.toUpperCase() !== "PUBLIC" && (
                    <div className="flex flex-col gap-4">
                      <p className="text-center text-lg">
                        Register before participate the IDO
                      </p>
                      <button
                        onClick={onRegister}
                        disabled={
                          loading || !general || !user || general?.isPaused
                        }
                        className={`
                          ${
                            loading || !general || !user || general?.isPaused
                              ? "bg-black text-white/20"
                              : "bg-samurai-red text-white hover:opacity-75"
                          }
                            rounded-[8px] w-[300px] h-[50px] self-center py-4 text-[18px] text-center transition-all
                        `}
                      >
                        {loading ? (
                          <Spinner
                            size="md"
                            color="gray"
                            className="opacity-40"
                          />
                        ) : (
                          "REGISTER"
                        )}
                      </button>
                    </div>
                  )}
              </>
            )}

            {/* LINK WALLET */}
            {ido.linkedWallet && (
              <>
                <div className="flex flex-col gap-1 text-[14px] w-full">
                  {general?.usingLinkedWallet &&
                    user?.linkedWallet === "" &&
                    user?.isWhitelisted && (
                      <div className="flex flex-col p-4 border border-white/20 rounded-lg">
                        <p className="text-[16px] text-center">
                          Link your
                          <span className="text-samurai-red px-[6px]">
                            {ido.tokenNetwork.toUpperCase()}
                          </span>
                          wallet address
                        </p>

                        <div className="flex justify-center gap-10 items-center py-3">
                          <button
                            onClick={() => onPaste()}
                            disabled={
                              loading || !general || !user || general?.isPaused
                            }
                            className={`
                              ${
                                loading ||
                                !general ||
                                !user ||
                                general?.isPaused
                                  ? "opacity-40"
                                  : "opacity-100"
                              }
                              font-light flex justify-center items-center gap-2 transition-all hover:scale-110
                            `}
                          >
                            <div>{inputLinkedWallet ? pasted : paste}</div>
                            <span>
                              {inputLinkedWallet ? "Pasted" : "Paste"}
                            </span>
                          </button>
                          <button
                            onClick={() => setInputLinkedWallet("")}
                            disabled={
                              loading || !general || !user || general?.isPaused
                            }
                            className={`
                              ${
                                loading ||
                                !general ||
                                !user ||
                                general?.isPaused
                                  ? "opacity-40"
                                  : "opacity-100"
                              }
                                font-light flex justify-center items-center gap-2 transition-all hover:scale-110
                            `}
                          >
                            <div>{redo}</div>
                            <span>Clear</span>
                          </button>
                          <button
                            onClick={() => onPaste()}
                            disabled={
                              loading || !general || !user || general?.isPaused
                            }
                            className={`
                              ${
                                loading ||
                                !general ||
                                !user ||
                                general?.isPaused
                                  ? "opacity-40"
                                  : "opacity-100"
                              }
                                font-light flex justify-center items-center gap-2 transition-all hover:scale-110
                            `}
                          >
                            <div>{linkWalletIcon}</div>
                            <span>
                              {inputLinkedWallet
                                ? `${inputLinkedWallet.substring(
                                    0,
                                    5
                                  )}...${inputLinkedWallet.substring(
                                    inputLinkedWallet.length - 5,
                                    inputLinkedWallet.length
                                  )}`
                                : "Not set"}
                            </span>
                          </button>
                        </div>

                        <button
                          onClick={onLinkWallet}
                          disabled={
                            loading ||
                            !general ||
                            !user ||
                            general?.isPaused ||
                            (general?.usingLinkedWallet &&
                              inputLinkedWallet === "")
                          }
                          className={`
                            ${
                              loading ||
                              !general ||
                              !user ||
                              general?.isPaused ||
                              (general?.usingLinkedWallet &&
                                inputLinkedWallet === "")
                                ? "bg-black text-white/20"
                                : "bg-samurai-red text-white hover:opacity-75"
                            }
                              rounded-[8px] w-full h-[50px] mt-4 py-4 text-[18px] text-center transition-all
                          `}
                        >
                          {loading ? (
                            <Spinner
                              size="md"
                              color="gray"
                              className="opacity-40"
                            />
                          ) : (
                            "LINK WALLET"
                          )}
                        </button>
                      </div>
                    )}
                </div>
              </>
            )}
          </div>
        )}
      {/* PARTICIPATION */}
      {currentPhase?.toLowerCase() === "participation" &&
        (user?.isWhitelisted || general?.isPublic) &&
        ((general?.usingLinkedWallet && user?.linkedWallet) ||
          !general?.usingLinkedWallet) && (
          <div className="flex flex-col justify-center min-w-full">
            <div className="flex items-center gap-3 flex-wrap mb-8">
              <p className="bg-samurai-red/10 w-max py-1 px-2 rounded-full text-samurai-red border border-white/10">
                <span className="text-white/70">Your Allocation:</span> $
                {user?.allocation.toLocaleString("en-us", {
                  minimumFractionDigits: 2,
                })}{" "}
                {general?.usingETH
                  ? CHAIN_TO_CURRENCY[chain]
                  : ido?.acceptedTokenSymbol}
              </p>
              <p className="bg-white/10 w-max py-1 px-2 rounded-full text-samurai-red border border-white/10">
                <span className="text-white/70">Tokens Purchased:</span> $
                {user?.purchased.toLocaleString("en-us", {
                  minimumFractionDigits: 2,
                })}{" "}
                {ido.projectTokenSymbol}
              </p>
            </div>

            <div className="flex items-center justify-between w-full">
              <span className="self-end text-[10px] lg:text-[12px] mb-1 mr-1">
                MIN{" "}
                {Number(user?.walletRange?.minPerWallet).toLocaleString(
                  "en-us",
                  {
                    minimumFractionDigits: 2,
                    // maximumFractionDigits: 2,
                  }
                )}
                {" / "}
                MAX{" "}
                {Number(user?.walletRange?.maxPerWallet).toLocaleString(
                  "en-us",
                  {
                    minimumFractionDigits: 2,
                    // maximumFractionDigits: 2,
                  }
                )}{" "}
                {TOKENS_TO_SYMBOL[general?.acceptedToken]}
              </span>
              <button
                onClick={() => onInputChange((user?.balance || 0).toString())}
                className="self-end text-[10px] lg:text-[12px] mb-1 hover:text-samurai-red mr-1"
              >
                BALANCE: {Number(user?.balance || 0).toLocaleString("en-us")}{" "}
                {general?.usingETH
                  ? CHAIN_TO_CURRENCY[chain]
                  : TOKENS_TO_SYMBOL[general?.acceptedToken]}
              </button>
            </div>

            <div className="relative w-full">
              <input
                type="text"
                disabled={loading}
                placeholder={`${
                  general?.usingETH
                    ? CHAIN_TO_CURRENCY[chain]
                    : TOKENS_TO_SYMBOL[general?.acceptedToken]
                } to allocate`}
                className="w-full p-2 lg:p-4 placeholder-black/50 text-black"
                value={inputValue}
                onChange={(e) => onInputChange(e.target.value)}
              />
              {general && (
                <div className="absolute top-[7px] lg:top-[15px] right-2 flex items-center gap-[5px]">
                  <Image
                    src={
                      general?.usingETH
                        ? CHAIN_TO_ICON[chain]
                        : TOKENS_TO_ICON[general?.acceptedToken]
                    }
                    width={32}
                    height={32}
                    alt={
                      general?.usingETH
                        ? CHAIN_TO_CURRENCY[chain]
                        : TOKENS_TO_SYMBOL[general?.acceptedToken]
                    }
                    className="w-6 h-6"
                  />
                  <div className="flex items-center text-black/80 mr-2 text-lg font-bold">
                    <span>
                      {general?.usingETH
                        ? CHAIN_TO_CURRENCY[chain]
                        : TOKENS_TO_SYMBOL[general?.acceptedToken]}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* PARTICIPATE BUTTON */}

            <button
              onClick={onParticipate}
              disabled={
                loading ||
                !general ||
                !user ||
                general?.isPaused ||
                (!user?.isWhitelisted && !general?.isPublic) ||
                inputValue === "" ||
                Number(inputValue) === 0 ||
                Number(inputValue) < user?.walletRange.minPerWallet ||
                Number(inputValue) >
                  user?.walletRange.maxPerWallet - user?.allocation
              }
              className={`
                ${
                  loading ||
                  !general ||
                  !user ||
                  general?.isPaused ||
                  (!user.isWhitelisted && !general?.isPublic) ||
                  inputValue === "" ||
                  Number(inputValue) === 0 ||
                  Number(inputValue) < user?.walletRange.minPerWallet ||
                  Number(inputValue) >
                    user?.walletRange.maxPerWallet - user?.allocation
                    ? "bg-black text-white/20"
                    : "bg-samurai-red text-white hover:opacity-75"
                }
                  rounded-[8px] w-full mt-4 py-4 text-[18px] text-center transition-all 
              `}
            >
              {loading ? (
                <Spinner size="md" color="gray" className="opacity-40" />
              ) : (
                "PARTICIPATE"
              )}
            </button>
          </div>
        )}
      {user?.isWhitelisted && now < general?.periods.participationStartsAt && (
        <div className="flex min-w-full items-center justify-center text-lg">
          Please, wait until participation starts.
        </div>
      )}

      {user?.walletRange.name.toUpperCase() === "PUBLIC" && now < ido.fcfs && (
        <div className="flex min-w-full items-center justify-center text-lg">
          Please, wait until FCFS starts.
        </div>
      )}
    </div>
  );
}
