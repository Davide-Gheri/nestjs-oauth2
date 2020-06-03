import { IsArray, IsOptional, IsString } from 'class-validator';

export class ConsentDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  scopes: string[];
}
