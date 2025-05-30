import { AuthTokens } from "../models/auth_tokens";

export interface TokenManagerService {
    getAccessToken(): string | null;
    getRefreshToken(): string | null;
    setTokens(tokens: AuthTokens): void;
    clearTokens(): void;
    isAuthenticated(): boolean;
}
