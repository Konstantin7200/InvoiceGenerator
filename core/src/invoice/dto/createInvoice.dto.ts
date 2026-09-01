export class CreateInvoiceDto {
  constructor(email: string, jobs: Map<string, number>) {
    this.email = email;
    this.jobs = jobs;
  }
  email: string;
  jobs: Map<string, number>;
}
