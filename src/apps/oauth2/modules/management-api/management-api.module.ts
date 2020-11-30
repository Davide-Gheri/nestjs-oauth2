import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OAuthClient, User } from '@app/entities';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientResolver, CurrentUserResolver, DashboardResolver, UserResolver } from './resolvers';
import { GraphqlFactory } from './graphql.factory';
import { AccessControlModule } from 'nest-access-control';
import { roles } from '@app/modules/auth';
import { APP_FILTER } from '@nestjs/core';
import { GraphqlFilter } from '@app/modules/management-api/filters';
import { SessionService, TfaService } from '@app/modules/management-api/services';
import { UserModule } from '@app/modules/user';

@Module({
  imports: [
    ConfigModule,
    UserModule,
    AccessControlModule.forRoles(roles),
    TypeOrmModule.forFeature([
      OAuthClient, User,
    ]),
    GraphQLModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useClass: GraphqlFactory,
    }),
  ],
  providers: [
    SessionService,
    TfaService,
    ClientResolver,
    UserResolver,
    CurrentUserResolver,
    DashboardResolver,
    {
      provide: APP_FILTER,
      useClass: GraphqlFilter,
    },
  ],
})
export class ManagementApiModule {}
