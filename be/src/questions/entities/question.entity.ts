import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Question {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  desc: string;

  @Field(() => [String])
  tags: string[];

  @Field()
  author: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
} 