import Link from 'next/link';
import styles from './page.module.css';

interface Tournament {
  tournamentId: number;
  name: string;
  status: string;
  startUtc: string;
  completedUtc?: string;
  style: string;
}

interface TournamentsResponse {
  data: Tournament[];
  meta?: {
    current_page: number;
    last_page: number;
    total: number;
  };
}

async function getTournaments(userId: string): Promise<TournamentsResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  try {
    const response = await fetch(`${baseUrl}/api/tournaments/${userId}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch tournaments');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching tournaments:', error);
    return { data: [] };
  }
}

export default async function UserPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const tournamentsData = await getTournaments(userId);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/" className={styles.backLink}>
          ← Back
        </Link>
        <h1>Tournaments for User {userId}</h1>
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
                  <strong>Started:</strong>{' '}
                  {new Date(tournament.startUtc).toLocaleDateString()}
                </p>
                {tournament.completedUtc && (
                  <p>
                    <strong>Completed:</strong>{' '}
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
            Showing {tournamentsData.data.length} of {tournamentsData.meta.total} tournaments
          </p>
        </div>
      )}
    </div>
  );
}
