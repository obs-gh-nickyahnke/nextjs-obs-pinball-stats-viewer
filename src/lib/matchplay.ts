// Shared Matchplay API functions that can be used by both API routes and server components

export interface Tournament {
  tournamentId: number;
  name: string;
  status: string;
  type?: string;
  style?: string;
  startUtc: string;
  completedAt?: string;
  completedUtc?: string;
  players?: Player[];
}

export interface Player {
  playerId: number;
  name: string;
  ifpaId?: number;
  claimedBy?: number;
}

export interface Standing {
  playerId: number;
  position: number;
  points: string;
  gamesPlayed: number;
  wins?: number;
  losses?: number;
  draws?: number;
  strikeCount?: number;
}

export interface TournamentsResponse {
  data: Tournament[];
  meta?: {
    current_page: number;
    last_page: number;
    total: number;
  };
}

export interface TournamentData {
  tournament: Tournament;
  standings: Standing[];
}

function getApiKey(): string {
  const apiKey = process.env.MATCHPLAY_API_KEY;
  if (!apiKey) {
    throw new Error("MATCHPLAY_API_KEY is not configured");
  }
  return apiKey;
}

export async function fetchTournamentsByUser(
  userId: string
): Promise<TournamentsResponse> {
  const apiKey = getApiKey();

  const response = await fetch(
    `https://app.matchplay.events/api/tournaments?played=${userId}&status=completed`,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(`Matchplay API error: ${response.status}`);
  }

  return await response.json();
}

export async function fetchTournamentData(
  tournamentId: string
): Promise<TournamentData> {
  const apiKey = getApiKey();

  // Fetch tournament details with players
  const tournamentResponse = await fetch(
    `https://app.matchplay.events/api/tournaments/${tournamentId}?includePlayers=1`,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      cache: "no-store",
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
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      cache: "no-store",
    }
  );

  if (!standingsResponse.ok) {
    throw new Error(`Matchplay API error: ${standingsResponse.status}`);
  }

  const tournamentData = await tournamentResponse.json();
  const standingsData = await standingsResponse.json();

  return {
    tournament: tournamentData.data,
    standings: standingsData,
  };
}
