import { useEffect } from "react"
import { sleep } from "@/lib/sleep"
import { Loader2 } from "lucide-react"
import { Logo } from "@/components/Logo"

export default function Github() {
  useEffect(() => {
    const run = async () => {
      await sleep(500)
      window.location.replace("https://github.com/Aditya-Baindur/TriviaUP")
    }

    run()
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6 text-center">
        <Logo className="h-10 w-auto" />

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Taking you to the repository...
          </p>
        </div>

        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    </div>
  )
}