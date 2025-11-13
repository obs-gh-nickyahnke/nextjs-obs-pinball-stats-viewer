import Link from "next/link";
import styles from "./page.module.css";
import {
  fetchTournamentsByUser,
  fetchUserProfile,
  type TournamentsResponse,
  type UserProfile,
} from "@/lib/matchplay";

async function getTournaments(userId: string): Promise<TournamentsResponse> {
  try {
    return await fetchTournamentsByUser(userId);
  } catch (error) {
    console.error("Error fetching tournaments:", error);
    return { data: [] };
  }
}

async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    return await fetchUserProfile(userId);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}

export default async function UserPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const [userProfile, tournamentsData] = await Promise.all([
    getUserProfile(userId),
    getTournaments(userId),
  ]);
  console.log("userProfile", userProfile);
  const playerName = userProfile?.user?.name || `User ${userId}`;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/" className={styles.backLink}>
          ← Back
        </Link>
        <h1>{playerName}</h1>
      </div>

      {tournamentsData.data.length === 0 ? (
        <p className={styles.noData}>No tournaments found for this user.</p>
      ) : (
        <div className={styles.tournamentList}>
          {tournamentsData.data.map((tournament) => (
            <Link
              key={tournament.tournamentId}
              href={`/tournament/${tournament.tournamentId}`}
              className={styles.tournamentCard}
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
          ))}
        </div>
      )}

      {tournamentsData.meta && tournamentsData.meta.total > 0 && (
        <div className={styles.meta}>
          <p>
            Showing {tournamentsData.data.length} of{" "}
            {tournamentsData.meta.total} tournaments
          </p>
        </div>
      )}
    </div>
  );
}
