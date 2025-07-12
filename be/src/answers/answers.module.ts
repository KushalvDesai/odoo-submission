import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnswersService } from './answers.service';
import { AnswersResolver } from './answers.resolver';
import { Answer, AnswerSchema } from './schemas/answer.schema';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Answer.name, schema: AnswerSchema },
    ]),
    UsersModule,
  ],
  providers: [AnswersService, AnswersResolver],
  exports: [AnswersService],
})
export class AnswersModule {}
