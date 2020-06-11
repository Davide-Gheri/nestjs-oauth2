import { useAppCurrentUser } from './useAppCurrentUser';
import { useForm } from 'react-hook-form';
import { useCallback, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import {
  GetCurrentUserDocument,
  GetCurrentUserQuery,
  UpdateCurrentUserDocument,
  UpdateCurrentUserMutation,
  UpdateCurrentUserMutationVariables, UserDataFragment,
} from '../generated/graphql';
import { useSnackbar } from 'notistack';
import { MutationUpdaterFn } from '@apollo/client/core/watchQueryOptions';

export interface CurrentUserBasicInfoData {
  nickname: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface CurrentUserSecurityData {
  password: string;
  passwordConfirm: string;
  currentPassword: string;
}

const setDefaults = (user?: UserDataFragment | null) => ({
  nickname: user?.nickname || undefined,
  email: user?.email || undefined,
  firstName: user?.firstName || undefined,
  lastName: user?.lastName || undefined,
})

const updateCachedCurrentUser: MutationUpdaterFn<UpdateCurrentUserMutation> = (cache, mutationResult) => {
  try {
    if (mutationResult.data) {
      cache.writeQuery<GetCurrentUserQuery>({
        query: GetCurrentUserDocument,
        data: {
          getCurrentUser: mutationResult.data.updateCurrentUser,
        },
      });
    }
  } catch (e) {
    //
    console.log(e);
  }
}

export const useCurrentUserBasicInfoForm = () => {
  const user = useAppCurrentUser();
  const { enqueueSnackbar } = useSnackbar();
  const [mutate, { loading }] = useMutation<UpdateCurrentUserMutation, UpdateCurrentUserMutationVariables>(UpdateCurrentUserDocument, {
    update: updateCachedCurrentUser,
  });
  const { handleSubmit, reset, ...form } = useForm<CurrentUserBasicInfoData>({
    defaultValues: setDefaults(user),
  });

  useEffect(() => {
    reset(setDefaults(user));
  }, [user, reset]);

  const onSubmit = useCallback((data: CurrentUserBasicInfoData) => {
    (async () => {
      try {
        await mutate({
          variables: { data },
        });
        enqueueSnackbar('Profile updated', {
          variant: 'success',
        });
      } catch (e) {
        console.log(e.message);
        enqueueSnackbar(e.message, {
          variant: 'error',
        });
      }
    })();
  }, [mutate, enqueueSnackbar]);

  return {
    onSubmit: handleSubmit(onSubmit),
    loading,
    ...form,
  }
}

export const useCurrentUserSecurityForm = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [mutate, { loading }] = useMutation<UpdateCurrentUserMutation, UpdateCurrentUserMutationVariables>(UpdateCurrentUserDocument, {
    update: updateCachedCurrentUser,
  });
  const { handleSubmit, ...form } = useForm<CurrentUserSecurityData>();

  const onSubmit = useCallback((data: CurrentUserSecurityData) => {
    (async () => {
      try {
        await mutate({
          variables: { data },
        });
        enqueueSnackbar('Password updated', {
          variant: 'success',
        });
      } catch (e) {
        console.log(e.message);
        enqueueSnackbar(e.message, {
          variant: 'error',
        });
      }
    })();
  }, [mutate, enqueueSnackbar]);

  return {
    onSubmit: handleSubmit(onSubmit),
    loading,
    ...form,
  }
}
