import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ResponseModes, TokenType } from '@app/modules/oauth2/constants';

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
  @IsEnum(TokenType, { message: `token_type_hint must be one of: ${Object.values(TokenType)}` })
  token_type_hint?: TokenType;
}

