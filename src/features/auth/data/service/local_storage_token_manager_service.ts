import { AuthTokens } from "../../domain/models/auth_tokens";
import { TokenManagerService } from "../../domain/service/token_manager_service";

export class LocalStorageTokenManager implements TokenManagerService {
    private readonly TOKEN_KEY = 'auth_tokens';

    getAccessToken(): string | null {
        const tokens = this.getTokens();
        return tokens ? tokens.accessToken : null;
    }

    getRefreshToken(): string | null {
        const tokens = this.getTokens();
        return tokens ? tokens.refreshToken : null;
    }

    setTokens(tokens: AuthTokens): void {
        localStorage.setItem(this.TOKEN_KEY, JSON.stringify(tokens));
    }

    clearTokens(): void {
        localStorage.removeItem(this.TOKEN_KEY);
    }

    isAuthenticated(): boolean {
        const tokens = this.getTokens();
        if (!tokens) return false;
        return tokens.expiresAt > Date.now();
    }

    private getTokens(): AuthTokens | null {
        const tokensStr = localStorage.getItem(this.TOKEN_KEY);
        return tokensStr ? JSON.parse(tokensStr) : null;
    }
}
