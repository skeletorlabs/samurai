import { ReactElement } from "react";

interface SSButton {
  children: string;
}
export default function SSButton({ children }: SSButton) {
  return (
    <button className="transition-all bg-button hover:bg-button-hover bg-no-repeat w-[195px] h-[55.31px] text-center">
      {children}
    </button>
  );
}
