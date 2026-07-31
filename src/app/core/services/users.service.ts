import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly hpClient = inject(HttpClient);

  getFollowSuggestions(term?: string): Observable<any> {
    return this.hpClient.get(
      environment.baseUrl + `/users/suggestions?limit=10${term ? `&q=${term}` : ''}`,
    );
  }
  toggleFollow(userId: string): Observable<any> {
    return this.hpClient.put(environment.baseUrl + `/users/${userId}/follow`, {});
  }
  uploadProfilePhoto(file: File) {
    const formatDate = new FormData();
    formatDate.append('photo', file);
    return this.hpClient.put(environment.baseUrl + '/users/upload-photo', formatDate);
  }
  getUserProfile(id: string): Observable<any> {
    return this.hpClient.get(`${environment.baseUrl}/users/${id}/profile`);
  }
}
