// Shared Matchplay API functions that can be used by both API routes and server components

import { logger } from "./logger-server";

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

export interface User {
  userId: number;
  name: string;
  ifpaId?: number;
  role?: string;
  flag?: string;
  location?: string;
  pronouns?: string;
  initials?: string;
  avatar?: string;
  banner?: string;
  tournamentAvatar?: string | null;
  createdAt?: string;
}

export interface UserProfile {
  user: User;
  rating?: {
    ratingId: number;
    userId: number;
    ifpaId?: number;
    name: string;
    rating: number;
    rd: number;
    calculatedRd: number;
    lowerBound: number;
    lastRatingPeriod: string;
    rank: number;
  };
  ifpa?: {
    ifpaId: number;
    name: string;
    rank: number | null;
    rating: number;
    ratingRank: number;
    womensRank: number | null;
    totalEvents: number;
    initials: string;
    city: string;
    state: string;
    countryCode: string;
    countryName: string;
    updatedAt: string;
  };
  shortcut?: string | null;
  plan?: string | null;
  userCounts?: {
    tournamentOrganizedCount: number;
    seriesOrganizedCount: number;
    tournamentPlayCount: number;
    ratingPeriodCount: number;
  };
}

function getApiKey(): string {
  const apiKey = process.env.MATCHPLAY_API_KEY;
  if (!apiKey) {
    throw new Error("MATCHPLAY_API_KEY is not configured");
  }
  return apiKey;
}

export async function fetchUserProfile(
  userId: string
): Promise<UserProfile | null> {
  logger.info("Fetching user profile", { userId });

  const apiKey = getApiKey();

  const response = await fetch(
    `https://app.matchplay.events/api/users/${userId}`,
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
    logger.error("Failed to fetch user profile", undefined, {
      userId,
      statusCode: response.status,
      statusText: response.statusText,
    });
    return null;
  }

  const profile = await response.json();
  logger.info("Successfully fetched user profile", {
    userId,
    userName: profile.user?.name,
    ifpaId: profile.user?.ifpaId,
  });

  return profile;
}

export async function fetchTournamentsByUser(
  userId: string
): Promise<TournamentsResponse> {
  logger.info("Fetching tournaments for user", { userId });

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
    logger.error("Failed to fetch tournaments", undefined, {
      userId,
      statusCode: response.status,
      statusText: response.statusText,
    });
    throw new Error(`Matchplay API error: ${response.status}`);
  }

  const data = await response.json();
  logger.info("Successfully fetched tournaments", {
    userId,
    tournamentCount: data.data?.length || 0,
    totalPages: data.meta?.last_page,
  });

  return data;
}

export async function fetchTournamentData(
  tournamentId: string
): Promise<TournamentData> {
  logger.info("Fetching tournament data", { tournamentId });

  const apiKey = getApiKey();

  // Fetch tournament details with players
  logger.debug("Fetching tournament details", { tournamentId });
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
    logger.error("Failed to fetch tournament details", undefined, {
      tournamentId,
      statusCode: tournamentResponse.status,
      statusText: tournamentResponse.statusText,
    });
    throw new Error(`Matchplay API error: ${tournamentResponse.status}`);
  }

  // Fetch standings
  logger.debug("Fetching tournament standings", { tournamentId });
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
    logger.error("Failed to fetch tournament standings", undefined, {
      tournamentId,
      statusCode: standingsResponse.status,
      statusText: standingsResponse.statusText,
    });
    throw new Error(`Matchplay API error: ${standingsResponse.status}`);
  }

  const tournamentData = await tournamentResponse.json();
  const standingsData = await standingsResponse.json();

  logger.info("Successfully fetched tournament data", {
    tournamentId,
    tournamentName: tournamentData.data?.name,
    playerCount: tournamentData.data?.players?.length || 0,
    standingsCount: standingsData?.length || 0,
  });

  return {
    tournament: tournamentData.data,
    standings: standingsData,
  };
}
