// https://opentdb.com/api.php?amount=10

import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const amountParam = searchParams.get("amount");
  const amount = Number(amountParam);

  if (!amountParam || isNaN(amount) || amount <= 0){
    return new NextResponse("Invalid request, No amount in search params was provided",{status:400})
  }

  const res = await fetch(`https://opentdb.com/api.php?amount=${amount}`);

  const data = await res.json();

  return NextResponse.json(
    {
      amount,
      data,
    },
    { status: 200 }
  );
}