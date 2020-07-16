import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user';

@Entity()
export class SocialLogin extends BaseEntity {
  @Column({ type: 'varchar' })
  type: string;

  @Column({ type: 'varchar' })
  socialId: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'varchar', nullable: true })
  picture: string;

  @ManyToOne(type => User, u => u.socialLogins, {
    onDelete: 'CASCADE',
  })
  user: Promise<User>;
}
