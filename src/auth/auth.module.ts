import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from './jwt.strategy';  // تأكد من استيراد JwtStrategy
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    UserModule, // تأكد من استيراد UserModule
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'yourDefaultSecretKey', // استخدام المتغير البيئي JWT_SECRET أو مفتاح افتراضي
      signOptions: { expiresIn: '1h' },  // تحديد مدة صلاحية الـ JWT
    }),
  ],
  providers: [AuthService, JwtStrategy],  // إضافة JwtStrategy هنا
  exports: [AuthService],  // تصدير AuthService ليكون متاحًا في باقي الـ modules
})
export class AuthModule {}
