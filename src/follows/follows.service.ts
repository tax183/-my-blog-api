import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Follow } from 'src/follows/entities/follow.entity';
import { CreateFollowDto } from './dto/create-follow.dto';
import { User } from 'src/user/entities/user.entity';  // تأكد من استيراد كائن المستخدم


@Injectable()
export class FollowsService {
  constructor(
    @InjectRepository(Follow)
    private readonly followRepository: Repository<Follow>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // متابعة مستخدم آخر
  async create(currentUserId: number, createFollowDto: CreateFollowDto) {
    const { followedUserId } = createFollowDto;

    // تحقق من إذا كان المستخدم يحاول متابعة نفسه
    if (currentUserId === followedUserId) {
      throw new Error('You cannot follow yourself');
    }

    // استرجاع المستخدمين من قاعدة البيانات
    const followingUser = await this.userRepository.findOne({ where: { id: currentUserId } });
    const followedUser = await this.userRepository.findOne({ where: { id: followedUserId } });

    if (!followingUser || !followedUser) {
      throw new Error('User not found');
    }

    // تحقق من وجود متابعة سابقة
    const existingFollow = await this.followRepository.findOne({
      where: {
        following_user: { id: currentUserId },
        followed_user: { id: followedUserId },
      },
    });

    if (existingFollow) {
      throw new Error('You are already following this user');
    }

    // إنشاء متابعة جديدة
    const follow = new Follow();
    follow.following_user = followingUser;
    follow.followed_user = followedUser;
    await this.followRepository.save(follow);

    return { message: 'You are now following the user' };
  }

  // استرجاع المتابعين لمستخدم معين
  async findFollowers(userId: string) {
    const userIdAsNumber = Number(userId);  // تحويل userId إلى رقم
    const followers = await this.followRepository.find({
      where: { followed_user: { id: userIdAsNumber } },
      relations: ['following_user'],
    });

    return followers.map((follow) => follow.following_user);
  }

  // استرجاع الأشخاص الذين يتابعهم المستخدم
  async findFollowing(userId: string) {
    const userIdAsNumber = Number(userId);  // تحويل userId إلى رقم
    const following = await this.followRepository.find({
      where: { following_user: { id: userIdAsNumber } },
      relations: ['followed_user'],
    });

    return following.map((follow) => follow.followed_user);
  }

  // استرجاع ملف المستخدم الحالي
  async getMyProfile(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}

