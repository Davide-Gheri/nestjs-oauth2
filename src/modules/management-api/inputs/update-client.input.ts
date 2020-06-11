import { Field, InputType } from '@nestjs/graphql';
import { ClientMetaInput } from './client-meta.input';

@InputType()
export class UpdateClientInput {
  @Field({ nullable: true })
  name: string;

  @Field(returns => ClientMetaInput, { nullable: true })
  meta: ClientMetaInput;

  @Field(returns => [String], { nullable: true })
  redirect: string[];

  @Field(returns => [String], { nullable: true })
  grantTypes: string[];

  @Field(returns => [String], { nullable: true })
  responseTypes: string[];

  @Field(returns => [String], { nullable: true })
  responseModes: string[];

  @Field(returns => [String], { nullable: true })
  authMethods: string[];

  @Field(returns => Boolean, { nullable: true })
  firstParty: boolean;

  @Field(returns => [String], { nullable: true })
  scopes: string[];
}
