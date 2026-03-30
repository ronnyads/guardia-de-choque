"use client";

import { useEffect, useState, useCallback } from "react";

export function useExitIntent() {
  const [showModal, setShowModal] = useState(false);

  const close = useCallback(() => {
    setShowModal(false);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("exit-intent-shown", "true");
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("exit-intent-shown") === "true") return;

    function handleMouseLeave(e: MouseEvent) {
      if (e.clientY <= 0) {
        setShowModal(true);
        sessionStorage.setItem("exit-intent-shown", "true");
        document.removeEventListener("mouseout", handleMouseLeave);
      }
    }

    document.addEventListener("mouseout", handleMouseLeave);
    return () => document.removeEventListener("mouseout", handleMouseLeave);
  }, []);

  return { showModal, close };
}
