import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { Repository, Like } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { faker } from '@faker-js/faker';

@Injectable()
export class ArticlesService {
    constructor(
        @InjectRepository(Article)
        private readonly articleRepository: Repository<Article>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>, // إضافة Repository للمستخدمين
    ) {}

    async create(createArticleDto: CreateArticleDto, user: User): Promise<Article> {
        const article = this.articleRepository.create({
            ...createArticleDto,
            author: user,
        });
        return await this.articleRepository.save(article);
    }

    async generateRandomArticles(count: number = 100) {
        const users = await this.userRepository.find();

        if (users.length === 0) {
            throw new Error('لا يوجد مستخدمين لإسناد المقالات لهم');
        }

        const articles = Array.from({ length: count }, () => ({
            title: faker.lorem.sentence(),
            body: faker.lorem.paragraphs(3),
            author: users[Math.floor(Math.random() * users.length)],
        }));

        await this.articleRepository.save(articles);
        return { message: `${count} مقالة تم إنشاؤها بنجاح` };
    }

    async findAll(page: number = 1, pageSize: number = 10, searchTerm?: string) {
        const skip = (page - 1) * pageSize;

        const [results, total] = await this.articleRepository.findAndCount({
            where: searchTerm ? { title: Like(`%${searchTerm}%`) } : {},
            relations: ['author'],
            skip: skip,
            take: pageSize,
        });

        return {
            results,
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
        };
    }

    async findOne(id: number) {
        return this.articleRepository.findOne({ where: { id }, relations: ['author'] });
    }

    async update(id: number, updateArticleDto: UpdateArticleDto) {
        return this.articleRepository.update(id, updateArticleDto);
    }

    async remove(id: number) {
        return this.articleRepository.delete(id);
    }
}

