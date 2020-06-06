import { AfterLoad, BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Exclude } from 'class-transformer';
import { OAuthAccessToken } from './o-auth-access-token';
import { hashValue, verifyValue } from '@app/lib/cipher';
import gravatar from 'gravatar';
import { Scopes } from '@app/modules/oauth2/constants';

@Entity()
export class User extends BaseEntity {
  @Column({ type: 'varchar' })
  nickname: string;

  @Column({ type: 'varchar', nullable: true })
  firstName: string;

  @Column({ type: 'varchar', nullable: true })
  lastName: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'timestamp without time zone', nullable: true })
  emailVerifiedAt: Date;

  @Column({ type: 'varchar', nullable: true })
  @Exclude()
  password: string;

  @OneToMany(type => OAuthAccessToken, at => at.user)
  tokens: Promise<OAuthAccessToken>;

  @Exclude()
  tmpPassword!: string;

  @AfterLoad()
  private loadTmpPassword() {
    this.tmpPassword = this.password;
  }

  @BeforeUpdate()
  @BeforeInsert()
  private async encryptPassword() {
    if (this.password) {
      if (this.tmpPassword !== this.password) {
        this.password = await hashValue(this.password);
      }
    }
  }

  public validatePassword(password: string): Promise<boolean> {
    return verifyValue(password, this.password);
  }

  public toOpenIdProfile(scopes: Scopes[]) {
    return {
      sub: this.id,
      ...scopes.includes(Scopes.PROFILE) && {
        picture: gravatar.url(this.email, {
          rating: 'g',
          default: 'retro',
        }),
        nickname: this.nickname,
        updated_at: this.updatedAt,
        ...this.firstName && {
          name: `${this.firstName} ${this.lastName}`.trimRight(),
        },
      },
      ...scopes.includes(Scopes.EMAIL) && {
        email: this.email,
        email_verified: !!this.emailVerifiedAt,
      }
    }
  }
}
