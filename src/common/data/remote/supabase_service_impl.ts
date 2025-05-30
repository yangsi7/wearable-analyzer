import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { SupabaseService } from "./supabase_service";

const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 2000; // 2 seconds
const MAX_RETRY_DELAY = 10000; // 10 seconds

export class SupabaseServiceImpl implements SupabaseService {
    public supabase: SupabaseClient;

    constructor() {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseAnonKey) {
            throw new Error('Missing Supabase environment variables');
        }

        this.supabase = createClient(supabaseUrl, supabaseAnonKey);

        // Initialize Supabase connection
        this.initializeSupabase().catch(error => { console.error('Failed to initialize Supabase after all retries:', error); });
    }

    // Wrap Supabase client initialization in a retry mechanism
    private async initializeSupabase() {
        let retries = MAX_RETRIES;
        let delay = INITIAL_RETRY_DELAY;

        while (retries > 0) {
            try {
                const { data: { session } } = await this.supabase.auth.getSession();
                if (session) {
                    console.log('Supabase connection established');
                }
                return;
            } catch (error) {
                console.warn(`Failed to initialize Supabase (${retries} attempts remaining)`);
                retries--;
                if (retries > 0) {
                    const jitter = Math.random() * 1000;
                    delay = Math.min(delay * 2 + jitter, MAX_RETRY_DELAY);
                    await new Promise(resolve => setTimeout(resolve, delay));
                } else {
                    throw error;
                }
            }
        }
    }
}
