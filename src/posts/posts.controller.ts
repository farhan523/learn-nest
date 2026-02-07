import { PostExistPipe } from './pipes/post-exist.pipe';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  Post,
  Patch,
  Delete,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import type { Post as PostInterface } from './interface/post.interface';
import { CreatePostDto, UpdatePostDto } from './dto/create-post-dto';
@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @Get('/')
  findAll(@Query('search') search?: string): PostInterface[] {
    const posts = this.postService.findAll();
    if (search) {
      const post = posts.filter((post) => post.title.includes(search));
      return post;
    }
    return posts;
  }

  @Get('/:id')
  findOne(@Param('id', ParseIntPipe) id: number): PostInterface {
    return this.postService.findOne(id);
  }

  @Post('/')
  addNew(@Body() newPostData: CreatePostDto): PostInterface {
    return this.postService.addNew(newPostData);
  }

  @Patch('/:id')
  updatePost(
    @Param('id', ParseIntPipe, PostExistPipe) id: number,
    @Body()
    updatedPostData: UpdatePostDto,
  ): PostInterface {
    return this.postService.updatePost(id, updatedPostData);
  }

  @Delete('/:id')
  removePost(@Param('id', ParseIntPipe) id: number): void {
    this.postService.removePost(id);
  }
}
