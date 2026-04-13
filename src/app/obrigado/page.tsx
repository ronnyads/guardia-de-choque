import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

export default function ObrigadoPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] p-10 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-[#F0FDF4] rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-[#16A34A]" />
        </div>
        <h1 className="text-2xl font-bold text-[#0F172A] mb-3">Pagamento Confirmado!</h1>
        <p className="text-[#475569] mb-2">
          Seu pagamento foi processado com sucesso.
        </p>
        <p className="text-sm text-[#94A3B8] mb-8">
          Você receberá o rastreio e a nota fiscal no seu e-mail nos próximos 15 minutos.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold rounded-xl transition-colors text-sm"
        >
          Voltar à loja
        </Link>
      </div>
    </div>
  );
}
