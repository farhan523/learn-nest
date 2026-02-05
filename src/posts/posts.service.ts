import { Injectable, NotFoundException } from '@nestjs/common';
import { Post } from './interface/post.interface';

@Injectable()
export class PostsService {
  private posts: Post[] = [
    {
      id: 1,
      title: 'First Post',
      content: 'This is the first post',
      authorName: 'John Doe',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      title: 'Second Post',
      content: 'This is the second post',
      authorName: 'Jane Doe',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  getPostCount(): number {
    return this.posts.length;
  }

  findAll(): Post[] {
    return this.posts;
  }

  findOne(id: number): Post {
    const post = this.posts.find((post) => post.id === id);
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return post;
  }

  addNew(newPostData: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>): Post {
    const newPost = {
      ...newPostData,
      id: this.posts.length + 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.posts.push(newPost);
    return newPost;
  }

  updatePost(
    postId: number,
    updatedPostData: Partial<Omit<Post, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Post {
    const postIndex = this.posts.findIndex((post) => post.id === postId);
    if (postIndex === -1) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }
    this.posts[postIndex] = {
      ...this.posts[postIndex],
      ...updatedPostData,
      updatedAt: new Date(),
    };
    return this.posts[postIndex];
  }

  removePost(postId: number): void {
    const postIndex = this.posts.findIndex((post) => post.id === postId);
    if (postIndex === -1) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }
    this.posts.splice(postIndex, 1);
  }
}
