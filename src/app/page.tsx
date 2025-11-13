"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { logger } from "@/lib/logger-client";

export default function Home() {
  const [userId, setUserId] = useState("1627");
  const router = useRouter();

  useEffect(() => {
    // Log page view when component mounts
    logger.pageView("/", {
      initialUserId: userId,
    });
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (userId.trim()) {
      logger.userAction("submit_user_id", {
        userId: userId.trim(),
        page: "home",
      });
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
