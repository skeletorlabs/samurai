import Image from "next/image";

export default function LoadingBox() {
  return (
    <div className="absolute top-0 left-0 bg-black/80 backdrop-blur-sm w-[100%] h-[100%] rounded-lg border border-black flex justify-center items-center">
      <Image src="/three-dots.svg" width={48} height={48} alt="loading..." />
    </div>
  );
}
