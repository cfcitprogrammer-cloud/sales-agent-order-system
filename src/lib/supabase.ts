import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://elrtnvgaqbydgcuxuqfn.supabase.co";
const supabaseAnonKey = "sb_publishable_CjE2KZKSEdR7RRwOnvnTGg_eXARu7-k";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
