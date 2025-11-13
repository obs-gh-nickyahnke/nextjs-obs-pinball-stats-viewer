"use client";

import Link from "next/link";
import { logger } from "@/lib/logger-client";
import type { Tournament } from "@/lib/matchplay";

interface TournamentCardProps {
  tournament: Tournament;
  styles: Record<string, string>;
}

export function TournamentCard({ tournament, styles }: TournamentCardProps) {
  const handleClick = () => {
    logger.userAction("click_tournament", {
      tournamentId: tournament.tournamentId,
      tournamentName: tournament.name,
      tournamentStatus: tournament.status,
    });
  };

  return (
    <Link
      href={`/tournament/${tournament.tournamentId}`}
      className={styles.tournamentCard}
      onClick={handleClick}
    >
      <h2>{tournament.name}</h2>
      <div className={styles.tournamentDetails}>
        <p>
          <strong>Style:</strong> {tournament.style}
        </p>
        <p>
          <strong>Status:</strong> {tournament.status}
        </p>
        <p>
          <strong>Started:</strong>{" "}
          {new Date(tournament.startUtc).toLocaleDateString()}
        </p>
        {tournament.completedUtc && (
          <p>
            <strong>Completed:</strong>{" "}
            {new Date(tournament.completedUtc).toLocaleDateString()}
          </p>
        )}
      </div>
    </Link>
  );
}
