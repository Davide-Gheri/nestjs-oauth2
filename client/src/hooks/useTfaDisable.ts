import { useMutation } from '@apollo/client';
import { DisableTfaDocument, DisableTfaMutation } from '../generated/graphql';
import { useCallback } from 'react';
import { useSnackbar } from 'notistack';

export const useTfaDisable = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [mutate, { loading }] = useMutation<DisableTfaMutation>(DisableTfaDocument);

  const disableTfa = useCallback(async () => {
    try {
      const result = await mutate();
      if (result.data?.disableTfa) {
        enqueueSnackbar('Two factor authentication disabled', {
          variant: 'info',
        });
      }
      return result.data?.disableTfa;
    } catch (e) {
      console.log(e);
      enqueueSnackbar(e.message, {
        variant: 'error',
      });
    }
  }, []);

  return {
    disableTfa,
    loading,
  }
}
