import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { DatabaseModule } from 'src/db/db.module';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [DatabaseModule],
  providers: [AuthService, AuthGuard],
  exports: [AuthService],
})
export class AuthModule {}
