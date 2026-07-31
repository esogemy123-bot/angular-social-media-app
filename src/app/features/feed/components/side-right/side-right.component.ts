import { Component, inject, OnInit } from '@angular/core';
import { PostComponent } from '../../../post/post.component';
import { UsersService } from '../../../../core/services/users.service';
import { user } from '../../../../core/models/post.interface';
import { User } from '../../../../core/models/user.interface';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-side-right',
  imports: [PostComponent, ReactiveFormsModule, RouterLink, TranslatePipe],
  templateUrl: './side-right.component.html',
  styleUrl: './side-right.component.css',
})
export class SideRightComponent implements OnInit {
  searchContent: string = '';
  private readonly usersService = inject(UsersService);
  searchControl = new FormControl('');
  suggestedFriends: User[] = [];
  ngOnInit(): void {
    this.getFollowSuggestion();

    this.searchControl.valueChanges.subscribe((term) => {
      this.getFollowSuggestion(term || '');
      console.log(term);
    });
  }

  getFollowSuggestion(term?: string) {
    this.usersService.getFollowSuggestions(term).subscribe({
      next: (res) => {
        this.suggestedFriends = res.data.suggestions;
        console.log(this.suggestedFriends);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  toggleUserFollow(userId: string) {
    this.usersService.toggleFollow(userId).subscribe({
      next: (res) => {
        console.log(res);

        this.suggestedFriends = this.suggestedFriends.map((user) => {
          if (user._id === userId) {
            user.isFollowed = !user.isFollowed;

            if (user.isFollowed) {
              user.followersCount++;
            } else {
              user.followersCount--;
            }
          }
          return user;
        });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
