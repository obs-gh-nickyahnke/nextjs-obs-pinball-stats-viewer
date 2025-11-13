import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tournamentId: string }> }
) {
  const { tournamentId } = await params;
  const apiKey = process.env.MATCHPLAY_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'API key not configured' },
      { status: 500 }
    );
  }

  try {
    // Fetch tournament details with players
    const tournamentResponse = await fetch(
      `https://app.matchplay.events/api/tournaments/${tournamentId}?includePlayers=1`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    );

    if (!tournamentResponse.ok) {
      throw new Error(`Matchplay API error: ${tournamentResponse.status}`);
    }

    // Fetch standings
    const standingsResponse = await fetch(
      `https://app.matchplay.events/api/tournaments/${tournamentId}/standings`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    );

    if (!standingsResponse.ok) {
      throw new Error(`Matchplay API error: ${standingsResponse.status}`);
    }

    const tournamentData = await tournamentResponse.json();
    const standingsData = await standingsResponse.json();

    return NextResponse.json({
      tournament: tournamentData.data,
      standings: standingsData,
    });
  } catch (error) {
    console.error('Error fetching tournament:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tournament data' },
      { status: 500 }
    );
  }
}

