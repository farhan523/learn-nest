import { PipeTransform, Injectable } from '@nestjs/common';
import { PostsService } from '../posts.service';

@Injectable()
export class PostExistPipe implements PipeTransform {
  constructor(private readonly postService: PostsService) {}
  transform(postId: number) {
    const post = this.postService.findOne(postId);
    return post;
  }
}
