import { IsString, IsNotEmpty, IsMongoId } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateAnswerDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  content: string;

  @Field()
  @IsString()
  @IsMongoId()
  @IsNotEmpty()
  questionId: string;
} 