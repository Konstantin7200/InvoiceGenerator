export class PdfDto {
  constructor(
    email: string,
    firstName: string,
    lastName: string,
    companyEmail: string,
    companyName: string,
    jobs: Record<string, number>,
  ) {
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.jobs = jobs;
    this.companyName = companyName;
    this.companyEmail = companyEmail;
  }
  email: string;
  firstName: string;
  lastName: string;
  companyEmail: string;
  companyName: string;
  jobs: Record<string, number>;
}
