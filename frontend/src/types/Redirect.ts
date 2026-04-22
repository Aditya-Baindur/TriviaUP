export type RedirectItem = {
  url: string
  label: string
}

export type RedirectKey = "github" | "docs"

export type RedirectDB = Record<RedirectKey, RedirectItem>