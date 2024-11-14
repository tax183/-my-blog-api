import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { Article } from './entities/article.entity';
import { User } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Article, User]),
        UserModule, // إضافة UsersModule هنا
    ],
    providers: [ArticlesService],
    controllers: [ArticlesController],
})
export class ArticlesModule {}
