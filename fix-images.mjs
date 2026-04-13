import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const content = fs.readFileSync('C:\\Users\\euron\\Documents\\guardia-de-choque\\.env.local', 'utf-8');
const env = {};
content.split('\n').forEach((line) => {
  const [key, ...rest] = line.split('=');
  if (key && rest.length) {
    env[key.trim()] = rest.join('=').replace(/"/g, '').trim();
  }
});
const supabase = createClient(env['NEXT_PUBLIC_SUPABASE_URL'], env['SUPABASE_SERVICE_ROLE_KEY']);

async function updateImages() {
  const { error } = await supabase.from('products').update({
    images: [
      '/images/product/guardia-1.png',
      '/images/product/hero-product.png',
      '/images/product/choque-in-hand.png',
      '/images/product/kit-completo.png'
    ]
  }).eq('slug', 'guardia-de-choque');
  
  if (error) console.error('Erro:', error);
  else console.log('Imagens corrigidas!');
  process.exit(0);
}
updateImages();
