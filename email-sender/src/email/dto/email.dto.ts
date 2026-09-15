import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class EmailDto {
  @IsNumber()
  invoiceId!: number;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  pdfKey: string;
}
