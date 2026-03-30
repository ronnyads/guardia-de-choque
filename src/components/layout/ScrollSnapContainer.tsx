"use client";

import { ReactNode } from "react";

export default function ScrollSnapContainer({ children }: { children: ReactNode }) {
  return (
    <div className="snap-container">
      {children}
    </div>
  );
}
