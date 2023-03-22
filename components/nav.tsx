import Image from "next/image";
import Link from "next/link";
import { NAV } from "@/utils/constants";
import { useState } from "react";
export default function Nav() {
  const [active, setActive] = useState("");
  return (
    <div className="h-20 px-8 flex items-center justify-between mt-10 z-10">
      <div className="flex items-center w-full gap-9 font-light">
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
            className="mr-10 mt-[-5px] drop-shadow-xl w-[320px] h-[100px]"
          />
        </Link>
        {NAV.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className={`hover:border-b hover:border-red-500 h-7 ${
              active === item.title && "text-red-500 border-b border-red-500"
            }`}
            onClick={() => setActive(item.title)}
          >
            {item.title}
          </Link>
        ))}
      </div>
      <button className="border rounded-[8px] border-red-500 px-4 py-1 text-sm transition-all hover:bg-[#FF4E6B] hover:text-black text-red-500 hover:font-medium">
        V1(Old)
      </button>
    </div>
  );
}
