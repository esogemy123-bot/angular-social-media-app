import { environment } from './../../../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RepliesService {
  private readonly httpClient = inject(HttpClient);

  getReplies(postID: string, commentID: string): Observable<any> {
    return this.httpClient.get(
      environment.baseUrl + `/posts/${postID}/comments/${commentID}/replies?page=1&limit=10`,
    );
  }
  createReply(postID: string, commentID: string, formData: FormData) {
    return this.httpClient.post(
      environment.baseUrl + `/posts/${postID}/comments/${commentID}/replies`,
      formData,
    );
  }
  likeReply(postId: string, replyId: string): Observable<any> {
    return this.httpClient.put(
      environment.baseUrl + `/posts/${postId}/comments/${replyId}/like`,
      {},
    );
  }
}
