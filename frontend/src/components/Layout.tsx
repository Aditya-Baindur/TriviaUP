import { Link } from 'react-router-dom'
import { ReactNode } from 'react'
import { Logo } from './Logo'
import { ThemeToggle } from './ThemeToggle'
import { ArrowUpRight } from 'lucide-react'
import { SiGithub } from "react-icons/si";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center" aria-label="TriviaUP home">
            <Logo className="h-7 w-auto" />
          </Link>

          <div className="flex items-center gap-2">
            <ThemeToggle />

          <Link to="/github">
            <SiGithub />
          </Link>
          
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col">{children}</main>

      <footer className="border-t border-border/60 py-6">
        <div className="container text-center text-xs text-muted-foreground">
          Built for the Student Health & Wellness coding challenge by{' '}
          <a
            href="https://adityabaindur.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:underline"
          >
            Aditya Baindur
            <ArrowUpRight className="h-3 w-3" />
          </a>
        </div>
      </footer>
    </div>
  )
}
