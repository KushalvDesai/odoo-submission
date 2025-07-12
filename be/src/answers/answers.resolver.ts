import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AnswersService } from './answers.service';
import { Answer } from './entities/answer.entity';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Resolver(() => Answer)
export class AnswersResolver {
  constructor(private readonly answersService: AnswersService) {}

  @Mutation(() => Answer)
  @UseGuards(JwtAuthGuard)
  createAnswer(
    @Args('createAnswerInput') createAnswerDto: CreateAnswerDto,
    @CurrentUser() user: User,
  ) {
    return this.answersService.create({
      ...createAnswerDto,
      author: user.name,
    });
  }

  @Query(() => [Answer], { name: 'answers' })
  findAll() {
    return this.answersService.findAll();
  }

  @Query(() => [Answer], { name: 'answersByQuestion' })
  findByQuestionId(@Args('questionId', { type: () => String }) questionId: string) {
    return this.answersService.findByQuestionId(questionId);
  }

  @Query(() => Answer, { name: 'answer' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.answersService.findOne(id);
  }

  @Mutation(() => Answer)
  @UseGuards(JwtAuthGuard)
  updateAnswer(
    @Args('id', { type: () => String }) id: string,
    @Args('updateAnswerInput') updateAnswerDto: UpdateAnswerDto,
    @CurrentUser() user: User,
  ) {
    return this.answersService.update(id, updateAnswerDto);
  }

  @Mutation(() => Answer)
  @UseGuards(JwtAuthGuard)
  removeAnswer(
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user: User,
  ) {
    return this.answersService.remove(id);
  }
} 