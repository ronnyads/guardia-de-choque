'use client';

import { Archive } from 'lucide-react';
import { deleteProduct } from './actions';

export default function ArchiveButton({ productId }: { productId: string }) {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (!confirm('Arquivar este produto? Ele não aparecerá mais na loja.')) {
      e.preventDefault();
    }
  }

  return (
    <form action={deleteProduct} onSubmit={handleSubmit}>
      <input type="hidden" name="id" value={productId} />
      <button
        type="submit"
        className="flex items-center gap-2 px-4 py-2.5 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
      >
        <Archive className="w-4 h-4" />
        Arquivar Produto
      </button>
    </form>
  );
}
