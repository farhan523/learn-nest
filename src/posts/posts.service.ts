import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post as PostEntity } from './entities/post.entity';
import { User } from 'src/auth/entities/user.entity';
import { CreatePostDto, UpdatePostDto } from './dto/create-post-dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity) private post: Repository<PostEntity>,
  ) {}

  async getPostCount(): Promise<number> {
    return await this.post.count({});
  }

  async findAll(): Promise<PostEntity[]> {
    return this.post.find({});
  }

  async findOne(id: number): Promise<PostEntity> {
    const singlePost = await this.post.findOneBy({ id });
    if (!singlePost) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return singlePost;
  }

  async addNew(newPostData: CreatePostDto, author: User): Promise<PostEntity> {
    const newPost = this.post.create({
      title: newPostData.title,
      content: newPostData.content,
      author: author,
    });

    await this.post.save(newPost);

    return newPost;
  }

  async updatePost(
    postId: number,
    updatedPostData: UpdatePostDto,
    author: User,
  ): Promise<PostEntity> {
    const post = await this.post.findOne({
      where: { id: postId },
      relations: ['author'],
    });

    if (!post) throw new NotFoundException(`Post with ID ${postId} not found`);

    if (post.author?.id !== author.id) {
      throw new UnauthorizedException(
        'You are not authorized to update this post',
      );
    }
    post.title = updatedPostData.title || post.title;
    post.content = updatedPostData.content || post.content;
    await this.post.save(post);
    return post;
  }

  async removePost(postId: number): Promise<void> {
    const post = await this.findOne(postId);
    await this.post.remove(post);
  }

  async getPostsByUserId(userId: number): Promise<PostEntity[]> {
    const userPosts = await this.post
      .createQueryBuilder('post')
      .where('post.authorId = :userId', { userId })
      .getMany();

    if (!userPosts || userPosts.length === 0) {
      throw new NotFoundException(`No posts found for user with ID ${userId}`);
    }
    return userPosts;
  }
}
