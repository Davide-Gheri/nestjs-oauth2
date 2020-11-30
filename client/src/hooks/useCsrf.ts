import { useAppData } from './useAppdata';

export const useCsrf = () => useAppData()?.csrfToken;
