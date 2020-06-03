import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

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
}
