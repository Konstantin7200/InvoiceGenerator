import { IsEmail, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

class JobItem {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsNumber()
  @Min(0, { each: true })
  amount!: number;
}

export class CreateInvoiceDto {
  @IsEmail()
  email!: string;

  jobs!: JobItem[];
}
