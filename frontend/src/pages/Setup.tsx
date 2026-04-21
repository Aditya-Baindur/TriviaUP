import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Shuffle } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import type { Difficulty, QuestionType } from "@/lib/api";

const difficulties: {
  value: Difficulty;
  label: string;
  desc: string;
  points: number;
}[] = [
  { value: "any", label: "Mixed", desc: "All difficulties", points: 0 },
  { value: "easy", label: "Easy", desc: "Warm up", points: 1 },
  { value: "medium", label: "Medium", desc: "Get serious", points: 2 },
  { value: "hard", label: "Hard", desc: "Brain mode", points: 3 },
];

const types: { value: QuestionType; label: string }[] = [
  { value: "multiple", label: "Multiple choice" },
  { value: "boolean", label: "True / false" },
];

const Setup = () => {
  const navigate = useNavigate();

  const [difficulty, setDifficulty] = useState<Difficulty>("any");
  const [type, setType] = useState<QuestionType>("any");
  const [amount, setAmount] = useState(10);

  const start = (custom?: {
    difficulty?: Difficulty;
    type?: QuestionType;
    amount?: number;
  }) => {
    const finalDifficulty = custom?.difficulty ?? difficulty;
    const finalType = custom?.type ?? type;
    const finalAmount = custom?.amount ?? amount;

    const params = new URLSearchParams({
      type: finalType,
      amount: String(finalAmount),
    });

    // 🚀 Only include difficulty if NOT mixed
    if (finalDifficulty !== "any") {
      params.set("difficulty", finalDifficulty);
    }

    // 🚀 FLAG for frontend/game logic
    if (finalDifficulty === "any") {
      params.set("mixedDifficulty", "true");
    }

    navigate(`/play?${params.toString()}`);
  };

  // 🎲 RANDOMIZER
  const randomize = () => {
    const realDifficulties: Exclude<Difficulty, "any">[] = [
      "easy",
      "medium",
      "hard",
    ];

    const randDifficulty =
      Math.random() < 0.5
        ? "any" // 50% chance mixed
        : realDifficulties[
            Math.floor(Math.random() * realDifficulties.length)
          ];

    const randTypeOptions: QuestionType[] = ["any", "multiple", "boolean"];
    const randType =
      randTypeOptions[Math.floor(Math.random() * randTypeOptions.length)];

    const randAmount = Math.floor(Math.random() * 26) + 5;

    start({
      difficulty: randDifficulty,
      type: randType,
      amount: randAmount,
    });
  };

  return (
    <Layout>
      <div className="container max-w-2xl py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
            Set up your game
          </h1>
          <p className="mt-3 text-muted-foreground">
            Pick a difficulty, format, and length. Hit start when you're ready.
          </p>
        </motion.div>

        <Card className="mt-8 p-6 md:p-8 space-y-8 border-border/70">
          {/* Difficulty */}
          <div>
            <Label className="text-sm font-medium">Difficulty</Label>
            <div className="mt-3 grid grid-cols-4 gap-3">
              {difficulties.map((d) => (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => setDifficulty(d.value)}
                  className={cn(
                    "rounded-xl border p-4 text-left transition-all",
                    "hover:border-foreground/40",
                    difficulty === d.value
                      ? "border-foreground bg-secondary shadow-soft"
                      : "border-border bg-card"
                  )}
                >
                  <div className="font-display font-semibold">{d.label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {d.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Question Type */}
          <div>
            <Label className="text-sm font-medium">Question type</Label>

            <div className="mt-3">
              <button
                type="button"
                onClick={() => setType("any")}
                className={cn(
                  "w-full rounded-xl border px-4 py-3 text-sm font-semibold transition-all",
                  "hover:border-foreground/40",
                  type === "any"
                    ? "border-foreground bg-secondary"
                    : "border-border bg-card"
                )}
              >
                🎲 Mixed Questions
              </button>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3">
              {types.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setType(t.value)}
                  className={cn(
                    "rounded-xl border px-4 py-3 text-sm font-medium transition-all",
                    "hover:border-foreground/40",
                    type === t.value
                      ? "border-foreground bg-secondary"
                      : "border-border bg-card"
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Amount */}
          <div>
            <div className="flex items-baseline justify-between">
              <Label className="text-sm font-medium">
                Number of questions
              </Label>
              <span className="font-display text-2xl font-semibold tabular-nums">
                {amount}
              </span>
            </div>

            <Slider
              value={[amount]}
              onValueChange={(v) => setAmount(v[0])}
              min={5}
              max={30}
              step={1}
              className="mt-4"
            />

            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>5</span>
              <span>30</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3">
            <Button
              onClick={() => start()}
              size="lg"
              className="w-full h-12 rounded-full text-base"
            >
              Start game <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <Button
              onClick={randomize}
              variant="secondary"
              size="lg"
              className="w-full h-12 rounded-full text-base"
            >
              <Shuffle className="mr-2 h-4 w-4" />
              I'm Feeling Lucky
            </Button>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default Setup;