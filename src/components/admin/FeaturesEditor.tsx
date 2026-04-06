'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

interface Props {
  defaultValue?: FeatureItem[];
  name?: string;
}

const ICONS = [
  { value: 'zap',     label: '⚡ Zap' },
  { value: 'shield',  label: '🛡️ Shield' },
  { value: 'star',    label: '⭐ Star' },
  { value: 'check',   label: '✓ Check' },
  { value: 'award',   label: '🏆 Award' },
  { value: 'clock',   label: '⏱ Clock' },
  { value: 'truck',   label: '🚚 Truck' },
  { value: 'heart',   label: '❤ Heart' },
  { value: 'lock',    label: '🔒 Lock' },
  { value: 'bolt',    label: '🔩 Bolt' },
];

const inputCls = 'border border-[#CBD5E1] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F172A]/20 focus:border-[#0F172A] bg-white transition-colors';

export default function FeaturesEditor({ defaultValue = [], name = 'features' }: Props) {
  const [items, setItems] = useState<FeatureItem[]>(
    defaultValue.length > 0 ? defaultValue : [{ icon: 'zap', title: '', description: '' }]
  );

  const add = () => setItems(prev => [...prev, { icon: 'zap', title: '', description: '' }]);
  const remove = (i: number) => setItems(prev => prev.filter((_, idx) => idx !== i));
  const update = (i: number, field: keyof FeatureItem, value: string) => {
    setItems(prev => prev.map((item, idx) => idx === i ? { ...item, [field]: value } : item));
  };

  return (
    <div className="flex flex-col gap-3">
      <input type="hidden" name={name} value={JSON.stringify(items)} />

      {items.map((item, i) => (
        <div key={i} className="grid grid-cols-[120px_1fr_1fr_32px] gap-2 items-start">
          <select
            value={item.icon}
            onChange={e => update(i, 'icon', e.target.value)}
            className={inputCls}
          >
            {ICONS.map(ic => (
              <option key={ic.value} value={ic.value}>{ic.label}</option>
            ))}
          </select>
          <input
            type="text"
            value={item.title}
            onChange={e => update(i, 'title', e.target.value)}
            placeholder="Título"
            className={inputCls}
          />
          <input
            type="text"
            value={item.description}
            onChange={e => update(i, 'description', e.target.value)}
            placeholder="Descrição"
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
        Adicionar feature
      </button>
    </div>
  );
}
