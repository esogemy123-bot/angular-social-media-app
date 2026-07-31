import { PostsService } from './../../core/services/posts.service';
import { Component, inject, Input, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, ActivatedRoute } from '@angular/router';
import { PostComponent } from '../post/post.component';
import { Post } from '../../core/models/post.interface';
import { DatePipe } from '@angular/common';
import { routes } from '../../app.routes';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-my-posts',
  imports: [RouterOutlet, PostComponent, DatePipe, RouterLink, TranslatePipe],
  templateUrl: './my-posts.component.html',
  styleUrl: './my-posts.component.css',
})
export class MyPostsComponent implements OnInit {
  currentUser = JSON.parse(localStorage.getItem('socialUser')!);
  private readonly postServ = inject(PostsService);
  private readonly route = inject(ActivatedRoute);
  myPosts: Post[] = [];
  isOwnProfile!: boolean;

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe((params) => {
      const userId = params.get('id');
      const requestedId = userId ? userId : this.currentUser._id;
      this.isOwnProfile = userId ? false : true;
      this.getMyPosts(requestedId);
    });
  }
  getMyPosts(id: string) {
    this.postServ.getMyPosts(id).subscribe({
      next: (res) => {
        this.myPosts = res.data.posts;
        console.log(this.myPosts);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  currentOpenImageUrl: string | null = null;
  currentPostBody: string = '';
  getPostBody(body: string) {
    this.currentPostBody = body;
  }

  viewPostPhoto(imageUrl: string) {
    if (imageUrl) {
      console.log('Opened image:', imageUrl);
      this.currentOpenImageUrl = imageUrl;
    }
  }

  closePostPhoto(): void {
    this.currentOpenImageUrl = null;
  }
}
