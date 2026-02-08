import { PipeTransform, Injectable, NotFoundException } from '@nestjs/common';
import { PostsService } from '../posts.service';

@Injectable()
export class PostExistPipe implements PipeTransform {
  constructor(private readonly postService: PostsService) {}

  async transform(postId: number) {
    try {
      await this.postService.findOne(postId);
      return postId;
    } catch (err) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }
  }
}
