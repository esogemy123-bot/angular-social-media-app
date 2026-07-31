import { Component, inject, OnInit, viewChild } from '@angular/core';
import { PostCommentsComponent } from './components/post-comments/post-comments.component';
import { PostsService } from '../../../../core/services/posts.service';
import { Post } from '../../../../core/models/post.interface';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe, formatDate } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-feed-content',
  imports: [ReactiveFormsModule, PostCommentsComponent, RouterLink, DatePipe, TranslatePipe],
  templateUrl: './feed-content.component.html',
  styleUrl: './feed-content.component.css',
})
export class FeedContentComponent implements OnInit {
  private readonly postsService = inject(PostsService);
  content: FormControl = new FormControl('');
  updateContent: FormControl = new FormControl('');
  privacy: FormControl = new FormControl('public');
  postList: Post[] = [];
  isUpdating: boolean = false;
  userId = '';
  userName = '';
  userPhoto = '';
  userUserName = '';
  newPostFile!: File;
  imgUrl: string | ArrayBuffer | null | undefined;
  postId = '';
  activeTab: string = 'all';

  selectFeed(type: string) {
    this.activeTab = type;
    this.postsService.changeFeedType(type);
  }
  ngOnInit(): void {
    this.getAllPostsData();
    this.userId = JSON.parse(localStorage.getItem('socialUser')!)?._id;
    this.userName = JSON.parse(localStorage.getItem('socialUser')!).name;
    this.userPhoto = JSON.parse(localStorage.getItem('socialUser')!).photo;
    this.userUserName = JSON.parse(localStorage.getItem('socialUser')!).username;

    console.log(this.userId);
    this.postsService.currentFeedType$.subscribe((type) => {
      this.loadPostsBasedOnType(type);
    });
  }

  getAllPostsData(): void {
    this.postsService.getAllPosts().subscribe({
      next: (res) => {
        console.log(res.data.posts);
        this.postList = res.data.posts;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  changeImg(e: Event) {
    // file
    const input = e.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      console.log(input.files[0].name);
      this.newPostFile = input.files[0];
      // show file in html
      this.readFileUrl();
    }
  }

  readFileUrl(): void {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(this.newPostFile);
    fileReader.onload = (e: ProgressEvent<FileReader>) => {
      this.imgUrl = e.target?.result;
    };
  }

  submitForm(e: Event, form: HTMLFormElement): void {
    // remove default behavior (reload)
    e.preventDefault();
    // append form Data ===> Send BE
    this.appendFormData();
    this.removePostInputsData(form);
  }
  appendFormData(): void {
    const formdata = new FormData();
    if (this.content.value) {
      formdata.append('body', this.content.value);
    }
    if (this.newPostFile) {
      formdata.append('image', this.newPostFile);
    }
    if (this.privacy.value) {
      formdata.append('privacy', this.privacy.value);
    }
    this.sendPost(formdata);
  }
  sendPost(formData: FormData) {
    this.postsService.createPost(formData).subscribe({
      next: (res) => {
        console.log(res);
        if (res.success) {
          this.getAllPostsData();
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  removePostInputsData(form: HTMLFormElement) {
    form.reset();
    this.imgUrl = null;
  }
  deletePost(postId: string) {
    this.postsService.deletePost(postId).subscribe({
      next: (res) => {
        console.log(res);
        if (res.success) {
          this.getAllPostsData();
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  updatePost(postId: string) {
    this.isUpdating = true;
    const formdate = new FormData();
    if (this.updateContent.value) {
      formdate.append('body', this.updateContent.value);
      this.sendUpdatedPost(formdate, postId);
    }
  }
  sendUpdatedPost(formdata: FormData, postId: string) {
    this.postsService.updateData(formdata, postId).subscribe({
      next: (res) => {
        console.log(res);
        if (res.success) {
          this.getAllPostsData();
          this.isUpdating = false;
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  setDataToUpdate() {
    this.isUpdating = true;
  }
  cancelUpdate() {
    this.isUpdating = false;
  }
  removeUpdateData() {}
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
        console.log('post shared suc');
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

  savePost(post: Post) {
    this.postsService.savePost(post._id).subscribe({
      next: (res) => {
        console.log('post saved suc');
        console.log(res);
        post.bookmarked = !post.bookmarked;
      },
      error: (err) => {
        console.log('cannot save post, pls try again');
        console.log(err);
      },
    });
  }

  loadPostsBasedOnType(type: string) {
    if (type === 'all') {
      this.postsService.getAllPosts().subscribe((res) => (this.postList = res.data.posts));
    } else if (type === 'mine') {
      this.postsService.getMyPosts().subscribe((res) => (this.postList = res.data.posts));
    } else if (type === 'saved') {
      this.postsService.getSavedPosts().subscribe((res) => (this.postList = res.data.bookmarks));
      console.log(this.postList);
    } else if (type === 'community') {
      this.postsService.getAllPosts().subscribe((res) => (this.postList = res.data.posts));
    }
  }
  removeImage(): void {
    this.imgUrl = '';
    const fileInput = document.getElementById('imgFileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
}
