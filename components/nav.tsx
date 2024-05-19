import Image from "next/image";
import Link from "next/link";
import { NAV } from "@/utils/constants";
import { useContext } from "react";
import { Inter } from "next/font/google";
import { StateContext } from "@/context/StateContext";
import { Page } from "@/utils/enums";
import SSButton from "./ssButton";
import { useRouter } from "next/router";
import ConnectButton from "./connectbutton";

const inter = Inter({
  subsets: ["latin"],
});

export default function Nav() {
  const { page, setPage } = useContext(StateContext);
  const { query, pathname } = useRouter();
  return (
    <div
      className={`h-20 px-2 lg:px-8 flex flex-col md:flex-row items-center justify-between mt-5 z-10 ${inter.className} h-max`}
    >
      <div className="flex items-center gap-6 font-bold text-lg 2xl:text-xl">
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
            className=" mt-[-5px] drop-shadow-xl w-[400px] lg:w-[300px] h-[80px] px-3 lg:px-0"
          />
        </Link>
        {NAV.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className={`hidden lg:flex hover:border-b hover:border-samurai-red h-8 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] ${
              page === item.page ||
              (pathname.includes(item.href) && item.href !== "/")
                ? "text-samurai-red border-b border-samurai-red"
                : ""
            }`}
            onClick={() => setPage(item.page)}
          >
            {item.title}
          </Link>
        ))}
      </div>
      <div className="flex flex-col md:flex-row  gap-5 px-5 lg:px-0 h-max">
        {(page === Page.nft || query.ido !== "") && (
          <div className="flex self-center h-14">
            <ConnectButton />
          </div>
        )}

        <SSButton
          isLink
          target="blank"
          href="https://basescan.org/token/0xed1779845520339693CDBffec49a74246E7D671b"
        >
          CA: 0xe...71b
        </SSButton>
      </div>
    </div>
  );
}
