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
  @IsEnum(ResponseModes, { message: `response_mode must be one of: ${Object.values(ResponseModes)}` })
  response_mode: ResponseModes = ResponseModes.query;

  @IsNotEmpty()
  @IsEnum(ResponseTypes, { message: `response_type must be one of: ${Object.values(ResponseTypes)}` })
  response_type: ResponseTypes;

  @IsNotEmpty()
  @IsString()
  redirect_uri: string;

  @IsOptional()
  @IsEnum(PromptTypes, { message: `prompt must be one of: ${Object.values(PromptTypes)}` })
  prompt: PromptTypes = PromptTypes.consent;

  get scopes() {
    return (this.scope || '').split(' ').filter(Boolean);
  }
}
