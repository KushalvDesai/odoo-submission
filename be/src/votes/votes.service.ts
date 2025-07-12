import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Vote, VoteDocument, VoteType } from './schemas/vote.schema';
import { CreateVoteDto } from './dto/create-vote.dto';

@Injectable()
export class VotesService {
  constructor(
    @InjectModel(Vote.name) private voteModel: Model<VoteDocument>,
  ) {}

  async createOrUpdate(createVoteDto: CreateVoteDto & { userId: string }): Promise<Vote> {
    const { answerId, voteType, userId } = createVoteDto;
    
    try {
      // Try to find existing vote
      const existingVote = await this.voteModel.findOne({
        answerId: new Types.ObjectId(answerId),
        userId: new Types.ObjectId(userId),
      });

      if (existingVote) {
        // If same vote type, remove the vote (toggle off)
        if (existingVote.voteType === voteType) {
          await this.voteModel.findByIdAndDelete(existingVote._id);
          return existingVote;
        } else {
          // If different vote type, update it
          const updatedVote = await this.voteModel.findByIdAndUpdate(
            existingVote._id,
            { voteType },
            { new: true }
          );
          if (!updatedVote) {
            throw new NotFoundException('Failed to update vote');
          }
          return updatedVote;
        }
      } else {
        // Create new vote
        const newVote = new this.voteModel({
          answerId: new Types.ObjectId(answerId),
          userId: new Types.ObjectId(userId),
          voteType,
        });
        return newVote.save();
      }
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Vote already exists for this user and answer');
      }
      throw error;
    }
  }

  async findByAnswerId(answerId: string): Promise<Vote[]> {
    return this.voteModel
      .find({ answerId: new Types.ObjectId(answerId) })
      .exec();
  }

  async findByUserId(userId: string): Promise<Vote[]> {
    return this.voteModel
      .find({ userId: new Types.ObjectId(userId) })
      .exec();
  }

  async getVoteStats(answerId: string): Promise<{ upvotes: number; downvotes: number }> {
    const [upvotes, downvotes] = await Promise.all([
      this.voteModel.countDocuments({
        answerId: new Types.ObjectId(answerId),
        voteType: VoteType.UPVOTE,
      }),
      this.voteModel.countDocuments({
        answerId: new Types.ObjectId(answerId),
        voteType: VoteType.DOWNVOTE,
      }),
    ]);

    return { upvotes, downvotes };
  }

  async getUserVote(answerId: string, userId: string): Promise<Vote | null> {
    return this.voteModel.findOne({
      answerId: new Types.ObjectId(answerId),
      userId: new Types.ObjectId(userId),
    });
  }

  async remove(id: string): Promise<void> {
    const result = await this.voteModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Vote with ID ${id} not found`);
    }
  }
} 