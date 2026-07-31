import { Comment } from './comment.interface';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  private readonly httpClient = inject(HttpClient);

  getPostComment(postId: string): Observable<any> {
    return this.httpClient.get(environment.baseUrl + `/posts/${postId}/comments?page=1&limit=10`);
  }
  createComment(postId: string, data: object): Observable<any> {
    return this.httpClient.post(environment.baseUrl + `/posts/${postId}/comments`, data);
  }
  deleteComment(postId: string, commentId: string): Observable<any> {
    return this.httpClient.delete(environment.baseUrl + `/posts/${postId}/comments/${commentId}`);
  }
  updateComment(data: object, postId: string, commentId: string): Observable<any> {
    return this.httpClient.put(
      environment.baseUrl + `/posts/${postId}/comments/${commentId}`,
      data,
    );
  }
  likeComment(postId: string, commentId: string): Observable<any> {
    return this.httpClient.put(
      environment.baseUrl + `/posts/${postId}/comments/${commentId}/like`,
      {},
    );
  }
}
