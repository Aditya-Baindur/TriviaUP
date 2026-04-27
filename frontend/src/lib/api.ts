/**
 * API Handler
 *
 * Utility functions for interacting with the TriviaUP backend API.
 *
 * Responsibilities:
 * - Manage session tokens (store, refresh, validate)
 * - Fetch trivia questions from backend
 * - Handle retries on expired tokens
 * - Provide helper utilities (e.g., HTML decoding)
 *
 * @notes
 * - Uses localStorage for token persistence
 * - Token expires after 6 hours
 * - Automatically refreshes token when needed
 */


const VITE_URL = import.meta.env.VITE_BASE_URL

console.log(`Backend URL : ${VITE_URL}`)

const BASE_URL = VITE_URL ?? 'https://backend.triviaup.adityabaindur.com/api/trivia'

const TOKEN_KEY = 'triviaup_token'
const TOKEN_TTL_MS = 6 * 60 * 60 * 1000 // 6 hours

export type Difficulty = 'easy' | 'medium' | 'hard' | 'any'
export type QuestionType = 'boolean' | 'multiple' | 'any'

export interface TriviaCategory {
  id: number
  name: string
  label: string
  group: string | null
}

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
  data?: { response_code: number; response_message: string; token: string }
  token: string
  reset?: boolean
}

interface TriviaResponse {
  amount: number
  questions: TriviaQuestion[]
}

interface TriviaErrorResponse {
  error?: string
  code?: number
  needsTokenReset?: boolean
}

interface CategoryResponse {
  categories: TriviaCategory[]
}


/**
 * Gets the token from localstorage
 */
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

/**
 * Writes the token from localstorage and 
 * set's it to expire after 6 hours
 * @param token 
 */
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

export async function resetToken(token: string): Promise<string> {
  const url = new URL(`${BASE_URL}/token`)
  url.searchParams.set('token', token)

  const res = await fetch(url.toString())

  if (!res.ok) {
    throw new Error('Failed to reset token')
  }

  const json = (await res.json()) as TokenResponse
  const nextToken = json.token ?? json.data?.token

  if (!nextToken) {
    throw new Error('Invalid reset token response')
  }

  writeStoredToken(nextToken)
  return nextToken
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
  category?: number | string
}


/**
 * Fetches trivia from backend
 * @param params 
 * @returns 
 */
export async function fetchTrivia(
  params: FetchTriviaParams
): Promise<TriviaQuestion[]> {
  let token = await ensureToken()

  const makeUrl = (currentToken: string) => {
    const url = new URL(BASE_URL)
    url.searchParams.set('amount', String(params.amount))
    url.searchParams.set('token', currentToken)

    if (params.difficulty) {
      url.searchParams.set('difficulty', params.difficulty)
    }

    if (params.type) {
      url.searchParams.set('type', params.type)
    }

    if (params.category && params.category !== 'any') {
      url.searchParams.set('category', String(params.category))
    }

    return url
  }

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const res = await fetch(makeUrl(token).toString())

    if (res.ok) {
      const data = (await res.json()) as TriviaResponse
      return data.questions
    }

    let errorBody: TriviaErrorResponse | null = null

    try {
      errorBody = (await res.json()) as TriviaErrorResponse
    } catch {
      errorBody = null
    }

    if (errorBody?.needsTokenReset && attempt === 0) {
      token = await resetToken(token)
      continue
    }

    if ([400, 401, 403].includes(res.status) && attempt === 0) {
      token = await fetchNewToken()
      continue
    }

    throw new Error(errorBody?.error ?? 'Failed to fetch trivia')
  }

  throw new Error('Failed to fetch trivia')
}

export async function fetchCategories(): Promise<TriviaCategory[]> {
  const res = await fetch(`${BASE_URL}/categories`)

  if (!res.ok) {
    throw new Error('Failed to fetch categories')
  }

  const data = (await res.json()) as CategoryResponse
  return data.categories
}

export function decodeHtml(html: string): string {
  const txt = document.createElement('textarea')
  txt.innerHTML = html
  return txt.value
}
