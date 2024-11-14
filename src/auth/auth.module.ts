import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    UserModule, // تأكد من استيراد UserModule
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'yourSecretKey', // استخدام المتغير البيئي JWT_SECRET
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
