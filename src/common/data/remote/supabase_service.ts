import { SupabaseClient } from "@supabase/supabase-js";

export interface SupabaseService {
    supabase: SupabaseClient;
}