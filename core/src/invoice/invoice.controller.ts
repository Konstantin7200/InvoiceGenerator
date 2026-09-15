import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/createInvoice.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { InternalAuthGuard } from 'src/auth/internal-auth.guard';
import { InvoiceStatus } from 'src/db/types/invoiceStatus';

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
    return { id: result.id, status: 'pending' };
  }
  @Get(':id')
  async getInvoiceStatus(@Param('id') id: string) {
    const result = await this.invoiceService.getInvoiceStatus(id);
    return result;
  }
  @Patch('internal/:id')
  @UseGuards(InternalAuthGuard)
  async updateInvoiceStatus(
    @Param('id') id: string,
    @Body('status') status: InvoiceStatus,
  ) {
    await this.invoiceService.updateStatus(Number(id), status);
  }
}
