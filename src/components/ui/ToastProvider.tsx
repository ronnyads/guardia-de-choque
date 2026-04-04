"use client";

import { create } from "zustand";
import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Info, X, type LucideProps } from "lucide-react";

/* ── Types ─────────────────────────────────────────────────────── */
export type ToastType = "success" | "error" | "info";

interface Toast {
  id:      string;
  type:    ToastType;
  title:   string;
  message?: string;
}

interface ToastState {
  toasts: Toast[];
  show: (toast: Omit<Toast, "id">) => void;
  dismiss: (id: string) => void;
}

/* ── Store ──────────────────────────────────────────────────────── */
export const useToastStore = create<ToastState>((set) => ({
  toasts: [],

  show: (toast) =>
    set((s) => ({
      toasts: [...s.toasts, { ...toast, id: crypto.randomUUID() }].slice(-5),
    })),

  dismiss: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

/* ── Helper ─────────────────────────────────────────────────────── */
export function toast(type: ToastType, title: string, message?: string) {
  useToastStore.getState().show({ type, title, message });
}

/* ── Icon map ───────────────────────────────────────────────────── */
const ICONS: Record<ToastType, React.FC<LucideProps>> = {
  success: (props) => <CheckCircle2 {...props} />,
  error:   (props) => <XCircle      {...props} />,
  info:    (props) => <Info         {...props} />,
};

const COLORS: Record<ToastType, { bg: string; icon: string; border: string }> = {
  success: { bg: "#F0FDF4", icon: "#16A34A", border: "#BBF7D0" },
  error:   { bg: "#FEF2F2", icon: "#DC2626", border: "#FECACA" },
  info:    { bg: "#F8FAFF", icon: "#3B82F6", border: "#BFDBFE" },
};

/* ── Single Toast Item ──────────────────────────────────────────── */
function ToastItem({ toast: t }: { toast: Toast }) {
  const dismiss = useToastStore((s) => s.dismiss);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const Icon = ICONS[t.type];
  const c = COLORS[t.type];

  useEffect(() => {
    timerRef.current = setTimeout(() => dismiss(t.id), 4000);
    return () => clearTimeout(timerRef.current);
  }, [t.id, dismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 60, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.88, transition: { duration: 0.2 } }}
      transition={{ type: "spring", damping: 24, stiffness: 300 }}
      role="alert"
      aria-live="polite"
      className="flex items-start gap-3 max-w-[340px] w-full rounded-2xl shadow-xl p-4 pr-3 border"
      style={{
        background: c.bg,
        borderColor: c.border,
        boxShadow: "0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      <Icon className="w-5 h-5 mt-0.5 shrink-0" color={c.icon} />
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-[#09090B] leading-tight">{t.title}</p>
        {t.message && (
          <p className="text-[12px] text-[#71717A] mt-0.5 leading-relaxed">{t.message}</p>
        )}
      </div>
      <button
        onClick={() => dismiss(t.id)}
        className="w-6 h-6 flex items-center justify-center rounded-lg text-[#A1A1AA] hover:text-[#09090B] hover:bg-black/5 transition-colors shrink-0 mt-0.5"
        aria-label="Fechar notificação"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
}

/* ── Toast Portal (mount at app root) ───────────────────────────── */
export default function ToastProvider() {
  const toasts = useToastStore((s) => s.toasts);

  return (
    <div
      className="fixed top-20 right-4 z-[200] flex flex-col gap-2 items-end pointer-events-none"
      aria-label="Notificações"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem toast={t} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
