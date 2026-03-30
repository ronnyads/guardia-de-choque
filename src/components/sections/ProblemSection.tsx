"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Clock, ShieldOff } from "lucide-react";
import ScrollSnapSection from "@/components/layout/ScrollSnapSection";
import { useInView } from "@/hooks/useInView";
import { useEffect, useState } from "react";

const icons = { AlertTriangle, Clock, ShieldOff };

const stats = [
  { icon: "AlertTriangle", target: 50000, suffix: "+", label: "assaltos registrados por ano no Brasil" },
  { icon: "Clock", target: 10, suffix: " min", label: "uma pessoa é vítima de roubo a cada 10 minutos" },
  { icon: "ShieldOff", target: 87, suffix: "%", label: "das vítimas estavam completamente desprevenidas" },
];

function AnimatedCounter({ target, suffix, start }: { target: number; suffix: string; start: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [start, target]);

  const formatted = target >= 1000 ? count.toLocaleString("pt-BR") : count;

  return (
    <span className="text-3xl md:text-4xl font-bold text-white tabular-nums">
      {formatted}{suffix}
    </span>
  );
}

export default function ProblemSection() {
  const { ref, isInView } = useInView(0.3);

  return (
    <ScrollSnapSection className="relative">
      {/* Red tinted overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-danger/5 via-transparent to-transparent pointer-events-none" />

      <div ref={ref} className="max-w-5xl mx-auto w-full flex flex-col items-center gap-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Você Está Preparado Para{" "}
            <span className="text-danger">Se Defender?</span>
          </h2>
          <p className="text-text-secondary text-lg">
            A violência não escolhe hora nem lugar. Estar preparado não é opção
            — é <span className="text-white font-semibold">necessidade</span>.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {stats.map((stat, i) => {
            const Icon = icons[stat.icon as keyof typeof icons];
            return (
              <motion.div
                key={stat.icon}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
                className="bg-surface border border-white/5 rounded-2xl p-8 flex flex-col items-center text-center gap-4"
              >
                <div className="w-14 h-14 rounded-xl bg-danger/10 flex items-center justify-center">
                  <Icon className="w-7 h-7 text-danger" />
                </div>
                <AnimatedCounter target={stat.target} suffix={stat.suffix} start={isInView} />
                <p className="text-text-secondary text-sm">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </ScrollSnapSection>
  );
}
