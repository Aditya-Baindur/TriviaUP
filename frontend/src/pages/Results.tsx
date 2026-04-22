/**
 * Results Page
 *
 * Displays final game results and performance summary.
 * Shows score, accuracy, and detailed question review.
 * Redirects to "/" if accessed without valid game state.
 *
 * Usage :
 *  - Accessed after completing a game via "/results"
 *  - Requires navigation state (score, total, history, difficulty)
 *  - Provides actions to replay or view stats
 *
 * @note
 *  - Calculates accuracy and win condition (>= 70%)
 *  - Displays per-question breakdown (correct vs selected answers)
 */

import { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Trophy, RotateCcw, BarChart3, Check, X } from 'lucide-react'
import { Layout } from '@/components/Layout'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Difficulty } from '@/lib/api'

interface AnswerRecord {
  question: string
  category: string
  difficulty: Difficulty
  correct: boolean
  selected: string
  answer: string
  points: number
}

interface ResultState {
  score: number
  total: number
  difficulty: Difficulty
  history: AnswerRecord[]
}

const Results = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state as ResultState | null

  useEffect(() => {
    if (!state) navigate('/', { replace: true })
  }, [state, navigate])

  if (!state) return null

  const correctCount = state.history.filter((h) => h.correct).length
  const accuracy = Math.round((correctCount / state.total) * 100)
  const won = accuracy >= 70

  return (
    <Layout>
      <div className="container max-w-2xl py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <div
            className={cn(
              'mx-auto flex h-16 w-16 items-center justify-center rounded-full',
              won
                ? 'bg-accent text-accent-foreground'
                : 'bg-secondary text-foreground'
            )}
          >
            <Trophy className="h-8 w-8" />
          </div>
          <h1 className="mt-6 font-display text-4xl font-bold tracking-tight md:text-5xl">
            {won ? 'You leveled up!' : 'Nice run.'}
          </h1>
          <p className="mt-3 text-muted-foreground">
            {won
              ? `You scored ${state.score} points with ${accuracy}% accuracy.`
              : `You scored ${state.score} points. Try again to beat your best.`}
          </p>
        </motion.div>

        <div className="mt-10 grid grid-cols-3 gap-3">
          <Stat label="Score" value={state.score} />
          <Stat label="Correct" value={`${correctCount}/${state.total}`} />
          <Stat label="Accuracy" value={`${accuracy}%`} />
        </div>

        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild size="lg" className="rounded-full">
            <Link to="/setup">
              <RotateCcw className="mr-2 h-4 w-4" /> Play again
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full">
            <Link to="/stats">
              <BarChart3 className="mr-2 h-4 w-4" /> View stats
            </Link>
          </Button>
        </div>

        <div className="mt-12">
          <h2 className="mb-4 font-display text-xl font-semibold">
            Question review
          </h2>
          <div className="space-y-3">
            {state.history.map((h, i) => (
              <Card key={i} className="border-border/70 p-4">
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      'mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full',
                      h.correct
                        ? 'bg-success/15 text-success'
                        : 'bg-destructive/15 text-destructive'
                    )}
                  >
                    {h.correct ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <X className="h-4 w-4" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1.5 flex flex-wrap gap-2">
                      <Badge
                        variant="secondary"
                        className="rounded-full text-xs"
                      >
                        {h.category}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="rounded-full text-xs capitalize"
                      >
                        {h.difficulty}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium">{h.question}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Your answer:{' '}
                      <span className="text-foreground">{h.selected}</span>
                      {!h.correct && (
                        <>
                          {' '}
                          · Correct:{' '}
                          <span className="text-foreground">{h.answer}</span>
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <Card className="border-border/70 p-4 text-center">
      <div className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 font-display text-2xl font-bold tabular-nums">
        {value}
      </div>
    </Card>
  )
}

export default Results
