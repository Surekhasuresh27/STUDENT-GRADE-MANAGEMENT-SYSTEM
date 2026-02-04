import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthState } from '../types';
import * as authUtils from '../utils/auth';

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, role: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
  });

  useEffect(() => {
    const user = authUtils.getCurrentUser();
    setState({ user, loading: false });
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const user = authUtils.signIn(email, password);
      setState({ user, loading: false });
    } catch (error) {
      throw error;
    }
  };

  const signUp = async (email: string, password: string, role: string, name: string) => {
    try {
      const user = authUtils.signUp(email, password, role, name);
      setState({ user, loading: false });
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    authUtils.signOut();
    setState({ user: null, loading: false });
  };

  return (
    <AuthContext.Provider value={{ ...state, signIn, signUp, signOut }}>
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