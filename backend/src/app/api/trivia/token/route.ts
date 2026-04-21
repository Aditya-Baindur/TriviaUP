

// https://opentdb.com/api_token.php?command=request

import { NextResponse } from "next/server"

export async function GET(req:Request) {

    const res = await fetch(`https://opentdb.com/api_token.php?command=request`)

    const data = await res.json()
    const token = data.token

    return NextResponse.json({data, token}, {status:200})
    
}