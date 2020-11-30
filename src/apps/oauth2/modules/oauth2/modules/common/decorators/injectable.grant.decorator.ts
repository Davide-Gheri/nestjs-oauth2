import { applyDecorators, Injectable, InjectableOptions } from '@nestjs/common';
import { GRANT_TYPE_METADATA } from '../constants';
import { GrantTypes } from '@app/modules/oauth2/constants';

function Grant(grantType: GrantTypes): ClassDecorator {
  return (target: object) => {
    Reflect.defineMetadata(GRANT_TYPE_METADATA, grantType, target);
  };
}

export const InjectableGrant = (grantType: GrantTypes, options?: InjectableOptions) => applyDecorators(
  Injectable(options),
  Grant(grantType),
);
