import Link from "next/link";
import Layout from "@/components/layout";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
});

export default function Launchpad() {
  return (
    <Layout>
      <div className="px-6 lg:px-8 xl:px-20">
        {/* TOP CONTENT */}
        <div className="pt-10 lg:pt-24 lg:max-w-[750px] lg:h-[630px]">
          <h1 className="text-[58px] lg:text-[68px] font-black leading-[62px] tracking-wide">
            Launchpad
          </h1>
          <p className={`leading-normal pt-4 text-2xl ${inter.className}`}>
            Lorem ipsum dolor sit amet
          </p>
          <div className="flex flex-col lg:flex-row items-center pt-10 gap-5 z-20">
            <button className="bg-[#FF284C] border rounded-2xl border-[#e2d4d6] px-8 h-14 text-lg transition-all hover:bg-black/90 hover:text-white hover:border-white w-full lg:w-[190px]">
              Lorem ipsum
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
