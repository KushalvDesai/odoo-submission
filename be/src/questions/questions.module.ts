import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuestionsService } from './questions.service';
import { QuestionsResolver } from './questions.resolver';
import { Question, QuestionSchema } from './schemas/question.schema';
import { TagsModule } from '../tags/tags.module';
import { AnswersModule } from '../answers/answers.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Question.name, schema: QuestionSchema },
    ]),
    TagsModule,
    forwardRef(() => AnswersModule),
  ],
  providers: [QuestionsService, QuestionsResolver],
  exports: [QuestionsService],
})
export class QuestionsModule {} 