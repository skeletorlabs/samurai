import Link from "next/link";
import Layout from "@/components/layout";
import { Inter } from "next/font/google";
import SSButton from "@/components/ssButton";

const inter = Inter({
  subsets: ["latin"],
});

export default function Nft() {
  return (
    <Layout>
      <div className="px-6 lg:px-8 xl:px-20">
        {/* TOP CONTENT */}
        <div className="pt-10 lg:pt-24 lg:max-w-[750px] lg:h-[630px]">
          <h1 className="text-[58px] lg:text-[68px] font-black leading-[62px] tracking-wide">
            Sam NFT
          </h1>
          <p className={`leading-normal pt-4 text-2xl ${inter.className}`}>
            Get your SAM NFT to receive airdrops.
          </p>
          <div className="flex flex-col lg:flex-row items-center pt-10 gap-5 z-20">
            <SSButton>Mint</SSButton>
          </div>
        </div>
      </div>
    </Layout>
  );
}
