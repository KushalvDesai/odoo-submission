import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Answer, AnswerDocument } from './schemas/answer.schema';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { QuestionsService } from '../questions/questions.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class AnswersService {
  constructor(
    @InjectModel(Answer.name) private answerModel: Model<AnswerDocument>,
    private notificationsService: NotificationsService,
    private questionsService: QuestionsService,
    private usersService: UsersService,
  ) {}

  async create(createAnswerDto: CreateAnswerDto & { author: string }): Promise<Answer> {
    const createdAnswer = new this.answerModel({
      ...createAnswerDto,
      questionId: new Types.ObjectId(createAnswerDto.questionId),
    });
    const saved = await createdAnswer.save();

    // Notify question owner
    const question = await this.questionsService.findOne(createAnswerDto.questionId);
    if (question && question.author !== createAnswerDto.author) {
      // Find user by name
      const owner = await this.usersService['userModel'].findOne({ name: question.author });
      if (owner) {
        await this.notificationsService.createNotification(
          String(owner._id),
          'answer',
          `Your question received a new answer from ${createAnswerDto.author}`,
          JSON.stringify({ questionId: createAnswerDto.questionId, answerId: saved._id })
        );
      }
    }

    // Notify mentioned users (support spaces in usernames)
    const mentionRegex = /@([a-zA-Z0-9_ ]+)/g;
    const mentions = Array.from(new Set((createAnswerDto.content.match(mentionRegex) || []).map(m => m.slice(1).trim())));
    if (mentions.length > 0) {
      // Find users whose name matches any mention (case-sensitive)
      const users = await this.usersService['userModel'].find({ name: { $in: mentions } });
      for (const user of users) {
        if (user.name !== createAnswerDto.author) {
          await this.notificationsService.createNotification(
            String(user._id),
            'mention',
            `You were mentioned by ${createAnswerDto.author} in an answer`,
            JSON.stringify({ questionId: createAnswerDto.questionId, answerId: saved._id })
          );
        }
      }
    }

    return saved;
  }

  async findAll(): Promise<Answer[]> {
    return this.answerModel.find().sort({ createdAt: -1 }).exec();
  }

  async findByQuestionId(questionId: string): Promise<Answer[]> {
    return this.answerModel
      .find({ questionId: new Types.ObjectId(questionId) })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<Answer> {
    const answer = await this.answerModel.findById(id).exec();
    if (!answer) {
      throw new NotFoundException(`Answer with ID ${id} not found`);
    }
    return answer;
  }

  async update(id: string, updateAnswerDto: UpdateAnswerDto): Promise<Answer> {
    const updatedAnswer = await this.answerModel
      .findByIdAndUpdate(id, updateAnswerDto, { new: true })
      .exec();
    if (!updatedAnswer) {
      throw new NotFoundException(`Answer with ID ${id} not found`);
    }
    return updatedAnswer;
  }

  async remove(id: string): Promise<void> {
    const result = await this.answerModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Answer with ID ${id} not found`);
    }
  }

  async deleteByQuestionId(questionId: string): Promise<void> {
    await this.answerModel.deleteMany({ questionId: new Types.ObjectId(questionId) }).exec();
  }
} 