import { NextResponse } from "next/server";
import { fetchTournamentsByUser } from "@/lib/matchplay";
import { logger } from "@/lib/logger-server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;

  logger.info("API request: GET /api/tournaments/[userId]", {
    userId,
    endpoint: "/api/tournaments/[userId]",
  });

  try {
    const data = await fetchTournamentsByUser(userId);

    logger.info("API response: GET /api/tournaments/[userId]", {
      userId,
      tournamentCount: data.data?.length || 0,
      statusCode: 200,
    });

    return NextResponse.json(data);
  } catch (error) {
    logger.error(
      "API error: GET /api/tournaments/[userId]",
      error instanceof Error ? error : undefined,
      {
        userId,
        statusCode: 500,
      }
    );

    return NextResponse.json(
      { error: "Failed to fetch tournaments" },
      { status: 500 }
    );
  }
}
