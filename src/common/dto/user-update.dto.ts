import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UserUpdateDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  name?: string;
}
