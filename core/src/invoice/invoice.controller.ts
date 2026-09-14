import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/createInvoice.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}
  @Post('/')
  @UseGuards(AuthGuard)
  async createInvoice(@Body() createInvoiceDto: CreateInvoiceDto) {
    await this.invoiceService.createInvoice(
      createInvoiceDto.email,
      createInvoiceDto.jobs,
    );
  }
}
