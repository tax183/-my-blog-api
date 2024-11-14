import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticlesModule } from './articles/articles.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST || 'localhost',
      port: +process.env.DATABASE_PORT || 3306,
      username: process.env.DATABASE_USER || 'root',
      password: process.env.DATABASE_PASSWORD || '',
      database: process.env.DATABASE_NAME || 'artical',
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // يلتقط جميع الكيانات من المسار المحدد
      synchronize: false,
      logging: false,
    }),
    ArticlesModule, // استيراد ArticlesModule
    UserModule,     // استيراد UserModule
    AuthModule,     // استيراد AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
