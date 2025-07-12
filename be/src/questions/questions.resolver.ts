import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { QuestionsService } from './questions.service';
import { Question } from './entities/question.entity';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Resolver(() => Question)
export class QuestionsResolver {
  constructor(private readonly questionsService: QuestionsService) {}

  @Mutation(() => Question)
  createQuestion(@Args('createQuestionInput') createQuestionDto: CreateQuestionDto) {
    return this.questionsService.create(createQuestionDto);
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
  updateQuestion(
    @Args('id', { type: () => String }) id: string,
    @Args('updateQuestionInput') updateQuestionDto: UpdateQuestionDto,
  ) {
    return this.questionsService.update(id, updateQuestionDto);
  }

  @Mutation(() => Question)
  removeQuestion(@Args('id', { type: () => String }) id: string) {
    return this.questionsService.remove(id);
  }
} 