/**
 * Setup Page
 *
 * Configures game settings before starting a session.
 * Allows user to select difficulty, question type, and number of questions.
 * Builds query params and navigates to "/play".
 *
 * Usage :
 *  - Access via "/setup"
 *  - Select options manually or use randomizer ("I'm Feeling Lucky")
 *  - Starts game by navigating to "/play" with query params
 */

import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Loader2, Search, Shuffle } from 'lucide-react'
import { Layout } from '@/components/Layout'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'
import {
  fetchCategories,
  type Difficulty,
  type QuestionType,
  type TriviaCategory,
} from '@/lib/api'

const difficulties = [
  { value: 'any', label: 'Mixed', desc: 'All difficulties' },
  { value: 'easy', label: 'Easy', desc: 'Warm up' },
  { value: 'medium', label: 'Medium', desc: 'Get serious' },
  { value: 'hard', label: 'Hard', desc: 'Brain mode' },
]

const types = [
  { value: 'any', label: 'Mixed questions', desc: 'The full quiz bowl' },
  { value: 'multiple', label: 'Multiple choice', desc: 'Four options, one answer' },
  { value: 'boolean', label: 'True / false', desc: 'Fast calls, zero fluff' },
]

const steps = [
  {
    eyebrow: 'Step 1',
    title: 'Pick a category',
    description: 'Choose a lane, or keep it wide open and let the app mix it up.',
  },
  {
    eyebrow: 'Step 2',
    title: 'Set the difficulty',
    description: 'Ease in, push harder, or keep the challenge unpredictable.',
  },
  {
    eyebrow: 'Step 3',
    title: 'Choose the format',
    description: 'Go fast with true or false, or play with full multiple choice.',
  },
  {
    eyebrow: 'Step 4',
    title: 'Decide the length',
    description: 'Short sprint or full session. You can still randomize everything.',
  },
]

