import { IsString, MinLength, IsOptional } from 'class-validator';

export class CreateBehaviorDto {
  @IsString()
  userId: string;

  @IsString()
  @MinLength(1)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;
}
