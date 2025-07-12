import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tag, TagDocument } from './schemas/tag.schema';
import { CreateTagDto } from './dto/create-tag.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectModel(Tag.name) private tagModel: Model<TagDocument>,
  ) {}

  async create(createTagDto: CreateTagDto): Promise<Tag> {
    const existingTag = await this.tagModel.findOne({ 
      name: createTagDto.name.toLowerCase() 
    });
    if (existingTag) {
      throw new ConflictException('Tag already exists');
    }
    const createdTag = new this.tagModel({
      ...createTagDto,
      name: createTagDto.name.toLowerCase(),
    });
    return createdTag.save();
  }

  async findAll(): Promise<Tag[]> {
    return this.tagModel.find().sort({ usageCount: -1, name: 1 }).exec();
  }

  async findPopularTags(limit: number = 10): Promise<Tag[]> {
    return this.tagModel.find()
      .sort({ usageCount: -1, name: 1 })
      .limit(limit)
      .exec();
  }

  async searchTags(query: string, limit: number = 10): Promise<Tag[]> {
    return this.tagModel.find({
      name: { $regex: query.toLowerCase(), $options: 'i' }
    })
    .sort({ usageCount: -1, name: 1 })
    .limit(limit)
    .exec();
  }

  async findByName(name: string): Promise<Tag | null> {
    return this.tagModel.findOne({ name: name.toLowerCase() }).exec();
  }

  async findOrCreate(name: string): Promise<Tag> {
    let tag = await this.findByName(name);
    if (!tag) {
      tag = await this.create({ name });
    }
    return tag;
  }

  async validateTags(tagNames: string[]): Promise<{ valid: string[], invalid: string[] }> {
    const valid: string[] = [];
    const invalid: string[] = [];

    for (const name of tagNames) {
      const tag = await this.findByName(name);
      if (tag) {
        valid.push(name);
      } else {
        invalid.push(name);
      }
    }

    return { valid, invalid };
  }

  async incrementUsageCount(tagNames: string[]): Promise<void> {
    for (const name of tagNames) {
      await this.tagModel.updateOne(
        { name: name.toLowerCase() },
        { $inc: { usageCount: 1 } }
      );
    }
  }

  async decrementUsageCount(tagNames: string[]): Promise<void> {
    for (const name of tagNames) {
      await this.tagModel.updateOne(
        { name: name.toLowerCase() },
        { $inc: { usageCount: -1 } }
      );
    }
  }
} 