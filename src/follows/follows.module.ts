
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FollowsService } from './follows.service';
import { FollowsController } from './follows.controller';
import { Follow } from 'src/follows/entities/follow.entity';
import { AuthModule } from 'src/auth/auth.module';
import { User } from 'src/user/entities/user.entity';  // تأكد من استيراد User entity

@Module({
  imports: [TypeOrmModule.forFeature([Follow, User]), AuthModule],  // تأكد من إضافة Follow و User هنا
  providers: [FollowsService],
  controllers: [FollowsController],
})
export class FollowsModule {}