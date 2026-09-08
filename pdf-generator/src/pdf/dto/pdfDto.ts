import { IsEmail, IsNotEmpty, IsObject, IsString } from 'class-validator';

export class PdfDto {
  @IsEmail()
  email: string;

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

  @IsObject()
  jobs: Record<string, number>;
}
