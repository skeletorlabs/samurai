import Link from "next/link";

interface SSButton {
  children: string;
  isLink?: boolean;
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
  href = "",
  click = () => {},
  flexSize = false,
  disabled = false,
  secondary = false,
  buttonType = "button",
}: SSButton) {
  return isLink ? (
    <Link
      href={href}
      className={`
        flex justify-center items-center border rounded-[8px]
        ${
          secondary
            ? "text-yellow-300 border-yellow-300"
            : "text-samurai-red border-samurai-red"
        }
         px-8 py-3 transition-all 
        hover:bg-samurai-red hover:text-black hover:border-samurai-red
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
        flex justify-center items-center  px-8 py-3 transition-all 
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
