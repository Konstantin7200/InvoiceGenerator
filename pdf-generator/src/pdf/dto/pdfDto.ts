import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class JobItem {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsNumber()
  @Min(0, { each: true })
  amount!: number;
}

export class PdfDto {
  @IsNumber()
  invoiceId!: number;

  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @IsEmail()
  companyEmail!: string;

  @IsString()
  @IsNotEmpty()
  companyName!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => JobItem)
  jobs!: JobItem[];

  @IsNumber()
  total!: number;

  @IsString()
  @IsNotEmpty()
  invoiceDate!: string;
}
