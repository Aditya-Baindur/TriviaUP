import { useEffect } from "react"
import { sleep } from "@/lib/sleep"
import { Loader2 } from "lucide-react"
import { Logo } from "@/components/Logo"

import type { RedirectDB, RedirectKey } from "@/types/Redirect"

const RedirectDb: RedirectDB = {
  github: {
    url: "https://github.com/Aditya-Baindur/TriviaUP",
    label: "GitHub",
  },
  docs: {
    url: "https://docs.adityabaindur.dev/docs/TriviaUP/API",
    label: "Docs",
  },
}

type Props = {
  keyName: RedirectKey
}

export default function Redirect({ keyName }: Props) {
  const item = RedirectDb[keyName]

  useEffect(() => {
    const run = async () => {
      await sleep(500)
      window.location.replace(item.url)
    }

    run()
  }, [keyName, item.url])

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6 text-center">
        <Logo className="h-10 w-auto" />

        <div className="space-y-3 flex flex-col items-center">
          <p className="text-sm text-muted-foreground">
            Taking you to {item.label}...
          </p>

          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      </div>
    </div>
  )
}