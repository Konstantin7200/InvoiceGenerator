import { IsEmail, IsObject } from 'class-validator';
import { IsValidJobs } from './jobs.validator';

export class CreateInvoiceDto {
  @IsEmail()
  email!: string;

  @IsObject()
  @IsValidJobs()
  jobs!: Record<string, number>;
}
