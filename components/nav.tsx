import Image from "next/image";
import Link from "next/link";
import { NAV } from "@/utils/constants";
import { useContext } from "react";
import { Inter } from "next/font/google";
import { StateContext } from "@/context/StateContext";
import { Page } from "@/utils/enums";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import SSButton from "./ssButton";

const inter = Inter({
  subsets: ["latin"],
});

export default function Nav() {
  const { page, setPage } = useContext(StateContext);
  return (
    <div
      className={`h-20 px-2 lg:px-8 flex flex-col md:flex-row items-center justify-between mt-5 z-10 ${inter.className} h-max`}
    >
      <div className="flex items-center gap-9 font-bold text-lg 2xl:text-xl">
        <Link
          href="/"
          className="transition-all hover:opacity-75"
          onClick={() => setPage(Page.home)}
        >
          <Image
            src="/logo.svg"
            placeholder="blur"
            blurDataURL="/logo.svg"
            width={0}
            height={0}
            alt="logo"
            className=" mt-[-5px] drop-shadow-xl w-[400px] lg:w-[320px] h-[100px] px-3 lg:px-0"
          />
        </Link>
        {NAV.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className={`hidden lg:flex hover:border-b hover:border-samurai-red h-8 ${
              page === item.page
                ? "text-samurai-red border-b border-samurai-red"
                : ""
            }`}
            onClick={() => setPage(item.page)}
          >
            {item.title}
          </Link>
        ))}
      </div>
      <div className="flex gap-5 h-10 px-5 lg:px-0">
        {/* {page === Page.nft && <ConnectButton showBalance={false} />} */}

        <div className="hidden xl:flex">
          <SSButton isLink href="#">
            V1(Old)
          </SSButton>
        </div>
      </div>
    </div>
  );
}
