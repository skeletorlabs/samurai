import { ReactElement } from "react";
import Nav from "./nav";

interface TopLayout {
  children: ReactElement;
  padding?: boolean;
  background?: string;
}

export default function TopLayout({
  children,
  padding = true,
  background = "",
}: TopLayout) {
  return (
    <div
      className={`flex flex-col w-full h-full  bg-no-repeat bg-fit z-20 ${
        padding ? "pb-12 lg:pb-24" : ""
      } ${background ? background : "bg-home-art"}`}
    >
      <Nav />
      {children}
    </div>
  );
}
