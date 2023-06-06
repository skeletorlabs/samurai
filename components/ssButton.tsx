import Link from "next/link";
import { ReactElement } from "react";

interface SSButton {
  children: string;
  isLink?: boolean;
  href?: string;
  click?: () => void;
  flexSize?: boolean;
}
export default function SSButton({
  children,
  isLink = false,
  href = "",
  click = () => {},
  flexSize = false,
}: SSButton) {
  return isLink ? (
    <Link
      href={href}
      className="flex justify-center items-center border rounded-[8px] border-red-500 px-8 py-3 transition-all hover:bg-samurai-red hover:text-black text-red-500"
    >
      {children}
    </Link>
  ) : (
    <button
      onClick={() => click()}
      className={`flex justify-center items-center ${
        flexSize ? "w-full" : "w-auto"
      } border rounded-[8px] border-red-500 px-8 py-3 transition-all hover:bg-samurai-red hover:text-black text-red-500`}
    >
      {children}
    </button>
  );
}
