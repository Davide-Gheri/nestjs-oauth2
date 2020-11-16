import { IsNotEmpty, IsEmail, IsString, IsOptional } from 'class-validator';

/**
 * Login payload
 */
export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;

  @IsOptional()
  remember?: any;
}
