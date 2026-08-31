import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';
import { authApi } from '../api/auth.api';
import type { LoginDto, RegisterDto } from '../api/auth.api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginDto) => Promise<void>;
  register: (userData: RegisterDto) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('taskmind_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // On app load, check if token exists and auto-login
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('taskmind_token');
      if (storedToken) {
        try {
          const res = await authApi.getMe();
          setUser(res.data.user);
        } catch (error) {
          localStorage.removeItem('taskmind_token');
          localStorage.removeItem('taskmind_user');
          setUser(null);
          setToken(null);
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = async (credentials: LoginDto) => {
    const res = await authApi.login(credentials);
    const { user, token } = res.data;
    localStorage.setItem('taskmind_token', token);
    localStorage.setItem('taskmind_user', JSON.stringify(user));
    setUser(user);
    setToken(token);
  };

  const register = async (userData: RegisterDto) => {
    const res = await authApi.register(userData);
    const { user, token } = res.data;
    localStorage.setItem('taskmind_token', token);
    localStorage.setItem('taskmind_user', JSON.stringify(user));
    setUser(user);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem('taskmind_token');
    localStorage.removeItem('taskmind_user');
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};