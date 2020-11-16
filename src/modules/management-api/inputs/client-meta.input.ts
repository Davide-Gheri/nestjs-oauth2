import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ClientMetaInput {
  @Field({ nullable: true })
  description: string;

  @Field({ nullable: true })
  logo_uri: string;
}
