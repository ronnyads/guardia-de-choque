export interface ShippingOption {
  id: number;
  name: string;
  price: number;      // BRL
  deliveryDays: number;
  company: string;
}

interface SuperFreteItem {
  id: number;
  name: string;
  price: string | number;
  delivery_time: number;
  error?: string;
  company?: { name: string };
}

/**
 * Calls the SuperFrete calculator API.
 * Never throws — returns [] on any failure (silent fallback).
 */
export async function calculateShipping(
  fromCep: string,
  toCep: string,
  packages: { weightG: number; lengthCm: number; widthCm: number; heightCm: number }[],
  token?: string,
): Promise<ShippingOption[]> {
  const resolvedToken = token || process.env.SUPERFRETE_TOKEN;
  if (!resolvedToken || !fromCep || !toCep) return [];

  const clean = (c: string) => c.replace(/\D/g, '');
  if (clean(fromCep).length !== 8 || clean(toCep).length !== 8) return [];

  // Aggregate: sum weight, use max dimensions
  const totalWeightKg = packages.reduce((s, p) => s + p.weightG, 0) / 1000;
  const maxLen = Math.max(...packages.map(p => p.lengthCm));
  const maxWid = Math.max(...packages.map(p => p.widthCm));
  const maxHei = Math.max(...packages.map(p => p.heightCm));

  try {
    const res = await fetch('https://superfrete.com/api/v0/calculator', {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${resolvedToken}`,
        'Accept':        'application/json',
      },
      body: JSON.stringify({
        from:     { postal_code: clean(fromCep) },
        to:       { postal_code: clean(toCep) },
        package:  { height: maxHei, width: maxWid, length: maxLen, weight: totalWeightKg },
        services: '1,2,3,17',
        options:  { insurance_value: 0, receipt: false, own_hand: false },
      }),
    });

    if (!res.ok) return [];

    const data: SuperFreteItem[] = await res.json();

    return data
      .filter(s => !s.error && s.price != null)
      .map(s => ({
        id:          s.id,
        name:        s.name,
        price:       Math.round(Number(s.price) * 100) / 100,
        deliveryDays: s.delivery_time,
        company:     s.company?.name ?? '',
      }))
      .sort((a, b) => a.price - b.price);
  } catch {
    return [];
  }
}
