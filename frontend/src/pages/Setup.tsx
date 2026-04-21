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
import { sleep } from "@/lib/sleep";

const difficulties = [
  { value: "any", label: "Mixed", desc: "All difficulties" },
  { value: "easy", label: "Easy", desc: "Warm up" },
  { value: "medium", label: "Medium", desc: "Get serious" },
  { value: "hard", label: "Hard", desc: "Brain mode" },
];

const types = [
  { value: "multiple", label: "Multiple choice" },
  { value: "boolean", label: "True / false" },
];

export default function Setup() {
  const navigate = useNavigate();

  const [difficulty, setDifficulty] = useState<Difficulty>("any");
  const [type, setType] = useState<QuestionType>("any");
  const [amount, setAmount] = useState(10);

  const start = async (custom?: {
    difficulty?: Difficulty;
    type?: QuestionType;
    amount?: number;
  }) => {
    const finalDifficulty = custom?.difficulty ?? difficulty;
    const finalType = custom?.type ?? type;
    const finalAmount = custom?.amount ?? amount;

    const params = new URLSearchParams({
      amount: String(finalAmount),
    });

    if (finalType !== "any") {
      params.set("type", finalType);
    }

    if (finalDifficulty !== "any") {
      params.set("difficulty", finalDifficulty);
    } 

    // console.error(params) 
    // await sleep(10000)
    
    navigate(`/play?${params.toString()}`);
  };

  const randomize = () => {
    const realDifficulties: Difficulty[] = ["easy", "medium", "hard"];

    const randDifficulty =
      Math.random() < 0.5
        ? "any"
        : realDifficulties[Math.floor(Math.random() * 3)];

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
      <div className="container max-w-2xl py-12">
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold"
        >
          Set up your game
        </motion.h1>

        <Card className="mt-8 p-6 space-y-8">
          {/* Difficulty */}
          <div>
            <Label>Difficulty</Label>
            <div className="grid grid-cols-4 gap-3 mt-3">
              {difficulties.map((d) => (
                <button
                  key={d.value}
                  onClick={() => setDifficulty(d.value as Difficulty)}
                  className={cn(
                    "border rounded-xl p-4",
                    difficulty === d.value
                      ? "bg-secondary border-foreground"
                      : "bg-card"
                  )}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Type */}
          <div>
            <Label>Question Type</Label>

            <button
              onClick={() => setType("any")}
              className={cn(
                "w-full mt-3 border rounded-xl p-3",
                type === "any" && "bg-secondary border-foreground"
              )}
            >
              Mixed Questions
            </button>

            <div className="grid grid-cols-2 gap-3 mt-3">
              {types.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setType(t.value as QuestionType)}
                  className={cn(
                    "border rounded-xl p-3",
                    type === t.value && "bg-secondary border-foreground"
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Amount */}
          <div>
            <Label>Questions: {amount}</Label>
            <Slider
              value={[amount]}
              onValueChange={(v) => setAmount(v[0])}
              min={5}
              max={30}
            />
          </div>

          {/* Buttons */}
          <Button onClick={() => start()} className="w-full h-12">
            Start Game<ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          <Button
            onClick={randomize}
            variant="secondary"
            className="w-full h-12"
          >
            <Shuffle className="mr-2 h-4 w-4" />
            I'm Feeling Lucky
          </Button>
        </Card>
      </div>
    </Layout>
  );
}