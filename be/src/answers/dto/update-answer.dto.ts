import { IsString, IsOptional } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateAnswerDto {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  content?: string;
} 