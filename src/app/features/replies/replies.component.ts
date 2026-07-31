import { Component, inject, Input, input, OnInit } from '@angular/core';
import { RepliesService } from '../feed/components/feed-content/components/replies.service';
import { FormsModule } from '@angular/forms';
import { Reply } from '../../core/models/reply.interface';
import { DatePipe } from '@angular/common';
import { PostsService } from '../../core/services/posts.service';
import { Post } from '../../core/models/post.interface';
import { Comment } from '../../core/models/comment.interface';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-replies',
  imports: [FormsModule, DatePipe, TranslatePipe],
  templateUrl: './replies.component.html',
  styleUrl: './replies.component.css',
})
export class RepliesComponent implements OnInit {
  user = JSON.parse(localStorage.getItem('socialUser')!);
  private readonly repliesService = inject(RepliesService);
  private readonly postServ = inject(PostsService);
  currentReply!: Reply;
  @Input() comment!: Comment;
  @Input() postId!: string;
  replies: Reply[] = [];
  post!: Post;
  replyContent: string = '';
  selectedFile: File | null = null;
  showReplies: boolean = false;
  hasLoaded: boolean = false;
  ngOnInit(): void {
    this.getCommentReplies();
    console.log('got');
  }
  getCommentReplies() {
    this.repliesService.getReplies(this.postId, this.comment._id).subscribe({
      next: (res) => {
        this.replies = res.data.replies;
        console.log(this.replies);
        console.log('got replies');
      },
      error: (err) => {
        console.log(err.message);
      },
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      console.log('تم اختيار صورة:', file.name);
    }
  }

  addReply() {
    if (!this.replyContent.trim() && !this.selectedFile) return;

    const myData = new FormData();

    if (this.replyContent.trim()) {
      myData.append('content', this.replyContent);
    }
    if (this.selectedFile) {
      myData.append('image', this.selectedFile);
    }

    this.repliesService.createReply(this.postId, this.comment._id, myData).subscribe({
      next: (res) => {
        // this.replies.push(res.reply || res);
        this.replyContent = '';
        this.selectedFile = null;
        console.log(res);
        this.currentReply = (res as any)?.data.reply;
        this.replies.push(this.currentReply);
      },
      error: (err) => console.log(err.message),
    });
  }

  toggleReplies(): void {
    this.showReplies = !this.showReplies;

    if (this.showReplies && !this.hasLoaded) {
      this.getCommentReplies();
    }
  }

  getPost() {
    this.postServ.getSinglePost(this.postId).subscribe({
      next: (res) => {
        console.log(res);
        this.post = res.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  toggleLikeReply(reply: Reply) {
    const userId: string = this.user._id;
    const userIndex = reply.likes.indexOf(userId);
    const isLiked = userIndex !== -1;
    const previousLikes = [...reply.likes];

    if (isLiked) {
      reply.likes.splice(userIndex, 1);
    } else {
      reply.likes.push(userId);
    }

    this.repliesService.likeReply(this.postId, reply._id).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.log(err);
        reply.likes = previousLikes;
      },
    });
  }
}
