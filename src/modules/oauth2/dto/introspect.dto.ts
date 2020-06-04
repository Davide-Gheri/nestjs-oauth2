import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TokenType } from '@app/modules/oauth2/constants';

export class IntrospectDto {
  @IsNotEmpty()
  @IsString()
  token: string;

  @IsOptional()
  @IsString()
  client_id?: string;

  @IsOptional()
  @IsString()
  client_secret?: string;

  @IsOptional()
  @IsEnum(TokenType)
  token_type_hint?: TokenType;
}

