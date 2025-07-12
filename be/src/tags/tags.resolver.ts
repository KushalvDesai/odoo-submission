import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { TagsService } from './tags.service';
import { Tag } from './entities/tag.entity';
import { CreateTagDto } from './dto/create-tag.dto';

@Resolver(() => Tag)
export class TagsResolver {
  constructor(private readonly tagsService: TagsService) {}

  @Query(() => [Tag], { name: 'tags' })
  findAll() {
    return this.tagsService.findAll();
  }

  @Query(() => [Tag], { name: 'popularTags' })
  findPopularTags(@Args('limit', { type: () => Number, defaultValue: 10 }) limit: number) {
    return this.tagsService.findPopularTags(limit);
  }

  @Query(() => [Tag], { name: 'searchTags' })
  searchTags(
    @Args('query') query: string,
    @Args('limit', { type: () => Number, defaultValue: 10 }) limit: number,
  ) {
    return this.tagsService.searchTags(query, limit);
  }

  @Mutation(() => Tag)
  createTag(@Args('createTagInput') createTagDto: CreateTagDto) {
    return this.tagsService.create(createTagDto);
  }
} 