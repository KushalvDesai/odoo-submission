import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Answer {
  @Field(() => ID)
  id: string;

  @Field()
  content: string;

  @Field()
  author: string;

  @Field()
  questionId: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
} 