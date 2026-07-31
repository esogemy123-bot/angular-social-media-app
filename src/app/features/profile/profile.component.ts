import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router'; // 👈 أضفنا الـ ActivatedRoute هنا
import { AuthService } from './../../core/auth/services/auth.service';
import { UsersService } from './../../core/services/users.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-profile',
  imports: [RouterLink, RouterOutlet, RouterLinkActive, TranslatePipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  myProfile: any;
  currentUserPhoto: string = '';
  isOverlayOpen: boolean = false;

  isOwnProfile: boolean = true;

  private readonly authService = inject(AuthService);
  private readonly usersService = inject(UsersService);
  private readonly route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const userId = params.get('id');

      if (userId) {
        this.isOwnProfile = false; // ده بروفايل يوزر غريب
        this.getRequestedUserProfile(userId);
      } else {
        this.isOwnProfile = true;
        this.getMyProfile();
      }
    });
  }

  getMyProfile() {
    this.authService.getMyProfile().subscribe({
      next: (res: any) => {
        this.myProfile = res.data;
        console.log(this.myProfile);
        this.currentUserPhoto = this.myProfile?.user?.photo || this.myProfile?.photo || '';
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  getRequestedUserProfile(id: string) {
    this.usersService.getUserProfile?.(id)?.subscribe?.({
      next: (res: any) => {
        this.myProfile = res.data;
        this.currentUserPhoto = res.data?.photo || res.data?.user?.photo || '';
        console.log(res.data);
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  viewProfilePhoto() {
    console.log('viewed');
    this.isOverlayOpen = true;
  }

  closeProfilePhoto(): void {
    this.isOverlayOpen = false;
  }

  onFileSelected(event: Event) {
    if (!this.isOwnProfile) return;

    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      this.usersService.uploadProfilePhoto(file).subscribe({
        next: (res: any) => {
          console.log('Photo uploaded successfully:', res);
          this.currentUserPhoto = (res as any).data.photo;
        },
        error: (err: any) => {
          console.log('Error uploading photo:', err);
        },
      });
    }
  }
  toggleUserFollow(userId: string) {
    this.usersService.toggleFollow(userId).subscribe({
      next: (res) => {
        console.log(res);
        this.myProfile.isFollowed = !this.myProfile.isFollowed;
        return this.myProfile;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
