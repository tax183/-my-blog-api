import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { DataSource } from 'typeorm'; // استيراد DataSource
import { faker } from '@faker-js/faker'; // استيراد faker
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly dataSource: DataSource // إضافة DataSource
  ) {}

  // إنشاء 1000 مستخدم عشوائي
  @Post('/fillUsers')
  async fillUsers() {
    const usersRepo = this.dataSource.getRepository('User');
    const users = Array.from({ length: 1000 }, () => ({
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    }));
    await usersRepo.save(users);

    return '1000 مستخدم تم إضافتهم بنجاح';
  }

  // جلب جميع المستخدمين
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    const users = await this.userService.findAll();
    return {
      message: 'Users retrieved successfully',
      data: users,
    };
  }

  // جلب مستخدم معين بواسطة المعرف (ID)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOne(+id);
    return {
      message: `User with ID ${id} retrieved successfully`,
      data: user,
    };
  }

  // تحديث بيانات مستخدم معين
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const updatedUser = await this.userService.update(+id, updateUserDto);
    return {
      message: `User with ID ${id} updated successfully`,
      data: updatedUser,
    };
  }

  // حذف مستخدم معين
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.userService.remove(+id);
    return {
      message: `User with ID ${id} removed successfully`,
    };
  }
}
