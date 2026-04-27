import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");
    const command = token ? "reset" : "request";

    const params = new URLSearchParams({ command });

    if (token) {
      params.set("token", token);
    }

    const res = await fetch(
      `https://opentdb.com/api_token.php?${params.toString()}`
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
      reset: command === "reset",
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
