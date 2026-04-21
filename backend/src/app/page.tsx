import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black text-white">
      {/* 🔲 Subtle Grid */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* 🔥 Soft Glow */}
      <div className="absolute h-100 w-100 rounded-full bg-red-500/20 blur-3xl" />

      {/* 🧠 Content */}
      <div className="relative z-10 flex flex-col items-center space-y-5 px-4 text-center">
        {/* Logo */}
        <Image
          src="/images/logo-white.png"
          alt="TriviaUP logo"
          width={400}
          height={60}
          className="object-contain"
        />

        {/* Title */}
        <h1 className="text-xl font-medium tracking-tight text-zinc-200">
          TriviaUP Backend
        </h1>

        {/* Description */}
        <p className="max-w-sm text-sm text-zinc-500">
          This service powers the TriviaUP application. It provides question
          retrieval, difficulty handling, and game logic APIs.
        </p>

        {/* Actions */}
        <div className="flex items-center gap-4 pt-2">
          <Link href={process.env.BASE_URL ?? '/'}>
            <Button className="bg-red-500 text-white hover:bg-red-600">
              Open App
            </Button>
          </Link>

          <Link href="/api">
            <Button
              variant="outline"
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-900"
            >
              API Routes
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
