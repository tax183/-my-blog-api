import { Controller, Get, Post, Body, Param, Query, Delete, Put } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { User } from '../user/entities/user.entity';

@Controller('articles')
export class ArticlesController {
    constructor(private readonly articlesService: ArticlesService) {}

    @Post()
    async create(@Body() createArticleDto: CreateArticleDto, user: User) {
        return this.articlesService.create(createArticleDto, user);
    }

    @Get('generate')
    async generateRandomArticles(@Query('count') count: number = 100) {
        return this.articlesService.generateRandomArticles(count);
    }

    @Get()
    async getAllArticles(
        @Query('page') page: number = 1,
        @Query('pageSize') pageSize: number = 10,
        @Query('searchTerm') searchTerm?: string
    ) {
        return this.articlesService.findAll(page, pageSize, searchTerm);
    }

    @Get(':id')
    async getArticleById(@Param('id') id: number) {
        return this.articlesService.findOne(id);
    }

    @Put(':id')
    async update(
        @Param('id') id: number,
        @Body() updateArticleDto: UpdateArticleDto
    ) {
        return this.articlesService.update(id, updateArticleDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: number) {
        return this.articlesService.remove(id);
    }
}
