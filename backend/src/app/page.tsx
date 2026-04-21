import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";


export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Image height={10} width={10} src={"/images/logo.png"} alt="TriviaUP logo"> </Image>
      <p>Backend for TriviaUP</p>
      <Link href={process.env.BASE_URL ?? "https://"}>

      </Link>
      <Button variant='link'></Button>
    </div>
  );
}
