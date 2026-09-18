import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { DatabaseModule } from 'src/db/db.module';
import { AuthGuard } from './auth.guard';
import { InternalAuthGuard } from './internal-auth.guard';

@Module({
  imports: [DatabaseModule],
  providers: [AuthService, AuthGuard, InternalAuthGuard],
  exports: [AuthService, AuthGuard, InternalAuthGuard],
})
export class AuthModule {}
