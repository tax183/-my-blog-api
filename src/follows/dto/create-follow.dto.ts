import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateFollowDto {
  @IsInt()
  @IsNotEmpty()
  followedUserId: number;  // تأكد من أن هذه الخاصية موجودة بشكل صحيح
}

