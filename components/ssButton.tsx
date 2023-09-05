import Link from "next/link";
import { ReactElement } from "react";

interface SSButton {
  children: string | ReactElement;
  isLink?: boolean;
  target?: string;
  href?: string;
  click?: () => void;
  flexSize?: boolean;
  disabled?: boolean;
  secondary?: boolean;
  buttonType?: "button" | "submit" | "reset";
}
export default function SSButton({
  children,
  isLink = false,
  target = "",
  href = "",
  click = () => {},
  flexSize = false,
  disabled = false,
  secondary = false,
  buttonType = "button",
}: SSButton) {
  return isLink ? (
    <Link
      target={target}
      href={href}
      className={`
      text-lg md:text-normal
        flex justify-center items-center border rounded-[8px]
        ${flexSize ? "w-full" : "w-auto"} 
        ${
          secondary
            ? "text-yellow-300 border-yellow-300"
            : "text-samurai-red border-samurai-red"
        }
         px-8 py-3 transition-all z-20
         bg-black/70
         hover:bg-samurai-red hover:text-black hover:border-black hover:font-bold
      `}
    >
      {children}
    </Link>
  ) : (
    <button
      type={buttonType}
      disabled={disabled}
      onClick={() => click()}
      className={`
      bg-black/70
        text-lg md:text-normal
        flex justify-center items-center px-8 py-3 transition-all z-20 
        ${flexSize ? "w-full" : "w-auto"} 
        ${
          secondary
            ? "border-yellow-300 text-yellow-300"
            : "border-samurai-red text-samurai-red"
        }
        border rounded-[8px]  
        enabled:hover:bg-samurai-red enabled:hover:text-black enabled:hover:border-samurai-red
        disabled:border-white/20 disabled:text-white/10
      `}
    >
      {children}
    </button>
  );
}
