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
  console.log(project.img);

  // const getImage = useCallback(async () => {
  //   const response = await fetch(
  //     "https://dev-fs.cyberfi.tech/api/file/upcoming/maya.png"
  //   );

  //   console.log(response);
  // }, []);

  // useEffect(() => {
  //   getImage();
  // }, []);

  return (
    <Link
      href="#"
      className="flex flex-col justify-end w-[380px] h-[400px] rounded-xl border border-neutral-700 relative transition-all hover:scale-[1.03] hover:border-samurai-red hover:shadow-xl hover:shadow-samurai-red/20 hover:bg-samurai-red hover:text-white"
    >
      <div className="flex flex-col justify-center items-center w-full h-[150px] rounded-b-xl text-center px-4 z-10">
        <h1 className="font-bold text-xl">{project.name}</h1>
        <p className={`text-black/70 hover:text-white ${inter.className}`}>
          {project.description.substring(0, 80)}...
        </p>
        <button className="bg-samurai-red rounded-full w-20 py-1 mt-3 font-normal text-sm text-white">
          Button
        </button>
      </div>
      <Image
        src={`https://samuraistarter.com/_nuxt/img/inwarium.0518d58.png`}
        width={380}
        height={250}
        alt=""
        className="absolute top-0 left-0 z-0 rounded-t-xl max-h-[250px]"
      />
      <Image
        src={`/chain-logos/${project.network}.svg`}
        width={20}
        height={20}
        alt=""
        className="absolute top-2 right-2 max-h-[20px]"
      />
    </Link>
  );
}
