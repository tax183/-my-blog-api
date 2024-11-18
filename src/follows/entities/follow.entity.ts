import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Article } from 'src/articles/entities/article.entity';


@Entity()
export class Follow {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.following)
  @JoinColumn({ name: 'following_user_id' })
  following_user: User;

  @ManyToOne(() => User, (user) => user.followed)
  @JoinColumn({ name: 'followed_user_id' })
  followed_user: User;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
