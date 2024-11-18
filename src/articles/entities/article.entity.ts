import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Comment } from 'src/comments/entities/comment.entity';
import { Like } from 'src/likes/entities/like.entity';
import { Follow } from 'src/follows/entities/follow.entity';
import { User } from 'src/user/entities/user.entity';



@Entity()
export class Article {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    title: string;
  
    @Column('text')
    body: string;
  
    // تغيير user إلى author
    @ManyToOne(() => User, (user) => user.articles)
    @JoinColumn({ name: 'author' })  // يمكنك إضافة هذا لتحديد اسم العمود في قاعدة البيانات
    author: User;  // هنا سيكون اسم الحقل author
  
    @Column()
    status: string;
  
    @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
  
    // علاقة مع التعليقات
    @OneToMany(() => Comment, (comment) => comment.article)
    comments: Comment[];
  
    // علاقة مع الإعجابات
    @OneToMany(() => Like, (like) => like.article)
    likes: Like[];
  }