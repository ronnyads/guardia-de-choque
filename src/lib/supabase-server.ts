import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

/**
 * Cria um cliente Supabase server-side com cookies da sessão atual.
 * Sujeito a RLS — respeita as permissões do usuário autenticado.
 * Use em Server Components, Server Actions e API Routes.
 */
export async function createServerSupabase() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component — não pode setar cookies, ignorar
          }
        },
      },
    }
  );
}

/**
 * Cria um cliente Supabase com service role — bypassa RLS completamente.
 *
 * ATENCAO: Use APENAS em:
 * - API routes de checkout (validação de preços)
 * - Webhooks de pagamento
 * - Scripts de migração/seed
 *
 * NUNCA use em Server Components ou Client Components.
 */
export function createServiceSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
