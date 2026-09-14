import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ClientService } from './client.service';
import { Client } from './dto/client.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}
  @Post()
  @UseGuards(AuthGuard)
  async addClient(@Body() client: Client) {
    await this.clientService.addClient(client);
  }
}
