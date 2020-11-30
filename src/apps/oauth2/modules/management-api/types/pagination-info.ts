import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PaginationInfo {
  @Field(returns => Boolean)
  hasMore: boolean;

  @Field(returns => Int)
  total: number;
}
