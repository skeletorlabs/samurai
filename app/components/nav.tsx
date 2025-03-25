import Image from "next/image";
import Link from "next/link";
import { IDOs, NAV } from "@/app/utils/constants";
import { useContext, useEffect } from "react";
import { Inter } from "next/font/google";
import { StateContext } from "@/app/context/StateContext";
import { Page } from "@/app/utils/enums";
import SSButton from "./ssButton";
import { useParams, usePathname } from "next/navigation";
import ConnectButton from "./connectbutton";
import { useSwitchNetwork } from "@web3modal/ethers/react";
import { chains } from "../context/web3modal";
import { base } from "../utils/chains"

const inter = Inter({
  subsets: ["latin"],
});

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
      className={`h-20 px-2 lg:px-8 flex flex-col md:flex-row items-center justify-between mt-5 z-10 ${inter.className} h-max`}
    >
      <div className="flex items-center gap-4 2xl:gap-6 font-bold text-[16px] 2xl:text-xl">
        <Link
          href="/"
          className="transition-all hover:opacity-75"
          onClick={() => setPage(Page.home)}
        >
          <Image
            src="/logo.svg"
            // placeholder="blur"
            // blurDataURL="/logo.svg"
            width={0}
            height={0}
            alt="logo"
            className="mt-[-5px] drop-shadow-xl w-[300px] lg:w-[300px] h-[80px] px-3 lg:px-0"
          />
        </Link>
        {NAV.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className={`hidden lg:flex hover:border-b hover:border-samurai-red h-8 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]
              ${
                page === item.page ||
                (pathname.includes(item.href) && item.href !== "/")
                  ? "text-samurai-red border-b border-samurai-red"
                  : ""
              }
            `}
            onClick={() => setPage(item.page)}
          >
            {item.title}
          </Link>
        ))}
      </div>
      <div className="flex gap-5 lg:px-0">
        {(page === Page.nft ||
          ido ||
          page === Page.sanka ||
          page === Page.dashboard) && (
          <div className="flex self-center h-14">
            <ConnectButton mobile />
          </div>
        )}

        <SSButton
          isLink
          target="blank"
          href="https://basescan.org/token/0xed1779845520339693CDBffec49a74246E7D671b"
          mobile
        >
          CA: 0xe...71b
        </SSButton>
      </div>
    </div>
  );
}
