import React, {
    createContext,
    useState,
    useContext,
    useEffect
} from 'react';
import { AuthService } from '../domain/service/auth_service';
import { User } from '../domain/models/user';

// Create context type
interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    signUp: ({ email, password }: { email: string, password: string }) => Promise<User | null>;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    checkAuthState: () => Promise<void>;
    resetPasswordForEmail: (email: string) => Promise<boolean>;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Component
export const AuthProvider: React.FC<{
    children: React.ReactNode,
    authService: AuthService
}> = ({ children, authService: authService }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check initial auth state on mount
    useEffect(() => {
        checkAuthState();
    }, [authService]);

    const checkAuthState = async () => {
        try {
            const currentUser = await authService.getUser();
            setUser(currentUser);
        } catch (error) {
            console.error('Initial auth check failed', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Auth methods
    const signUp = async ({ email, password }: { email: string, password: string }) => {
        const newUser = await authService.signup(email, password);
        setUser(newUser);
        return newUser;
    };

    const signIn = async (email: string, password: string) => {
        const loggedInUser = await authService.login(email, password);
        setUser(loggedInUser);
    };

    const signOut = async () => {
        await authService.logout();
        setUser(null);
    };

    const resetPasswordForEmail = async (email: string) => {
        return await authService.resetPassword(email);
    };

    // Provide context value
    const contextValue: AuthContextType = {
        user,
        isAuthenticated: !!user,
        isLoading,
        signUp,
        signIn,
        signOut,
        checkAuthState,
        resetPasswordForEmail
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
};

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};