import {
  Controller,
  Post,
  Get,
  Param,
  Req,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { JwtGuard } from '../auth/jwt.guard';
import { faker } from '@faker-js/faker';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/generate-random-users')
  async generateRandomUsers() {
    const users = [];

    for (let i = 0; i < 10000; i++) {
      const randomUser = {
        username: faker.internet.userName(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        password: faker.internet.password(),
      };
      users.push(randomUser);
    }

    // حفظ المستخدمين في قاعدة البيانات
    await this.usersService.createMany(users);

    return { message: '10000 random users created successfully' };
  }

  // Follow a user
  @Post('/follow/:followingId')
  async followUser(@Req() req: any, @Param('followingId') followingId: number) {
    const followerId = req.user.id;
    return this.usersService.followUser(followerId, followingId);
  }

  // Get followers of a user
  @Get(':userId/followers')
  async getFollowers(@Param('userId') userId: number) {
    return this.usersService.getFollowers(userId);
  }

  // Get following of a user
  @Get(':userId/following')
  async getFollowing(@Param('userId') userId: number) {
    return this.usersService.getFollowing(userId);
  }

  // Get current user's profile
  @Get('myProfile')
  async getMyProfile(@Req() req: any) {
    const userId = req.user.id; // Assuming user is authenticated and their ID is available in the request
    const user = await this.usersService.findOneById(userId);
    const followers = await this.usersService.getFollowers(userId);
    const following = await this.usersService.getFollowing(userId);

    const userProfile: UserDto = {
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    return {
      user: userProfile,
      followers,
      following,
    };
  }

  // Unfollow a user
  @Delete('unfollow/:followingId')
  async unfollowUser(
    @Req() req: any,
    @Param('followingId') followingId: number,
  ) {
    const followerId = req.user.id;

    await this.usersService.unfollowUser(followerId, followingId);

    return { message: 'Unfollowed successfully' };
  }

  // Get user by username
  @UseGuards(JwtGuard)
  @Get('/:username')
  async getUserByUsername(@Param('username') username: string) {
    return this.usersService.getUserByUsername(username);
  }
}
