import { Component, inject, OnInit } from '@angular/core';
import { PostsService } from '../../core/services/posts.service';
import { Post } from '../../core/models/post.interface';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-saved-posts',
  imports: [DatePipe, RouterLink, TranslatePipe],
  templateUrl: './saved-posts.component.html',
  styleUrl: './saved-posts.component.css',
})
export class SavedPostsComponent implements OnInit {
  private readonly postServ = inject(PostsService);

  ngOnInit(): void {
    this.getSavedPosts();
  }

  savedPosts: Post[] = [];
  getSavedPosts() {
    this.postServ.getSavedPosts().subscribe({
      next: (res) => {
        this.savedPosts = res.data.bookmarks;
        console.log(this.savedPosts);
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
