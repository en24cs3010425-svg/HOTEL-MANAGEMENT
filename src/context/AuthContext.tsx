import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types/index.ts';
import { api, getStoredToken, setStoredToken, clearStoredToken } from '../services/api.ts';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string; phone?: string; address?: string; role?: string }) => Promise<void>;
  demoLogin: (role: 'admin' | 'staff' | 'guest') => Promise<void>;
  logout: () => void;
  updateProfile: (profile: Partial<User> & { currentPassword?: string; newPassword?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getStoredToken();
    if (token) {
      api.auth.me()
        .then(res => {
          if (res.success && res.user) {
            setUser(res.user);
          } else {
            clearStoredToken();
            setUser(null);
          }
        })
        .catch(() => {
          clearStoredToken();
          setUser(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.auth.login({ email, password });
    if (res.token && res.user) {
      setStoredToken(res.token);
      setUser(res.user);
    }
  };

  const register = async (data: { name: string; email: string; password: string; phone?: string; address?: string; role?: string }) => {
    const res = await api.auth.register(data);
    if (res.token && res.user) {
      setStoredToken(res.token);
      setUser(res.user);
    }
  };

  const demoLogin = async (demoRole: 'admin' | 'staff' | 'guest') => {
    setIsLoading(true);
    try {
      const res = await api.auth.demoLogin(demoRole);
      if (res.token && res.user) {
        setStoredToken(res.token);
        setUser(res.user);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearStoredToken();
    setUser(null);
  };

  const updateProfile = async (profile: Partial<User> & { currentPassword?: string; newPassword?: string }) => {
    const res = await api.auth.updateProfile(profile);
    if (res.user) {
      setUser(res.user);
    }
  };

  const role: UserRole = user?.role || 'guest';
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        isLoading,
        login,
        register,
        demoLogin,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
