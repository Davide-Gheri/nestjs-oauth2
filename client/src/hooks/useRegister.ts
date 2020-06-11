import { useForm } from 'react-hook-form';
import { useCallback, useEffect } from 'react';
import { Action, useMutation } from 'react-fetching-library';
import { useLocation } from 'react-router';

export interface RegisterData {
  nickname: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

const registerAction = (query?: Record<string, any>) => (body: RegisterData): Action => ({
  method: 'POST',
  endpoint: `/auth/register?redirect_uri=${encodeURIComponent(query?.redirect_uri || '/')}`,
  body,
})

export const useRegister = () => {
  const { query } = useLocation();
  const { mutate, loading, payload, error } = useMutation(registerAction(query));
  const { handleSubmit, setError, ...form } = useForm<RegisterData>();

  const onSubmit = useCallback((data: RegisterData) => {
    mutate(data)
    .then(value => {
      if (!value.error) {
        window.location.href = value.payload.returnTo || '/';
      }
    })
  }, [mutate]);

  useEffect(() => {
    if (error) {

    }
  }, [error]);

  return {
    onSubmit: handleSubmit(onSubmit),
    ...form,
    loading,
    error,
    payload,
  }
}
