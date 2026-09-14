import { IsEmail, IsNumber, IsObject, Min } from 'class-validator';

export class CreateInvoiceDto {
  @IsEmail()
  email!: string;

  @IsObject()
  @IsNumber({}, { each: true })
  @Min(0, { each: true })
  jobs!: Record<string, number>;
}
