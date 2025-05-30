import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 2000; // 2 seconds
const MAX_RETRY_DELAY = 10000; // 10 seconds

// Wrap Supabase client initialization in a retry mechanism
async function initializeSupabase() {
    let retries = MAX_RETRIES;
    let delay = INITIAL_RETRY_DELAY;

    while (retries > 0) {
        try {
            const { data: { session } } = await supabase.auth.getSession();
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
            }
        }
    }
}

// Initialize Supabase connection
initializeSupabase().catch(error => {
    console.error('Failed to initialize Supabase after all retries:', error);
});