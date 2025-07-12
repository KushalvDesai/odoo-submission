'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN_MUTATION, REGISTER_MUTATION, ME_QUERY } from '@/lib/graphql-queries';
import { User, AuthContextType } from '@/lib/types';
import apolloClient from '@/lib/apollo-client';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // GraphQL mutations
  const [loginMutation] = useMutation(LOGIN_MUTATION);
  const [registerMutation] = useMutation(REGISTER_MUTATION);

  // Check if user is logged in on app start
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // If token exists, try to fetch user data
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, []);

  // Function to fetch user data
  const fetchUserData = async () => {
    try {
      const { data } = await apolloClient.query({
        query: ME_QUERY,
        errorPolicy: 'all',
      });
      
      if (data?.me) {
        setUser(data.me);
      } else {
        // If no user data, remove invalid token
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      const { data, errors } = await loginMutation({
        variables: { email, password },
      });

      if (errors) {
        throw new Error(errors[0]?.message || 'Login failed');
      }

      if (data?.login) {
        localStorage.setItem('token', data.login);
        // Fetch user data after successful login
        await fetchUserData();
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      const { data, errors } = await registerMutation({
        variables: { name, email, password },
      });

      if (errors) {
        throw new Error(errors[0]?.message || 'Registration failed');
      }

      if (data?.register) {
        localStorage.setItem('token', data.register);
        // Fetch user data after successful registration
        await fetchUserData();
      }
    } catch (error: any) {
      console.error('Register error:', error);
      throw new Error(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const logout = (): void => {
    localStorage.removeItem('token');
    setUser(null);
    // Clear Apollo cache
    apolloClient.clearStore();
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
