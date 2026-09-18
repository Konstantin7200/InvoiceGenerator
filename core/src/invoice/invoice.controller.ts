import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/createInvoice.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { InternalAuthGuard } from 'src/auth/internal-auth.guard';
import type { InvoiceStatus } from 'src/db/types/invoiceStatus';
import { INVOICE_STATUS_PENDING } from 'src/config/constants';

@Controller('invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}
  @Post('/')
  @UseGuards(AuthGuard)
  async createInvoice(@Body() createInvoiceDto: CreateInvoiceDto) {
    const result = await this.invoiceService.createInvoice(
      createInvoiceDto.email,
      createInvoiceDto.jobs,
    );
    return {
      id: result.id,
      status: INVOICE_STATUS_PENDING,
      ...(result.duplicate && { duplicate: true }),
    };
  }
  @Get(':id')
  async getInvoiceStatus(@Param('id') id: string) {
    const result = await this.invoiceService.getInvoiceStatus(id);
    return { id: id, status: result };
  }
  @Get('internal/:id')
  @UseGuards(InternalAuthGuard)
  async getInvoiceStatusById(@Param('id') id: string) {
    const result = await this.invoiceService.getInvoiceStatusById(Number(id));
    return { status: result };
  }
  @Patch('internal/:id')
  @UseGuards(InternalAuthGuard)
  async updateInvoiceStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: InvoiceStatus,
  ) {
    await this.invoiceService.updateStatus(id, status);
  }
  @Patch('cron/expire-stale')
  @UseGuards(InternalAuthGuard)
  async expireStaleInvoices() {
    const count = await this.invoiceService.expireStaleInvoices();
    return { expired: count };
  }
}
