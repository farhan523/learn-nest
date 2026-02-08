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
} from '@nestjs/common';
import { PostsService } from './posts.service';
import type { Post as postEntity } from './entities/post.entity';
import { CreatePostDto, UpdatePostDto } from './dto/create-post-dto';
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

  @Post('/')
  async addNew(@Body() newPostData: CreatePostDto): Promise<postEntity> {
    return this.postService.addNew(newPostData);
  }

  @Patch('/:id')
  async updatePost(
    @Param('id', ParseIntPipe, PostExistPipe) id: number,
    @Body()
    updatedPostData: UpdatePostDto,
  ): Promise<postEntity> {
    return await this.postService.updatePost(id, updatedPostData);
  }

  @Delete('/:id')
  async removePost(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.postService.removePost(id);
  }
}
