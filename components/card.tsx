import { Project } from "@/utils/interfaces";
import Image from "next/image";
import Link from "next/link";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
});
interface Card {
  project: Project;
}
export default function Card({ project }: Card) {
  return (
    <Link href="#" className="flex flex-col w-full">
      <Image
        src={`/projects/${project.name.toLowerCase().replaceAll(" ", "-")}.svg`}
        width={426}
        height={0}
        alt=""
        className="rounded-2xl border-2 hover:border-samurai-red transition-all w-full lg:w-[426px]"
      />

      <div className="flex flex-col w-full z-10 mt-4">
        <div className="flex flex-row gap-4 items-center">
          <h1 className="font-bold text-3xl text-samurai-red">
            {project.name}
          </h1>
          <button
            className={`border border-samurai-red text-samurai-red rounded-full w-16 py-1 font-normal text-xs transition-all hover:scale-[1.03] ${inter.className}`}
          >
            Button
          </button>
        </div>
        <p className={`text-lg mt-2 ${inter.className}`}>
          {project.description.substring(0, 260)}...
        </p>
      </div>
    </Link>
  );
}
