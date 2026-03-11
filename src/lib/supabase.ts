import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://zshlyhsnhzxdkquufsum.supabase.co";
const supabaseAnonKey = "sb_publishable_MhgUbcj593As7zdaWEUyNQ_pmOo2YA-";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
