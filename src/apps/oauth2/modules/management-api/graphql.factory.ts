import { GqlModuleOptions, GqlOptionsFactory, registerEnumType } from '@nestjs/graphql';
import { Injectable } from '@nestjs/common';
import { EmailAddressResolver, JSONResolver } from 'graphql-scalars';
import { GrantTypes, ResponseModes, ResponseTypes, TokenAuthMethod } from '@app/modules/oauth2/constants';
import { Roles } from '@app/modules/auth';

@Injectable()
export class GraphqlFactory implements GqlOptionsFactory {
  async createGqlOptions(): Promise<GqlModuleOptions> {
    this.registerEnums();

    return {
      autoSchemaFile: 'schema.graphql',
      path: '/api/graphql',
      context: this.makeContext,
      resolvers: {
        JSON: JSONResolver,
        EmailAddress: EmailAddressResolver,
      },
    }
  }

  private registerEnums() {
    registerEnumType(GrantTypes, {
      name: 'GrantTypes',
    });
    registerEnumType(ResponseTypes, {
      name: 'ResponseTypes',
    });
    registerEnumType(ResponseModes, {
      name: 'ResponseModes',
    });
    registerEnumType(TokenAuthMethod, {
      name: 'TokenAuthMethod',
    });
    registerEnumType(Roles, {
      name: 'Roles',
    });
  }

  makeContext = ({ req }) => {
    return { req }
  }
}
