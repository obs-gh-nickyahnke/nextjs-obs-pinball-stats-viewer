import { NextResponse } from "next/server";
import { fetchTournamentsByUser } from "@/lib/matchplay";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;

  try {
    const data = await fetchTournamentsByUser(userId);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching tournaments:", error);
    return NextResponse.json(
      { error: "Failed to fetch tournaments" },
      { status: 500 }
    );
  }
}
