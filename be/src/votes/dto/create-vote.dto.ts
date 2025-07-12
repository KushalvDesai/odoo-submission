import { IsString, IsNotEmpty, IsMongoId, IsEnum } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';
import { VoteType } from '../schemas/vote.schema';

@InputType()
export class CreateVoteDto {
  @Field()
  @IsString()
  @IsMongoId()
  @IsNotEmpty()
  answerId: string;

  @Field(() => VoteType)
  @IsEnum(VoteType)
  @IsNotEmpty()
  voteType: VoteType;
} 