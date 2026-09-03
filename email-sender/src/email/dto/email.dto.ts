export class EmailDto {
  constructor(email: string, file: any) {
    this.email = email;
    this.file = file;
  }
  email: string;
  file: any;
}
