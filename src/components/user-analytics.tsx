"use client";

import { useEffect } from "react";
import { logger } from "@/lib/logger-client";

interface UserAnalyticsProps {
  userId: string;
  userName: string;
  tournamentCount: number;
}

export function UserAnalytics({
  userId,
  userName,
  tournamentCount,
}: UserAnalyticsProps) {
  useEffect(() => {
    logger.pageView(`/user/${userId}`, {
      userId,
      userName,
      tournamentCount,
    });

    logger.info("User page loaded", {
      userId,
      userName,
      tournamentCount,
      loadTime: performance.now(),
    });
  }, [userId, userName, tournamentCount]);

  return null;
}
