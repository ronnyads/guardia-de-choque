"use client";

import { useState, useTransition } from "react";
import {
  Truck, FileText, XCircle, CheckCircle2, RotateCcw,
  ChevronDown, Loader2, Package, Save, Trash2,
} from "lucide-react";
import {
  updateOrderStatus,
  updateOrderTracking,
  updateOrderNotes,
  deleteOrder,
} from "@/app/admin/pedidos/[id]/actions";

interface Props {
  orderId: string;
  currentStatus: string;
  currentTracking?: string | null;
  currentNotes?: string | null;
}

const STATUS_OPTIONS = [
  { value: "pending",   label: "Pendente",   color: "text-[#D97706]", bg: "bg-[#FEF9C3]" },
  { value: "approved",  label: "Aprovado",   color: "text-[#059669]", bg: "bg-[#DCFCE7]" },
  { value: "failed",    label: "Falhou",     color: "text-[#DC2626]", bg: "bg-[#FEE2E2]" },
  { value: "refunded",  label: "Reembolsado",color: "text-[#7C3AED]", bg: "bg-[#EDE9FE]" },
  { value: "cancelled", label: "Cancelado",  color: "text-[#475569]", bg: "bg-[#F1F5F9]" },
];

function StatusBadge({ status }: { status: string }) {
  const opt = STATUS_OPTIONS.find((s) => s.value === status) ?? STATUS_OPTIONS[0];
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${opt.bg} ${opt.color}`}>
      {opt.label}
    </span>
  );
}

export function StatusSelector({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const change = (value: string) => {
    setOpen(false);
    startTransition(() => updateOrderStatus(orderId, value));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        disabled={pending}
        className="flex items-center gap-2 px-3 py-2 border border-[#E2E8F0] rounded-lg bg-white hover:bg-[#F8FAFC] text-sm font-medium text-[#0F172A] transition-colors"
      >
        {pending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <StatusBadge status={currentStatus} />}
        <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8]" />
      </button>
      {open && (
        <div className="absolute top-full mt-1.5 left-0 z-30 bg-white border border-[#E2E8F0] rounded-xl shadow-lg overflow-hidden w-44">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => change(opt.value)}
              className={`w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-[#F8FAFC] transition-colors ${
                opt.value === currentStatus ? "bg-[#F8FAFC]" : ""
              } ${opt.color}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function TrackingForm({ orderId, currentTracking }: { orderId: string; currentTracking?: string | null }) {
  const [value, setValue] = useState(currentTracking ?? "");
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const save = () => {
    startTransition(async () => {
      await updateOrderTracking(orderId, value);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  };

  return (
    <div className="flex gap-2">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Ex: BR123456789BR"
        className="flex-1 border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm text-[#0F172A] placeholder:text-[#CBD5E1] focus:outline-none focus:ring-2 focus:ring-[#6366F1]/30 focus:border-[#6366F1]"
      />
      <button
        onClick={save}
        disabled={pending}
        className="flex items-center gap-1.5 px-3 py-2 bg-[#0F172A] hover:bg-[#1E293B] text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
      >
        {pending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : saved ? <CheckCircle2 className="w-3.5 h-3.5 text-[#4ADE80]" /> : <Save className="w-3.5 h-3.5" />}
        {saved ? "Salvo!" : "Salvar"}
      </button>
    </div>
  );
}

export function NotesForm({ orderId, currentNotes }: { orderId: string; currentNotes?: string | null }) {
  const [value, setValue] = useState(currentNotes ?? "");
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const save = () => {
    startTransition(async () => {
      await updateOrderNotes(orderId, value);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={3}
        placeholder="Notas internas sobre este pedido..."
        className="border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm text-[#0F172A] placeholder:text-[#CBD5E1] focus:outline-none focus:ring-2 focus:ring-[#6366F1]/30 focus:border-[#6366F1] resize-none"
      />
      <button
        onClick={save}
        disabled={pending}
        className="self-end flex items-center gap-1.5 px-3 py-2 bg-[#0F172A] hover:bg-[#1E293B] text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
      >
        {pending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : saved ? <CheckCircle2 className="w-3.5 h-3.5 text-[#4ADE80]" /> : <Save className="w-3.5 h-3.5" />}
        {saved ? "Salvo!" : "Salvar nota"}
      </button>
    </div>
  );
}

export function QuickActions({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const [pending, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const doStatus = (s: string) => startTransition(() => updateOrderStatus(orderId, s));
  const doDelete = () => startTransition(() => deleteOrder(orderId));

  return (
    <div className="flex flex-wrap gap-2">
      {currentStatus === "pending" && (
        <button
          onClick={() => doStatus("approved")}
          disabled={pending}
          className="flex items-center gap-1.5 px-3 py-2 bg-[#059669] hover:bg-[#047857] text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
        >
          <CheckCircle2 className="w-3.5 h-3.5" /> Marcar como Aprovado
        </button>
      )}
      {currentStatus === "approved" && (
        <button
          onClick={() => doStatus("refunded")}
          disabled={pending}
          className="flex items-center gap-1.5 px-3 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reembolsar
        </button>
      )}
      {(currentStatus === "pending" || currentStatus === "approved") && (
        <button
          onClick={() => doStatus("cancelled")}
          disabled={pending}
          className="flex items-center gap-1.5 px-3 py-2 bg-white border border-[#E2E8F0] hover:bg-[#FEE2E2] hover:border-[#FCA5A5] text-[#DC2626] text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
        >
          <XCircle className="w-3.5 h-3.5" /> Cancelar
        </button>
      )}
      {!confirmDelete ? (
        <button
          onClick={() => setConfirmDelete(true)}
          className="flex items-center gap-1.5 px-3 py-2 bg-white border border-[#E2E8F0] hover:border-[#FCA5A5] text-[#94A3B8] hover:text-[#DC2626] text-xs font-semibold rounded-lg transition-colors ml-auto"
        >
          <Trash2 className="w-3.5 h-3.5" /> Excluir
        </button>
      ) : (
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs text-[#DC2626] font-medium">Tem certeza?</span>
          <button
            onClick={doDelete}
            disabled={pending}
            className="px-3 py-2 bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
          >
            {pending ? <Loader2 className="w-3 h-3 animate-spin" /> : "Sim, excluir"}
          </button>
          <button
            onClick={() => setConfirmDelete(false)}
            className="px-3 py-2 border border-[#E2E8F0] text-[#64748B] text-xs font-semibold rounded-lg"
          >
            Não
          </button>
        </div>
      )}
      {pending && <Loader2 className="w-4 h-4 animate-spin text-[#94A3B8] self-center" />}
    </div>
  );
}

// Re-export icons used in server page
export { Truck, FileText, Package };
