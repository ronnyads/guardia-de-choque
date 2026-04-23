'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { CheckCircle } from 'lucide-react';

export default function SavedToast() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [visible, setVisible] = useState(searchParams.get("saved") === "1");

  useEffect(() => {
    if (visible) {
      router.replace(pathname, { scroll: false });
      const t = setTimeout(() => setVisible(false), 3000);
      return () => clearTimeout(t);
    }
  }, [visible, router, pathname]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 bg-[#0F172A] text-white px-5 py-3 rounded-2xl shadow-2xl text-sm font-medium animate-in fade-in slide-in-from-bottom-4 duration-300">
      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
      Produto salvo com sucesso!
    </div>
  );
}
