import { AuthTokens } from "../models/auth_tokens";
import { Session } from "../models/session";
import { User } from "../models/user";

export interface AuthService {
    refreshToken(token: string): Promise<AuthTokens | null>;
    refreshSession(): Promise<Session | null>;
    login(email: string, password: string): Promise<AuthTokens | null>;
    logout(): Promise<void>;
    getSession(): Promise<Session | null>;
    getUser(): Promise<User | null>;
    signup(email: string, password: string): Promise<AuthTokens | null>;
    getSessionId(): Promise<string | null>;
    resetPassword(email: string): Promise<boolean>;
}