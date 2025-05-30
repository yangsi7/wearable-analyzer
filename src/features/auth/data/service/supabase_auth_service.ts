import { User as SupabaseUser, Session as SupabaseSession } from "@supabase/supabase-js";
import { Session } from "../../domain/models/session";
import { User } from "../../domain/models/user";
import { SupabaseService } from "../../../../common/data/remote/supabase_service";
import { AuthService } from "../../domain/service/auth_service";
import { AuthTokens } from "../../domain/models/auth_tokens";

const REFRESH_THRESHOLD = 60 * 1000; // 1 minute before expiry
export class SupabaseAuthService implements AuthService {
    private supabaseService: SupabaseService;

    constructor(supabaseService: SupabaseService) {
        this.supabaseService = supabaseService;
    }
    async resetPassword(email: string): Promise<boolean> {
        const { error: resetError } = await this.supabaseService.supabase.auth.resetPasswordForEmail(
            email.trim(),
            {
                redirectTo: `${window.location.origin}/reset-password`,
            }
        );
        if (resetError) throw resetError;
        return true;
    }

    private mapSupabaseUser(user: SupabaseUser): User {
        return {
            id: user.id,
            email: user.email,
        }
    }

    private mapSupabaseSession(session: SupabaseSession): Session {
        return {
            access_token: session.access_token,
            refresh_token: session.refresh_token,
            expires_in: session.expires_in,
            expires_at: session.expires_at,
            user: this.mapSupabaseUser(session.user),
        }
    }

    async refreshToken(): Promise<AuthTokens | null> {
        const session = await this.refreshSession();
        return session && {
            accessToken: session.access_token,
            refreshToken: session.refresh_token,
            expiresAt: session.expires_at || 0,
        }
    }



    async refreshSession(): Promise<Session | null> {
        const { data: { session } } = await this.supabaseService.supabase.auth.getSession();

        if (session?.expires_at) {
            const expiresAt = new Date(session.expires_at * 1000);
            const now = new Date();

            if (expiresAt.getTime() - now.getTime() < REFRESH_THRESHOLD) {
                const { data: { session: newSession }, error } = await this.supabaseService.supabase.auth.refreshSession();
                if (error) throw error;
                return newSession && this.mapSupabaseSession(newSession);
            }
        }

        return session && this.mapSupabaseSession(session);
    }

    async login(email: string, password: string) {
        const { data, error } = await this.supabaseService.supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
        });

        if (error) throw error;
        return {
            accessToken: data.session.access_token,
            refreshToken: data.session.refresh_token,
            expiresAt: data.session.expires_at || 0,
        };
    }

    async logout() {
        const { error } = await this.supabaseService.supabase.auth.signOut();
        if (error) throw error;
    }

    async getSession() {
        const session = await this.refreshSession();
        return session;
    }

    async getUser() {
        const session = await this.refreshSession();
        return session && session.user;
    }

    async signup(email: string, password: string) {
        const { data, error } = await this.supabaseService.supabase.auth.signUp({
            email: email.trim(),
            password,
        });

        if (error) throw error;
        return data.session && {
            accessToken: data.session.access_token,
            refreshToken: data.session.refresh_token,
            expiresAt: data.session.expires_at || 0,
        };
    }

    async getSessionId(): Promise<string | null> {
        const session = await this.refreshSession();
        const jwt = session?.access_token;
        if (!jwt) return null;

        const payload = jwt.split('.')[1];
        const decoded = JSON.parse(atob(payload));
        return decoded.session_id;
    }
}