import { Field, InputType } from '@nestjs/graphql';
import { EmailAddressResolver } from 'graphql-scalars';
import { Confirm } from '@app/utils';
import { Roles } from '@app/modules/auth';

@InputType()
export class CreateUserInput {
  @Field()
  nickname: string;

  @Field({ nullable: true })
  firstName: string;

  @Field({ nullable: true })
  lastName: string;

  @Field(returns => EmailAddressResolver)
  email: string;

  @Field()
  @Confirm()
  password: string;

  @Field()
  passwordConfirm: string;

  @Field(returns => Roles, { defaultValue: Roles.USER })
  role: Roles;
}
