import Image from "next/image";
import Link from "next/link";
import { IDOs } from "@/app/utils/constants";
import { useContext, useEffect } from "react";
import { Inter } from "next/font/google";
import { StateContext } from "@/app/context/StateContext";
import { Page } from "@/app/utils/enums";
import { useParams, usePathname } from "next/navigation";
import ConnectButton from "./connectbutton";
import { useSwitchNetwork } from "@web3modal/ethers/react";
import { chains } from "../context/web3modal";
import { base } from "../utils/chains";
// import NavDropdown from "./navDropdown";

const inter = Inter({
  subsets: ["latin"],
});

// const buyItems = [
//   {
//     name: "$SAM on Shadow",
//     href: "https://aerodrome.finance/swap?from=0x4200000000000000000000000000000000000006&to=0xed1779845520339693CDBffec49a74246E7D671b",
//   },
//   {
//     name: "$SAM on Aerodrome",
//     href: "https://aerodrome.finance/swap?from=0x4200000000000000000000000000000000000006&to=0xed1779845520339693CDBffec49a74246E7D671b",
//   },
// ];

// const provideItems = [
//   {
//     name: "S/SAM on Shadow",
//     href: "https://aerodrome.finance/swap?from=0x4200000000000000000000000000000000000006&to=0xed1779845520339693CDBffec49a74246E7D671b",
//   },
//   {
//     name: "vAMM-WETH/SAM on Aerodrome",
//     href: "https://aerodrome.finance/swap?from=0x4200000000000000000000000000000000000006&to=0xed1779845520339693CDBffec49a74246E7D671b",
//   },
// ];

export default function Nav() {
  const { page, setPage, chain } = useContext(StateContext);
  const pathname = usePathname();
  const { ido } = useParams();
  const { switchNetwork } = useSwitchNetwork();

  const getVestingChainId = () => {
    const currentIDO = IDOs.find((item) => item.id === ido);
    return currentIDO?.vestingChain?.chainId || -1;
  };

  const needToSwitchNetwork = (chainId: number) => {
    return chain !== chainId;
  };

  const checkNetwork = async () => {
    const vestingChainId = getVestingChainId();

    if (vestingChainId !== -1 && needToSwitchNetwork(vestingChainId)) {
      await switchNetwork(vestingChainId);
    } else if (chain !== base.chainId && chains.length > 1) {
      await switchNetwork(base.chainId);
    }
  };

  useEffect(() => {
    checkNetwork();
  }, [chain, ido]);
  return (
    <div
      className={`h-20 px-2 lg:px-8 flex flex-col md:flex-row items-center justify-center lg:justify-end mt-5 z-10 ${inter.className} h-max`}
    >
      <div className="flex gap-5 lg:px-0">
        {(page === Page.nft ||
          page === Page.launchpad ||
          ido ||
          page === Page.tokens ||
          page === Page.sanka ||
          page === Page.dashboard) && (
          <div className="flex self-center h-14">
            <ConnectButton mobile />
          </div>
        )}

        {/* <NavDropdown items={buyItems} title="Buy" /> */}

        <div className="flex items-center w-full bg-black rounded-lg h-10 border border-neutral-500">
          <Link
            target="blank"
            href="https://basescan.org/token/0xed1779845520339693CDBffec49a74246E7D671b"
            className="bg-transparent w-[120px] h-10 flex justify-center gap-3 items-center transition-all z-20 hover:bg-blue-600 text-blue hover:text-blue-100  text-sm md:text-normal px-3 py-[5px] rounded-l-lg"
          >
            <Image
              src="/chain-logos/BASE.svg"
              alt=""
              width={22}
              height={22}
              className="bg-white rounded-full p-[1px]"
            />
            <span>0xe...71b</span>
          </Link>
          <span className="h-full w-[1px] bg-neutral-500/50" />

          <Link
            target="blank"
            href="https://sonicscan.org/token/0xCC5D9cc0d781d7F41F6809c0E8356C15942b775E"
            className="bg-transparent w-[120px] h-10 flex justify-center gap-3 items-center transition-all z-20 hover:bg-orange-400 text-orange-300 hover:text-orange-100 text-sm md:text-normal px-3 py-[5px] rounded-r-lg"
          >
            <Image
              src="/chain-logos/SONIC.png"
              alt=""
              width={22}
              height={22}
              className="bg-white rounded-full p-[1px]"
            />
            <span>0xC...75E</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
