const BASE_URL = process.env.BASE_URL ?? 'https://backend.triviaup.adityabaindur.com/api/trivia'
const TOKEN_KEY = 'triviaup_token'
const TOKEN_TTL_MS = 6 * 60 * 60 * 1000 // 6 hours

export type Difficulty = 'easy' | 'medium' | 'hard' | 'any'
export type QuestionType = 'boolean' | 'multiple' | 'any'

export interface TriviaQuestion {
  id: number
  question: string
  correctAnswer: string
  options: string[]
  difficulty: Difficulty
  category: string
  type: 'boolean' | 'multiple'
}

interface StoredToken {
  token: string
  expiresAt: number
}

interface TokenResponse {
  data: { response_code: number; response_message: string; token: string }
  token: string
}

interface TriviaResponse {
  amount: number
  questions: TriviaQuestion[]
}

function readStoredToken(): StoredToken | null {
  try {
    const raw = localStorage.getItem(TOKEN_KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw) as StoredToken

    if (!parsed.token || !parsed.expiresAt) return null
    if (Date.now() >= parsed.expiresAt) return null

    return parsed
  } catch {
    return null
  }
}

function writeStoredToken(token: string) {
  const stored: StoredToken = {
    token,
    expiresAt: Date.now() + TOKEN_TTL_MS,
  }

  localStorage.setItem(TOKEN_KEY, JSON.stringify(stored))
}

export function clearStoredToken() {
  localStorage.removeItem(TOKEN_KEY)
}

export async function fetchNewToken(): Promise<string> {
  const res = await fetch(`${BASE_URL}/token`)

  if (!res.ok) {
    throw new Error('Failed to fetch token')
  }

  const json = (await res.json()) as TokenResponse
  const token = json.token ?? json.data?.token

  if (!token) {
    throw new Error('Invalid token response')
  }

  writeStoredToken(token)
  return token
}

export async function ensureToken(): Promise<string> {
  const existing = readStoredToken()
  if (existing) return existing.token

  return fetchNewToken()
}

export interface FetchTriviaParams {
  amount: number
  difficulty?: Difficulty
  type?: QuestionType
}

export async function fetchTrivia(
  params: FetchTriviaParams
): Promise<TriviaQuestion[]> {
  const token = await ensureToken()

  const url = new URL(BASE_URL)
  url.searchParams.set('amount', String(params.amount))
  url.searchParams.set('token', token)

  if (params.difficulty) {
    url.searchParams.set('difficulty', params.difficulty)
  }

  if (params.type) {
    url.searchParams.set('type', params.type)
  }

  const res = await fetch(url.toString())

  if (!res.ok) {
    // Token expired → retry once
    if ([400, 401, 403].includes(res.status)) {
      const fresh = await fetchNewToken()
      url.searchParams.set('token', fresh)

      const retry = await fetch(url.toString())

      if (!retry.ok) {
        throw new Error('Failed to fetch trivia')
      }

      const data = (await retry.json()) as TriviaResponse
      return data.questions
    }

    throw new Error('Failed to fetch trivia')
  }

  const data = (await res.json()) as TriviaResponse
  return data.questions
}

export function decodeHtml(html: string): string {
  const txt = document.createElement('textarea')
  txt.innerHTML = html
  return txt.value
}
