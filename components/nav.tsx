import Image from "next/image";
import Link from "next/link";
import { NAV } from "@/utils/constants";
import { useState } from "react";
export default function Nav() {
  const [active, setActive] = useState("");
  console.log(active);
  return (
    <div className="h-20 px-4 flex items-center justify-between">
      <div className="flex items-center w-full gap-9 font-light">
        <Link href="/" className="transition-all hover:opacity-75">
          <Image
            src="/logo.svg"
            width={300}
            height={100}
            alt="logo"
            className="mr-10"
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
      <button className="border rounded-[8px] border-red-500 px-8 py-2 font-light transition-all hover:scale-105 hover:bg-red-500 hover:text-black hover:font-medium">
        V1(Old)
      </button>
    </div>
  );
}
