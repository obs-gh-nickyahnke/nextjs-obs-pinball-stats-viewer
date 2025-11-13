"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function Home() {
  const [userId, setUserId] = useState("1627");
  const router = useRouter();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (userId.trim()) {
      router.push(`/user/${userId.trim()}`);
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Enter a matchplay id</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter Matchplay User ID"
            className={styles.input}
          />
          <button type="submit" className={styles.button}>
            Submit
          </button>
        </form>
      </main>
    </div>
  );
}
