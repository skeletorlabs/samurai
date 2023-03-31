import Image from "next/image";
import Link from "next/link";
import { NAV } from "@/utils/constants";
import { useState } from "react";
import { Inter } from "next/font/google";
const inter = Inter({
  subsets: ["latin"],
});
export default function Nav() {
  const [active, setActive] = useState("");
  return (
    <div className="h-20 px-2 lg:px-8 flex items-center justify-between mt-10 z-10">
      <div className="flex items-center w-full gap-9 font-bold text-xl">
        <Link
          href="/"
          className="transition-all hover:opacity-75"
          onClick={() => setActive("")}
        >
          <Image
            src="/logo.svg"
            width={0}
            height={0}
            alt="logo"
            className="mr-10 mt-[-5px] drop-shadow-xl w-[400px] lg:w-[320px] h-[100px]"
          />
        </Link>
        {NAV.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className={`hidden lg:flex hover:border-b hover:border-samurai-red h-8 ${
              active === item.title &&
              "text-samurai-red border-b border-samurai-red"
            } ${inter.className}`}
            onClick={() => setActive(item.title)}
          >
            {item.title}
          </Link>
        ))}
      </div>
      <button className="hidden lg:flex border rounded-[8px] border-red-500 px-4 py-1 text-sm transition-all hover:bg-[#FF4E6B] hover:text-black text-red-500 hover:font-medium">
        V1(Old)
      </button>
    </div>
  );
}
