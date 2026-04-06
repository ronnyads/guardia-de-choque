'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface SpecItem {
  label: string;
  value: string;
}

interface Props {
  defaultValue?: SpecItem[];
  name?: string;
}

const inputCls = 'border border-[#CBD5E1] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F172A]/20 focus:border-[#0F172A] bg-white transition-colors';

export default function SpecsEditor({ defaultValue = [], name = 'specs' }: Props) {
  const [items, setItems] = useState<SpecItem[]>(
    defaultValue.length > 0 ? defaultValue : [{ label: '', value: '' }]
  );

  const add = () => setItems(prev => [...prev, { label: '', value: '' }]);
  const remove = (i: number) => setItems(prev => prev.filter((_, idx) => idx !== i));
  const update = (i: number, field: keyof SpecItem, value: string) => {
    setItems(prev => prev.map((item, idx) => idx === i ? { ...item, [field]: value } : item));
  };

  return (
    <div className="flex flex-col gap-3">
      <input type="hidden" name={name} value={JSON.stringify(items)} />

      {items.map((item, i) => (
        <div key={i} className="grid grid-cols-[1fr_1fr_32px] gap-2 items-start">
          <input
            type="text"
            value={item.label}
            onChange={e => update(i, 'label', e.target.value)}
            placeholder="Ex: Peso"
            className={inputCls}
          />
          <input
            type="text"
            value={item.value}
            onChange={e => update(i, 'value', e.target.value)}
            placeholder="Ex: 180g"
            className={inputCls}
          />
          <button
            type="button"
            onClick={() => remove(i)}
            className="w-8 h-[38px] flex items-center justify-center text-[#94A3B8] hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={add}
        className="flex items-center gap-2 text-sm text-[#64748B] hover:text-[#0F172A] transition-colors w-fit"
      >
        <Plus className="w-4 h-4" />
        Adicionar especificação
      </button>
    </div>
  );
}
