/**
 * Play Page
 *
 * Core gameplay screen for TriviaUP.
 * Fetches questions, manages game state, and handles scoring + progression.
 * Displays loading, error, and interactive quiz UI.
 * Persists results to localStorage and redirects to "/results" on completion.
 *
 * Usage :
 *  - Access via /setup with query params (difficulty, type, amount)
 *  - Example : /play?difficulty=easy&type=multiple&amount=10
 *  - Navigates to "/results" with game state after completion
 *
 * @param difficulty - Question difficulty ("easy" | "medium" | "hard" | "any")
 * @param type - Question type ("multiple" | "boolean" | "any")
 * @param amount - Number of questions (1–30)
 */

import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, X, Loader2, ArrowRight } from 'lucide-react'
import { Layout } from '@/components/Layout'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import {
  fetchTrivia,
  decodeHtml,
  type Difficulty,
  type QuestionType,
  type TriviaQuestion,
} from '@/lib/api'


// Points per question
const POINTS: Record<Difficulty, number> = {
  easy: 1,
  medium: 2,
  hard: 3,
  any: 0, //unused only to satisfy types
}

interface AnswerRecord {
  question: string
  category: string
  difficulty: Difficulty
  correct: boolean
  selected: string
  answer: string
  points: number
}

const Play = () => {
  const [params] = useSearchParams()
  const navigate = useNavigate()

  const difficulty = (params.get('difficulty') as Difficulty) || 'any'
  const type = (params.get('type') as QuestionType) || 'any'
  const category = params.get('category') || 'any'
  const amount = Math.min(
    Math.max(parseInt(params.get('amount') || '10', 10), 1),
    30
  )

  const [questions, setQuestions] = useState<TriviaQuestion[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [history, setHistory] = useState<AnswerRecord[]>([])

  useEffect(() => {
    let cancelled = false
    setQuestions(null)
    setError(null)
    fetchTrivia({ amount, difficulty, type, category })
      .then((qs) => {
        if (cancelled) return
        if (!qs.length) {
          setError('No questions returned. Try different settings.')
        } else {
          setQuestions(qs)
        }
      })
      .catch(
        () =>
          !cancelled && setError("Couldn't fetch questions. Please try again.")
      )
    return () => {
      cancelled = true
    }
  }, [amount, category, difficulty, type])

  const current = questions?.[index]
  const total = questions?.length ?? amount
  const progress = ((index + (selected ? 1 : 0)) / total) * 100

  const decodedOptions = useMemo(
    () => current?.options.map(decodeHtml) ?? [],
    [current]
  )
  const decodedAnswer = current ? decodeHtml(current.correctAnswer) : ''

  const handleSelect = (opt: string) => {
    if (selected || !current) return
    setSelected(opt)
    const correct = opt === decodedAnswer
    const points = correct ? POINTS[current.difficulty] : 0
    if (correct) setScore((s) => s + points)
    setHistory((h) => [
      ...h,
      {
        question: decodeHtml(current.question),
        category: decodeHtml(current.category),
        difficulty: current.difficulty,
        correct,
        selected: opt,
        answer: decodedAnswer,
        points,
      },
    ])
  }

  const handleNext = () => {
    if (!questions) return
    if (index + 1 >= questions.length) {
      // Persist results for stats and pass to results page via state
      const finalHistory = history
      const stats = JSON.parse(localStorage.getItem('triviaup_stats') || '[]')
      stats.push({
        date: Date.now(),
        score,
        total: questions.length,
        difficulty,
        type,
        history: finalHistory,
      })
      localStorage.setItem('triviaup_stats', JSON.stringify(stats))

      navigate('/results', {
        state: {
          score,
          total: questions.length,
          difficulty,
          history: finalHistory,
        },
      })
      return
    }
    setIndex((i) => i + 1)
    setSelected(null)
  }

  if (error) {
    return (
      <Layout>
        <div className="container max-w-xl py-20 text-center">
          <h2 className="font-display text-2xl font-semibold">
            Something went wrong
          </h2>
          <p className="mt-2 text-muted-foreground">{error}</p>
          <Button
            className="mt-6 rounded-full"
            onClick={() => navigate('/setup')}
          >
            Back to setup
          </Button>
        </div>
      </Layout>
    )
  }

  if (!questions || !current) {
    return (
      <Layout>
        <div className="container flex flex-1 flex-col items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="mt-4 text-sm text-muted-foreground">
            Loading your questions…
          </p>
        </div>
      </Layout>
    )
  }

  const isCorrect = selected !== null && selected === decodedAnswer

  return (
    <Layout>
      <div className="container flex max-w-2xl flex-1 flex-col py-8 md:py-12">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            Question{' '}
            <span className="font-semibold tabular-nums text-foreground">
              {index + 1}
            </span>{' '}
            / {total}
          </div>
          <div className="text-sm">
            Score{' '}
            <span className="font-display font-semibold tabular-nums">
              {score}
            </span>
          </div>
        </div>
        <Progress value={progress} className="h-1.5" />

        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            className="mt-8"
          >
            <Card className="border-border/70 p-6 md:p-8">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="rounded-full">
                  {decodeHtml(current.category)}
                </Badge>
                <Badge variant="outline" className="rounded-full capitalize">
                  {current.difficulty}
                </Badge>
                <Badge variant="outline" className="rounded-full">
                  +{POINTS[current.difficulty]} pt
                </Badge>
              </div>
              <h2 className="mt-5 font-display text-2xl font-semibold leading-snug md:text-3xl">
                {decodeHtml(current.question)}
              </h2>

              <div
                className={cn(
                  'mt-6 grid gap-3',
                  current.type === 'boolean' ? 'grid-cols-2' : 'grid-cols-1'
                )}
              >
                {decodedOptions.map((opt) => {
                  const isSelected = selected === opt
                  const isAnswer = opt === decodedAnswer
                  const showCorrect = selected !== null && isAnswer
                  const showWrong = isSelected && !isAnswer
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleSelect(opt)}
                      disabled={selected !== null}
                      className={cn(
                        'group relative rounded-xl border p-4 text-left transition-all',
                        'disabled:cursor-default',
                        selected === null &&
                          'hover:border-foreground/50 hover:bg-secondary/60',
                        showCorrect &&
                          'border-success bg-success/10 text-foreground',
                        showWrong &&
                          'border-destructive bg-destructive/10 text-foreground',
                        !showCorrect &&
                          !showWrong &&
                          selected !== null &&
                          'opacity-50'
                      )}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-medium">{opt}</span>
                        {showCorrect && (
                          <Check className="h-5 w-5 shrink-0 text-success" />
                        )}
                        {showWrong && (
                          <X className="h-5 w-5 shrink-0 text-destructive" />
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>

              <AnimatePresence>
                {selected !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center"
                  >
                    <div
                      className={cn(
                        'text-sm font-medium',
                        isCorrect ? 'text-success' : 'text-destructive'
                      )}
                    >
                      {isCorrect
                        ? `Correct! +${POINTS[current.difficulty]} point${POINTS[current.difficulty] > 1 ? 's' : ''}`
                        : `Correct Answer: ${decodedAnswer}`}
                    </div>
                    <Button
                      onClick={handleNext}
                      className="rounded-full"
                      size="lg"
                    >
                      {index + 1 >= questions.length
                        ? 'See results'
                        : 'Next question'}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </Layout>
  )
}

export default Play
