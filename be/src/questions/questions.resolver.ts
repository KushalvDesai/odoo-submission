import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { Question } from './entities/question.entity';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Resolver(() => Question)
export class QuestionsResolver {
  constructor(private readonly questionsService: QuestionsService) {}

  @Mutation(() => Question)
  @UseGuards(JwtAuthGuard)
  createQuestion(
    @Args('createQuestionInput') createQuestionDto: CreateQuestionDto,
    @CurrentUser() user: User,
  ) {
    // Set the author to the current user's name
    return this.questionsService.create({
      ...createQuestionDto,
      author: user.name,
    });
  }

  @Query(() => [Question], { name: 'questions' })
  findAll() {
    return this.questionsService.findAll();
  }

  @Query(() => Question, { name: 'question' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.questionsService.findOne(id);
  }

  @Mutation(() => Question)
  @UseGuards(JwtAuthGuard)
  updateQuestion(
    @Args('id', { type: () => String }) id: string,
    @Args('updateQuestionInput') updateQuestionDto: UpdateQuestionDto,
    @CurrentUser() user: User,
  ) {
    return this.questionsService.update(id, updateQuestionDto);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  removeQuestion(
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user: User,
  ) {
    return this.questionsService.remove(id).then(() => true);
  }
} 