import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const geistSans = Geist({
  subsets: ["latin"],
  display: "swap",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Trivia UP backend",
  description: "The next.js backend proxy for Trivia UP",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={geistSans.className}>
      <body className="min-h-screen bg-black text-white antialiased">
        {children}
      </body>
    </html>
  )
}