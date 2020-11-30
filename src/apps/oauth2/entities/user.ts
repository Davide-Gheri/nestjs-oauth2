import { AfterLoad, BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Exclude, Expose } from 'class-transformer';
import { OAuthAccessToken } from './o-auth-access-token';
import { hashValue, verifyValue } from '@app/lib/cipher';
import gravatar from 'gravatar';
import { ApiScopes, Scopes } from '@app/modules/oauth2/constants';
import { Field, ObjectType } from '@nestjs/graphql';
import { EmailAddressResolver } from 'graphql-scalars';
import { Roles } from '@app/modules/auth/roles';
import { SocialLogin } from '@app/entities/social-login.entity';

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field()
  @Column({ type: 'varchar' })
  nickname: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', nullable: true })
  firstName: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', nullable: true })
  lastName: string;

  @Field(returns => EmailAddressResolver, { nullable: true })
  @Column({ type: 'varchar', unique: true, nullable: true })
  email: string;

  @Field({ nullable: true })
  @Column({ type: 'timestamp without time zone', nullable: true })
  emailVerifiedAt: Date;

  @Column({ type: 'varchar', nullable: true })
  @Exclude()
  password: string;

  @Field(returns => Roles)
  @Column({ type: 'varchar', enum: Roles, default: Roles.USER })
  role: Roles;

  @Column({ type: 'varchar', nullable: true })
  tfaSecret: string;

  @Field()
  @Column({ type: 'boolean', default: false })
  tfaEnabled: boolean;

  @OneToMany(type => OAuthAccessToken, at => at.user)
  tokens: Promise<OAuthAccessToken>;

  @OneToMany(type => SocialLogin, sl => sl.user, {
    eager: true,
  })
  socialLogins: SocialLogin[];

  @Exclude()
  tmpPassword!: string;

  @Field(returns => String)
  @Expose()
  get picture(): string {
    let pictureUrl: string;
    if (this.socialLogins.length) {
      pictureUrl = this.socialLogins.find(s => s.picture)?.picture;
    }
    return pictureUrl || gravatar.url(this.email, {
      rating: 'g',
      default: 'retro',
    })
  }

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
      ...scopes.includes(Scopes.profile) && {
        picture: this.picture,
        nickname: this.nickname,
        updated_at: this.updatedAt,
        ...this.firstName && {
          name: `${this.firstName} ${this.lastName}`.trimRight(),
        },
      },
      ...scopes.includes(Scopes.email) && {
        email: this.email,
        email_verified: !!this.emailVerifiedAt,
      }
    }
  }

  public toApiProfile(scopes: ApiScopes[]) {
    return {
      id: this.id,
      ...scopes.includes(ApiScopes.users_profile) && {
        picture: this.picture,
        nickname: this.nickname,
        updated_at: this.updatedAt,
        ...this.firstName && {
          name: `${this.firstName} ${this.lastName}`.trimRight(),
        },
      },
      ...scopes.includes(ApiScopes.users_email) && {
        email: this.email,
        email_verified: !!this.emailVerifiedAt,
      }
    }
  }
}
