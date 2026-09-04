import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class EmailDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  file: string;
}
