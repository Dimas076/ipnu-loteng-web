"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '@/lib/axios';
import Cookies from 'js-cookie';

interface User {
  id: number;
  name: string;
  email: string;
  roles: any[];
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    const token = Cookies.get('auth_token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      // Jika ini adalah token simulasi (karena backend belum siap)
      if (token === "dummy_token_123") {
        setUser({ id: 1, name: "Admin IPNU", email: "admin@ipnuloteng.or.id", roles: ['Super Admin'] });
        return;
      }
      
      const response = await axios.get('/api/me');
      setUser(response.data.data);
    } catch (error) {
      console.error("Auth check failed:", error);
      Cookies.remove('auth_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = (token: string, userData: User) => {
    Cookies.set('auth_token', token, { expires: 7 }); // expires in 7 days
    setUser(userData);
  };

  const logout = async () => {
    try {
      await axios.post('/api/logout');
    } catch (error) {
      console.error("Logout API failed:", error);
    } finally {
      Cookies.remove('auth_token');
      setUser(null);
      window.location.href = '/'; // redirect to home
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
