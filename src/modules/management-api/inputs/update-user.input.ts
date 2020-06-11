import { Field, InputType } from '@nestjs/graphql';
import { EmailAddressResolver } from 'graphql-scalars';
import { Roles } from '@app/modules/auth';

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  nickname: string;

  @Field({ nullable: true })
  firstName: string;

  @Field({ nullable: true })
  lastName: string;

  @Field(returns => EmailAddressResolver, { nullable: true })
  email: string;

  @Field(returns => Roles, { nullable: true })
  role: Roles;
}
