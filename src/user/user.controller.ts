import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { DataSource } from 'typeorm'; // استيراد DataSource
import { faker } from '@faker-js/faker'; // استيراد faker
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly dataSource: DataSource
  ) {}

  // إنشاء مليون مستخدم عشوائي على دفعات
  @Post('/fillUsers')
  async fillUsers() {
    const usersRepo = this.dataSource.getRepository('User');

    // حجم الدفعة وعدد المستخدمين الإجمالي
    const chunkSize = 10_000;
    const totalUsers = 1_000_000;
    const users = [];

    for (let i = 0; i < totalUsers; i++) {
      // توليد بيانات عشوائية للمستخدم
      const randomUsername = faker.internet.userName();
      const randomEmail = faker.internet.email();
      const randomPassword = faker.internet.password();
      const randomRole = faker.helpers.arrayElement(['admin', 'user']); // دور عشوائي

      users.push({
        username: randomUsername,
        email: randomEmail,
        password: randomPassword,
        role: randomRole,
      });

      // إدخال البيانات عند امتلاء الدفعة
      if (users.length === chunkSize) {
        console.log('إدخال الدفعة رقم:', i / chunkSize);
        console.log('النسبة المئوية للإكمال:', ((i / totalUsers) * 100).toFixed(2) + '%');
        await usersRepo.insert(users);
        users.length = 0; // تفريغ المصفوفة
      }
    }

    // إدخال أي بيانات متبقية
    if (users.length > 0) {
      await usersRepo.insert(users);
    }

    return 'تم إنشاء مليون مستخدم بنجاح';
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