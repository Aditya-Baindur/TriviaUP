import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(
      "https://opentdb.com/api_token.php?command=request"
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch token" },
        { status: 502 }
      );
    }

    const data = await res.json();

    if (!data.token) {
      return NextResponse.json(
        { error: "No token returned from API" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      token: data.token,
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