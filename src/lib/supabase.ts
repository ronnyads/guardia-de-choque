import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client para uso geral (Client-side / e SSG seguro)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
