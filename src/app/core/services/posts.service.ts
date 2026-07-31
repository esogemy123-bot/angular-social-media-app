import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  currentUser = JSON.parse(localStorage.getItem('socialUser')!);
  private readonly httpClient = inject(HttpClient);
  private feedTypeSource = new BehaviorSubject<string>('all');

  getAllPosts(): Observable<any> {
    return this.httpClient.get(environment.baseUrl + '/posts');
  }
  createPost(data: object): Observable<any> {
    return this.httpClient.post(environment.baseUrl + `/posts`, data);
  }
  getSinglePost(postId: string): Observable<any> {
    return this.httpClient.get(environment.baseUrl + `/posts/${postId}`);
  }
  deletePost(postId: string): Observable<any> {
    return this.httpClient.delete(environment.baseUrl + `/posts/${postId}`);
  }
  updateData(data: object, postId: string): Observable<any> {
    return this.httpClient.put(environment.baseUrl + `/posts/${postId}`, data);
  }
  likePost(postId: string): Observable<any> {
    return this.httpClient.put(environment.baseUrl + `/posts/${postId}/like`, {});
  }
  sharePost(postId: string): Observable<any> {
    return this.httpClient.post(environment.baseUrl + `/posts/${postId}/share`, {
      body: 'Shared from my app',
    });
  }
  getMyPosts(id?: string): Observable<any> {
    return this.httpClient.get(
      environment.baseUrl + `/users/${id ? id : this.currentUser._id}/posts`,
    );
  }
  savePost(postId: string): Observable<any> {
    return this.httpClient.put(environment.baseUrl + `/posts/${postId}/bookmark`, {});
  }
  getSavedPosts(): Observable<any> {
    return this.httpClient.get(environment.baseUrl + `/posts/bookmarks`);
  }

  currentFeedType$ = this.feedTypeSource.asObservable();

  changeFeedType(type: string) {
    this.feedTypeSource.next(type);
  }
}
