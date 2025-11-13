import { NextResponse } from "next/server";
import { fetchTournamentData } from "@/lib/matchplay";
import { logger } from "@/lib/logger-server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ tournamentId: string }> }
) {
  const { tournamentId } = await params;

  logger.info("API request: GET /api/tournament/[tournamentId]", {
    tournamentId,
    endpoint: "/api/tournament/[tournamentId]",
  });

  try {
    const data = await fetchTournamentData(tournamentId);

    logger.info("API response: GET /api/tournament/[tournamentId]", {
      tournamentId,
      tournamentName: data.tournament?.name,
      playerCount: data.tournament?.players?.length || 0,
      statusCode: 200,
    });

    return NextResponse.json(data);
  } catch (error) {
    logger.error(
      "API error: GET /api/tournament/[tournamentId]",
      error instanceof Error ? error : undefined,
      {
        tournamentId,
        statusCode: 500,
      }
    );

    return NextResponse.json(
      { error: "Failed to fetch tournament data" },
      { status: 500 }
    );
  }
}
