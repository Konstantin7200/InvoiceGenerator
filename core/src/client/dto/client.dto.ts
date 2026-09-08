import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class Client {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  companyEmail: string;

  @IsString()
  @IsNotEmpty()
  companyName: string;

  @IsEmail()
  email: string;
}
