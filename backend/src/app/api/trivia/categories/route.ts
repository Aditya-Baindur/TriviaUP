import { NextResponse } from "next/server";
import he from "he";

type OpenTriviaCategory = {
  id: number;
  name: string;
};

function cleanCategoryName(name: string) {
  const decoded = he.decode(name).trim();
  const parts = decoded.split(":").map((part) => part.trim()).filter(Boolean);

  if (parts.length <= 1) {
    return {
      name: decoded,
      label: decoded,
      group: null,
    };
  }

  return {
    name: decoded,
    label: parts[parts.length - 1],
    group: parts.slice(0, -1).join(" / "),
  };
}

export async function GET() {
  try {
    const res = await fetch("https://opentdb.com/api_category.php", {
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch categories" },
        { status: 502 }
      );
    }

    const data = (await res.json()) as {
      trivia_categories?: OpenTriviaCategory[];
    };

    const categories = (data.trivia_categories ?? []).map((category) => ({
      id: category.id,
      ...cleanCategoryName(category.name),
    }));

    return NextResponse.json({ categories });
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
