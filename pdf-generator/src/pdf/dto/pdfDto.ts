import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

class JobItem {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  amount: number;
}

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

  @IsArray()
  @ValidateNested({ each: true })
  jobs: JobItem[];

  @IsNumber()
  total: number;

  @IsString()
  @IsNotEmpty()
  invoiceDate: string;
}
