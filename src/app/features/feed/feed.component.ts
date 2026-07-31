import { Component } from '@angular/core';
import { PostComponent } from '../post/post.component';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { PostDetailsComponent } from '../post-details/post-details.component';
import { SideLeftComponent } from './components/side-left/side-left.component';
import { SideRightComponent } from './components/side-right/side-right.component';
import { FeedContentComponent } from './components/feed-content/feed-content.component';

@Component({
  selector: 'app-feed',
  imports: [SideLeftComponent, SideRightComponent, FeedContentComponent, PostComponent],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.css',
})
export class FeedComponent {
  userId = JSON.parse(localStorage.getItem('socialUser')!);
  isNavOpen: boolean = false;
  isUserPost(postUserId: string) {
    if (this.userId === postUserId) {
      console.log('matched');
      return;
    }
    console.log('!matched');
  }
  toggleNav() {
    this.isNavOpen = !this.isNavOpen;
  }
}
