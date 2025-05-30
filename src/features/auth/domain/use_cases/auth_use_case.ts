import { AuthTokens } from "../models/auth_tokens";
import { User } from "../models/user";
import { AuthService } from "../service/auth_service";

export class AuthUseCase {
    constructor(private authRepository: AuthService) { }

    async login(email: string, password: string): Promise<User | null> {
        const tokens = await this.authRepository.login(email, password);
        tokens ? this.saveTokens(tokens) : this.clearTokens();
        return this.authRepository.getUser();
    }

    async singUp(email: string, password: string): Promise<User | null> {
        const tokens = await this.authRepository.signup(email, password);
        tokens ? this.saveTokens(tokens) : this.clearTokens();
        return this.authRepository.getUser();
    }

    async logout(): Promise<void> {
        await this.authRepository.logout();
        this.clearTokens();
    }

    async refreshAuthToken(): Promise<AuthTokens | null> {
        const currentTokens = this.getTokens();
        if (!currentTokens || !currentTokens.refreshToken) {
            throw new Error('No refresh token available');
        }

        const newTokens = await this.authRepository.refreshToken(currentTokens.refreshToken);
        newTokens ? this.saveTokens(newTokens) : this.clearTokens();
        return newTokens;
    }

    async getCurrentUser(): Promise<User | null> {
        return this.authRepository.getUser();
    }

    isAuthenticated(): boolean {
        const tokens = this.getTokens();
        if (!tokens) return false;
        return tokens.expiresAt > Date.now();
    }

    private saveTokens(tokens: AuthTokens): void {
        localStorage.setItem('auth_tokens', JSON.stringify(tokens));
    }

    private getTokens(): AuthTokens | null {
        const tokensStr = localStorage.getItem('auth_tokens');
        return tokensStr ? JSON.parse(tokensStr) : null;
    }

    private clearTokens(): void {
        localStorage.removeItem('auth_tokens');
    }
}
