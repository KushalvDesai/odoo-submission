import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { VotesService } from './votes.service';
import { Vote } from './entities/vote.entity';
import { CreateVoteDto } from './dto/create-vote.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { VoteType } from './schemas/vote.schema';

@Resolver(() => Vote)
export class VotesResolver {
  constructor(private readonly votesService: VotesService) {}

  @Mutation(() => Vote)
  @UseGuards(JwtAuthGuard)
  vote(
    @Args('createVoteInput') createVoteDto: CreateVoteDto,
    @CurrentUser() user: User,
  ) {
    return this.votesService.createOrUpdate({
      ...createVoteDto,
      userId: user.id,
    });
  }

  @Query(() => [Vote], { name: 'votesByAnswer' })
  findByAnswerId(@Args('answerId', { type: () => String }) answerId: string) {
    return this.votesService.findByAnswerId(answerId);
  }

  @Query(() => [Vote], { name: 'votesByUser' })
  findByUserId(@Args('userId', { type: () => String }) userId: string) {
    return this.votesService.findByUserId(userId);
  }

  @Query(() => Vote, { name: 'userVote', nullable: true })
  @UseGuards(JwtAuthGuard)
  getUserVote(
    @Args('answerId', { type: () => String }) answerId: string,
    @CurrentUser() user: User,
  ) {
    return this.votesService.getUserVote(answerId, user.id);
  }

  @Query(() => String, { name: 'voteStats' })
  async getVoteStats(@Args('answerId', { type: () => String }) answerId: string) {
    const stats = await this.votesService.getVoteStats(answerId);
    return JSON.stringify(stats);
  }

  @Mutation(() => Vote)
  @UseGuards(JwtAuthGuard)
  removeVote(
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user: User,
  ) {
    return this.votesService.remove(id);
  }
} 