import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // استيراد TypeOrmModule مع كيان User
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], // تصدير UserService إذا كان سيتم استخدامه في وحدات أخرى
})
export class UserModule {}
