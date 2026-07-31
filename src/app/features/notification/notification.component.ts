import { Component, inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { NotifyService } from '../../core/services/notify.service';
import { Notification } from '../../core/models/notifications.interface';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [DatePipe, TranslatePipe],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css',
})
export class NotificationComponent implements OnInit {
  private readonly notifyServ = inject(NotifyService);
  private readonly router = inject(Router);

  allNotifications: Notification[] = [];
  unReadCount: number = 0;
  unRead: boolean = true;

  ngOnInit(): void {
    this.getAllNotifications();
    this.getUnreadCount();
  }

  getAllNotifications(): void {
    this.notifyServ.getAllNotifications(this.unRead).subscribe({
      next: (res) => {
        this.allNotifications = res.data.notifications;
      },
      error: (err) => {
        console.error('Error fetching notifications:', err);
      },
    });
  }

  getUnreadCount(): void {
    this.notifyServ.getUnreadCount().subscribe({
      next: (res) => {
        this.unReadCount = res.data.unreadCount;
      },
      error: (err) => {
        console.error('Error fetching unread count:', err);
      },
    });
  }

  toggleFilter(status: boolean): void {
    this.unRead = status;
    this.getAllNotifications();
  }

  // 🚀 دالة التوجيه عند الضغط على كارد الإشعار
  onNotificationClick(notification: any): void {
    // 1. تعليم الإشعار كمقروء فوراً في الـ UI
    if (!notification.isRead) {
      this.markNotificationAsRead(notification);
    }

    // 2. فحص حالة البوست لو محذوف أو غير متاح
    if (notification.entity?.unavailable) {
      alert('This content is no longer available.');
      return;
    }

    // 3. التوجيه بذكاء حسب نوع الكيان
    if (notification.entityType === 'post') {
      this.router.navigate(['main/details', notification.entityId]);
    } else if (notification.entityType === 'user' || notification.type === 'follow_user') {
      this.router.navigate(['main/profile', notification.entityId]);
    }
  }

  markNotificationAsRead(notification: Notification, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }

    if (notification.isRead) return;

    this.unReadCount = Math.max(0, this.unReadCount - 1);
    notification.isRead = true;

    this.notifyServ.markNotificationAsRead(notification._id).subscribe({
      next: () => {
        this.getAllNotifications();
      },
      error: (err) => {
        console.error('Error marking as read:', err);
        this.unReadCount++;
        notification.isRead = false;
      },
    });
  }

  markAllAsRead(): void {
    this.allNotifications.forEach((notification) => (notification.isRead = true));
    const previousCount = this.unReadCount;
    this.unReadCount = 0;

    this.notifyServ.markAllAsRead().subscribe({
      next: () => {
        this.getAllNotifications();
      },
      error: (err) => {
        console.error('Error marking all as read:', err);
        this.unReadCount = previousCount;
        this.getAllNotifications();
      },
    });
  }
}
