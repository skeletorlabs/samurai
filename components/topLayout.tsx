import { ReactElement } from "react";
import Nav from "./nav";

interface TopLayout {
  children: ReactElement;
  padding?: boolean;
}

export default function TopLayout({ children, padding = true }: TopLayout) {
  return (
    <div
      className={`flex flex-col w-full h-full bg-home-art bg-repeat ${
        padding ? "pb-12 lg:pb-24" : ""
      }`}
    >
      <Nav />
      {children}
    </div>
  );
}
