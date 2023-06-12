import Link from "next/link";
import { ReactElement } from "react";

interface SSButton {
  children: string;
  isLink?: boolean;
  href?: string;
  click?: () => void;
  flexSize?: boolean;
  disabled?: boolean;
}
export default function SSButton({
  children,
  isLink = false,
  href = "",
  click = () => {},
  flexSize = false,
  disabled = false,
}: SSButton) {
  return isLink ? (
    <Link
      href={href}
      className="flex justify-center items-center border rounded-[8px] border-samurai-red px-8 py-3 transition-all hover:bg-samurai-red hover:text-black text-samurai-red"
    >
      {children}
    </Link>
  ) : (
    <button
      disabled={disabled}
      onClick={() => click()}
      className={`
        flex justify-center items-center text-samurai-red px-8 py-3 transition-all 
        ${flexSize ? "w-full" : "w-auto"} 
        border rounded-[8px] border-samurai-red 
        enabled:hover:bg-samurai-red enabled:hover:text-black
        disabled:border-gray-800 disabled:text-gray-800
      `}
    >
      {children}
    </button>
  );
}
