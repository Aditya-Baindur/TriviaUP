import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import { Layout } from '@/components/Layout'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import type { Difficulty } from '@/lib/api'

interface StoredGame {
  date: number
  score: number
  total: number
  difficulty: Difficulty
  type: string
  history: { category: string; difficulty: Difficulty; correct: boolean }[]
}

function loadStats(): StoredGame[] {
  try {
    return JSON.parse(localStorage.getItem('triviaup_stats') || '[]')
  } catch {
    return []
  }
}

const Stats = () => {
  const games = useMemo(loadStats, [])

  const totalQs = games.reduce((s, g) => s + g.total, 0)
  const totalCorrect = games.reduce(
    (s, g) => s + g.history.filter((h) => h.correct).length,
    0
  )
  const totalScore = games.reduce((s, g) => s + g.score, 0)

  const byDifficulty: Record<Difficulty, { correct: number; total: number }> = {
    easy: { correct: 0, total: 0 },
    medium: { correct: 0, total: 0 },
    hard: { correct: 0, total: 0 },
  }
  const byCategory: Record<string, { correct: number; total: number }> = {}

  for (const g of games) {
    for (const h of g.history) {
      byDifficulty[h.difficulty].total += 1
      if (h.correct) byDifficulty[h.difficulty].correct += 1
      if (!byCategory[h.category])
        byCategory[h.category] = { correct: 0, total: 0 }
      byCategory[h.category].total += 1
      if (h.correct) byCategory[h.category].correct += 1
    }
  }

  const sortedCategories = Object.entries(byCategory)
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 8)

  const clear = () => {
    localStorage.removeItem('triviaup_stats')
    window.location.reload()
  }

  if (!games.length) {
    return (
      <Layout>
        <div className="container max-w-xl py-20 text-center">
          <h1 className="font-display text-3xl font-bold">No stats yet</h1>
          <p className="mt-3 text-muted-foreground">
            Play a round and your performance will show up here.
          </p>
          <Button asChild className="mt-6 rounded-full">
            <Link to="/setup">Start a game</Link>
          </Button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="container max-w-3xl py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl font-bold">Your stats</h1>
            <p className="mt-1 text-muted-foreground">
              Across {games.length} game{games.length !== 1 ? 's' : ''}.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={clear}
          >
            <Trash2 className="mr-2 h-4 w-4" /> Clear history
          </Button>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-3">
          <Stat label="Total score" value={totalScore} />
          <Stat label="Questions" value={totalQs} />
          <Stat
            label="Accuracy"
            value={`${totalQs ? Math.round((totalCorrect / totalQs) * 100) : 0}%`}
          />
        </div>

        <Section title="By difficulty">
          <div className="space-y-4">
            {(Object.keys(byDifficulty) as Difficulty[]).map((d) => {
              const { correct, total } = byDifficulty[d]
              const pct = total ? Math.round((correct / total) * 100) : 0
              return (
                <div key={d}>
                  <div className="mb-1.5 flex justify-between text-sm">
                    <span className="font-medium capitalize">{d}</span>
                    <span className="tabular-nums text-muted-foreground">
                      {correct}/{total} · {pct}%
                    </span>
                  </div>
                  <Progress value={pct} className="h-2" />
                </div>
              )
            })}
          </div>
        </Section>

        <Section title="By category">
          <div className="space-y-4">
            {sortedCategories.map(([cat, { correct, total }]) => {
              const pct = total ? Math.round((correct / total) * 100) : 0
              return (
                <div key={cat}>
                  <div className="mb-1.5 flex justify-between gap-3 text-sm">
                    <span className="truncate font-medium">{cat}</span>
                    <span className="shrink-0 tabular-nums text-muted-foreground">
                      {correct}/{total} · {pct}%
                    </span>
                  </div>
                  <Progress value={pct} className="h-2" />
                </div>
              )
            })}
          </div>
        </Section>
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

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="mt-10">
      <h2 className="mb-4 font-display text-xl font-semibold">{title}</h2>
      <Card className="border-border/70 p-6">{children}</Card>
    </div>
  )
}

export default Stats
