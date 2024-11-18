import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // إنشاء مستخدم جديد مع تجزئة كلمة المرور
  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({ where: { username: createUserDto.username } });
    if (existingUser) {
      throw new BadRequestException('Username already exists');
    }

    // تجزئة كلمة المرور
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return this.userRepository.save(newUser);
  }

  // جلب جميع المستخدمين
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  // جلب مستخدم معين بواسطة المعرف (ID)
  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } }); // تعديل هنا
    if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
}

  // تحديث بيانات مستخدم معين
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id); // تأكد من وجود المستخدم أولاً
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10); // تجزئة كلمة المرور الجديدة إذا كانت محدثة
    }
    const updatedUser = Object.assign(user, updateUserDto);
    return this.userRepository.save(updatedUser);
  }

  // حذف مستخدم معين
  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }
  
  // البحث عن مستخدم بواسطة اسم المستخدم
  async findOneByUsername(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { username } });
  }
}
//