"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

// ---- TYPES ----
type TriviaQuestion = {
  type: string
  difficulty: string
  category: string
  question: string
  correct_answer: string
  incorrect_answers: string[]
}

type TriviaData = {
  response_code: number
  results: TriviaQuestion[]
}

type TriviaApiResponse = {
  amount: number
  data: TriviaData
}

export default function Trivia() {
  const [input, setInput] = useState("")
  const [data, setData] = useState<TriviaApiResponse | null>(null)
  const [loading, setLoading] = useState(false)

  const getData = async () => {
    const amount = Number(input) || 10

    setLoading(true)
    try {
      const res = await fetch(`/api/trivia?amount=${amount}`)
      const json: TriviaApiResponse = await res.json()
      setData(json)
    } catch (err) {
      console.error("Failed to fetch trivia:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-2xl space-y-6">
        
        {/* HEADER */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            Trivia Game
          </h1>
          <p className="text-muted-foreground text-sm">
            Generate trivia questions instantly
          </p>
        </div>

        {/* INPUT CARD */}
        <div className="bg-card border rounded-2xl p-4 shadow-sm">
          <div className="flex gap-2">
            <Input
              placeholder="Number of questions (e.g. 10)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1"
            />
            <Button onClick={getData} disabled={loading}>
              {loading ? "Loading..." : "Generate"}
            </Button>
          </div>
        </div>

        {/* QUESTIONS */}
        <div className="space-y-4">
          {data?.data.results.map((q, i) => (
            <div
              key={i}
              className="bg-card border rounded-2xl p-5 shadow-sm space-y-3 transition hover:shadow-md"
            >
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{q.category}</span>
                <span className="capitalize">{q.difficulty}</span>
              </div>

              <p
                className="text-base font-medium leading-relaxed"
                dangerouslySetInnerHTML={{ __html: q.question }}
              />

              <div className="text-sm text-green-600">
                Answer:{" "}
                <span
                  dangerouslySetInnerHTML={{ __html: q.correct_answer }}
                />
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}