import { Component, inject, OnInit } from '@angular/core';
import { PostCommentsComponent } from '../feed/components/feed-content/components/post-comments/post-comments.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Post } from '../../core/models/post.interface';
import { PostsService } from '../../core/services/posts.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-post-details',
  imports: [PostCommentsComponent, RouterLink],
  templateUrl: './post-details.component.html',
  styleUrl: './post-details.component.css',
})
export class PostDetailsComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly postsService = inject(PostsService);
  private readonly location = inject(Location);
  userId: string = '';
  isUpdating: boolean = false;
  postId: string = '';
  postDetails: Post = {} as Post;
  ngOnInit() {
    this.userId = JSON.parse(localStorage.getItem('socialUser')!)?._id;
    this.activatedRoute.paramMap.subscribe((param) => {
      console.log(param.get('id'));
      this.postId = param.get('id')!;
      this.getPostDetails();
    });
  }
  getPostDetails(): void {
    this.postsService.getSinglePost(this.postId).subscribe({
      next: (res) => {
        console.log(res);
        this.postDetails = res.data.post;
        console.log(this.postDetails);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  goBack() {
    this.location.back();
  }
  likePost(postId: string) {
    this.postsService.likePost(postId).subscribe({
      next: (res) => {
        console.log('post liked suc');
        console.log(res);
      },
      error: (err) => {
        console.log('cannot like post, pls try again');
        console.log(err);
      },
    });
  }
  sharePost(post: Post) {
    this.postsService.sharePost(post._id).subscribe({
      next: (res) => {
        console.log('post saved suc');
        console.log(res);
        post.sharesCount++;
        post.isShare = true;
      },
      error: (err) => {
        console.log('cannot share post, pls try again');
        console.log(err);
      },
    });
  }
}
