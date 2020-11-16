import { Field, InputType } from '@nestjs/graphql';
import { EmailAddressResolver } from 'graphql-scalars';
import { IsNotEmpty, IsOptional, ValidateIf } from 'class-validator';
import { Confirm } from '@app/utils';

@InputType()
export class UpdateCurrentUserInput {
  @Field({ nullable: true })
  nickname: string;

  @Field({ nullable: true })
  firstName: string;

  @Field({ nullable: true })
  lastName: string;

  @Field(returns => EmailAddressResolver, { nullable: true })
  email: string;

  @IsOptional()
  @Confirm()
  @Field({ nullable: true })
  password: string;

  @ValidateIf((o: UpdateCurrentUserInput) => !!o.password)
  @IsNotEmpty()
  @Field({ nullable: true })
  passwordConfirm: string;

  @ValidateIf((o: UpdateCurrentUserInput) => !!o.password)
  @IsNotEmpty()
  @Field({ nullable: true })
  currentPassword: string;
}
