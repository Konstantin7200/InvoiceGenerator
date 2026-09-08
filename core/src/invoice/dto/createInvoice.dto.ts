import { IsEmail, IsObject } from 'class-validator';

export class CreateInvoiceDto {
  @IsEmail()
  email: string;

  @IsObject()
  jobs: Record<string, number>;
}
