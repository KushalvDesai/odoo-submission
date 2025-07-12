import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Answer, AnswerDocument } from './schemas/answer.schema';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';

@Injectable()
export class AnswersService {
  constructor(
    @InjectModel(Answer.name) private answerModel: Model<AnswerDocument>,
  ) {}

  async create(createAnswerDto: CreateAnswerDto & { author: string }): Promise<Answer> {
    const createdAnswer = new this.answerModel({
      ...createAnswerDto,
      questionId: new Types.ObjectId(createAnswerDto.questionId),
    });
    return createdAnswer.save();
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
} 