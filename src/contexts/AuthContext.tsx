import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "../types/user";
import { LocalStorageService } from "../services/LocalStorageService";
import { AuthService } from '../services/AuthService';
import { useNavigate } from "react-router-dom";

interface AuthContextType {
    currentUser: User | null;
    loading: boolean;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(LocalStorageService.getUser() !== null);

    useEffect(() => {
        const initAuth = async () => {
            try {
                // Check if user is stored in local storage
                const userData = LocalStorageService.getUser();
                const token = LocalStorageService.getToken();

                if (userData && token) {
                    // Validate token with your backend (optional)
                    //   try {
                    //     const isValid = await AuthService.validateToken(token);
                    //     if (isValid) {
                    //       setCurrentUser(userData);
                    //       setIsAuthenticated(true);
                    //     } else {
                    //       // Token invalid, clear storage
                    //       LocalStorageService.clearAll();
                    //     }
                    //   } catch (error) {
                    //     console.error("Token validation error:", error);
                    //     LocalStorageService.clearAll();
                    //   }
                }
            } catch (error) {
                console.error("Auth initialization error:", error);
            } finally {
            }
        };

        initAuth();
    }, []);

 

    const logout = async () => {
        try {
            setLoading(true);
            await AuthService.logout();
            LocalStorageService.clearAll();
            setCurrentUser(null);
            setIsAuthenticated(false);
            navigate("/login");
        } catch (error) {
            console.error("Logout error:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const value = {
        currentUser,
        loading,
        isAuthenticated,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
