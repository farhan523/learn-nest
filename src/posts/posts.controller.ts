import { PostExistPipe } from './pipes/post-exist.pipe';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import type { Post as postEntity } from './entities/post.entity';
import { CreatePostDto, UpdatePostDto } from './dto/create-post-dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/auth/entities/user.entity';

@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @Get('/')
  async findAll(): Promise<postEntity[]> {
    const posts = await this.postService.findAll();
    return posts;
  }

  @Get('/:id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<postEntity> {
    return await this.postService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/')
  async addNew(
    @Body() newPostData: CreatePostDto,
    @CurrentUser() author: User,
  ): Promise<postEntity> {
    return this.postService.addNew(newPostData, author);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  async updatePost(
    @Param('id', ParseIntPipe, PostExistPipe) id: number,
    @Body()
    updatedPostData: UpdatePostDto,
    @CurrentUser() author: User,
  ): Promise<postEntity> {
    return await this.postService.updatePost(id, updatedPostData, author);
  }

  @Delete('/:id')
  async removePost(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.postService.removePost(id);
  }

  @Get('/user/:userId')
  async getUserPosts(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<postEntity[]> {
    return await this.postService.getPostsByUserId(userId);
  }
}
