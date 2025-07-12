
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN_MUTATION, SIGNUP_MUTATION } from '../graphql/mutations';
import { useAuth } from '../contexts/AuthContext';

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignupCredentials {
  username: string;
  email: string;
  password: string;
}

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login: authLogin } = useAuth();

  const [loginMutation] = useMutation(LOGIN_MUTATION, {
    errorPolicy: 'all',
  });

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await loginMutation({
        variables: credentials,
      });

      if (data?.login) {
        authLogin(data.login.token, data.login.user);
        setLoading(false);
        return true;
      }

      setLoading(false);
      return false;
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Login failed');
      return false;
    }
  };

  return {
    login,
    loading,
    error,
  };
};

export const useSignup = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login: authLogin } = useAuth();

  const [signupMutation] = useMutation(SIGNUP_MUTATION, {
    errorPolicy: 'all',
  });

  const signup = async (credentials: SignupCredentials): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await signupMutation({
        variables: credentials,
      });

      if (data?.signup) {
        authLogin(data.signup.token, data.signup.user);
        setLoading(false);
        return true;
      }

      setLoading(false);
      return false;
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Signup failed');
      return false;
    }
  };

  return {
    signup,
    loading,
    error,
  };
};
