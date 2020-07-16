import { useLocation } from 'react-router';
import { Action, useMutation } from 'react-fetching-library';
import { useForm } from 'react-hook-form';
import { useCallback, useEffect } from 'react';

export interface TfaData {
  code: string;
  remember?: boolean;
}

const tfaAction = (query?: Record<string, any>) => (body: TfaData): Action => ({
  method: 'POST',
  endpoint: `/auth/tfa?redirect_uri=${encodeURIComponent(query?.redirect_uri || '/')}`,
  body,
});

export const useTfaForm = (remember = false) => {
  const { query } = useLocation();
  const { loading, payload, error, mutate } = useMutation(tfaAction(query));
  const { handleSubmit, setError, ...form } = useForm<TfaData>({
    defaultValues: {
      remember,
    },
  });

  const onSubmit = useCallback((data: TfaData) => {
    mutate(data)
      .then(value => {
        if (!value.error) {
          window.location.href = value.payload.returnTo || '/';
        }
      });
  }, [mutate]);

  useEffect(() => {
    if (error) {
      const { message = 'invalid OTP code' } = payload;
      setError([{
        name: 'code',
        type: 'network',
        message,
      }])
    }
  }, [error, payload, setError]);

  return {
    onSubmit: handleSubmit(onSubmit),
    ...form,
    loading,
  }
}
