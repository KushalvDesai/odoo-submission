import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Tag {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description: string;

  @Field()
  usageCount: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
} 