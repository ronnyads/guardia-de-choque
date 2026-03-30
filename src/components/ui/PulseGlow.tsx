import { ReactNode } from "react";

export default function PulseGlow({ children }: { children: ReactNode }) {
  return <div className="animate-pulse-glow rounded-xl">{children}</div>;
}
