import { ReactElement } from "react";
import Nav from "./nav";
import SidebarMenu from "./sidebarMenu";

interface TopLayout {
  children: ReactElement;
  padding?: boolean;
  background?: string;
  style?: object;
}

export default function TopLayout({
  children,
  padding = true,
  background = "",
  style = {},
}: TopLayout) {
  return (
    <div
      style={style}
      className={`flex flex-col w-full h-full bg-no-repeat bg-cover md:bg-center 2xl:bg-[0_-10rem] z-20 ${
        padding ? "pb-12 lg:pb-24" : ""
      } ${background ? background : "bg-home-art"}`}
    >
      <Nav />
      {/* <SidebarMenu /> */}
      {children}
    </div>
  );
}