export default function Setup() {
  const navigate = useNavigate()

  const [step, setStep] = useState(0)
  const [categories, setCategories] = useState<TriviaCategory[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [categoriesError, setCategoriesError] = useState<string | null>(null)
  const [categorySearch, setCategorySearch] = useState('')
  const [category, setCategory] = useState('any')
  const [difficulty, setDifficulty] = useState<Difficulty>('any')
  const [type, setType] = useState<QuestionType>('any')
  const [amount, setAmount] = useState(10)

  useEffect(() => {
    let cancelled = false

    fetchCategories()
      .then((data) => {
        if (cancelled) return
        setCategories(data)
        setCategoriesError(null)
      })
      .catch(() => {
        if (cancelled) return
        setCategoriesError("Couldn't load categories. You can still play with a mixed set.")
      })
      .finally(() => {
        if (!cancelled) {
          setCategoriesLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  const filteredCategories = useMemo(() => {
    const query = categorySearch.trim().toLowerCase()

    if (!query) return categories

    return categories.filter((item) => {
      const haystack = [item.name, item.label, item.group ?? '']
        .join(' ')
        .toLowerCase()

      return haystack.includes(query)
    })
  }, [categories, categorySearch])

  const selectedCategory =
    category === 'any'
      ? null
      : categories.find((item) => String(item.id) === category) ?? null

  const start = (custom?: {
    category?: string
    difficulty?: Difficulty
    type?: QuestionType
    amount?: number
  }) => {
    const finalCategory = custom?.category ?? category
    const finalDifficulty = custom?.difficulty ?? difficulty
    const finalType = custom?.type ?? type
    const finalAmount = custom?.amount ?? amount

    const params = new URLSearchParams({
      amount: String(finalAmount),
    })

    if (finalCategory !== 'any') {
      params.set('category', finalCategory)
    }

    if (finalType !== 'any') {
      params.set('type', finalType)
    }

    if (finalDifficulty !== 'any') {
      params.set('difficulty', finalDifficulty)
    }

    navigate(`/play?${params.toString()}`)
  }

  const randomize = () => {
    const realDifficulties: Difficulty[] = ['easy', 'medium', 'hard']

    const randDifficulty =
      Math.random() < 0.5
        ? 'any'
        : realDifficulties[Math.floor(Math.random() * 3)]

    const randTypeOptions: QuestionType[] = ['any', 'multiple', 'boolean']
    const randType =
      randTypeOptions[Math.floor(Math.random() * randTypeOptions.length)]

    const randAmount = Math.floor(Math.random() * 26) + 5
    const randCategory =
      categories.length > 0 && Math.random() >= 0.45
        ? String(categories[Math.floor(Math.random() * categories.length)].id)
        : 'any'

    start({
      category: randCategory,
      difficulty: randDifficulty,
      type: randType,
      amount: randAmount,
    })
  }

  const nextStep = () =>
    setStep((current) => Math.min(current + 1, steps.length - 1))
  const previousStep = () => setStep((current) => Math.max(current - 1, 0))
  const progress = ((step + 1) / steps.length) * 100

  return (
    <Layout>
      <div className="container max-w-5xl py-12 md:py-16">
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl font-display text-4xl font-bold tracking-tight md:text-5xl"
        >
          Build a round that feels made for you.
        </motion.h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Start with a category, then tune the challenge like a quick
          Typeform flow.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <Card className="overflow-hidden border-border/70">
            <div className="border-b border-border/60 bg-muted/30 px-6 py-5 md:px-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                    {steps[step].eyebrow}
                  </p>
                  <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight">
                    {steps[step].title}
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">
                    {steps[step].description}
                  </p>
                </div>
                <div className="hidden rounded-full border border-border/70 px-4 py-2 text-sm text-muted-foreground md:block">
                  {step + 1} / {steps.length}
                </div>
              </div>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-border/60">
                <motion.div
                  className="h-full rounded-full bg-foreground"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                />
              </div>
            </div>

            <div className="min-h-[460px] px-6 py-6 md:px-8 md:py-8">
              {step === 0 && (
                <div>
                  <Label htmlFor="category-search">Category</Label>
                  <div className="relative mt-3">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      id="category-search"
                      value={categorySearch}
                      onChange={(event) => setCategorySearch(event.target.value)}
                      placeholder="Search categories"
                      className="h-12 w-full rounded-2xl border border-border bg-background pl-11 pr-4 text-sm outline-none transition focus:border-foreground/40"
                    />
                  </div>

                  <div className="mt-5 grid gap-3 md:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setCategory('any')}
                      className={cn(
                        'rounded-3xl border p-5 text-left transition-all',
                        category === 'any'
                          ? 'border-foreground bg-secondary'
                          : 'border-border/70 hover:border-foreground/40 hover:bg-secondary/40'
                      )}
                    >
                      <div className="text-sm text-muted-foreground">Mixed deck</div>
                      <div className="mt-1 font-display text-xl font-semibold">Any category</div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Pull from the full trivia pool.
                      </p>
                    </button>

                    {categoriesLoading && (
                      <div className="col-span-full flex min-h-40 items-center justify-center rounded-3xl border border-dashed border-border/80">
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Loading categories...
                        </div>
                      </div>
                    )}

                    {!categoriesLoading &&
                      filteredCategories.map((item) => {
                        const active = category === String(item.id)

                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setCategory(String(item.id))}
                            className={cn(
                              'rounded-3xl border p-5 text-left transition-all',
                              active
                                ? 'border-foreground bg-secondary'
                                : 'border-border/70 hover:border-foreground/40 hover:bg-secondary/40'
                            )}
                          >
                            <div className="text-sm text-muted-foreground">
                              {item.group ?? 'Open Trivia DB'}
                            </div>
                            <div className="mt-1 font-display text-xl font-semibold">
                              {item.label}
                            </div>
                            <p className="mt-2 text-sm text-muted-foreground">
                              {item.group
                                ? item.name
                                : 'Focused questions from this category.'}
                            </p>
                          </button>
                        )
                      })}
                  </div>

                  {!categoriesLoading && filteredCategories.length === 0 && (
                    <div className="mt-4 rounded-2xl border border-dashed border-border/80 p-5 text-sm text-muted-foreground">
                      No categories match that search. Try a broader keyword.
                    </div>
                  )}

                  {categoriesError && (
                    <div className="mt-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-900 dark:text-amber-200">
                      {categoriesError}
                    </div>
                  )}
                </div>
              )}

              {step === 1 && (
                <div className="grid gap-3 md:grid-cols-2">
                  {difficulties.map((d) => (
                    <button
                      key={d.value}
                      type="button"
                      onClick={() => setDifficulty(d.value as Difficulty)}
                      className={cn(
                        'rounded-3xl border p-5 text-left transition-all',
                        difficulty === d.value
                          ? 'border-foreground bg-secondary'
                          : 'border-border/70 hover:border-foreground/40 hover:bg-secondary/40'
                      )}
                    >
                      <div className="font-display text-2xl font-semibold">{d.label}</div>
                      <p className="mt-2 text-sm text-muted-foreground">{d.desc}</p>
                    </button>
                  ))}
                </div>
              )}

              {step === 2 && (
                <div className="grid gap-3 md:grid-cols-2">
                  {types.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setType(t.value as QuestionType)}
                      className={cn(
                        'rounded-3xl border p-5 text-left transition-all',
                        type === t.value
                          ? 'border-foreground bg-secondary'
                          : 'border-border/70 hover:border-foreground/40 hover:bg-secondary/40',
                        t.value === 'any' && 'md:col-span-2'
                      )}
                    >
                      <div className="font-display text-2xl font-semibold">
                        {t.label}
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {t.desc}
                      </p>
                    </button>
                  ))}
                </div>
              )}

              {step === 3 && (
                <div className="space-y-8">
                  <div>
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <Label>Questions</Label>
                        <p className="mt-2 text-sm text-muted-foreground">
                          More questions means a longer run and more chances to score.
                        </p>
                      </div>
                      <div className="rounded-2xl border border-border/70 px-4 py-3 text-right">
                        <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                          Length
                        </div>
                        <div className="font-display text-3xl font-semibold tabular-nums">
                          {amount}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 rounded-3xl border border-border/70 p-5">
                      <Slider
                        value={[amount]}
                        onValueChange={(value) => setAmount(value[0])}
                        min={5}
                        max={30}
                      />

                      <div className="mt-4 flex justify-between text-xs uppercase tracking-wide text-muted-foreground">
                        <span>Quick 5</span>
                        <span>Deep 30</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-border/70 bg-muted/30 p-5">
                    <div className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                      Ready to launch
                    </div>
                    <div className="mt-3 grid gap-3 md:grid-cols-3">
                      <SummaryChip
                        label="Category"
                        value={selectedCategory?.label ?? 'Any'}
                        hint={selectedCategory?.group ?? 'Mixed deck'}
                      />
                      <SummaryChip
                        label="Difficulty"
                        value={difficulty}
                        hint="Scoring follows difficulty"
                      />
                      <SummaryChip
                        label="Format"
                        value={type === 'any' ? 'mixed' : type}
                        hint={`${amount} total questions`}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 border-t border-border/60 px-6 py-5 sm:flex-row sm:items-center sm:justify-between md:px-8">
              <Button
                type="button"
                variant="ghost"
                className="justify-center rounded-full sm:justify-start"
                onClick={previousStep}
                disabled={step === 0}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  type="button"
                  onClick={randomize}
                  variant="secondary"
                  className="rounded-full"
                >
                  <Shuffle className="mr-2 h-4 w-4" />
                  I'm Feeling Lucky
                </Button>

                {step < steps.length - 1 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="rounded-full"
                  >
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={() => start()}
                    className="rounded-full"
                  >
                    Start Game
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </Card>

          <Card className="h-fit border-border/70 p-6">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Your setup
            </div>
            <div className="mt-4 space-y-4">
              <SummaryBlock
                label="Category"
                value={selectedCategory?.label ?? 'Any category'}
                detail={
                  selectedCategory?.group ??
                  'Surprise me across the full database'
                }
              />
              <SummaryBlock
                label="Difficulty"
                value={difficulty}
                detail="Easy is 1 point, medium is 2, hard is 3."
              />
              <SummaryBlock
                label="Question type"
                value={type === 'any' ? 'Mixed questions' : type}
                detail="Mix formats or lock the round into one style."
              />
              <SummaryBlock
                label="Length"
                value={`${amount} questions`}
                detail={
                  amount <= 10
                    ? 'Fast session'
                    : amount <= 20
                      ? 'Balanced round'
                      : 'Long-form challenge'
                }
              />
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  )
}

function SummaryBlock({
  label,
  value,
  detail,
}: {
  label: string
  value: string
  detail: string
}) {
  return (
    <div className="rounded-3xl border border-border/70 p-4">
      <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-2 font-display text-xl font-semibold capitalize">
        {value}
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{detail}</p>
    </div>
  )
}

function SummaryChip({
  label,
  value,
  hint,
}: {
  label: string
  value: string
  hint: string
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-background p-4">
      <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-2 font-display text-lg font-semibold capitalize">
        {value}
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </div>
  )
}
