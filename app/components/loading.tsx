import Image from "next/image";

export default function Loading() {
  return (
    <Image src="/three-dots.svg" width={48} height={48} alt="loading..." />
  );
}
