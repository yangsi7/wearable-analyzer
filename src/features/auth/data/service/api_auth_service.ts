import { HttpClient } from "../../../../common/data/remote/http_service";
import { AuthTokens } from "../../domain/models/auth_tokens";
import { Session } from "../../domain/models/session";
import { User } from "../../domain/models/user";
import { AuthService } from "../../domain/service/auth_service";
import { TokenManagerService } from "../../domain/service/token_manager_service";

export class ApiAuthService implements AuthService {
    constructor(
        private httpClient: HttpClient,
        private tokenManager: TokenManagerService
    ) { }

    async refreshSession(): Promise<Session | null> {
        try {
            const session = await this.httpClient.post<Session>('/auth/refresh-session');
            return session;
        } catch (error) {
            console.error('Failed to refresh session', error);
            return null;
        }
    }

    async getSession(): Promise<Session | null> {
        try {
            const session = await this.httpClient.get<Session>('/auth/session');
            return session;
        } catch (error) {
            console.error('Failed to get session', error);
            return null;
        }
    }

    async getUser(): Promise<User | null> {
        try {
            return this.httpClient.get<User>('/auth/user');
        }
        catch (error) {
            console.error('Failed to get user', error);
            return null;
        }
    }

    async login(email: string, password: string): Promise<AuthTokens | null> {
        try {
            const tokens = await this.httpClient.post<AuthTokens>('/auth/login', { email, password });
            this.tokenManager.setTokens(tokens);
            return tokens;
        } catch (error) {
            console.error('Failed to login', error);
            return null;
        }
    }

    async signup(email: string, password: string): Promise<AuthTokens | null> {
        try {
            const tokens = await this.httpClient.post<AuthTokens>('/auth/register', {
                email,
                password,
            });
            this.tokenManager.setTokens(tokens);
            return tokens;
        } catch (error) {
            console.error('Failed to register', error);
            return null;
        }
    }

    async refreshToken(refreshToken: string): Promise<AuthTokens | null> {
        try {
            const tokens = await this.httpClient.post<AuthTokens>('/auth/refresh', { refreshToken });
            this.tokenManager.setTokens(tokens);
            return tokens;
        } catch (error) {
            console.error('Failed to refresh token', error);
            return null;
        }
    }

    async logout(): Promise<void> {
        try {
            await this.httpClient.post<void>('/auth/logout');
        } finally {
            // Clear tokens even if the request fails
            this.tokenManager.clearTokens();
        }
    }

    async resetPassword(email: string): Promise<boolean> {
        try {
            await this.httpClient.post<void>('/auth/reset-password', { email });
            return true;
        } catch (error) {
            console.error('Failed to reset password', error);
            return false;
        }
    }

    async getSessionId(): Promise<string | null> {
        try {
            const sessionId = await this.httpClient.get<string>('/auth/session-id');
            return sessionId;
        } catch (error) {
            console.error('Failed to get session ID', error);
            return null;
        }
    }

}
