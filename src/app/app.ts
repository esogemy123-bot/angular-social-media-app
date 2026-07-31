import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PostDetailsComponent } from './features/post-details/post-details.component';
import { NgxSpinnerComponent } from 'ngx-spinner';
import { TranslateService } from '@ngx-translate/core';
import { MyTranslateService } from './core/services/my-translate.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PostDetailsComponent, NgxSpinnerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('social-app');
  private translate = inject(TranslateService);
  private myTranslateService = inject(MyTranslateService);

  constructor() {
    this.translate.addLangs(['ar', 'en', 'it', 'de', 'fr']);
    if (localStorage.getItem('lang')) {
      this.translate.use(localStorage.getItem('lang')!);
    }
    // change dir
    this.myTranslateService.changeDirection();
  }
}
