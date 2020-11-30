import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '@app/entities';
import { PaginationInfo } from '@app/modules/management-api/types/pagination-info';

@ObjectType()
export class UsersPaginatedResponse {
  @Field(returns => [User])
  items: User[];

  @Field(returns => PaginationInfo)
  paginationInfo: PaginationInfo;
}
