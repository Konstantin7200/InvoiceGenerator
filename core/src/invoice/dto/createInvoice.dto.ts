export class CreateInvoiceDto {
  constructor(email: string, jobs: Record<string, number>) {
    this.email = email;
    this.jobs = jobs;
  }
  email: string;
  jobs: Record<string, number>;
}
