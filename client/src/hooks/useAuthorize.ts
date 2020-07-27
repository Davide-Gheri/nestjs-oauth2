import { useAppData } from './useAppdata';

export const useAuthorize = () => {
  const { client, scopes } = useAppData();

  return {
    client,
    scopes,
    parsedScopes: scopes.map((scope: string) => ({
      scope,
      label: scopeMapping[scope] || undefined,
    })) as { scope: string; label?: string }[],
  }
}

const scopeMapping: Record<string, any> = {
  openid: 'Access to your profile basic info',
  email: 'Read your email address',
  profile: 'Read your name, nickname and profile image',
  offline_access: undefined, // TODO what to ask?
};
