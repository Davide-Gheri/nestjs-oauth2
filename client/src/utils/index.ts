export * from './async-load';
export * from './get-client-logo';
export * from './remove-falsy';
export * from './enum-maps';
export * from './userCan';

export const capitalize = (str: string) => str && str.replace(/(?:^|\s)\S/g, (a) => a.toUpperCase());

