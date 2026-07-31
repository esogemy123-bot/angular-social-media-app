import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class NotifyService {
  private readonly hpClient = inject(HttpClient);
  getAllNotifications(isRead: boolean): Observable<any> {
    // https://route-posts.routemisr.com/notifications?unread=false&page=1&limit=10
    return this.hpClient.get(
      `${environment.baseUrl}/notifications?unread=${isRead}&page=1&limit=10`,
    );
  }
  getUnreadCount(): Observable<any> {
    return this.hpClient.get(environment.baseUrl + '/notifications/unread-count');
  }
  markNotificationAsRead(id: string) {
    return this.hpClient.patch(`${environment.baseUrl}/notifications/${id}/read`, {});
  }
  markAllAsRead(): Observable<any> {
    return this.hpClient.patch(environment.baseUrl + '/notifications/read-all', {});
  }
}
