import { IsEnum, IsNotEmpty, IsOptional, IsString, MinLength, ValidateIf } from 'class-validator';
import { PromptTypes, ResponseModes, ResponseTypes } from '../constants';

export class AuthorizeDto {
  @IsNotEmpty()
  @IsString()
  client_id: string;

  @IsOptional()
  @IsString()
  scope: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  state: string;

  @IsOptional()
  @IsString()
  code_challenge: string;

  @ValidateIf((o: AuthorizeDto) => !!o.code_challenge)
  @IsNotEmpty()
  @IsString()
  code_challenge_method: string;

  @IsOptional()
  @IsEnum(ResponseModes)
  response_mode: ResponseModes = ResponseModes.QUERY;

  @IsNotEmpty()
  @IsEnum(ResponseTypes)
  response_type: ResponseTypes;

  @IsNotEmpty()
  @IsString()
  redirect_uri: string;

  @IsOptional()
  @IsEnum(PromptTypes)
  prompt: PromptTypes = PromptTypes.CONSENT;

  get scopes() {
    return (this.scope || '').split(' ').filter(Boolean);
  }
}
