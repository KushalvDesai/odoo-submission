import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@Resolver()
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Mutation(() => String)
  async register(
    @Args('name') name: string,
    @Args('email') email: string,
    @Args('password') password: string,
  ) {
    const user = await this.usersService.register(name, email, password);
    return this.usersService.login(user);
  }

  @Mutation(() => String)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
  ) {
    const user = await this.usersService.validateUser(email, password);
    if (!user) throw new Error('Invalid credentials');
    return this.usersService.login(user);
  }

  @Query(() => User, { nullable: true })
  async me(@Context() ctx) {
    const auth = ctx.req.headers.authorization;
    if (!auth) return null;
    const token = auth.replace('Bearer ', '');
    return this.usersService.verifyToken(token);
  }
} 