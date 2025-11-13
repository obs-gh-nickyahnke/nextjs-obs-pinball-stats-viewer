import Link from "next/link";
import styles from "./page.module.css";
import {
  fetchTournamentData,
  type Player,
  type TournamentData,
} from "@/lib/matchplay";
import { TournamentAnalytics } from "@/components/tournament-analytics";

async function getTournamentData(
  tournamentId: string
): Promise<TournamentData | null> {
  try {
    return await fetchTournamentData(tournamentId);
  } catch (error) {
    console.error("Error fetching tournament data:", error);
    return null;
  }
}

export default async function TournamentPage({
  params,
}: {
  params: Promise<{ tournamentId: string }>;
}) {
  const { tournamentId } = await params;
  const data = await getTournamentData(tournamentId);

  if (!data) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <Link href="/" className={styles.backLink}>
            ← Back to Home
          </Link>
          <h1>Tournament Not Found</h1>
        </div>
        <p className={styles.noData}>Unable to load tournament data.</p>
      </div>
    );
  }

  const { tournament, standings } = data;

  // Create a map of player IDs to player names
  const playerMap = new Map<number, Player>();
  if (tournament.players) {
    tournament.players.forEach((player) => {
      playerMap.set(player.playerId, player);
    });
  }

  return (
    <div className={styles.container}>
      <TournamentAnalytics
        tournamentId={tournamentId}
        tournamentName={tournament.name}
        playerCount={tournament.players?.length || 0}
        standingsCount={standings.length}
      />

      <div className={styles.header}>
        <Link href="/" className={styles.backLink}>
          ← Back to Home
        </Link>
        <h1>{tournament.name}</h1>
        <div className={styles.tournamentMeta}>
          <span className={styles.badge}>{tournament.type}</span>
          <span className={styles.badge}>{tournament.status}</span>
          <span className={styles.date}>
            Started: {new Date(tournament.startUtc).toLocaleDateString()}
          </span>
          {tournament.completedAt && (
            <span className={styles.date}>
              Completed: {new Date(tournament.completedAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      <div className={styles.standingsSection}>
        <h2>Standings</h2>
        {standings.length === 0 ? (
          <p className={styles.noData}>No standings available yet.</p>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.standingsTable}>
              <thead>
                <tr>
                  <th>Pos</th>
                  <th>Player</th>
                  <th>Points</th>
                  <th>Games</th>
                  {standings[0]?.wins !== undefined && <th>W</th>}
                  {standings[0]?.losses !== undefined && <th>L</th>}
                  {standings[0]?.draws !== undefined && <th>D</th>}
                  {standings[0]?.strikeCount !== undefined && <th>Strikes</th>}
                </tr>
              </thead>
              <tbody>
                {standings.map((standing) => {
                  const player = playerMap.get(standing.playerId);
                  const userId = player?.claimedBy || standing.playerId;
                  return (
                    <tr key={standing.playerId}>
                      <td className={styles.position}>{standing.position}</td>
                      <td className={styles.playerName}>
                        <Link
                          href={`/user/${userId}`}
                          className={styles.playerLink}
                        >
                          {player?.name || `Player ${standing.playerId}`}
                        </Link>
                      </td>
                      <td>{standing.points}</td>
                      <td>{standing.gamesPlayed}</td>
                      {standing.wins !== undefined && <td>{standing.wins}</td>}
                      {standing.losses !== undefined && (
                        <td>{standing.losses}</td>
                      )}
                      {standing.draws !== undefined && (
                        <td>{standing.draws}</td>
                      )}
                      {standing.strikeCount !== undefined && (
                        <td>{standing.strikeCount}</td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
