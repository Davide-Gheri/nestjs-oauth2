import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@app/entities/base.entity';

@Entity()
export class Key extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  type: 'public' | 'private';

  @Column({ type: 'text' })
  data: string;
}
