import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class NotificationDto {
  @Field(() => ID)
  id: string;

  @Field()
  userId: string;

  @Field()
  type: string;

  @Field()
  message: string;

  @Field()
  read: boolean;

  @Field(() => String, { nullable: true })
  meta?: string;

  @Field()
  createdAt: Date;
} 