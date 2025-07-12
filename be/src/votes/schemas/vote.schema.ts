import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type VoteDocument = Vote & Document;

export enum VoteType {
  UPVOTE = 'upvote',
  DOWNVOTE = 'downvote',
}

@Schema({ timestamps: true })
export class Vote {
  @Prop({ type: Types.ObjectId, ref: 'Answer', required: true })
  answerId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: String, enum: VoteType, required: true })
  voteType: VoteType;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const VoteSchema = SchemaFactory.createForClass(Vote);

// Compound unique index to ensure one vote per user per answer
VoteSchema.index({ answerId: 1, userId: 1 }, { unique: true }); 