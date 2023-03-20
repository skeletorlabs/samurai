import Image from "next/image";
import Link from "next/link";
import { NAV } from "@/utils/constants";
export default function Nav() {
  return (
    <div className="h-20 px-4 flex items-center justify-between">
      <div className="flex items-center w-full gap-9 font-light">
        <Image
          src="/logo.svg"
          width={300}
          height={100}
          alt="logo"
          className="mr-10"
        />
        {NAV.map((item, index) => (
          <Link key={index} href={item.href} className="hover:border-b h-7">
            {item.title}
          </Link>
        ))}
      </div>
      <button className="border rounded-[8px] border-red-500 bg-slate-900 px-8 py-2 font-light transition-all hover:scale-105">
        V1(Old)
      </button>
    </div>
  );
}
