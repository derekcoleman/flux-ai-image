import { NextResponse } from "next/server";

import cors from "edge-cors";
import { getTweet } from "react-tweet/api";

type RouteSegment = { params: { id: string } };

export async function GET(req: Request, { params }: RouteSegment) {
  try {
    const tweet = await getTweet(params.id);
    return cors(
      req,
      NextResponse.json({ data: tweet ?? null }, { status: tweet ? 200 : 404 }),
    );
  } catch (error: any) {
    return cors(
      req,
      NextResponse.json(
        { error: error.message ?? "Bad request." },
        { status: 400 },
      ),
    );
  }
}
