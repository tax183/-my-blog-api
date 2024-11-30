import { Controller, Get, Query, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './auth/public.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Endpoint to generate fake users
  @Public()
  @Get('generate-users')
  async generateUsers(@Query('count') count: number) {
    const result = await this.appService.generateFakeUsers(count);
    return {
      message: `${count} fake users generated successfully!`,
      users: result,
    };
  }

  // Endpoint to generate fake posts
  @Public()
  @Get('generate-posts')
  async generatePosts(@Query('count') count: number) {
    const result = await this.appService.generateFakePostsForAllUsers(count);
    return {
      message: `Fake posts generated successfully for all users!`,
      posts: result,
    };
  }

  @Get()
  getHello() {
    return this.appService.getHello();
  }
}
