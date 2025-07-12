import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { VoteType } from '../schemas/vote.schema';

registerEnumType(VoteType, {
  name: 'VoteType',
  description: 'The type of vote (upvote or downvote)',
});

@ObjectType()
export class Vote {
  @Field(() => ID)
  id: string;

  @Field()
  answerId: string;

  @Field()
  userId: string;

  @Field(() => VoteType)
  voteType: VoteType;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
} 