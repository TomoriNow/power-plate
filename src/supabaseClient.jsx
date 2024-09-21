import { createClient } from "@supabase/supabase-js";

// to be more secure, use environment variables and store in .env file
const supabaseURL = "https://lufswepdkuvvgsrmqist.supabase.co";
const supabaseAnnonKey ="";

export const supabase = createClient(supabaseURL, supabaseAnnonKey)