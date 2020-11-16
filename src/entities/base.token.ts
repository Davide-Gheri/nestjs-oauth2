import { Column } from 'typeorm';
import { BaseEntity } from './base.entity';

export abstract class BaseToken extends BaseEntity {
  @Column({ type: 'timestamp without time zone' })
  expiresAt: Date;

  @Column({ type: 'boolean', default: false })
  revoked: boolean;

  @Column({ type: 'timestamp without time zone', nullable: true })
  revokedAt: Date;

  public abstract toPayload(): any;
}
