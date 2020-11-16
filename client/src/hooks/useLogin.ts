import { useForm } from 'react-hook-form';
import { useCallback, useEffect } from 'react';
import { useMutation, Action } from 'react-fetching-library';
import { useLocation } from 'react-router';

export interface LoginData {
  email: string;
  password: string;
  remember: any;
}

const loginAction = (query?: Record<string, any>) => (body: LoginData): Action => ({
  method: 'POST',
  endpoint: `/auth/login?redirect_uri=${encodeURIComponent(query?.redirect_uri || '/')}`,
  body,
})

export const useLogin = () => {
  const { query } = useLocation();
  const { loading, payload, error, mutate } = useMutation(loginAction(query));
  const { handleSubmit, setError, ...form } = useForm<LoginData>({
    defaultValues: {
      remember: false,
    },
  });

  const onSubmit = useCallback((data: LoginData) => {
    mutate(data)
      .then(value => {
        if (!value.error) {
          window.location.href = value.payload.returnTo || '/';
        }
      })
  }, [mutate]);

  useEffect(() => {
    if (error) {
      const { message = 'credentials does not match' } = payload;
      setError([{
        name: 'email',
        type: 'network',
        message,
      }, {
        name: 'password',
        type: 'network',
      }])
    }
  }, [error, payload, setError]);

  return {
    onSubmit: handleSubmit(onSubmit),
    ...form,
    loading,
  }
}
