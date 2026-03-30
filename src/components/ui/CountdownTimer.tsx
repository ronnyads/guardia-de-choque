"use client";

import { useCountdown } from "@/hooks/useCountdown";

export default function CountdownTimer() {
  const { hours, minutes, seconds } = useCountdown();

  const digits = [
    { value: hours, label: "Horas" },
    { value: minutes, label: "Min" },
    { value: seconds, label: "Seg" },
  ];

  return (
    <div className="flex items-center gap-2">
      {digits.map((d, i) => (
        <div key={d.label} className="flex items-center gap-2">
          <div className="flex flex-col items-center">
            <div className="bg-surface border border-white/10 rounded-lg px-3 py-2 min-w-[52px] text-center">
              <span className="text-xl md:text-2xl font-bold tabular-nums text-white">
                {String(d.value).padStart(2, "0")}
              </span>
            </div>
            <span className="text-[10px] text-text-muted mt-1">{d.label}</span>
          </div>
          {i < digits.length - 1 && (
            <span className="text-xl font-bold text-accent mb-4">:</span>
          )}
        </div>
      ))}
    </div>
  );
}
