"use client";

import { useEffect, useState } from "react";

function getTargetTime(): number {
  const stored = typeof window !== "undefined" ? localStorage.getItem("countdown-target") : null;
  if (stored) {
    const target = parseInt(stored, 10);
    if (target > Date.now()) return target;
  }
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  const target = tomorrow.getTime();
  if (typeof window !== "undefined") {
    localStorage.setItem("countdown-target", target.toString());
  }
  return target;
}

export function useCountdown() {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = getTargetTime();

    function update() {
      const diff = Math.max(0, target - Date.now());
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ hours, minutes, seconds });
    }

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return timeLeft;
}
