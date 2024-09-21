import { createClient } from "@supabase/supabase-js";
import.meta.env;

// to be more secure, use environment variables and store in .env file
const supabaseURL = "https://lufswepdkuvvgsrmqist.supabase.co";
const supabaseAnnonKey =import.meta.env.VITE_ANON_API_KEY;

export const supabase = createClient(supabaseURL, supabaseAnnonKey)