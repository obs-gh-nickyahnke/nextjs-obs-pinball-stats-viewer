import { NextResponse } from "next/server";
import { fetchTournamentData } from "@/lib/matchplay";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ tournamentId: string }> }
) {
  const { tournamentId } = await params;

  try {
    const data = await fetchTournamentData(tournamentId);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching tournament:", error);
    return NextResponse.json(
      { error: "Failed to fetch tournament data" },
      { status: 500 }
    );
  }
}
