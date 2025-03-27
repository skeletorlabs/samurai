import { useWeb3ModalAccount, useWeb3Modal } from "@web3modal/ethers/react";
import { useEffect, useState } from "react";
import { shortAddress } from "@/app/utils/shortAddress";
import { WalletIcon } from "@heroicons/react/24/solid";
import classNames from "classnames";

interface ConnectButton {
  showText: boolean;
}
export default function ConnectButton({ showText = false }: ConnectButton) {
  const [text, setText] = useState("Connect");
  const { isConnected, address } = useWeb3ModalAccount();
  const { open } = useWeb3Modal();

  useEffect(() => {
    setText(isConnected ? shortAddress(address || "") : "Connect");
  }, [address, isConnected]);

  return (
    <button
      onClick={() => open()}
      className={classNames({
        "flex w-full h-[55px] 2xl:h-[60px] items-center transition-all border-samurai-red hover:bg-white/10":
          true,
        "justify-center": !showText,
        "gap-5 pl-8": showText,
      })}
    >
      <span className="w-5 h-5 2xl:w-6 2xl:h-6">
        <WalletIcon />
      </span>
      <span
        className={classNames({
          "transition-all": true,
          flex: showText,
          hidden: !showText,
        })}
      >
        {text}
      </span>
    </button>
  );
}
