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
  mobile?: boolean;
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
  mobile = false,
}: SSButton) {
  return isLink ? (
    <Link
      target={target}
      href={href}
      className={`
      bg-black/70
        flex justify-center items-center transition-all z-20 
        ${flexSize ? "w-full" : "w-auto"} 
        ${
          secondary
            ? "hover:bg-yellow-300 hover:text-white hover:border-yellow-300  border-yellow-300 text-yellow-300"
            : "hover:bg-samurai-red hover:text-white hover:border-samurai-red border-samurai-red text-samurai-red"
        }
        ${
          mobile
            ? "text-sm md:text-normal px-5 py-0 h-10 md:h-auto md:px-8 md:py-3"
            : "text-lg md:text-normal px-8 py-3"
        }
        border rounded-[8px]  
        disabled:border-white/20 disabled:text-white/10
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
        flex justify-center items-center transition-all z-20 
        ${flexSize ? "w-full" : "w-auto"} 
        ${
          secondary
            ? "enabled:hover:bg-yellow-300 enabled:hover:text-white enabled:hover:border-yellow-300  border-yellow-300 text-yellow-300"
            : "enabled:hover:bg-samurai-red enabled:hover:text-white enabled:hover:border-samurai-red border-samurai-red text-samurai-red"
        }
        ${
          mobile
            ? "text-sm md:text-normal px-5 py-0 h-10 md:h-auto md:px-8 md:py-3"
            : "text-lg md:text-normal px-8 py-3"
        }
        border rounded-[8px]  
        disabled:border-white/20 disabled:text-white/10
      `}
    >
      {children}
    </button>
  );
}
