import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class RegisterDto {
    @ApiProperty({ example: 'user@example.com' })
    @IsEmail()
    @MaxLength(255)
    email: string;

    @ApiProperty({ minLength: 8, maxLength: 128 })
    @IsString()
    @MinLength(8)
    @MaxLength(128)
    password: string;

    @ApiProperty({ example: 'Jane' })
    @IsString()
    @MinLength(1)
    @MaxLength(255)
    @IsOptional()
    name: string;

    @ApiProperty({ example: 'Doe' })
    @IsString()
    @MinLength(1)
    @MaxLength(255)
    username: string;
}