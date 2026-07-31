import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class MyTranslateService {
  private translate = inject(TranslateService);
  // logic translate
  changeDirection(): void {
    if (localStorage.getItem('lang') === 'en') {
      document.documentElement.setAttribute('lang', 'en');
      document.documentElement.setAttribute('dir', 'ltr');
    } else if (localStorage.getItem('lang') === 'ar') {
      document.documentElement.setAttribute('lang', 'ar');
      document.documentElement.setAttribute('dir', 'rtl');
    } else if (localStorage.getItem('lang') === 'it') {
      document.documentElement.setAttribute('lang', 'it');
      document.documentElement.setAttribute('dir', 'ltr');
    } else if (localStorage.getItem('lang') === 'de') {
      document.documentElement.setAttribute('lang', 'de');
      document.documentElement.setAttribute('dir', 'ltr');
    } else if (localStorage.getItem('lang') === 'fr') {
      document.documentElement.setAttribute('lang', 'fr');
      document.documentElement.setAttribute('dir', 'ltr');
    }
  }
  changeLang(lang: string) {
    localStorage.setItem('lang', lang);
    // use lang
    this.translate.use(lang);
    this.changeDirection();
    console.log('done');
  }
}
