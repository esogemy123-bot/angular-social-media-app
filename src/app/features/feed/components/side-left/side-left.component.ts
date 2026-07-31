import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PostsService } from '../../../../core/services/posts.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-side-left',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './side-left.component.html',
  styleUrl: './side-left.component.css',
})
export class SideLeftComponent {
  private readonly postsService = inject(PostsService);

  activeTab: string = 'all';

  selectFeed(type: string) {
    this.activeTab = type;
    this.postsService.changeFeedType(type);
  }
}
