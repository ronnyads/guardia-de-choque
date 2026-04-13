"use client";

import { useState, useTransition } from "react";
import {
  XCircle, CheckCircle2, RotateCcw,
  ChevronDown, Loader2, Save, Trash2, Pencil, MapPin,
} from "lucide-react";
import {
  updateOrderStatus,
  updateOrderTracking,
  updateOrderNotes,
  updateOrderAddress,
  deleteOrder,
} from "@/app/admin/pedidos/[id]/actions";

const STATUS_OPTIONS = [
  { value: "pending",   label: "Pendente",    color: "text-[#D97706]", bg: "bg-[#FEF9C3]" },
  { value: "approved",  label: "Aprovado",    color: "text-[#059669]", bg: "bg-[#DCFCE7]" },
  { value: "failed",    label: "Falhou",      color: "text-[#DC2626]", bg: "bg-[#FEE2E2]" },
  { value: "refunded",  label: "Reembolsado", color: "text-[#7C3AED]", bg: "bg-[#EDE9FE]" },
  { value: "cancelled", label: "Cancelado",   color: "text-[#475569]", bg: "bg-[#F1F5F9]" },
];

export function StatusBadge({ status }: { status: string }) {
  const opt = STATUS_OPTIONS.find((s) => s.value === status) ?? STATUS_OPTIONS[0];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${opt.bg} ${opt.color}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
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
        className="flex items-center gap-2 px-3 py-1.5 border border-[#E2E8F0] rounded-lg bg-white hover:bg-[#F8FAFC] text-sm font-medium text-[#0F172A] transition-colors"
      >
        {pending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <StatusBadge status={currentStatus} />}
        <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8]" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} />
          <div className="absolute top-full mt-1.5 left-0 z-30 bg-white border border-[#E2E8F0] rounded-xl shadow-xl overflow-hidden w-44">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => change(opt.value)}
                className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors hover:bg-[#F8FAFC] ${opt.color} ${opt.value === currentStatus ? "bg-[#F8FAFC]" : ""}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </>
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
        onKeyDown={(e) => e.key === "Enter" && save()}
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

interface AddressData {
  cep?: string; street?: string; number?: string;
  complement?: string; neighborhood?: string; city?: string; state?: string;
}

export function AddressForm({ orderId, currentAddress }: { orderId: string; currentAddress?: AddressData | null }) {
  const [editing, setEditing] = useState(false);
  const [addr, setAddr] = useState<AddressData>(currentAddress ?? {});
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);

  const set = (field: keyof AddressData, val: string) =>
    setAddr((prev) => ({ ...prev, [field]: val }));

  const handleCep = async (raw: string) => {
    let v = raw.replace(/\D/g, "");
    if (v.length > 5) v = v.replace(/^(\d{5})(\d)/, "$1-$2");
    set("cep", v);
    if (v.replace("-", "").length === 8) {
      setLoadingCep(true);
      try {
        const res = await fetch(`https://viacep.com.br/ws/${v.replace("-", "")}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setAddr((prev) => ({
            ...prev,
            street: data.logradouro || prev.street,
            neighborhood: data.bairro || prev.neighborhood,
            city: data.localidade || prev.city,
            state: data.uf || prev.state,
          }));
        }
      } finally {
        setLoadingCep(false);
      }
    }
  };

  const save = () => {
    startTransition(async () => {
      await updateOrderAddress(orderId, addr as Record<string, string>);
      setSaved(true);
      setEditing(false);
      setTimeout(() => setSaved(false), 2000);
    });
  };

  if (!editing) {
    return (
      <div>
        {currentAddress && (currentAddress.street || currentAddress.city) ? (
          <address className="not-italic text-sm text-[#475569] space-y-1 mb-3">
            {currentAddress.street && (
              <p>{currentAddress.street}{currentAddress.number ? `, ${currentAddress.number}` : ""}{currentAddress.complement ? ` - ${currentAddress.complement}` : ""}</p>
            )}
            {currentAddress.neighborhood && <p>{currentAddress.neighborhood}</p>}
            {(currentAddress.city || currentAddress.state) && (
              <p>{[currentAddress.city, currentAddress.state].filter(Boolean).join(" - ")}</p>
            )}
            {currentAddress.cep && <p className="font-mono text-xs text-[#94A3B8]">CEP: {currentAddress.cep}</p>}
          </address>
        ) : (
          <div className="flex items-center gap-2 text-sm text-[#94A3B8] mb-3">
            <MapPin className="w-4 h-4" />
            <span>Endereço não registrado.</span>
          </div>
        )}
        <button
          onClick={() => { setAddr(currentAddress ?? {}); setEditing(true); }}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#6366F1] hover:text-[#4F46E5] transition-colors"
        >
          <Pencil className="w-3.5 h-3.5" />
          {currentAddress?.street ? "Editar endereço" : "Adicionar endereço"}
        </button>
        {saved && <p className="text-xs text-[#059669] mt-1 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Endereço salvo!</p>}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="text-xs text-[#64748B] font-medium mb-1 block">CEP</label>
          <div className="relative">
            <input
              value={addr.cep ?? ""}
              onChange={(e) => handleCep(e.target.value)}
              placeholder="00000-000"
              maxLength={9}
              className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6366F1]/30 focus:border-[#6366F1]"
            />
            {loadingCep && <Loader2 className="absolute right-2 top-2.5 w-4 h-4 animate-spin text-[#94A3B8]" />}
          </div>
        </div>
        <div className="w-20">
          <label className="text-xs text-[#64748B] font-medium mb-1 block">UF</label>
          <input
            value={addr.state ?? ""}
            onChange={(e) => set("state", e.target.value.toUpperCase().slice(0, 2))}
            placeholder="SP"
            className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6366F1]/30 focus:border-[#6366F1]"
          />
        </div>
      </div>
      <div>
        <label className="text-xs text-[#64748B] font-medium mb-1 block">Rua / Avenida</label>
        <input
          value={addr.street ?? ""}
          onChange={(e) => set("street", e.target.value)}
          placeholder="Rua das Flores"
          className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6366F1]/30 focus:border-[#6366F1]"
        />
      </div>
      <div className="flex gap-2">
        <div className="w-28">
          <label className="text-xs text-[#64748B] font-medium mb-1 block">Número</label>
          <input
            value={addr.number ?? ""}
            onChange={(e) => set("number", e.target.value)}
            placeholder="123"
            className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6366F1]/30 focus:border-[#6366F1]"
          />
        </div>
        <div className="flex-1">
          <label className="text-xs text-[#64748B] font-medium mb-1 block">Complemento</label>
          <input
            value={addr.complement ?? ""}
            onChange={(e) => set("complement", e.target.value)}
            placeholder="Apto 21"
            className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6366F1]/30 focus:border-[#6366F1]"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="text-xs text-[#64748B] font-medium mb-1 block">Bairro</label>
          <input
            value={addr.neighborhood ?? ""}
            onChange={(e) => set("neighborhood", e.target.value)}
            placeholder="Centro"
            className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6366F1]/30 focus:border-[#6366F1]"
          />
        </div>
        <div className="flex-1">
          <label className="text-xs text-[#64748B] font-medium mb-1 block">Cidade</label>
          <input
            value={addr.city ?? ""}
            onChange={(e) => set("city", e.target.value)}
            placeholder="São Paulo"
            className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6366F1]/30 focus:border-[#6366F1]"
          />
        </div>
      </div>
      <div className="flex gap-2 pt-1">
        <button
          onClick={save}
          disabled={pending}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#0F172A] hover:bg-[#1E293B] text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
        >
          {pending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          Salvar endereço
        </button>
        <button
          onClick={() => setEditing(false)}
          className="px-4 py-2 border border-[#E2E8F0] text-[#64748B] text-sm font-semibold rounded-lg hover:bg-[#F8FAFC]"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

export function QuickActions({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const [pending, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const doStatus = (s: string) => startTransition(() => updateOrderStatus(orderId, s));
  const doDelete = () => startTransition(() => deleteOrder(orderId));

  return (
    <div className="flex flex-wrap items-center gap-2">
      {currentStatus === "pending" && (
        <button
          onClick={() => doStatus("approved")}
          disabled={pending}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#059669] hover:bg-[#047857] text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
        >
          <CheckCircle2 className="w-4 h-4" /> Marcar como Aprovado
        </button>
      )}
      {currentStatus === "approved" && (
        <button
          onClick={() => doStatus("refunded")}
          disabled={pending}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
        >
          <RotateCcw className="w-4 h-4" /> Reembolsar
        </button>
      )}
      {(currentStatus === "pending" || currentStatus === "approved") && (
        <button
          onClick={() => doStatus("cancelled")}
          disabled={pending}
          className="flex items-center gap-1.5 px-4 py-2 bg-white border border-[#E2E8F0] hover:bg-[#FEE2E2] hover:border-[#FCA5A5] text-[#DC2626] text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
        >
          <XCircle className="w-4 h-4" /> Cancelar
        </button>
      )}

      <div className="ml-auto">
        {!confirmDelete ? (
          <button
            onClick={() => setConfirmDelete(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-[#94A3B8] hover:text-[#DC2626] text-sm font-semibold transition-colors"
          >
            <Trash2 className="w-4 h-4" /> Excluir
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#DC2626] font-medium">Tem certeza?</span>
            <button
              onClick={doDelete}
              disabled={pending}
              className="px-3 py-2 bg-[#DC2626] hover:bg-[#B91C1C] text-white text-sm font-semibold rounded-lg disabled:opacity-50"
            >
              {pending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Sim"}
            </button>
            <button onClick={() => setConfirmDelete(false)} className="px-3 py-2 border border-[#E2E8F0] text-[#64748B] text-sm font-semibold rounded-lg">
              Não
            </button>
          </div>
        )}
      </div>
      {pending && <Loader2 className="w-4 h-4 animate-spin text-[#94A3B8]" />}
    </div>
  );
}
