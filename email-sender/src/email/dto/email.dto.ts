export class EmailDto {
  constructor(email: string, file: Buffer) {
    this.email = email;
    this.file = file;
  }
  email: string;
  file: Buffer;
}
