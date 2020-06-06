import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Confirm } from '@app/utils';

/**
 * Register payload
 */
export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  nickname: string;

  @IsOptional()
  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Confirm()
  password: string;

  @IsNotEmpty()
  @IsString()
  passwordConfirm: string;
}
