import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VotesService } from './votes.service';
import { VotesResolver } from './votes.resolver';
import { Vote, VoteSchema } from './schemas/vote.schema';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Vote.name, schema: VoteSchema },
    ]),
    UsersModule,
  ],
  providers: [VotesService, VotesResolver],
  exports: [VotesService],
})
export class VotesModule {} 