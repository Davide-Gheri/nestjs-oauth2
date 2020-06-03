import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

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
  password: string;

  @IsNotEmpty()
  @IsString()
  passwordConfirm: string;
}
