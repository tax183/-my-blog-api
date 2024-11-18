import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Comment } from 'src/comments/entities/comment.entity';
import { Like } from 'src/likes/entities/like.entity';
import { Follow } from 'src/follows/entities/follow.entity';

import { Article } from 'src/articles/entities/article.entity';


@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  role: string;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  // إضافة حقل password
  @Column()
  password: string;

  // علاقة مع التعليقات
  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  // علاقة مع الإعجابات
  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];

  // علاقة مع المتابعات
  @OneToMany(() => Follow, (follow) => follow.following_user)
  following: Follow[];

  @OneToMany(() => Follow, (follow) => follow.followed_user)
  followed: Follow[];

  // علاقة مع المقالات (المستخدم هو المؤلف هنا)
  @OneToMany(() => Article, (article) => article.author)
  articles: Article[];
}
