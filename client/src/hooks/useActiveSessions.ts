import { useMutation, useQuery } from '@apollo/client';
import {
  DeleteSessionDocument,
  DeleteSessionMutation, DeleteSessionMutationVariables,
  GetActiveSessionsDocument,
  GetActiveSessionsQuery,
} from '../generated/graphql';
import { dummySessions } from '../utils/dummy';
import { useCallback } from 'react';
import { useSnackbar } from 'notistack';

export const useActiveSessions = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { data, loading } = useQuery<GetActiveSessionsQuery>(GetActiveSessionsDocument);
  const [mutate] = useMutation<DeleteSessionMutation, DeleteSessionMutationVariables>(DeleteSessionDocument);

  const deleteSession = useCallback(async (id: string) => {
    try {
      await mutate({
        variables: { id },
        update: (cache, mutationResult) => {
          try {
            const activeSessions = cache.readQuery<GetActiveSessionsQuery>({
              query: GetActiveSessionsDocument,
            });
            if (activeSessions?.activeSessions && mutationResult.data) {
              const newSessions = [
                ...activeSessions.activeSessions.filter(s => s.sessionId !== id),
              ];
              cache.writeQuery<GetActiveSessionsQuery>({
                query: GetActiveSessionsDocument,
                data: {
                  activeSessions: newSessions,
                },
              });
            }
          } catch (e) {
            //
          }
        }
      });
      enqueueSnackbar('Session ended', {
        variant: 'success',
      });
    } catch (e) {
      console.log(e);
      enqueueSnackbar(e.message, {
        variant: 'error',
      });
    }
  }, [mutate]);

  const currentSession = process.env.NODE_ENV === 'development' ? dummySessions[0].sessionId : window.__APP_DATA__.currentSession;

  return {
    sessions: data?.activeSessions,
    loading,
    currentSession,
    deleteSession,
  }
}
