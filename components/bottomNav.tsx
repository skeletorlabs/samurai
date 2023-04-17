import Link from "next/link";
import { NAV } from "@/utils/constants";
import Image from "next/image";

export default function BottomNav() {
  return (
    <nav className="fixed lg:hidden bottom-0 w-full h-[80px] bg-samurai-red z-50 pb-2">
      <div className="flex justify-around items-center w-full h-full px-4">
        {NAV.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className={` text-[8px] sm:text-md hover:opacity-75 text-slate-500"
              }`}
          >
            <div className="flex flex-col items-center text-white">
              <Image
                src={item.iconHref}
                width={24}
                height={24}
                alt={item.title}
              />
              <span>{item.title.toUpperCase()}</span>
            </div>
          </Link>
        ))}
      </div>
    </nav>
  );
}
