import { Injectable, NotFoundException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Question, QuestionDocument } from './schemas/question.schema';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { TagsService } from '../tags/tags.service';
import { AnswersService } from '../answers/answers.service';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectModel(Question.name) private questionModel: Model<QuestionDocument>,
    private tagsService: TagsService,
    @Inject(forwardRef(() => AnswersService)) private answersService: AnswersService,
  ) {}

  async create(createQuestionDto: CreateQuestionDto): Promise<Question> {
    // Automatically create tags if they don't exist
    if (createQuestionDto.tags && createQuestionDto.tags.length > 0) {
      for (const tagName of createQuestionDto.tags) {
        await this.tagsService.findOrCreate(tagName);
      }
      // Update usage count for all tags
      await this.tagsService.incrementUsageCount(createQuestionDto.tags);
    }

    const createdQuestion = new this.questionModel(createQuestionDto);
    return createdQuestion.save();
  }

  async findAll(): Promise<Question[]> {
    return this.questionModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Question> {
    const question = await this.questionModel.findById(id).exec();
    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }
    return question;
  }

  async update(id: string, updateQuestionDto: UpdateQuestionDto): Promise<Question> {
    const existingQuestion = await this.questionModel.findById(id).exec();
    if (!existingQuestion) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }

    // Automatically create new tags if they don't exist
    if (updateQuestionDto.tags && updateQuestionDto.tags.length > 0) {
      for (const tagName of updateQuestionDto.tags) {
        await this.tagsService.findOrCreate(tagName);
      }

      // Update usage counts
      if (existingQuestion.tags && existingQuestion.tags.length > 0) {
        await this.tagsService.decrementUsageCount(existingQuestion.tags);
      }
      await this.tagsService.incrementUsageCount(updateQuestionDto.tags);
    }

    const updatedQuestion = await this.questionModel
      .findByIdAndUpdate(id, updateQuestionDto, { new: true })
      .exec();
    if (!updatedQuestion) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }
    return updatedQuestion;
  }

  async remove(id: string): Promise<void> {
    const question = await this.questionModel.findById(id).exec();
    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }

    // Decrement usage counts for tags
    if (question.tags && question.tags.length > 0) {
      await this.tagsService.decrementUsageCount(question.tags);
    }

    // Delete all answers for this question
    await this.answersService.deleteByQuestionId(id);

    await this.questionModel.findByIdAndDelete(id).exec();
  }
} 