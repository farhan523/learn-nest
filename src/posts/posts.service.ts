import { Injectable, NotFoundException } from '@nestjs/common';
import { Post } from './interface/post.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post as PostEntity } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(@InjectRepository(PostEntity) private post: Repository<Post>) {}

  async getPostCount(): Promise<number> {
    return await this.post.count({});
  }

  async findAll(): Promise<Post[]> {
    return this.post.find({});
  }

  async findOne(id: number): Promise<Post> {
    const singlePost = await this.post.findOneBy({ id });
    if (!singlePost) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return singlePost;
  }

  async addNew(
    newPostData: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Post> {
    const newPost = this.post.create({
      title: newPostData.title,
      content: newPostData.content,
      authorName: newPostData.authorName,
    });

    await this.post.save(newPost);

    return newPost;
  }

  async updatePost(
    postId: number,
    updatedPostData: Partial<Omit<Post, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<Post> {
    const post = await this.findOne(postId);
    post.title = updatedPostData.title || post.title;
    post.content = updatedPostData.content || post.content;
    post.authorName = updatedPostData.authorName || post.authorName;
    await this.post.save(post);
    return post;
  }

  async removePost(postId: number): Promise<void> {
    const post = await this.findOne(postId);
    await this.post.remove(post);
  }
}
