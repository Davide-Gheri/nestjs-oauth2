import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Session {
  @Field(returns => ID)
  sessionId: string;

  @Field()
  ip: string;

  @Field({ nullable: true })
  userAgent?: string;

  @Field({ nullable: true })
  os?: string;

  @Field({ nullable: true })
  browser?: string;

  @Field({ nullable: true })
  createdAt: Date;
}
