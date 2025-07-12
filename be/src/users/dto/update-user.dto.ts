import { IsString, IsOptional, IsEmail, MinLength } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateUserDto {
  @Field({ nullable: true })
  @IsEmail()
  @IsOptional()
  email?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  @MinLength(6)
  password?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  name?: string;
} 