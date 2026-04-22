/**
 * Redirect Page
 *
 * Handles client-side redirection based on a key (github, docs).
 * Displays a loading UI while redirecting the user.
 * Falls back to "/" if the key is invalid
 * 
 * Usage : 
 *  - Add route to `RedirectDb` and `RedirectKey` if needed. 
 *  - Use in JSX : <Redirect keyname=''/>
 * 
 * @param keyName 
 */

import { useEffect } from 'react'
import { sleep } from '@/lib/sleep'
import { Loader2 } from 'lucide-react'
import { Logo } from '@/components/Logo'

export type RedirectItem = {
  url: string
  label: string
}
export type RedirectKey = 'github' | 'docs'

export type RedirectDB = Record<RedirectKey, RedirectItem>

const RedirectDb: RedirectDB = {
  github: {
    url: 'https://github.com/Aditya-Baindur/TriviaUP',
    label: 'GitHub',
  },
  docs: {
    url: 'https://docs.adityabaindur.dev/docs/TriviaUP',
    label: 'Docs',
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

      if (item) {
        window.location.replace(item.url)
      } else {
        window.location.replace('/')
      }
    }

    run()
  }, [item])

  if (!item) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Invalid redirect, taking you home...
        </p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6 text-center">
        <Logo className="h-10 w-auto" />

        <div className="flex flex-col items-center space-y-3">
          <p className="text-sm text-muted-foreground">
            Taking you to {item.label}...
          </p>

          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      </div>
    </div>
  )
}
