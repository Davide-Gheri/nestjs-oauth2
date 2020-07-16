import {
  GetCurrentUserDocument,
  GetCurrentUserQuery,
  RequestTfaDocument,
  RequestTfaMutation,
  VerifyTfaDocument,
  VerifyTfaMutation, VerifyTfaMutationVariables,
} from '../generated/graphql';
import { useMutation } from '@apollo/client';
import { useCallback, useState } from 'react';
import { useSnackbar } from 'notistack';

export const useTfaRequest = () => {
  const [requestMutate, { loading: requestLoading, error: requestError }] = useMutation<RequestTfaMutation>(RequestTfaDocument);
  const [verifyMutate, { loading: verifyLoading, error: verifyError }] = useMutation<VerifyTfaMutation, VerifyTfaMutationVariables>(VerifyTfaDocument, {
    update: (cache, mutationResult) => {
      try {
        const currentUser = cache.readQuery<GetCurrentUserQuery>({
          query: GetCurrentUserDocument,
        });
        if (currentUser?.getCurrentUser && mutationResult.data?.verifyTfa) {
          const newCurrentUser = {
            ...currentUser.getCurrentUser,
            tfaEnabled: true,
          };
          cache.writeQuery<GetCurrentUserQuery>({
            query: GetCurrentUserDocument,
            data: {
              getCurrentUser: newCurrentUser,
            },
          });
        }
      } catch (e) {
        //
      }
    }
  });
  const [error, setError] = useState<Error | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);

  const requestTfa = useCallback(() => {
    (async () => {
      try {
        const result = await requestMutate();
        setQrCode(result.data!.requestTfa);
      } catch (e) {
        console.log(e);
        setError(e);
      }
    })();
  }, [setQrCode, setError]);

  const verifyTfa = useCallback(async (code: string) => {
    try {
      const result = await verifyMutate({
        variables: { code },
      });
      return result.data?.verifyTfa;
    } catch (e) {
      console.log(e);
      setError(e);
    }
  }, [setError]);

  return {
    requestTfa,
    verifyTfa,
    error: requestError || verifyError || error,
    qrCode,
    requestLoading,
    verifyLoading,
  }
}
