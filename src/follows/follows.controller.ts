import { Controller, Get, Post, Body, Param, Req, UseGuards } from '@nestjs/common';
import { FollowsService } from './follows.service';
import { CreateFollowDto } from './dto/create-follow.dto';
import { AuthService } from 'src/auth/auth.service';  // تأكد من استيراد الخدمة الصحيحة
import { AuthGuard } from 'src/auth/auth.guard'; 

@Controller('follows')
export class FollowsController {
  constructor(
    private readonly followsService: FollowsService,
    private readonly authService: AuthService,  // لتوثيق المستخدم
  ) {}

  // نقطة نهاية لبدء متابعة مستخدم آخر
  @UseGuards(AuthGuard)  // استخدام الحارس للتحقق من التوثيق
  @Post()
  async create(@Body() createFollowDto: CreateFollowDto, @Req() req) {
    const currentUserId = req.user.id;  // الحصول على ID المستخدم الحالي من خلال التوثيق
    return this.followsService.create(currentUserId, createFollowDto);
  }

  // استرجاع المتابعين لمستخدم معين
  @Get(':userId/followers')
  async findFollowers(@Param('userId') userId: string) {
    return this.followsService.findFollowers(userId);
  }

  // استرجاع الأشخاص الذين يتابعهم المستخدم
  @Get(':userId/following')
  async findFollowing(@Param('userId') userId: string) {
    return this.followsService.findFollowing(userId);
  }

  // عرض ملف المستخدم الشخصي للمستخدم الحالي
  @UseGuards(AuthGuard)  // استخدام الحارس للتحقق من التوثيق
  @Get('/myProfile')
  async getMyProfile(@Req() req) {
    const currentUserId = req.user.id;  // الحصول على ID المستخدم الحالي من خلال التوثيق
    return this.followsService.getMyProfile(currentUserId);
  }
}
