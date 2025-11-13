"use client";

import { useEffect } from "react";
import { logger } from "@/lib/logger-client";

interface TournamentAnalyticsProps {
  tournamentId: string;
  tournamentName: string;
  playerCount: number;
  standingsCount: number;
}

export function TournamentAnalytics({
  tournamentId,
  tournamentName,
  playerCount,
  standingsCount,
}: TournamentAnalyticsProps) {
  useEffect(() => {
    logger.pageView(`/tournament/${tournamentId}`, {
      tournamentId,
      tournamentName,
      playerCount,
      standingsCount,
    });

    logger.info("Tournament page loaded", {
      tournamentId,
      tournamentName,
      playerCount,
      standingsCount,
      loadTime: performance.now(),
    });
  }, [tournamentId, tournamentName, playerCount, standingsCount]);

  return null;
}
