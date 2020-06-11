import { registerAs } from '@nestjs/config';
import { GqlModuleOptions } from '@nestjs/graphql';

export const management = registerAs('management', () => ({
}));
