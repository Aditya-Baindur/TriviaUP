import { NextResponse } from "next/server";
import he from "he";

function shuffle(arr: string[]) {
  return [...arr].sort(() => Math.random() - 0.5);
}

type TriviaQuestion = {
  type: "multiple" | "boolean";
  difficulty: "easy" | "medium" | "hard";
  category: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const amount = Number(searchParams.get("amount") ?? "10");
  const token = searchParams.get("token");
  const difficulty = searchParams.get("difficulty");
  const type = searchParams.get("type");
  const category = searchParams.get("category");

  // validation
  if (isNaN(amount) || amount < 1 || amount > 50) {
    return NextResponse.json(
      { error: "amount must be between 1 and 50" },
      { status: 400 }
    );
  }

  const params = new URLSearchParams({
    amount: String(amount),
  });

  // Only exclude the specific param if it is "any"
  if (difficulty && difficulty !== "any") {
    params.append("difficulty", difficulty);
  }

  if (type && type !== "any") {
    params.append("type", type);
  }

  if (category && category !== "any") {
    params.append("category", category);
  }

  if (token) {
    params.append("token", token);
  }

  const url = `https://opentdb.com/api.php?${params.toString()}`;

  try {
    const res = await fetch(url, {
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch trivia API" },
        { status: 502 }
      );
    }

    const data = await res.json();

    if (data.response_code !== 0) {
      return NextResponse.json(
        {
          error: "Trivia API error",
          code: data.response_code,
          needsTokenReset: data.response_code === 4,
        },
        { status: 400 }
      );
    }

    const results = data.results as TriviaQuestion[];

    const questions = results.map((q, i) => {
      const correct = he.decode(q.correct_answer);
      const incorrect = q.incorrect_answers.map((a) => he.decode(a));

      return {
        id: i,
        question: he.decode(q.question),
        correctAnswer: correct,
        options: shuffle([correct, ...incorrect]),
        difficulty: q.difficulty,
        category: q.category,
        type: q.type,
      };
    });

    return NextResponse.json({
      amount: questions.length,
      questions,
    });
  } catch (err) {
    return NextResponse.json(
      {
        error: "Something went wrong",
        details: err instanceof Error ? err.message : "unknown error",
      },
      { status: 500 }
    );
  }
}