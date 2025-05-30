import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { TokenManagerService } from '../../../features/auth/domain/service/token_manager_service';
import { AuthTokens } from '../../../features/auth/domain/models/auth_tokens';

export class HttpClient {
    private client: AxiosInstance;
    private refreshingPromise: Promise<string | null> | null = null;

    constructor(
        baseURL: string,
        private tokenManager: TokenManagerService,
        private onTokenRefreshFailed: () => void
    ) {
        this.client = axios.create({
            baseURL,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        this.setupInterceptors();
    }

    private setupInterceptors(): void {
        // Request interceptor - add auth token
        this.client.interceptors.request.use(
            (config) => {
                const accessToken = this.tokenManager.getAccessToken();
                if (accessToken) {
                    config.headers.Authorization = `Bearer ${accessToken}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response interceptor - handle token refresh
        this.client.interceptors.response.use(
            (response) => response,
            async (error: AxiosError) => {
                const originalRequest = error.config;
                if (!originalRequest) {
                    return Promise.reject(error);
                }

                // If error is 401 and we haven't tried to refresh the token yet
                if (
                    error.response?.status === 401 &&
                    !originalRequest.headers['X-Retry-After-Refresh']
                ) {
                    if (!this.refreshingPromise) {
                        this.refreshingPromise = this.refreshAccessToken();
                    }

                    try {
                        // Wait for the token refresh
                        const newToken = await this.refreshingPromise;
                        this.refreshingPromise = null;

                        if (!newToken) {
                            throw new Error('Token refresh failed');
                        }

                        // Update the authorization header
                        originalRequest.headers.Authorization = `Bearer ${newToken}`;
                        originalRequest.headers['X-Retry-After-Refresh'] = 'true';

                        // Retry the original request
                        return this.client(originalRequest);
                    } catch (refreshError) {
                        // If refresh fails, call the provided callback
                        this.onTokenRefreshFailed();
                        return Promise.reject(refreshError);
                    }
                }

                return Promise.reject(error);
            }
        );
    }

    private async refreshAccessToken(): Promise<string | null> {
        try {
            const refreshToken = this.tokenManager.getRefreshToken();
            if (!refreshToken) {
                return null;
            }

            // Use a direct axios instance to avoid interceptors loop
            const directClient = axios.create({
                baseURL: this.client.defaults.baseURL,
            });

            const response = await directClient.post<AuthTokens>('/auth/refresh', {
                refreshToken,
            });

            const newTokens = response.data;
            this.tokenManager.setTokens(newTokens);
            return newTokens.accessToken;
        } catch (error) {
            this.tokenManager.clearTokens();
            return null;
        }
    }

    async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.get<T>(url, config);
        return response.data;
    }

    async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.post<T>(url, data, config);
        return response.data;
    }

    async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.put<T>(url, data, config);
        return response.data;
    }

    async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.delete<T>(url, config);
        return response.data;
    }
}
