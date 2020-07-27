import { useForm } from 'react-hook-form';
import { useCallback } from 'react';
import { useMutation } from '@apollo/client';
import { removeFalsy } from '../utils';
import {
  ClientDataFragment,
  CreateClientDocument,
  CreateClientMutation,
  CreateClientMutationVariables, DeleteClientDocument, DeleteClientMutation, DeleteClientMutationVariables,
  GetClientsDocument,
  GetClientsQuery,
  UpdateClientDocument,
  UpdateClientMutation,
  UpdateClientMutationVariables,
} from '../generated/graphql';
import { useSnackbar } from 'notistack';

export interface ClientBasicInfoData {
  name: string;
  meta: {
    description: string;
    logo_uri: string;
  };
}

export interface ClientSettingsData {
  redirect: string[];
  grantTypes: string[];
  responseTypes: string[];
  responseModes: string[];
  authMethods: string[];
  firstParty: boolean;
  scopes: string[];
}

export type ClientNewForm = ClientBasicInfoData & Pick<ClientSettingsData, 'redirect' | 'firstParty'>;

export const useClientBasicInfoForm = (client: ClientDataFragment) => {
  const { enqueueSnackbar } = useSnackbar();
  const [mutate, { loading }] = useMutation<UpdateClientMutation, UpdateClientMutationVariables>(UpdateClientDocument);
  const { handleSubmit, setError, ...form } = useForm<ClientBasicInfoData>({
    defaultValues: {
      name: client.name || '',
      meta: {
        description: client.meta?.description || '',
        logo_uri: client.meta?.logo_uri || '',
      },
    },
  });

  const onSubmit = useCallback((data: ClientBasicInfoData) => {
    (async () => {
      try {
        await mutate({
          variables: {
            data: removeFalsy(data),
            id: client.id,
          }
        });
        enqueueSnackbar('Client updated', {
          variant: 'success',
        });
      } catch (e) {
        console.log(e.message);
        enqueueSnackbar(e.message, {
          variant: 'error',
        });
      }
    })();
  }, [client.id, mutate, enqueueSnackbar]);

  return {
    onSubmit: handleSubmit(onSubmit),
    loading,
    ...form,
  }
}

export const useClientSettingsForm = (client: ClientDataFragment) => {
  const { enqueueSnackbar } = useSnackbar();
  const [mutate, { loading }] = useMutation<UpdateClientMutation, UpdateClientMutationVariables>(UpdateClientDocument);
  const { handleSubmit, ...form } = useForm<ClientSettingsData>({
    defaultValues: {
      redirect: (client.redirect || []),
      firstParty: client.firstParty || false,
      grantTypes: client.grantTypes,
      authMethods: client.authMethods,
      responseModes: client.responseModes,
      responseTypes: client.responseTypes,
      scopes: client.scopes,
    },
  });

  const onSubmit = useCallback((data: ClientSettingsData) => {
    (async () => {
      try {
        await mutate({
          variables: {
            id: client.id,
            data,
          }
        });
        enqueueSnackbar('Client updated', {
          variant: 'success',
        });
      } catch (e) {
        console.log(e.message);
        enqueueSnackbar(e.message, {
          variant: 'error',
        });
      }
    })();
  }, [client.id, mutate, enqueueSnackbar]);

  return {
    onSubmit: handleSubmit(onSubmit),
    loading,
    ...form,
  }
}

export const useClientNewForm = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [mutate, loading] = useMutation<CreateClientMutation, CreateClientMutationVariables>(CreateClientDocument, {
    update: (cache, mutationResult) => {
      try {
        const clients = cache.readQuery<GetClientsQuery>({ query: GetClientsDocument });
        if (clients?.getClients && mutationResult.data) {
          const newClients = [
            ...clients.getClients,
            mutationResult.data.createClient,
          ];
          cache.writeQuery<GetClientsQuery>({
            query: GetClientsDocument,
            data: {
              getClients: newClients,
            },
          });
        }
      } catch (e) {
        console.log(e);
        //
      }
    },
  });
  const { handleSubmit, setError, ...form } = useForm<ClientNewForm>({
    defaultValues: {
      firstParty: false,
    },
  });

  const onSubmit = useCallback((data: ClientNewForm) => {
    if (!data.redirect || !data.redirect.length) {
      setError('redirect', 'required', 'Redirect URIs required');
      throw new Error();
    }
    (async () => {
      try {
        await mutate({
          variables: {
            data,
          }
        });
        enqueueSnackbar('Client created', {
          variant: 'success',
        });
      } catch (e) {
        console.log(e.message);
        enqueueSnackbar(e.message, {
          variant: 'error',
        });
      }
    })();
  }, [setError, mutate, enqueueSnackbar]);

  return {
    onSubmit: handleSubmit(onSubmit),
    loading,
    ...form,
  }
}

export const useDeleteClient = (id: string) => {
  const { enqueueSnackbar } = useSnackbar();
  const [mutate, { loading, called }] = useMutation<DeleteClientMutation, DeleteClientMutationVariables>(DeleteClientDocument, {
    variables: { id },
    update: (cache, mutationResult) => {
      try {
        const clients = cache.readQuery<GetClientsQuery>({ query: GetClientsDocument });
        if (clients?.getClients && mutationResult.data) {
          const newClients = [
            ...clients.getClients.filter(c => c.id !== id),
          ];
          cache.writeQuery<GetClientsQuery>({
            query: GetClientsDocument,
            data: {
              getClients: newClients,
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
        enqueueSnackbar('Client deleted', {
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
