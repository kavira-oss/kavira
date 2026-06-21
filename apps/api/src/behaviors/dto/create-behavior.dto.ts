import { IsString, IsNotEmpty, MinLength, IsOptional } from 'class-validator';

export class CreateBehaviorDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @MinLength(1)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;
}
