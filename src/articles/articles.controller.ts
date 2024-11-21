import { Controller, Get, Post, Body, Param, Query, Delete, Put } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { User } from '../user/entities/user.entity';
import { faker } from '@faker-js/faker';
import { DataSource, Repository } from 'typeorm';
import { Article } from './entities/article.entity';
@Controller('articles')
export class ArticlesController {
  constructor(private readonly dataSource: DataSource) {}

  @Post('/fillArticles')
  async fillArticles(@Query('count') count: number = 100_000) {
    const articlesRepo: Repository<Article> =
      this.dataSource.getRepository(Article);

    // حجم الدفعة وعدد المقالات الإجمالي
    const chunkSize = 10_000;
    const totalArticles = count;
    const articles = [];

    for (let i = 0; i < totalArticles; i++) {
      // توليد بيانات عشوائية للمقالة
      const randomTitle = faker.lorem.sentence();
      const randomBody = faker.lorem.paragraphs();
      const randomStatus = faker.helpers.arrayElement(['published', 'draft', 'archived']);
      const randomAuthorId = Math.floor(Math.random() * 1000) + 1; // توليد معرف عشوائي للمؤلف

      articles.push({
        title: randomTitle,
        body: randomBody,
        status: randomStatus,
        author: { id: randomAuthorId }, // يجب أن يتوافق مع العلاقة في الكيان
      });

      // إدخال البيانات عند امتلاء الدفعة
      if (articles.length === chunkSize) {
        console.log('Inserting chunk:', i / chunkSize);
        console.log('Progress:', ((i / totalArticles) * 100).toFixed(2) + '%');
        await articlesRepo.insert(articles);
        articles.length = 0; // تفريغ المصفوفة
      }
    }

    // إدخال أي بيانات متبقية
    if (articles.length > 0) {
      await articlesRepo.insert(articles);
    }

    return `Inserted ${totalArticles} articles successfully!`;
  }
}
