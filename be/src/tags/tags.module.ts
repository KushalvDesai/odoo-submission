import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TagsService } from './tags.service';
import { TagsResolver } from './tags.resolver';
import { Tag, TagSchema } from './schemas/tag.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Tag.name, schema: TagSchema },
    ]),
  ],
  providers: [TagsService, TagsResolver],
  exports: [TagsService],
})
export class TagsModule {} 