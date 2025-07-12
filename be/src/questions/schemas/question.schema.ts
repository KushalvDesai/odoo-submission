import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type QuestionDocument = Question & Document;

@Schema({ timestamps: true })
export class Question {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true })
  desc: string; // HTML content

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ required: true })
  author: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const QuestionSchema = SchemaFactory.createForClass(Question); 