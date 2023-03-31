import Link from "next/link";
import { NAV } from "@/utils/constants";

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
              <span className="w-8 h-8">{item.icon}</span>
              <span>{item.title.toUpperCase()}</span>
            </div>
          </Link>
        ))}
      </div>
    </nav>
  );
}
