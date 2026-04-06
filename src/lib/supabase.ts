import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder";

// Client para uso em Client Components — armazena sessão em cookies (lido pelo servidor)
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

