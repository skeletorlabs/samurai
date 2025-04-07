import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import StateProvider from "@/app/context/StateContext";
import AppClient from "@/app/context/AppClient"; // Import the client component

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "500", "900"],
});

export const metadata: Metadata = {
  title: "Samurai Starter",
  description:
    "Samurai enables projects to raise capital on a decentralised, permissionless and interoperable environment",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <StateProvider>
          <AppClient>{children}</AppClient>{" "}
          {/* Client-side logic handled here */}
        </StateProvider>
      </body>
    </html>
  );
}
