import {
  useWeb3ModalAccount,
  useDisconnect,
  useWeb3Modal,
} from "@web3modal/ethers/react";
import { useEffect, useState } from "react";
import SSButton from "./ssButton";

export default function ConnectButton() {
  const [text, setText] = useState("Connect wallet");
  const { isConnected, address } = useWeb3ModalAccount();
  const { open } = useWeb3Modal();

  useEffect(() => {
    setText(
      isConnected
        ? address
          ? address?.slice(0, 4) +
            "..." +
            address?.slice(address.length - 4, address.length)
          : ""
        : "CONNECT WALLET"
    );
  }, [address, isConnected]);

  return <SSButton click={() => open()}>{text}</SSButton>;
}
