import { useSnackbar } from 'notistack';
import { useMutation } from '@apollo/client';
import {
  CreateUserDocument,
  CreateUserMutation,
  CreateUserMutationVariables,
  DeleteUserDocument,
  DeleteUserMutation,
  DeleteUserMutationVariables,
  GetUsersDocument,
  GetUsersQuery, Roles,
  UpdateUserDocument,
  UpdateUserMutation,
  UpdateUserMutationVariables,
  UserDataFragment,
} from '../generated/graphql';
import { useForm } from 'react-hook-form';
import { useCallback } from 'react';
import { removeFalsy } from '../utils';

export interface UserNewData {
  nickname: string;
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  passwordConfirm: string;
  role: Roles,
}

export const useUserNewForm = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [mutate, { loading }] = useMutation<CreateUserMutation, CreateUserMutationVariables>(CreateUserDocument, {
    update: (cache, mutationResult) => {
      try {
        const users = cache.readQuery<GetUsersQuery>({ query: GetUsersDocument });
        if (users?.getUsers && mutationResult.data) {
          const newUsers = [
            ...users.getUsers.items,
            mutationResult.data.createUser,
          ];
          cache.writeQuery<GetUsersQuery>({
            query: GetUsersDocument,
            data: {
              getUsers: {
                items: newUsers,
                paginationInfo: users.getUsers.paginationInfo,
              },
            },
          });
        }
      } catch (e) {
        console.log(e);
        //
      }
    },
  });
  const { handleSubmit, setError, ...form } = useForm<UserNewData>({
    defaultValues: {},
  });

  const onSubmit = useCallback((data: UserNewData) => {
    (async () => {
      try {
        await mutate({
          variables: {
            data,
          }
        });
        enqueueSnackbar('User created', {
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

export const useUserUpdateForm = (user: UserDataFragment) => {
  const { enqueueSnackbar } = useSnackbar();
  const [mutate, { loading }] = useMutation<UpdateUserMutation, UpdateUserMutationVariables>(UpdateUserDocument);
  const { handleSubmit, ...form } = useForm<Partial<UserNewData>>({
    defaultValues: {
      nickname: user.nickname,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email,
      role: user.role,
    },
  });

  const onSubmit = useCallback((data: Partial<UserNewData>) => {
    (async () => {
      try {
        await mutate({
          variables: {
            id: user.id,
            data: removeFalsy(data),
          },
        });
        enqueueSnackbar('User updated', {
          variant: 'success',
        });
      } catch (e) {
        console.log(e.message);
        enqueueSnackbar(e.message, {
          variant: 'error',
        });
      }
    })();
  }, [mutate, user.id, enqueueSnackbar]);

  return {
    onSubmit: handleSubmit(onSubmit),
    loading,
    ...form,
  }
}

export const useDeleteUser = (id: string) => {
  const { enqueueSnackbar } = useSnackbar();
  const [mutate, { loading, called }] = useMutation<DeleteUserMutation, DeleteUserMutationVariables>(DeleteUserDocument, {
    variables: { id },
    update: (cache, mutationResult) => {
      try {
        const clients = cache.readQuery<GetUsersQuery>({ query: GetUsersDocument });
        if (clients?.getUsers && mutationResult.data) {
          const newUsers = [
            ...clients.getUsers.items.filter(u => u.id !== id),
          ];
          cache.writeQuery<GetUsersQuery>({
            query: GetUsersDocument,
            data: {
              getUsers: {
                items: newUsers,
                paginationInfo: clients.getUsers.paginationInfo,
              },
            },
          });
        }
      } catch (e) {
        console.log(e);
        //
      }
    }
  });

  const onSubmit = useCallback(() => {
    (async () => {
      try {
        await mutate();
        enqueueSnackbar('User deleted', {
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
    onSubmit,
    loading,
    called,
  }
}
