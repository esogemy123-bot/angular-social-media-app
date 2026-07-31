import { Component, inject, Input, input, OnInit } from '@angular/core';
import { CommentsService } from './comments.service';
import { Comment } from '../../../../../../core/models/comment.interface';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { RepliesComponent } from '../../../../../replies/replies.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-post-comments',
  imports: [ReactiveFormsModule, DatePipe, RepliesComponent, TranslatePipe],
  templateUrl: './post-comments.component.html',
  styleUrl: './post-comments.component.css',
})
export class PostCommentsComponent implements OnInit {
  private readonly commentsService = inject(CommentsService);
  content: FormControl = new FormControl('');
  updateContent: FormControl = new FormControl('');
  isUpdating = false;
  commentId = '';
  user = JSON.parse(localStorage.getItem('socialUser')!);
  newCommentFile!: File;
  imgUrl: string | ArrayBuffer | null | undefined;
  commentList: Comment[] = [];
  @Input() postId: string = '';
  ngOnInit(): void {
    this.getPostComments();
  }
  getPostComments(): void {
    this.commentsService.getPostComment(this.postId).subscribe({
      next: (res) => {
        console.log(res.data.comments);
        this.commentList = res.data.comments;
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
      this.newCommentFile = input.files[0];
      // show file in html
      this.readFileUrl();
    }
  }
  readFileUrl(): void {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(this.newCommentFile);
    fileReader.onload = (e: ProgressEvent<FileReader>) => {
      this.imgUrl = e.target?.result;
    };
  }

  cancelCommentImg() {
    this.imgUrl = '';
  }

  submitForm(e: Event, form: HTMLFormElement): void {
    // remove default behavior (reload)
    e.preventDefault();
    // append form Data ===> Send BE
    this.appendFormData();
    this.removeCommentInputsData(form);
  }
  appendFormData(): void {
    const formdata = new FormData();
    if (this.content.value) {
      formdata.append('content', this.content.value);
    }
    if (this.newCommentFile) {
      formdata.append('image', this.newCommentFile);
    }
    this.sendComment(formdata);
  }
  sendComment(formData: FormData) {
    this.commentsService.createComment(this.postId, formData).subscribe({
      next: (res) => {
        console.log(res);
        if (res.success) {
          this.getPostComments();
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
    console.log('done');
  }
  removeCommentInputsData(form: HTMLFormElement) {
    form.reset();
    this.imgUrl = null;
  }
  updateComment(commentId: string) {
    this.isUpdating = true;
    const formdate = new FormData();
    if (this.updateContent.value) {
      formdate.append('content', this.updateContent.value);
      this.sendUpdatedComment(formdate, commentId);
    }
  }
  sendUpdatedComment(formdata: FormData, commentId: string) {
    this.commentsService.updateComment(formdata, this.postId, commentId).subscribe({
      next: (res) => {
        console.log(res);
        if (res.success) {
          this.getPostComments();
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
  deleteComment(commentId: string) {
    this.commentsService.deleteComment(this.postId, commentId).subscribe({
      next: (res) => {
        console.log(res);
        if (res.success) {
          this.getPostComments();
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  toggleLikeComment(comment: Comment) {
    const userId: string = this.user._id;
    const userIndex = comment.likes.indexOf(userId);
    const isLiked = userIndex !== -1;
    const previousLikes = [...comment.likes];

    if (isLiked) {
      comment.likes.splice(userIndex, 1);
    } else {
      comment.likes.push(userId);
    }

    this.commentsService.likeComment(this.postId, comment._id).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.log(err);
        comment.likes = previousLikes;
      },
    });
  }
}
