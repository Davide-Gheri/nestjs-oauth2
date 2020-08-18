import { SetMetadata } from '@nestjs/common';

export const Scope = (...scope: string[]) => SetMetadata('scope', scope);
