import { Field, InputType } from '@nestjs/graphql';
import { ClientMetaInput } from './client-meta.input';

@InputType()
export class CreateClientInput {
  @Field()
  name: string;

  @Field(returns => ClientMetaInput, { nullable: true })
  meta: ClientMetaInput;

  @Field(returns => [String])
  redirect: string[];

  @Field({ defaultValue: false })
  firstParty: boolean;
}
