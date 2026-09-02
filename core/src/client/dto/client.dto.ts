export class Client {
  constructor(
    firstName: string,
    lastName: string,
    companyEmail: string,
    companyName: string,
    email: string,
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.companyEmail = companyEmail;
    this.companyName = companyName;
    this.email = email;
  }
  firstName: string;
  lastName: string;
  companyEmail: string;
  companyName: string;
  email: string;
}
