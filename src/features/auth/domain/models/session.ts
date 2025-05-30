import { User } from "./user";

export interface Session {
    access_token: string
    refresh_token: string
    expires_in: number;
    expires_at?: number;
    user: User;
}