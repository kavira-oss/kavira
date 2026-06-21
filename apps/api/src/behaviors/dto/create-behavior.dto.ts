import { IsString, MinLength, IsOptional, IsNotEmpty } from 'class-validator';

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
