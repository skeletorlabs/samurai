import Link from "next/link";
import { NAV } from "@/utils/constants";
import Image from "next/image";
import { useContext } from "react";
import { StateContext } from "@/context/StateContext";
import { Page } from "@/utils/enums";
import { home } from "@/utils/svgs";

export default function BottomNav() {
  const { page } = useContext(StateContext);

  return (
    <nav className="fixed lg:hidden bottom-0 w-full h-[80px] bg-[#FF284C] z-50 pb-2">
      <div className="flex justify-around items-center w-full h-full px-4">
        {NAV.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className={`text-[10px]  ${
              item.page === page
                ? "text-black"
                : "text-white hover:text-pink-900"
            }`}
          >
            <div className="flex flex-col items-center">
              <div className="w-[24px] h-[24px]">{item.icon}</div>
              <span>{item.title.toUpperCase()}</span>
            </div>
          </Link>
        ))}
      </div>
    </nav>
  );
}
