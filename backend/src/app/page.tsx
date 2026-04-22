import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black text-white px-4">
      <div className="flex flex-col items-center text-center space-y-6">
        
        {/* Logo */}
        <Image
          src="/images/logo-white.png"
          alt="TriviaUP logo"
          width={220}
          height={40}
          className="object-contain"
          priority
        />

        {/* Title | Only for HTML anchor to follow WCAG AAA*/}
        <h1 className="text-2xl font-semibold tracking-tight">
          Backend of TriviaUP
        </h1>

        {/* Description */}
        <p className="max-w-md text-sm text-zinc-400">
          API service for TriviaUP. Handles question retrieval, difficulty, and game logic.
        </p>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Link href={process.env.BASE_URL ?? "https://triviaup.adityabaindur.com"}>
            <Button className="bg-white text-black hover:bg-zinc-400">
              Open App
            </Button>
          </Link>

          <Link href="https://docs.adityabaindur.dev/docs/TriviaUP/API">
            <Button variant="outline" className="border-zinc-700 text-black bg-white hover:bg-zinc-400">
              API Documentation
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}