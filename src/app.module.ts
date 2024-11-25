import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticlesModule } from './articles/articles.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { LikesModule } from './likes/likes.module';
import { CommentsModule } from './comments/comments.module';
import { FollowsModule } from './follows/follows.module';
import { ConfigModule } from '@nestjs/config';
import * as dotenv from 'dotenv';
const entitiesPath = __dirname + '/**/*.entity{.ts,.js}';

dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
  //
      type: 'postgres',
      host: process.env.DB_HOST,
      port:  Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME, //'postgres',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      entities: [entitiesPath],
      synchronize: false,
      migrationsRun: true,
      logging: false,
    }),
    ArticlesModule, // استيراد ArticlesModule
    UserModule,     // استيراد UserModule
    AuthModule, LikesModule, CommentsModule, FollowsModule,     // استيراد AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
