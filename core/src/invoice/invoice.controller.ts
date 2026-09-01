import { Body, Controller, Post } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/createInvoice.dto';

@Controller('invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}
  @Post('/')
  async createInvoice(@Body() createInvoiceDto: CreateInvoiceDto) {
    await this.invoiceService.createInvoice(
      createInvoiceDto.email,
      createInvoiceDto.jobs,
    );
  }
}
